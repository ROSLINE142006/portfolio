// Dynamic Portfolio Logic - app.js

// Initial / Fallback data from Rosline Mary J's resume
const DEFAULT_PROJECTS = [
    {
        id: "proj_1",
        title: "Marriage Hall Booking System",
        category: "fullstack",
        description: "Developed a web-based Marriage Hall Booking System to enable online hall availability checking and reservation management. Designed an admin panel for managing halls, customers, and booking records efficiently. Integrated MySQL database for secure data storage and seamless backend connectivity.",
        technologies: "HTML, CSS, JavaScript, PHP, MySQL",
        github: "https://github.com/rosline-mary/marriage-hall-booking",
        live: "",
        image: ""
    },
    {
        id: "proj_2",
        title: "Don Bosco Skill Mission Allocation Management System",
        category: "frontend",
        description: "Built and deployed a web-based management system for Refectory Allocations and Mass Reading Schedules. Developed Admin Login, Dashboard, allocation management, and schedule publishing features. Created a responsive and user-friendly interface for administrators and users. Deployed the application using Vercel.",
        technologies: "HTML, CSS, JavaScript",
        github: "",
        live: "",
        image: ""
    },
    {
        id: "proj_3",
        title: "Don Bosco Skill Mission (DBSM) Landing Page",
        category: "frontend",
        description: "Developed a responsive and interactive website for Don Bosco Skill Mission (DBSM) to showcase skill development programs, courses, campus facilities, and career opportunities. Designed modern course sections for EV (Electric Vehicle), GSA (Hospitality & Hotel Management), AWS (Cloud Computing), and DCOM (Data Center Operations). Implemented engaging animations, responsive layouts, interactive sections, and user-friendly navigation to provide an attractive digital experience.",
        technologies: "React.js, HTML, CSS, JavaScript",
        github: "",
        live: "",
        image: ""
    }
];

const DEFAULT_CERTS = [
    {
        id: "cred_1",
        title: "Crash Course: Linux For Absolute Beginners",
        type: "certification",
        issuer: "KodeKloud",
        date: "Completed",
        link: "",
        image: ""
    },
    {
        id: "cred_2",
        title: "Object Oriented Programming using Python",
        type: "certification",
        issuer: "Infosys Springboard",
        date: "Completed",
        link: "",
        image: ""
    },
    {
        id: "cred_3",
        title: "Game Development Workshop using Python",
        type: "certification",
        issuer: "Workshop Organizer",
        date: "Completed",
        link: "",
        image: ""
    },
    {
        id: "cred_4",
        title: "Internship Program",
        type: "certification",
        issuer: "Jagan Digitech",
        date: "May 2025",
        link: "",
        image: ""
    },
    {
        id: "cred_5",
        title: "OOPs Concepts in C++",
        type: "certification",
        issuer: "Great Learning Academy",
        date: "Completed",
        link: "",
        image: ""
    },
    {
        id: "cred_6",
        title: "Digital Marketing Course",
        type: "certification",
        issuer: "IBM SkillsBuild",
        date: "Completed",
        link: "",
        image: ""
    },
    {
        id: "cred_7",
        title: "AWS Cloud Quest",
        type: "certification",
        issuer: "AWS",
        date: "Completed",
        link: "",
        image: ""
    },
    {
        id: "cred_8",
        title: "AWS Cloud practitioner Essentials",
        type: "certification",
        issuer: "AWS",
        date: "Completed",
        link: "",
        image: ""
    }
];

// Document Ready Initialization
document.addEventListener("DOMContentLoaded", () => {
    // Force version upgrade of default data if outdated
    const DB_VERSION = "20260831_v3";
    if (localStorage.getItem("portfolio_db_version") !== DB_VERSION) {
        localStorage.setItem("portfolio_projects", JSON.stringify(DEFAULT_PROJECTS));
        localStorage.setItem("portfolio_certs", JSON.stringify(DEFAULT_CERTS));
        localStorage.setItem("portfolio_db_version", DB_VERSION);
    }

    initTheme();
    initVisitorStats();
    initTypingEffect();
    initNavbarScroll();
    initProjectShowcase();
    initCredentialsShowcase();
    initContactForm();
    initMobileMenu();
    initScrollAnimations();
    init3DTilt();
    initCursorGlow();
    initMouseParallax();
    initBgParticles();
});

