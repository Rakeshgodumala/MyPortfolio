/**
 * One-time import of the projects from the previous portfolio (rakeshgodumala.github.io/portfolio)
 * and the certifications list. Screenshots in seed/images are uploaded through the configured
 * image storage (Cloudinary in production, local disk in development).
 *
 *   npm run seed           only fills empty collections
 *   npm run seed -- --force  replaces existing projects and certifications
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectDB, disconnectDB } from '../config/db.js';
import { env } from '../config/env.js';
import { Certification } from '../models/Certification.js';
import { Project } from '../models/Project.js';
import { detectImageType, saveImage, storageMode } from '../services/storage.js';
import { slugify } from '../utils/slug.js';

const IMAGE_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../seed/images');
const force = process.argv.includes('--force');

// Technologies are only listed where the resume or old portfolio states them. Edit the rest in the dashboard.
const projects = [
  {
    title: 'FakeStore API',
    description:
      'Built a product-shopping interface with React.js, Bootstrap, and JavaScript, integrating the FakeStore API to present online store data.',
    technologies: ['React.js', 'JavaScript', 'Bootstrap', 'REST API'],
    category: 'React',
    githubUrl: 'https://github.com/Rakeshgodumala/Fakestore-Api',
    image: 'fakestore.png',
    featured: true,
  },
  {
    title: 'Employee Management CRUD',
    description:
      'Built a role-based employee management dashboard with secure, user-specific access for administrators and employees. Administrators can add, edit, and delete employee records, while employees have read-only access.',
    technologies: ['React.js', 'Bootstrap', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript'],
    category: 'Full Stack',
    githubUrl: 'https://github.com/Rakeshgodumala/Employee---CRUD-Operation',
    image: 'employee-management.png',
    featured: true,
  },
  {
    title: 'CareBridge Healthcare Website',
    description:
      'Developed a responsive healthcare website as part of my IBM SkillsBuild internship. The website focused on providing accessible healthcare information, doctor information, appointment flow, and health tips.',
    technologies: ['HTML5', 'CSS3', 'Bootstrap', 'JavaScript'],
    category: 'Internship',
    featured: true,
  },
  {
    title: 'Virtual Online Shopping',
    description:
      'Created an e-commerce website that presents products in a straightforward shopping experience and demonstrates core online retail workflows.',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
    category: 'Web App',
    liveDemoUrl: 'https://rakeshgodumala.github.io/Online-Shoping-Website',
    image: 'virtual-shopping.png',
  },
  {
    title: 'Weather App',
    description: 'Designed a responsive weather app interface using HTML, CSS, Bootstrap, and JavaScript.',
    technologies: ['HTML5', 'CSS3', 'Bootstrap', 'JavaScript'],
    category: 'Web App',
    liveDemoUrl: 'https://rakeshgodumala.github.io/WeatherApp/',
    image: 'weather.png',
  },
  {
    title: 'To-Do App',
    description:
      'Created a task management app that lets users add, update, and delete tasks, built with HTML, CSS, Bootstrap, and JavaScript.',
    technologies: ['HTML5', 'CSS3', 'Bootstrap', 'JavaScript'],
    category: 'Web App',
    liveDemoUrl: 'https://rakeshgodumala.github.io/Todo-List/',
    image: 'todo-app.png',
  },
  {
    title: 'Chess Game',
    description: 'Built an interactive browser-based chess game for users to enjoy a game of chess online.',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    category: 'Web App',
    liveDemoUrl: 'https://rakeshgodumala.github.io/Chess-Game/',
    image: 'chess.png',
  },
  {
    title: 'Calculator',
    description:
      'Developed a dynamic calculator that performs instant, accurate calculations through a clean and intuitive interface.',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    category: 'Web App',
    liveDemoUrl: 'https://rakeshgodumala.github.io/Calculator/',
    image: 'calculator.png',
  },
];

const certifications = [
  { title: 'Front-end Web Development', issuer: 'IBM SkillsBuild', credentialUrl: 'https://drive.google.com/file/d/1oD-DbuFk260PI8H3K7BTDcQNlz1MXPqB/view' },
  { title: 'HTML & CSS Certification Course', issuer: 'Udemy', credentialUrl: 'https://www.udemy.com/certificate/UC-481b7769-9325-4e14-a986-7e3fb77ace09' },
  { title: 'Python 101 for Data Science', issuer: 'Cognitive Class', credentialUrl: 'https://courses.cognitiveclass.ai/certificates/60c94421c54440e8992731ef5ccb6958' },
  { title: 'Microsoft Certified: Azure AI Fundamentals', issuer: 'Microsoft', credentialUrl: 'https://learn.microsoft.com/api/credentials/share/en-us/RakeshGodumala-4963/7CF51F0BEFCE7081?sharingId=ABD9E7E62E48EBF8' },
  { title: 'Microsoft Certified: Azure Fundamentals (AZ-900)', issuer: 'Microsoft', credentialUrl: 'https://learn.microsoft.com/en-us/users/rakeshgodumala-4963/credentials/39e913e45803068a' },
  { title: 'Foundations of UX Design', issuer: 'Coursera (Google)', credentialUrl: 'https://www.coursera.org/account/accomplishments/verify/M3HCJGJAGVVR/' },
];

async function uploadSeedImage(fileName) {
  if (!fileName) return { imageUrl: '', imagePublicId: '' };
  const buffer = await fs.readFile(path.join(IMAGE_DIR, fileName));
  return saveImage(buffer, detectImageType(buffer));
}

async function seedProjects() {
  if ((await Project.countDocuments()) > 0 && !force) {
    console.log('Projects already exist; skipping (use --force to replace them).');
    return;
  }
  if (storageMode() === 'unconfigured') {
    throw new Error('Image storage is not configured. Set CLOUDINARY_URL before seeding in production.');
  }
  await Project.deleteMany({});
  for (const [index, { image, ...project }] of projects.entries()) {
    const stored = await uploadSeedImage(image);
    await Project.create({
      ...project,
      ...stored,
      slug: slugify(project.title),
      published: true,
      displayOrder: index + 1,
    });
    console.log(`  + ${project.title}`);
  }
  console.log(`Seeded ${projects.length} projects (image storage: ${storageMode()}).`);
}

async function seedCertifications() {
  if ((await Certification.countDocuments()) > 0 && !force) {
    console.log('Certifications already exist; skipping.');
    return;
  }
  await Certification.deleteMany({});
  await Certification.insertMany(certifications.map((cert, index) => ({ ...cert, displayOrder: index + 1 })));
  console.log(`Seeded ${certifications.length} certifications.`);
}

async function main() {
  await connectDB(env.mongoUri);
  await seedProjects();
  await seedCertifications();
}

main()
  .catch((error) => {
    console.error(`Seed failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => disconnectDB());
