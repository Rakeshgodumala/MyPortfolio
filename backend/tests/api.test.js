/**
 * API integration tests. Uses a separate database (TEST_MONGODB_URI, default local portfolio_test)
 * which is dropped at the end. Run with: npm test
 */
import { after, before, describe, test } from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio_test';
process.env.JWT_SECRET = 'test-secret-that-is-long-enough-for-hs256-signing';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';
process.env.CLOUDINARY_URL = '';
process.env.SMTP_HOST = '';

const { default: request } = await import('supertest');
const { default: bcrypt } = await import('bcryptjs');
const { default: mongoose } = await import('mongoose');
const { createApp } = await import('../app.js');
const { connectDB } = await import('../config/db.js');
const { Admin } = await import('../models/Admin.js');

const ORIGIN = 'http://localhost:5173';
const EMAIL = 'admin@example.com';
const PASSWORD = 'Correct-Horse-9!';
const app = createApp();

// Supertest agent that keeps cookies, like a browser.
const agent = request.agent(app);
const ajax = (req) => req.set('Origin', ORIGIN).set('X-Requested-With', 'XMLHttpRequest');

const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64',
);

const validProject = {
  title: 'Test Project',
  description: 'A project used by the automated API tests.',
  technologies: ['React.js', 'react.js', 'Node.js'],
  category: 'Testing',
  githubUrl: 'https://github.com/example/test',
  liveDemoUrl: '',
  published: false,
};