/* 1. Theme Configuration (Dark / Light Mode) */
function initTheme() {
    const themeToggle = document.getElementById("theme-toggle");
    let currentTheme = localStorage.getItem("portfolio_theme") || "light";
    
    // Apply current theme
    document.documentElement.setAttribute("data-theme", currentTheme);
    
    themeToggle.addEventListener("click", () => {
        const targetTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", targetTheme);
        localStorage.setItem("portfolio_theme", targetTheme);
    });
}

/* 2. Visitor Statistics Logger */
function initVisitorStats() {
    // Increment visitor counter
    let visits = parseInt(localStorage.getItem("portfolio_visitor_count") || "0");
    visits++;
    localStorage.setItem("portfolio_visitor_count", visits);
    
    const countElement = document.getElementById("visitor-count");
    if (countElement) {
        countElement.textContent = visits;
    }

    // Log the visit to visitor histories
    const logs = JSON.parse(localStorage.getItem("portfolio_visitor_logs") || "[]");
    const newLog = {
        timestamp: new Date().toLocaleString(),
        referrer: document.referrer || "Direct Link Access",
        platform: navigator.userAgentData ? navigator.userAgentData.platform : getBrowserPlatform(),
        route: "Public Home Page"
    };
    logs.unshift(newLog);
    // Keep max 200 logs to preserve storage limit
    if (logs.length > 200) logs.pop();
    localStorage.setItem("portfolio_visitor_logs", JSON.stringify(logs));
}

function getBrowserPlatform() {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf("Win") !== -1) return "Windows";
    if (userAgent.indexOf("Mac") !== -1) return "MacOS";
    if (userAgent.indexOf("Linux") !== -1) return "Linux";
    if (userAgent.indexOf("Android") !== -1) return "Android";
    if (userAgent.indexOf("like Mac") !== -1) return "iOS";
    return "Unknown Platform";
}

/* 3. Typing Subtitle Animation */
function initTypingEffect() {
    const words = ["Full Stack Web Developer", "BCA Graduate", "Python Developer", "Database Specialist"];
    const typingSpan = document.getElementById("typing-text");
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        if (!typingSpan) return;
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before starting next word
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
}

/* 4. Navbar Scroll & Progress States */
function initNavbarScroll() {
    const header = document.querySelector(".header");
    const progress = document.getElementById("scroll-progress");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section");

    window.addEventListener("scroll", () => {
        // Sticky Header effect
        if (window.scrollY > 50) {
            header.classList.add("header-scrolled");
        } else {
            header.classList.remove("header-scrolled");
        }

        // Scroll Progress Bar
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolledPercentage = (winScroll / height) * 100;
        if (progress) progress.style.width = scrolledPercentage + "%";

        // Navigation Highlight
        let currentSectionId = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    });
}

/* 5. Projects Showcase Rendering, Searching, and Filtering */
function initProjectShowcase() {
    // Fetch projects from LocalStorage, fallback to Defaults
    let projects = JSON.parse(localStorage.getItem("portfolio_projects"));
    if (!projects || projects.length === 0) {
        projects = DEFAULT_PROJECTS;
        localStorage.setItem("portfolio_projects", JSON.stringify(DEFAULT_PROJECTS));
    }

    const projectsGrid = document.getElementById("projects-grid");
    const searchInput = document.getElementById("project-search");
    const filterButtons = document.querySelectorAll(".filter-btn");

    let currentFilter = "all";
    let searchQuery = "";

    function renderProjects() {
        if (!projectsGrid) return;
        projectsGrid.innerHTML = "";

        const filtered = projects.filter(proj => {
            const matchesCategory = currentFilter === "all" || proj.category === currentFilter;
            const matchesSearch = proj.title.toLowerCase().includes(searchQuery) ||
                                  proj.description.toLowerCase().includes(searchQuery) ||
                                  proj.technologies.toLowerCase().includes(searchQuery);
            return matchesCategory && matchesSearch;
        });

        if (filtered.length === 0) {
            projectsGrid.innerHTML = `
                <div class="no-results glass-card text-center w-100" style="grid-column: 1/-1; padding: 40px;">
                    <i class="fa-solid fa-folder-open" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 15px;"></i>
                    <h3>No Projects Found</h3>
                    <p style="color: var(--text-secondary);">Try refining your search keyword or selected category filter.</p>
                </div>
            `;
            return;
        }

        filtered.forEach(proj => {
            const techBadges = proj.technologies.split(",")
                .map(t => `<span class="project-tech-tag">${t.trim()}</span>`)
                .join("");

            const card = document.createElement("div");
            card.className = "project-card glass-card";
            card.innerHTML = `
                <div class="project-img-wrapper">
                    ${proj.image 
                        ? `<img src="${proj.image}" alt="${proj.title}">` 
                        : `<div class="project-img-fallback">
                            <i class="fa-solid fa-code"></i>
                            <span>${proj.title}</span>
                           </div>`
                    }
                    <span class="badge project-cat-badge">${capitalizeFirstLetter(proj.category)}</span>
                </div>
                <div class="project-body">
                    <h3>${proj.title}</h3>
                    <p>${proj.description}</p>
                    <div class="project-tech-list">
                        ${techBadges}
                    </div>
                    <div class="project-links">
                        ${proj.github ? `<a href="${proj.github}" target="_blank" rel="noopener" class="project-link"><i class="fa-brands fa-github"></i> Source Code</a>` : ""}
                        ${proj.live ? `<a href="${proj.live}" target="_blank" rel="noopener" class="project-link"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>` : ""}
                    </div>
                </div>
            `;
            projectsGrid.appendChild(card);
        });
    }

    // Bind Search Input Handler
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            renderProjects();
        });
    }

    // Bind Filter Category Click handlers
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.getAttribute("data-filter");
            renderProjects();
        });
    });

    renderProjects();
}

