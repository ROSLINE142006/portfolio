// Dynamic Portfolio Logic - app.js

// Initial / Fallback data from Rosline Mary J's resume
const DEFAULT_PROJECTS = [
    {
        id: "proj_1",
        title: "Marriage Hall Booking System",
        category: "fullstack",
        description: "Developed a web-based Marriage Hall Booking System to simplify online hall reservations. Users can check hall availability, book rooms, and manage reservations. Includes a complete administrator console to manage records, bookings, and customer databases.",
        technologies: "HTML, CSS, JavaScript, PHP, MySQL",
        github: "https://github.com/rosline-mary/marriage-hall-booking",
        live: "",
        image: ""
    },
    {
        id: "proj_2",
        title: "Full Stack Internship Web App",
        category: "fullstack",
        description: "Built during the internship at Jagan Digitech. Consists of a responsive React.js frontend interface integrated with ASP.NET Core Web API endpoints and an underlying SQL Server database, running operations using Entity Framework Core.",
        technologies: "React.js, ASP.NET Core, Web API, SQL Server, Entity Framework Core",
        github: "https://github.com/rosline-mary/full-stack-intern-app",
        live: "",
        image: ""
    }
];

const DEFAULT_CERTS = [
    {
        id: "cred_1",
        title: "Python Programming Essentials",
        type: "certification",
        issuer: "Coursera / Python Institute",
        date: "May 2025",
        link: "https://coursera.org/verify/python-essentials",
        image: ""
    },
    {
        id: "cred_2",
        title: "Relational Database Management with MySQL",
        type: "certification",
        issuer: "Oracle / MySQL Academy",
        date: "April 2025",
        link: "https://mysql.com/certification/rdms-mysql",
        image: ""
    },
    {
        id: "cred_3",
        title: "Active Core Committee Member",
        type: "achievement",
        issuer: "School of Computing, Don Bosco College",
        date: "2024 - 2025",
        link: "",
        image: ""
    }
];

// Document Ready Initialization
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initVisitorStats();
    initTypingEffect();
    initNavbarScroll();
    initProjectShowcase();
    initCredentialsShowcase();
    initContactForm();
    initMobileMenu();
});

/* 1. Theme Configuration (Dark / Light Mode) */
function initTheme() {
    const themeToggle = document.getElementById("theme-toggle");
    let currentTheme = localStorage.getItem("portfolio_theme") || "dark";
    
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
    const words = ["Python Developer", "Full Stack Enthusiast", "BCA Student", "Database Specialist"];
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
