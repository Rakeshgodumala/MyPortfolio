/**
 * Static profile content. Projects and certifications are managed in the admin dashboard;
 * everything else about you lives here.
 */
import {
  FaBootstrap, FaCss3Alt, FaGitAlt, FaGithub, FaHtml5, FaJs, FaNodeJs, FaReact,
} from 'react-icons/fa';
import {
  FaCubes, FaDatabase, FaDiagramProject, FaMobileScreenButton, FaPlug,
} from 'react-icons/fa6';
import { SiCplusplus, SiExpress, SiMongodb, SiNextdotjs, SiTailwindcss } from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';

export const profile = {
  name: 'Rakesh Godumala',
  firstName: 'Rakesh',
  title: 'UI Developer | Full Stack Developer',
  roles: ['UI Developer', 'Full Stack Developer', 'React.js Developer', 'Frontend Developer'],
  email: 'rakeshgodumala22@gmail.com',
  phone: '+91 6301132896',
  phoneHref: 'tel:+916301132896',
  location: 'Hyderabad, Telangana, India',
  resumeUrl: import.meta.env.VITE_RESUME_URL || '/resume/Rakesh_Godumala_Resume.pdf',
  links: {
    linkedin: 'https://www.linkedin.com/in/rakesh-godumala-8b27371b6/',
    github: 'https://github.com/Rakeshgodumala',
    leetcode: 'https://leetcode.com/u/rakeshgodumala',
  },
  intro:
    'I build responsive, user-friendly web applications with React.js, JavaScript and modern CSS, turning ideas into clean, accessible interfaces.',
  summary:
    'I am a frontend developer with a strong interest in building responsive, user-friendly web applications. I have hands-on experience with HTML, CSS, JavaScript, React.js, Bootstrap, Tailwind CSS, and foundational full-stack technologies. I enjoy transforming ideas into clean user interfaces, solving problems, and continuously improving my development skills. I am looking for an opportunity to contribute to real-world projects and grow as a software developer.',
  languages: ['English', 'Hindi', 'Telugu', 'Marathi'],
  interests: [
    'Exploring New Technologies & Tools',
    'Designing Clean User Interfaces',
    'Building Full-Stack Web Projects',
    'Continuous Learning & Upskilling',
    'Solving Coding & Logic Challenges',
    'Studying Modern Website Designs',
  ],
};