/* 6. Credentials & Certifications Showcase Rendering */
function initCredentialsShowcase() {
    let creds = JSON.parse(localStorage.getItem("portfolio_certs"));
    if (!creds || creds.length === 0) {
        creds = DEFAULT_CERTS;
        localStorage.setItem("portfolio_certs", JSON.stringify(DEFAULT_CERTS));
    }

    const credsGrid = document.getElementById("credentials-grid");
    if (!credsGrid) return;

    credsGrid.innerHTML = "";

    creds.forEach(cred => {
        const isAchievement = cred.type === "achievement";
        
        const card = document.createElement("div");
        card.className = `cred-card glass-card ${isAchievement ? 'achievement-card' : ''}`;
        
        card.innerHTML = `
            <div class="cred-icon-box">
                <i class="fa-solid ${isAchievement ? 'fa-award' : 'fa-certificate'}"></i>
            </div>
            <div class="cred-content">
                <span class="badge cred-badge ${isAchievement ? 'cred-badge-ach' : 'cred-badge-cert'}">
                    ${isAchievement ? 'Achievement' : 'Certification'}
                </span>
                <h3>${cred.title}</h3>
                <p class="cred-org">${cred.issuer}</p>
                <p class="cred-date">${cred.date}</p>
                ${cred.link ? `<a href="${cred.link}" target="_blank" rel="noopener" class="cred-verify">Verify Credential <i class="fa-solid fa-circle-check"></i></a>` : ""}
            </div>
        `;
        credsGrid.appendChild(card);
    });
}

/* 7. Contact Form Handling & Mock Integrations */
function initContactForm() {
    const contactForm = document.getElementById("contact-form");
    const feedback = document.getElementById("form-feedback");

    if (!contactForm) return;

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const name = document.getElementById("form-name").value.trim();
        const email = document.getElementById("form-email").value.trim();
        const message = document.getElementById("form-message").value.trim();

        // UI Loading State
        const submitBtn = contactForm.querySelector("button[type='submit']");
        const btnOriginalHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;
        feedback.className = "form-feedback hidden";

        // Simulated API Processing
        setTimeout(() => {
            // Save contact submission details locally to simulate dynamic mail receiver
            const messagesInbox = JSON.parse(localStorage.getItem("portfolio_contact_inbox") || "[]");
            messagesInbox.unshift({
                timestamp: new Date().toLocaleString(),
                name,
                email,
                message
            });
            localStorage.setItem("portfolio_contact_inbox", JSON.stringify(messagesInbox));

            // Log this submission action in Admin visitors log
            const logs = JSON.parse(localStorage.getItem("portfolio_visitor_logs") || "[]");
            logs.unshift({
                timestamp: new Date().toLocaleString(),
                referrer: "Contact Form Submit",
                platform: "System Form Interaction",
                route: `Message from ${name}`
            });
            localStorage.setItem("portfolio_visitor_logs", JSON.stringify(logs));

            // Show success message
            submitBtn.disabled = false;
            submitBtn.innerHTML = btnOriginalHTML;
            
            feedback.textContent = `Thank you, ${name}! Your message has been sent successfully. (Saved to Admin logs)`;
            feedback.className = "form-feedback success";
            
            contactForm.reset();
        }, 1200);
    });
}

