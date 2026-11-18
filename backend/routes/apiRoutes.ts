import { Router } from "express";
import { submitContact } from "../controllers/contactController";

const router = Router();

// 1. Contact submission API
router.post("/contact", submitContact);

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
    // 1. Lifty
    {
      id: "lifty",
      name: "Lifty – Ride Sharing",
      description:
        "A ride-sharing web application that allows users to find and book rides, with separate functionality for ride providers and administrators.",
      image: "lifty",
      tags: ["React", "Node.js", "Express.js", "MongoDB", "Bootstrap"],
      github: "https://github.com/karthikeyan7333/lifty",
      demo: ""
    },

    // 2. TradeJournal
    {
      id: "tradejournal",
      name: "TradeJournal",
      description:
        "A trading journal application for recording trades across Indian stocks, options, forex and cryptocurrency, with profit and loss tracking, charts, calendar views and trade notes.",
      image: "tradejournal",
      tags: ["Trading Journal", "Trade Tracking", "Analytics", "PWA"],
      github: "https://github.com/karthikeyan7333/tradejournal",
      demo: ""
    },

    // 3. ProgressMind
    {
      id: "progressmind",
      name: "ProgressMind – Habit Tracker",
      description:
        "A habit-tracking application featuring login and signup, calendar-based habit tracking, weekly and monthly progress monitoring, and analytics.",
      image: "progressmind",
      tags: ["React", "Node.js", "Express.js", "MongoDB"],
      github: "https://github.com/karthikeyan7333/progressmind",
      demo: ""
    },

    // 4. Cloud House POS
    {
      id: "cloud-house-pos",
      name: "Cloud House – POS Billing Software",
      description:
        "A Point of Sale billing software project developed as a Python Developer assignment, focused on billing operations and administrative functionality.",
      image: "cloud-house-pos",
      tags: ["POS Billing", "Billing Management", "Administration"],
      github: "https://github.com/karthikeyan7333/cloudhouse-pos-billing",
      demo: ""
    },

    // 5. NutriSnap
    {
      id: "nutrisnap",
      name: "NutriSnap – Nutrition Tracker",
      description:
        "A nutrition-tracking web application designed to help users monitor their daily food intake and nutrition. The project includes a frontend, backend and Progressive Web App support.",
      image: "nutrisnap",
      tags: ["Nutrition Tracking", "PWA", "Frontend", "Backend"],
      github: "https://github.com/karthikeyan7333/nutrition-tracker",
      demo: ""
    },

    // 6. Online Grocery Delivery
    {
      id: "grocery",
      name: "Online Grocery Delivery Application",
      description:
        "A full-stack grocery delivery web application built using the MERN stack. It includes features for product selection, real-time cart management, delivery slot scheduling, and a fully responsive layout.",
      image: "grocery",
      tags: ["MongoDB", "Express.js", "React", "Node.js"],
      github: "https://github.com/karthikeyan7333/online-grocery-store",
      demo: "https://online-grocery-store-1-rqf8.onrender.com"
    },

    // 7. Netflix Clone
    {
      id: "netflix",
      name: "Netflix Clone",
      description:
        "A frontend web application that replicates the Netflix UI. It features movie category grids, dynamic trailer streaming, and interactive components using modern CSS techniques and JavaScript.",
      image: "netflix",
      tags: ["HTML5", "CSS3", "Bootstrap"],
      github: "https://github.com/karthikeyan7333/netflxc-clone",
      demo: "https://karthikeyan7333.github.io/netflxc-clone/"
    },

    // 8. Swiggy Clone
    {
      id: "swiggy-clone",
      name: "Swiggy Clone",
      description:
        "A responsive Swiggy-inspired food delivery web application built using HTML, CSS, and JavaScript. Features include restaurant listings, food categories, search functionality and interactive UI components.",
      image: "swiggy-clone",
      tags: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
      github: "https://github.com/karthikeyan7333/swiggy-clone",
      demo: "https://karthikeyan7333.github.io/swiggy-clone/"
    },

    // 9. Developer Portfolio
    {
      id: "portfolio",
      name: "Developer Portfolio",
      description:
        "A clean and professional personal portfolio website designed to showcase my software projects and technical skills. Built using Node.js, Express, and CSS, it features smooth layout, custom scroll effects, and contact form handling.",
      image: "portfolio",
      tags: ["Node.js", "Express.js", "Vanilla CSS", "Vanilla JS", "Nodemailer"],
      github: "https://github.com/karthikeyan7333/karthikeyan-ajith-portfolio",
      demo: "https://karthikeyan-ajith-portfolio.onrender.com"
    }
  ]);
});


export default router;
