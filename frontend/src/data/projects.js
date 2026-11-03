const projectImage = (fileName) => `${import.meta.env.BASE_URL}projects/${fileName}`;

export const fallbackProjects = [
  {
    _id: 'employee-management',
    title: 'Employee Management CRUD',
    description:
      'Built a role-based employee management dashboard with secure, user-specific access for administrators and employees. Administrators can add, edit, and delete employee records, while employees have read-only access.',
    technologies: ['React.js', 'JavaScript', 'Bootstrap', 'Node.js', 'Express.js', 'MongoDB'],
    category: 'Full Stack',
    githubUrl: 'https://github.com/Rakeshgodumala/Employee---CRUD-Operation',
    imageUrl: projectImage('employee-management.png'),
    featured: true,
    published: true,
  },
  {
    _id: 'virtual-online-shopping',
    title: 'Virtual Online Shopping',
    description:
      'Created an e-commerce website that presents products in a straightforward shopping experience and demonstrates core online retail workflows.',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
    category: 'Web App',
    liveDemoUrl: 'https://rakeshgodumala.github.io/Online-Shoping-Website',
    imageUrl: projectImage('virtual-shopping.png'),
    featured: false,
    published: true,
  },
  {
    _id: 'chess-game',
    title: 'Chess Game',
    description: 'Built an interactive browser-based chess game for users to enjoy a game of chess online.',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    category: 'Web App',
    liveDemoUrl: 'https://rakeshgodumala.github.io/Chess-Game/',
    imageUrl: projectImage('chess.png'),
    featured: false,
    published: true,
  },
  {
    _id: 'weather-app',
    title: 'Weather App',
    description:
      'Designed a responsive weather app interface using HTML, CSS, Bootstrap, and JavaScript.',
    technologies: ['HTML5', 'CSS3', 'Bootstrap', 'JavaScript'],
    category: 'Web App',
    liveDemoUrl: 'https://rakeshgodumala.github.io/WeatherApp/',
    imageUrl: projectImage('weather.png'),
    featured: false,
    published: true,
  },
  {
    _id: 'calculator',
    title: 'Calculator',
    description:
      'Developed a dynamic calculator that performs instant, accurate calculations through a clean and intuitive interface.',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    category: 'Web App',
    liveDemoUrl: 'https://rakeshgodumala.github.io/Calculator/',
    imageUrl: projectImage('calculator.png'),
    featured: false,
    published: true,
  },
  {
    _id: 'todo-app',
    title: 'To-Do App',
    description:
      'Created a task management app that lets users add, update, and delete tasks, built with HTML, CSS, Bootstrap, and JavaScript.',
    technologies: ['HTML5', 'CSS3', 'Bootstrap', 'JavaScript'],
    category: 'Web App',
    liveDemoUrl: 'https://rakeshgodumala.github.io/Todo-List/',
    imageUrl: projectImage('todo-app.png'),
    featured: false,
    published: true,
  },
  {
    _id: 'fakestore-api',
    title: 'FakeStore API',
    description:
      'Built a product-shopping interface with React.js, Bootstrap, and JavaScript, integrating the FakeStore API to present online store data.',
    technologies: ['React.js', 'JavaScript', 'Bootstrap', 'REST API'],
    category: 'React',
    githubUrl: 'https://github.com/Rakeshgodumala/Fakestore-Api',
    imageUrl: projectImage('fakestore.png'),
    featured: false,
    published: true,
  },
];