before(async () => {
  await connectDB(process.env.MONGODB_URI);
  await mongoose.connection.dropDatabase();
  await Admin.create({ email: EMAIL, passwordHash: await bcrypt.hash(PASSWORD, 4) });
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('authentication', () => {
  test('admin endpoints reject anonymous requests', async () => {
    await request(app).get('/api/admin/projects').expect(401);
    await ajax(request(app).post('/api/admin/projects')).send(validProject).expect(401);
  });

  test('there is no public registration endpoint', async () => {
    await ajax(request(app).post('/api/auth/register')).send({ email: 'x@y.com', password: 'x' }).expect(404);
  });

  test('state-changing requests without the CSRF header are refused', async () => {
    await request(app).post('/api/auth/login').set('Origin', ORIGIN).send({ email: EMAIL, password: PASSWORD }).expect(403);
  });

  test('requests from a foreign origin are refused', async () => {
    await request(app)
      .post('/api/auth/login')
      .set('Origin', 'https://evil.example')
      .set('X-Requested-With', 'XMLHttpRequest')
      .send({ email: EMAIL, password: PASSWORD })
      .expect(403);
  });

  test('wrong password is rejected with a generic message', async () => {
    const res = await ajax(request(app).post('/api/auth/login')).send({ email: EMAIL, password: 'nope' }).expect(401);
    assert.equal(res.body.message, 'Invalid email or password.');
  });

  test('operator injection in login body is neutralised', async () => {
    await ajax(request(app).post('/api/auth/login')).send({ email: { $ne: null }, password: { $ne: null } }).expect(400);
  });

  test('correct login sets an HttpOnly session cookie', async () => {
    const res = await ajax(agent.post('/api/auth/login')).send({ email: EMAIL, password: PASSWORD }).expect(200);
    const cookie = res.headers['set-cookie'].join(';');
    assert.match(cookie, /pf_session=/);
    assert.match(cookie, /HttpOnly/i);
    assert.match(cookie, /SameSite=Lax/i);
    assert.equal(res.body.admin.email, EMAIL);
    await agent.get('/api/auth/me').expect(200);
  });
});

describe('project management', () => {
  let projectId;

  test('validation errors are returned per field', async () => {
    const res = await ajax(agent.post('/api/admin/projects'))
      .send({ title: 'x', description: 'short', githubUrl: 'javascript:alert(1)' })
      .expect(400);
    assert.ok(res.body.errors.title);
    assert.ok(res.body.errors.description);
    assert.ok(res.body.errors.githubUrl);
  });

  test('create a draft project with de-duplicated technologies', async () => {
    const res = await ajax(agent.post('/api/admin/projects')).send(validProject).expect(201);
    projectId = res.body.project._id;
    assert.equal(res.body.project.slug, 'test-project');
    assert.deepEqual(res.body.project.technologies, ['React.js', 'Node.js']);
    assert.equal(res.body.project.imagePublicId, undefined);
  });

  test('drafts are hidden from the public API', async () => {
    const res = await request(app).get('/api/projects').expect(200);
    assert.equal(res.body.projects.length, 0);
    await request(app).get('/api/projects/test-project').expect(404);
  });

  test('publishing makes the project public', async () => {
    await ajax(agent.patch(`/api/admin/projects/${projectId}/publish`)).send({ published: true }).expect(200);
    const res = await request(app).get('/api/projects').expect(200);
    assert.equal(res.body.projects.length, 1);
    assert.equal(res.body.projects[0].imagePublicId, undefined);
  });

  test('image upload validates file contents', async () => {
    await ajax(agent.post('/api/admin/uploads'))
      .attach('image', Buffer.from('<script>alert(1)</script>'), { filename: 'evil.png', contentType: 'image/png' })
      .expect(400);
    const res = await ajax(agent.post('/api/admin/uploads'))
      .attach('image', PNG, { filename: 'shot.png', contentType: 'image/png' })
      .expect(201);
    assert.match(res.body.imageUrl, /^\/uploads\/[a-f0-9]{32}\.png$/);
    await request(app).get(res.body.imageUrl).expect(200);
    validProject.imageUrl = res.body.imageUrl;
    validProject.imagePublicId = res.body.imagePublicId;
  });

  test('editing updates the public data and slug', async () => {
    await ajax(agent.put(`/api/admin/projects/${projectId}`))
      .send({ ...validProject, title: 'Renamed Project', published: true, featured: true })
      .expect(200);
    const res = await request(app).get('/api/projects/renamed-project').expect(200);
    assert.equal(res.body.project.featured, true);
    assert.equal(res.body.project.imageUrl, validProject.imageUrl);
  });

  test('reorder renumbers projects', async () => {
    const second = await ajax(agent.post('/api/admin/projects'))
      .send({ ...validProject, title: 'Second Project', imageUrl: '', published: true })
      .expect(201);
    const res = await ajax(agent.put('/api/admin/projects/reorder'))
      .send({ ids: [second.body.project._id, projectId] })
      .expect(200);
    assert.equal(res.body.projects[0].title, 'Second Project');
    assert.equal(res.body.projects[0].displayOrder, 1);
  });

  test('delete removes the project and its uploaded image', async () => {
    await ajax(agent.delete(`/api/admin/projects/${projectId}`)).expect(204);
    await request(app).get('/api/projects/renamed-project').expect(404);
    await request(app).get(validProject.imageUrl).expect(404);
  });
});

describe('contact form', () => {
  test('invalid messages are rejected', async () => {
    const res = await ajax(request(app).post('/api/contact')).send({ name: 'A', email: 'bad' }).expect(400);
    assert.ok(res.body.errors.email);
  });

  test('valid messages are stored and visible to the admin', async () => {
    await ajax(request(app).post('/api/contact'))
      .send({ name: 'Recruiter', email: 'hr@example.com', subject: 'Interview', message: 'We would like to talk to you.' })
      .expect(201);
    const res = await agent.get('/api/admin/messages').expect(200);
    assert.equal(res.body.messages.length, 1);
    assert.equal(res.body.messages[0].emailDelivered, false);
  });
});

describe('logout', () => {
  test('logout revokes the session server-side', async () => {
    const login = await ajax(request(app).post('/api/auth/login')).send({ email: EMAIL, password: PASSWORD }).expect(200);
    const stolenCookie = login.headers['set-cookie'][0].split(';')[0];

    await ajax(agent.post('/api/auth/logout')).expect(204);
    await agent.get('/api/auth/me').expect(401);
    // A copy of an earlier token no longer works either, because tokenVersion changed.
    await request(app).get('/api/auth/me').set('Cookie', stolenCookie).expect(401);
  });
});