/* 8. Responsive Mobile Menu Drawer Toggle */
function initMobileMenu() {
    const toggleBtn = document.getElementById("mobile-menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener("click", () => {
        toggleBtn.classList.toggle("open");
        navMenu.classList.toggle("open");
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            toggleBtn.classList.remove("open");
            navMenu.classList.remove("open");
        });
    });
}

// Utility Helpers
function capitalizeFirstLetter(string) {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/* 9. 3D Card Hover Tilt Effect */
function init3DTilt() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.addEventListener("mousemove", (e) => {
        const card = e.target.closest(".glass-card");
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const normalizedX = (x - centerX) / centerX;
        const normalizedY = (y - centerY) / centerY;

        const maxTilt = 8; // Max degree tilt
        const rotateY = (normalizedX * maxTilt).toFixed(2);
        const rotateX = (-normalizedY * maxTilt).toFixed(2);

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02) translateY(-6px)`;
        card.style.boxShadow = `${-normalizedX * 10}px ${-normalizedY * 10}px 32px -10px var(--accent-glow), var(--shadow-md)`;
        card.style.transition = "transform 0.1s ease, box-shadow 0.1s ease";
    });

    document.addEventListener("mouseleave", (e) => {
        const card = e.target.closest(".glass-card");
        if (!card) return;
        
        card.style.transform = "";
        card.style.boxShadow = "";
        card.style.transition = "transform 0.5s ease, box-shadow 0.5s ease";
    }, true);
}

/* 10. Scroll Entrance Fade-In Animations */
function initScrollAnimations() {
    const sections = document.querySelectorAll(".fade-in-section");
    if (!sections.length) return;

    const observerOptions = {
        root: null,
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        if (section.id === "home") {
            setTimeout(() => {
                section.classList.add("is-visible");
            }, 150);
        } else {
            observer.observe(section);
        }
    });
}

/* 11. Cursor Following Glow Interaction */
function initCursorGlow() {
    const glow = document.getElementById("cursor-glow");
    if (!glow) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.addEventListener("mousemove", (e) => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
        
        if (glow.style.opacity === "0" || glow.style.opacity === "") {
            glow.style.opacity = "1";
        }
    });

    document.addEventListener("mouseleave", () => {
        glow.style.opacity = "0";
    });
}

/* 12. Mouse Parallax for Floating Brackets and Shapes */
function initMouseParallax() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const shapes = document.querySelectorAll(".parallax-shape");
    
    document.addEventListener("mousemove", (e) => {
        const x = (window.innerWidth / 2 - e.clientX) / 45;
        const y = (window.innerHeight / 2 - e.clientY) / 45;
        
        shapes.forEach(shape => {
            const speed = parseFloat(shape.getAttribute("data-speed") || "1");
            const px = (x * speed).toFixed(2);
            const py = (y * speed).toFixed(2);
            shape.style.setProperty("--parallax-x", `${px}px`);
            shape.style.setProperty("--parallax-y", `${py}px`);
        });
    });
}

/* 13. Dynamic Background Particle Generator */
function initBgParticles() {
    const container = document.getElementById("bg-particles");
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const numParticles = 25;
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement("div");
        particle.className = "bg-particle";
        
        const size = Math.random() * 5 + 3; // 3px to 8px
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 20 + 20; // 20s to 40s
        const delay = Math.random() * -20;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.opacity = (Math.random() * 0.12 + 0.04).toFixed(2);
        
        // 90% gold / yellow, 10% secondary accent blue
        const isBlue = Math.random() < 0.1;
        if (isBlue) {
            particle.style.background = "var(--secondary-accent-blue)";
            particle.style.boxShadow = "0 0 8px var(--secondary-accent-blue)";
        } else {
            particle.style.background = "var(--secondary-accent)";
            particle.style.boxShadow = "0 0 8px var(--secondary-accent)";
        }
        
        particle.style.animation = `float-bg-particle ${duration}s linear infinite`;
        particle.style.animationDelay = `${delay}s`;
        
        container.appendChild(particle);
    }
}
