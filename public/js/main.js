/**
 * Karthikeyan Ajith - Premium Portfolio Client Engine
 * Vanilla JavaScript (ES6+) with zero external framework dependencies
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- 1. LOADER INITIALIZATION ---
  const loader = document.getElementById("loader");
  window.addEventListener("load", () => {
    setTimeout(() => {
      if (loader) {
        loader.style.opacity = "0";
        setTimeout(() => {
          loader.style.visibility = "hidden";
        }, 600);
      }
      // Trigger metric counters and scroll reveal once page is loaded
      initScrollReveal();
      initMetricCounters();
    }, 800);
  });

  // Fallback in case load event takes too long
  setTimeout(() => {
    if (loader && loader.style.opacity !== "0") {
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.visibility = "hidden";
      }, 600);
      initScrollReveal();
      initMetricCounters();
    }
  }, 3000);

  // --- 2. INITIALIZE ICONS ---
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // --- 3. DYNAMIC REST API INTEGRATION ---
  // Demonstrates full-stack capability by retrieving portfolio data from the Express backend
  async function loadBackendData() {
    try {
      // Fetch About Details
      const aboutRes = await fetch("/api/about");
      if (aboutRes.ok) {
        const aboutData = await aboutRes.json();
        const leadEl = document.querySelector(".about-lead");
        if (leadEl) leadEl.textContent = aboutData.subtitle + " & " + aboutData.title;
      }

      // Fetch Technical Skills
      const skillsRes = await fetch("/api/skills");
      if (skillsRes.ok) {
        const skillsData = await skillsRes.json();
        populateSkills("skills-languages", skillsData.languages);
        populateSkills("skills-backend", skillsData.backend);
        populateSkills("skills-tools", skillsData.tools);
        if (typeof lucide !== "undefined") lucide.createIcons();
      }

      // Fetch Projects
      const projectsRes = await fetch("/api/projects");
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        populateProjects(projectsData);
        if (typeof lucide !== "undefined") lucide.createIcons();
      }
    } catch (err) {
      console.warn("⚠️ REST API fetch failed or server offline. Utilizing static HTML fallbacks.");
    }
  }

  function populateSkills(containerId, skillsList) {
    const container = document.getElementById(containerId);
    if (!container || !skillsList) return;
    container.innerHTML = ""; // Clear fallback placeholders

    skillsList.forEach((skill) => {
      const skillItem = document.createElement("div");
      skillItem.className = "skill-item";
      skillItem.innerHTML = `
        <div class="skill-info font-mono">
          <span>${skill.name}</span>
          <span>${skill.percentage}%</span>
        </div>
        <div class="skill-progress-bg">
          <div class="skill-progress-fill" style="width: 0%;"></div>
        </div>
      `;
      container.appendChild(skillItem);

      // Trigger progress bar transition with delay for reveal effect
      setTimeout(() => {
        const fill = skillItem.querySelector(".skill-progress-fill");
        if (fill) fill.style.width = `${skill.percentage}%`;
      }, 200);
    });
  }

  function populateProjects(projects) {
    const container = document.getElementById("projectsContainer");
    if (!container || !projects) return;
    container.innerHTML = ""; // Clear fallback placeholders

    projects.forEach((proj) => {
      const card = document.createElement("div");
      card.className = "project-card glass-card scroll-reveal";
      
      // Map project image IDs to our generated visual assets or general picsum
      let imgSrc = "https://picsum.photos/seed/" + proj.id + "/600/450";
      if (proj.image === "grocery") {
        imgSrc = "/src/assets/images/groceryimage.png";
      } else if (proj.image === "netflix") {
        imgSrc = "/src/assets/images/netflix.png";
      } else if (proj.image === "swiggy-clone" || proj.image === "swiggy") {
        imgSrc = "/src/assets/images/swiggy-clone.png";
      }else if (proj.image === "portfolio") {
    imgSrc = "/src/assets/images/images.jpg";
}

      const tagsHtml = proj.tags.map(t => `<span>${t}</span>`).join("");

      card.innerHTML = `
        <div class="project-img-container">
          <img src="${imgSrc}" alt="${proj.name}" class="project-img" referrerPolicy="no-referrer">
          <div class="project-overlay">
            <div class="overlay-buttons">
              <a href="${proj.github}" target="_blank" class="overlay-btn" aria-label="View Code"><i data-lucide="github"></i></a>
              <a href="${proj.demo}" target="_blank" class="overlay-btn" aria-label="Live Demo"><i data-lucide="external-link"></i></a>
            </div>
          </div>
        </div>
        <div class="project-info">
          <h3 class="project-name font-display">${proj.name}</h3>
          <p class="project-description">${proj.description}</p>
          <div class="project-tags font-mono">
            ${tagsHtml}
          </div>
          <div class="project-actions">
            <a href="${proj.github}" target="_blank" class="btn-text font-mono">GitHub <i data-lucide="arrow-up-right"></i></a>
            <a href="${proj.demo}" target="_blank" class="btn-text font-mono">Live Demo <i data-lucide="arrow-up-right"></i></a>
          </div>
        </div>
      `;
      container.appendChild(card);
      initSpotlight(card);
    });
  }

  loadBackendData();

  // --- 4. CUSTOM CURSOR & LAGGING CIRCLE ---
  const cursor = document.getElementById("customCursor");
  const follower = document.getElementById("customFollower");

  let cursorX = 0, cursorY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener("mousemove", (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    
    if (cursor) {
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
    }
  });

  // Render follower with a smooth lagging interpolation
  function updateFollower() {
    const dx = cursorX - followerX;
    const dy = cursorY - followerY;
    
    followerX += dx * 0.12;
    followerY += dy * 0.12;
    
    if (follower) {
      follower.style.left = `${followerX}px`;
      follower.style.top = `${followerY}px`;
    }
    
    requestAnimationFrame(updateFollower);
  }
  updateFollower();

  // Link Hover cursor expansion
  function setupCursorHoverEvents() {
    const targetElements = document.querySelectorAll("a, button, input, textarea, .social-icon, .mobile-menu-toggle");
    targetElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        document.body.classList.add("hovering-link");
      });
      el.addEventListener("mouseleave", () => {
        document.body.classList.remove("hovering-link");
      });
    });
  }
  // Setup initially and re-run when dynamic updates happen
  setupCursorHoverEvents();
  
  // Observe DOM additions to bind cursor events to dynamic nodes
  const observer = new MutationObserver(() => {
    setupCursorHoverEvents();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // --- 5. STICKY NAVBAR NAVIGATION ---
  const header = document.querySelector(".header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // --- 6. SCROLL PROGRESS BAR ---
  const progressBar = document.getElementById("scrollProgress");
  window.addEventListener("scroll", () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (totalScroll > 0) {
      const percentage = (window.scrollY / totalScroll) * 100;
      if (progressBar) progressBar.style.width = `${percentage}%`;
    }
  });

  // --- 7. TYPING ANIMATION ---
  const words = [
    "MERN Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Open to Work"
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typedEl = document.getElementById("typedText");

  function typeEffect() {
    if (!typedEl) return;
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typedEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 1800; // Hold at full word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 400; // Brief delay before typing next word
    }

    setTimeout(typeEffect, typeSpeed);
  }
  typeEffect();

  // --- 8. CARD SPOTLIGHT MOUSE GLOW ---
  function initSpotlight(card) {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  }
  document.querySelectorAll(".glass-card").forEach(initSpotlight);

  // --- 9. INTERACTIVE CANVAS PARTICLES ---
  const canvas = document.getElementById("particlesCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let particlesArray = [];
    
    const colors = ["#10B981", "#22D3EE", "#F8FAFC"];

    function resizeCanvas() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce boundaries
        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    function initParticles() {
      particlesArray = [];
      const numberOfParticles = Math.min(60, Math.floor((canvas.width * canvas.height) / 15000));
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }
    initParticles();
    window.addEventListener("resize", initParticles);

    function animateParticles() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // --- 10. SCROLL REVEAL MECHANISM ---
  function initScrollReveal() {
    const revealElements = document.querySelectorAll(".scroll-reveal");
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
          // Optionally unobserve after revealing for performance
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach((el) => observer.observe(el));
  }

  // --- 11. METRIC COUNTERS ---
  function initMetricCounters() {
    const numbers = document.querySelectorAll(".metric-number");
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute("data-target"));
          animateCounter(entry.target, target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    numbers.forEach((num) => observer.observe(num));
  }

  function animateCounter(element, target) {
    let current = 0;
    const duration = 2000; // 2 seconds
    const stepTime = Math.max(10, Math.floor(duration / target));
    
    const timer = setInterval(() => {
      current += Math.ceil(target / 100);
      if (current >= target) {
        element.textContent = target + "+";
        clearInterval(timer);
      } else {
        element.textContent = current;
      }
    }, stepTime);
  }

  // --- 12. RESPONSIVE MOBILE MENU ---
  const menuToggle = document.getElementById("menuToggle");
  const mobileOverlay = document.getElementById("mobileOverlay");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  if (menuToggle && mobileOverlay) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      mobileOverlay.classList.toggle("active");
      document.body.classList.toggle("overflow-hidden");
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        mobileOverlay.classList.remove("active");
        document.body.classList.remove("overflow-hidden");
      });
    });
  }

  // --- 13. VISUAL THEME TOGGLING (DARK / LIGHT) ---
  const themeToggle = document.getElementById("themeToggle");
  
  // Sync on startup
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      
      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("theme", nextTheme);
    });
  }

  // --- 14. CONTACT FORM SUBMISSION ENGINE (AJAX) ---
  const contactForm = document.getElementById("contactForm");
  const formAlert = document.getElementById("formAlert");
  const submitBtn = document.getElementById("submitBtn");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      // Reset Alert
      if (formAlert) formAlert.innerHTML = "";
      
      // Grab Inputs
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const subject = document.getElementById("subject").value.trim();
      const message = document.getElementById("message").value.trim();

      // UI Feedback: Sending State
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `Sending Message <i class="luxury-spinner" style="width: 14px; height: 14px; margin-left: 8px; border-width: 1.5px;"></i>`;
      }

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, subject, message }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Success Banner
          let bannerHtml = `
            <div class="alert-message alert-success">
              <i data-lucide="check-circle"></i>
              <div>
                <strong>Success!</strong> ${data.message}
              </div>
            </div>
          `;
          
          if (data.previewUrl) {
            bannerHtml = `
              <div class="alert-message alert-success" style="flex-direction: column; align-items: flex-start;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <i data-lucide="check-circle"></i>
                  <span><strong>Success!</strong> ${data.message}</span>
                </div>
                <div style="margin-top: 10px; font-size: 11px; padding-left: 28px;">
                  📬 Test Email Generated via Ethereal: <a href="${data.previewUrl}" target="_blank" style="color: #06B6D4; text-decoration: underline; font-weight:600;">Click to view simulated inbox</a>
                </div>
              </div>
            `;
          }
          
          if (formAlert) formAlert.innerHTML = bannerHtml;
          contactForm.reset();
        } else {
          // Error response from server
          if (formAlert) {
            formAlert.innerHTML = `
              <div class="alert-message alert-error">
                <i data-lucide="alert-circle"></i>
                <div>
                  <strong>Error:</strong> ${data.message || "Could not submit inquiry. Please check your data."}
                </div>
              </div>
            `;
          }
        }
      } catch (err) {
        // Network or client connection error
        if (formAlert) {
          formAlert.innerHTML = `
            <div class="alert-message alert-error">
              <i data-lucide="alert-circle"></i>
              <div>
                <strong>Error:</strong> Connection failed. Please ensure the Express server is online and try again.
              </div>
            </div>
          `;
        }
      } finally {
        // Re-enable button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `Send Message <i data-lucide="send"></i>`;
        }
        if (typeof lucide !== "undefined") {
          lucide.createIcons();
        }
      }
    });
  }

  // --- 15. BACK TO TOP BUTTON ---
  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // --- 16. ACTIVE SCROLL LINK SYNCHRONIZATION ---
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 180;
      const sectionId = current.getAttribute("id");
      
      const desktopLink = document.querySelector(`.nav-link[href*=${sectionId}]`);
      const mobileLink = document.querySelector(`.mobile-nav-link[href*=${sectionId}]`);
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        if (desktopLink) desktopLink.classList.add("active");
        if (mobileLink) mobileLink.classList.add("active");
      } else {
        if (desktopLink) desktopLink.classList.remove("active");
        if (mobileLink) mobileLink.classList.remove("active");
      }
    });
  });
});