export const skillGroups = [
  {
    title: 'Frontend',
    description: 'Building responsive, accessible user interfaces.',
    skills: [
      { name: 'HTML5', icon: FaHtml5, color: '#e34f26' },
      { name: 'CSS3', icon: FaCss3Alt, color: '#1572b6' },
      { name: 'JavaScript', icon: FaJs, color: '#e5b400' },
      { name: 'React.js', icon: FaReact, color: '#00b4d8' },
      { name: 'Bootstrap 5', icon: FaBootstrap, color: '#7952b3' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06b6d4' },
      { name: 'Next.js', icon: SiNextdotjs, color: 'currentColor' },
      { name: 'Responsive Web Design', icon: FaMobileScreenButton, color: '#6366f1' },
    ],
  },
  {
    title: 'Backend & Database',
    description: 'Foundational server-side and data skills.',
    skills: [
      { name: 'Node.js', icon: FaNodeJs, color: '#5fa04e' },
      { name: 'Express.js', icon: SiExpress, color: 'currentColor' },
      { name: 'MongoDB', icon: SiMongodb, color: '#47a248' },
    ],
  },
  {
    title: 'Programming & Concepts',
    description: 'Core problem-solving foundations.',
    skills: [
      { name: 'C++', icon: SiCplusplus, color: '#00599c' },
      { name: 'Object-Oriented Programming', icon: FaCubes, color: '#8b5cf6' },
      { name: 'Data Structures & Algorithms', icon: FaDiagramProject, color: '#0ea5e9' },
      { name: 'CRUD Operations', icon: FaDatabase, color: '#f97316' },
      { name: 'REST API Integration', icon: FaPlug, color: '#10b981' },
    ],
  },
  {
    title: 'Tools',
    description: 'Everyday development workflow.',
    skills: [
      { name: 'Git', icon: FaGitAlt, color: '#f05032' },
      { name: 'GitHub', icon: FaGithub, color: 'currentColor' },
      { name: 'Visual Studio Code', icon: VscVscode, color: '#007acc' },
    ],
  },
];

export const experience = [
  {
    role: 'Software Intern',
    organization: 'Purview Services',
    type: 'Internship',
    mode: 'Onsite · Hyderabad',
    period: 'September 2026 – October 2026',
    project: 'BeeRef',
    points: [
      'Contributed to BeeRef, an AI-powered recruitment and employee referral platform designed to simplify recruitment workflows and referrals.',
      'Designed and developed responsive landing pages, login and signup interfaces, and project-specific dashboards.',
      'Built reusable React components and interactive UI elements using React.js, JavaScript, and Bootstrap.',
    ],
    technologies: ['React.js', 'JavaScript', 'Bootstrap'],
  },
  {
    role: 'Frontend Developer Intern',
    organization: 'IBM SkillsBuild',
    type: 'Internship',
    mode: 'Remote',
    period: 'June 2024 – August 2024',
    project: 'CareBridge Healthcare Website',
    points: [
      'Collaborated with a small team to build a healthcare website aimed at helping underserved communities access medical information and services.',
      'Developed a responsive user interface using HTML, CSS, Bootstrap, and JavaScript.',
      'Worked on doctor information, appointment flow, and health tips sections.',
      'Focused on accessibility, responsiveness, and user-friendly layouts.',
    ],
    technologies: ['HTML5', 'CSS3', 'Bootstrap', 'JavaScript'],
  },
];

export const education = [
  {
    degree: 'Master of Computer Applications (MCA)',
    institution: 'Osmania University, Hyderabad',
    period: '2023 – 2025',
    score: 'CGPA: 7.35',
  },
  {
    degree: 'Bachelor of Science (B.Sc.) in Computer Science',
    institution: 'Osmania University, Hyderabad',
    period: '2018 – 2021',
    score: 'CGPA: 8.96',
  },
  {
    degree: 'Intermediate — MPC',
    institution: 'Omega Junior College, TSBIE',
    period: '2016 – 2018',
    score: 'Percentage: 77%',
  },
];

// Shown if the API cannot be reached. Verification links are added in the admin dashboard.
export const fallbackCertifications = [
  {
    _id: 'ibm',
    title: 'Front-end Web Development',
    issuer: 'IBM SkillsBuild',
    credentialUrl: 'https://drive.google.com/file/d/1oD-DbuFk260PI8H3K7BTDcQNlz1MXPqB/view',
  },
  {
    _id: 'udemy',
    title: 'HTML & CSS Certification Course',
    issuer: 'Udemy',
    credentialUrl: 'https://www.udemy.com/certificate/UC-481b7769-9325-4e14-a986-7e3fb77ace09',
  },
  {
    _id: 'cognitive-python',
    title: 'Python 101 for Data Science',
    issuer: 'Cognitive Class',
    credentialUrl: 'https://courses.cognitiveclass.ai/certificates/60c94421c54440e8992731ef5ccb6958',
  },
  {
    _id: 'azure-ai',
    title: 'Microsoft Certified: Azure AI Fundamentals',
    issuer: 'Microsoft',
    credentialUrl: 'https://learn.microsoft.com/api/credentials/share/en-us/RakeshGodumala-4963/7CF51F0BEFCE7081?sharingId=ABD9E7E62E48EBF8',
  },
  {
    _id: 'azure-az900',
    title: 'Microsoft Certified: Azure Fundamentals (AZ-900)',
    issuer: 'Microsoft',
    credentialUrl: 'https://learn.microsoft.com/en-us/users/rakeshgodumala-4963/credentials/39e913e45803068a',
  },
  {
    _id: 'ux-coursera',
    title: 'Foundations of UX Design',
    issuer: 'Coursera (Google)',
    credentialUrl: 'https://www.coursera.org/account/accomplishments/verify/M3HCJGJAGVVR/',
  },
];

export const achievements = [
  {
    title: 'TechGig Code Gladiators 2024 Semifinalist',
    detail: 'Reached the semifinal of the TechGig Code Gladiators 2024 hackathon with an All-India Rank of 488.',
    highlight: 'AIR 488',
    kind: 'trophy',
  },
  {
    title: '75 Gold Badges on TechGig',
    detail: 'Earned 75 Gold badges, along with Silver and Bronze badges, by solving coding challenges on TechGig.',
    highlight: '75 Gold',
    kind: 'medal',
  },
];

export const navSections = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];
