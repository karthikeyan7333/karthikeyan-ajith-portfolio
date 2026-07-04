import { Router } from "express";
import { submitContact, getContacts } from "../controllers/contactController";

const router = Router();

// 1. Contact submission API
router.post("/contact", submitContact);
router.get("/contact/messages", getContacts);

// 2. About Details API
router.get("/about", (req, res) => {
  res.json({
    name: "Karthikeyan Ajith",
    title: "MERN Stack Developer",
    subtitle: "Creative Web Developer",
    description: "I am a passionate MERN Stack Developer with a strong understanding of modern web development. I love crafting high-performance, responsive applications that deliver great user experiences. With a detail-oriented mindset and a dedication to writing clean code, I constantly push myself to learn new technologies and build elegant solutions. I am highly motivated and actively open to opportunities.",
    focusPoints: [
      "Passionate MERN Stack Developer",
      "Strong understanding of modern web development",
      "Love building responsive applications",
      "Always learning new technologies",
      "Open to opportunities",
    ]
  });
});

// 3. Skills API
router.get("/skills", (req, res) => {
  res.json({
    languages: [
  { name: "HTML5", icon: "html5", percentage: 85 },
  { name: "CSS3", icon: "css3", percentage: 80 },
  { name: "JavaScript", icon: "code", percentage: 75 },
  { name: "React.js", icon: "atom", percentage: 75 },
  { name: "Bootstrap", icon: "layout", percentage: 80 }
],
    backend: [
      { name: "Node.js", icon: "server", percentage: 85 },
      { name: "Express.js", icon: "cpu", percentage: 82 },
      { name: "MongoDB", icon: "database", percentage: 80 },
      { name: "Mongoose", icon: "git-commit", percentage: 80 }
    ],
    tools: [
      { name: "Git", icon: "git-branch", percentage: 85 },
      { name: "GitHub", icon: "github", percentage: 88 },
      { name: "VS Code", icon: "terminal", percentage: 90 },
      { name: "Postman", icon: "send", percentage: 82 },
      { name: "NPM", icon: "box", percentage: 85 }
    ]
  });
});

// 4. Projects API
router.get("/projects", (req, res) => {
  res.json([
    {
      id: "grocery",
      name: "Online Grocery Delivery Application",
      description: "A full-stack grocery delivery web application built using the MERN stack. It includes features for product selection, real-time cart management, delivery slot scheduling, and a fully responsive layout.",
      image: "grocery", // maps to our generated grocery image
      tags: ["MongoDB", "Express.js", "React", "Node.js", ],
      github: "https://github.com/karthikeyan-ajith/online-grocery-delivery",
      demo: "https://grocery-delivery-mern.example.com"
    },
    {
      id: "netflix",
      name: "Netflix Clone",
      description: "A frontend web application that replicates the Netflix UI. It features movie category grids, dynamic trailer streaming, and interactive components using modern CSS techniques and JavaScript.",
      image: "netflix", // maps to our generated Netflix image
      tags: ["HTML5", "CSS3","Bootstrap"],
      github: "https://github.com/karthikeyan7333/netflxc-clone",
      demo: "https://karthikeyan7333.github.io/netflxc-clone/"
    },
    {
      id: "swiggy-clone",
      name: "Swiggy Clone",
      description: "A responsive Swiggy-inspired food delivery web application built using HTML, CSS, and JavaScript. Features include restaurant listings, food categories, search functionality, interactive UI components, and a modern user experience optimized for desktop and mobile devices.",
      image: "swiggy-clone", // maps to swiggy-clone placeholder
      tags: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
      github: "https://github.com/karthikeyan7333/swiggy-clone",
      demo: "https://karthikeyan7333.github.io/swiggy-clone/"
    },
    {
      id: "portfolio",
      name: "Developer Portfolio",
      description: "A clean and professional personal portfolio website designed to showcase my software projects and technical skills. Built using Node.js, Express, and CSS, it features a smooth layout, custom scroll effects, and contact form handling with email notifications.",
      image: "portfolio",
      tags: ["Node.js", "Express.js", "Vanilla CSS", "Vanilla JS", "Nodemailer"],
      github: "https://github.com/karthikeyan-ajith/portfolio-website",
      demo: "https://karthikeyan-ajith-portfolio.example.com"
    }
  ]);
});

export default router;
