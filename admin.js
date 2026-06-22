// Portfolio Admin Dashboard Logic - admin.js

document.addEventListener("DOMContentLoaded", () => {
    initAdminSession();
    initTheme();
});

/* 1. Admin Authentication & Session Management */
function initAdminSession() {
    const loginOverlay = document.getElementById("admin-login-overlay");
    const adminConsole = document.getElementById("admin-console");
    const loginForm = document.getElementById("admin-login-form");
    const passwordInput = document.getElementById("admin-password");
    const togglePasswordBtn = document.getElementById("toggle-password-vis");
    const loginError = document.getElementById("login-error");
    const logoutBtn = document.getElementById("admin-logout-btn");

    // Check if session is already unlocked
    const isUnlocked = sessionStorage.getItem("portfolio_admin_auth") === "true";
    if (isUnlocked) {
        loginOverlay.classList.add("hidden");
        adminConsole.classList.remove("hidden");
        setupDashboard();
    }

    // Toggle Password Visibility
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener("click", () => {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);
            const icon = togglePasswordBtn.querySelector("i");
            icon.classList.toggle("fa-eye");
            icon.classList.toggle("fa-eye-slash");
        });
    }

    // Submit passcode form
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const password = passwordInput.value.trim();

            // Check against default passcode: admin123
            if (password === "admin123") {
                sessionStorage.setItem("portfolio_admin_auth", "true");
                loginError.classList.add("hidden");
                loginOverlay.classList.add("hidden");
                adminConsole.classList.remove("hidden");
                setupDashboard();
                showToast("Console unlocked successfully!");
                passwordInput.value = "";
            } else {
                loginError.classList.remove("hidden");
                passwordInput.value = "";
            }
        });
    }

    // Lock Dashboard (Logout)
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem("portfolio_admin_auth");
            location.reload();
        });
    }
}

/* 2. Unified Light/Dark Theme initialization for admin */
function initTheme() {
    const savedTheme = localStorage.getItem("portfolio_theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
}

/* 3. Core Dashboard Setup and Operations */
function setupDashboard() {
    initDashboardMetrics();
    initTabNavigation();
    initFileUploader("project-drag-uploader", "proj-image-input", "proj-image-preview", "project-image-preview-box", "proj-image-base64");
    initFileUploader("cred-drag-uploader", "cred-image-input", "cred-image-preview", "cred-image-preview-box", "cred-image-base64");
    
    // Clear Preview button links
    document.getElementById("remove-project-img").addEventListener("click", () => clearImagePreview("proj-image-input", "proj-image-preview", "project-image-preview-box", "proj-image-base64"));
    document.getElementById("remove-cred-img").addEventListener("click", () => clearImagePreview("cred-image-input", "cred-image-preview", "cred-image-preview-box", "cred-image-base64"));

    initProjectsCrud();
    initCredentialsCrud();
    initVisitorLogsView();
}

/* 4. Update Stats Metrics Card counters */
function initDashboardMetrics() {
    const viewsEl = document.getElementById("stat-views");
    const projEl = document.getElementById("stat-projects");
    const certEl = document.getElementById("stat-certs");

    // Fetch counts from storage
    const views = localStorage.getItem("portfolio_visitor_count") || "0";
    const projects = JSON.parse(localStorage.getItem("portfolio_projects") || "[]");
    const certs = JSON.parse(localStorage.getItem("portfolio_certs") || "[]");

    if (viewsEl) viewsEl.textContent = views;
    if (projEl) projEl.textContent = projects.length;
    if (certEl) certEl.textContent = certs.length;
}

/* 5. Navigation Tabs Controller */
function initTabNavigation() {
    const tabButtons = document.querySelectorAll(".sidebar-tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    const titleEl = document.getElementById("tab-title");
    const subtitleEl = document.getElementById("tab-subtitle");

    const tabMeta = {
        overview: {
            title: "Dashboard Overview",
            subtitle: "Welcome back, Admin! Here is a summary of your website metrics."
        },
        projects: {
            title: "Manage Projects",
            subtitle: "Add, modify, or remove software works appearing in your public catalog."
        },
        credentials: {
            title: "Manage Credentials",
            subtitle: "Manage academic awards, industry certifications, and key achievements."
        },
        visitors: {
            title: "Visitor Traffic Logs",
            subtitle: "Audit tracking histories and simulated user hits recorded on your portfolio page."
        }
    };

    window.switchTab = function(tabName, autoClick = false) {
        tabButtons.forEach(btn => {
            btn.classList.remove("active");
            if (btn.getAttribute("data-tab") === tabName) {
                btn.classList.add("active");
            }
        });

        tabContents.forEach(content => {
            content.classList.remove("active");
        });

        const targetContent = document.getElementById(`tab-content-${tabName}`);
        if (targetContent) targetContent.classList.add("active");

        if (tabMeta[tabName]) {
            titleEl.textContent = tabMeta[tabName].title;
            subtitleEl.textContent = tabMeta[tabName].subtitle;
        }
    };

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const tabName = btn.getAttribute("data-tab");
            switchTab(tabName);
        });
    });
}

/* 6. Drag & Drop File Upload Handler (Base64 encoding) */
function initFileUploader(uploaderId, inputId, previewImgId, previewContainerId, hiddenBase64Id) {
    const uploader = document.getElementById(uploaderId);
    const fileInput = document.getElementById(inputId);
    const previewImg = document.getElementById(previewImgId);
    const previewContainer = document.getElementById(previewContainerId);
    const hiddenBase64 = document.getElementById(hiddenBase64Id);

    if (!uploader || !fileInput) return;

    // Trigger file chooser on box click
    uploader.addEventListener("click", () => fileInput.click());

    // Highlight on dragover
    uploader.addEventListener("dragover", (e) => {
        e.preventDefault();
        uploader.classList.add("dragover");
    });

    uploader.addEventListener("dragleave", () => {
        uploader.classList.remove("dragover");
    });

    uploader.addEventListener("drop", (e) => {
        e.preventDefault();
        uploader.classList.remove("dragover");
        if (e.dataTransfer.files.length > 0) {
            handleImageFile(e.dataTransfer.files[0]);
        }
    });

    // File selected handler
    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            handleImageFile(e.target.files[0]);
        }
    });

    function handleImageFile(file) {
        if (!file.type.startsWith("image/")) {
            showToast("Only image files are accepted!", "error");
            return;
        }

        // Limit size to ~1.5MB to save Storage allocations
        if (file.size > 1.5 * 1024 * 1024) {
            showToast("Please choose an image smaller than 1.5MB to optimize storage.", "error");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            previewImg.src = event.target.result;
            previewContainer.classList.remove("hidden");
            uploader.classList.add("hidden");
            hiddenBase64.value = event.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function clearImagePreview(inputId, previewImgId, previewContainerId, hiddenBase64Id) {
    document.getElementById(inputId).value = "";
    document.getElementById(previewImgId).src = "";
    document.getElementById(previewContainerId).classList.add("hidden");
    
    // Find uploader parent element to un-hide
    let uploaderId = inputId === "proj-image-input" ? "project-drag-uploader" : "cred-drag-uploader";
    document.getElementById(uploaderId).classList.remove("hidden");
    document.getElementById(hiddenBase64Id).value = "";
}

/* 7. Projects CRUD Setup */
function initProjectsCrud() {
    const projectsForm = document.getElementById("project-crud-form");
    const projIdInput = document.getElementById("project-id");
    const projTitleInput = document.getElementById("proj-title");
    const projCatSelect = document.getElementById("proj-category");
    const projDescText = document.getElementById("proj-desc");
    const projTechInput = document.getElementById("proj-tech");
    const projGithubInput = document.getElementById("proj-github");
    const projLiveInput = document.getElementById("proj-live");
    const projImageBase64 = document.getElementById("proj-image-base64");
    
    const cancelEditBtn = document.getElementById("btn-project-cancel");
    const submitBtn = document.getElementById("btn-project-submit");
    const formTitle = document.getElementById("project-form-title");
    
    const projectsTableBody = document.getElementById("admin-projects-tbody");
    const adminSearch = document.getElementById("admin-project-search");

    let currentProjects = JSON.parse(localStorage.getItem("portfolio_projects") || "[]");

    function renderTable(filterQuery = "") {
        if (!projectsTableBody) return;
        projectsTableBody.innerHTML = "";

        const filtered = currentProjects.filter(p => 
            p.title.toLowerCase().includes(filterQuery) || 
            p.description.toLowerCase().includes(filterQuery) ||
            p.technologies.toLowerCase().includes(filterQuery)
        );

        if (filtered.length === 0) {
            projectsTableBody.innerHTML = `<tr><td colspan="4" class="text-center">No projects listed.</td></tr>`;
            return;
        }

        filtered.forEach(p => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${p.title}</strong></td>
                <td><span class="badge tech-badge">${p.category}</span></td>
                <td style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.technologies}</td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn btn-edit" onclick="editProject('${p.id}')" title="Edit"><i class="fa-solid fa-pencil"></i></button>
                        <button class="action-btn btn-delete" onclick="deleteProject('${p.id}')" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </td>
            `;
            projectsTableBody.appendChild(tr);
        });
    }

    // Add / Update submission
    if (projectsForm) {
        projectsForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const pId = projIdInput.value;
            const pTitle = projTitleInput.value.trim();
            const pCat = projCatSelect.value;
            const pDesc = projDescText.value.trim();
            const pTech = projTechInput.value.trim();
            const pGithub = projGithubInput.value.trim();
            const pLive = projLiveInput.value.trim();
            const pImage = projImageBase64.value;

            const projectPayload = {
                id: pId || "proj_" + Date.now(),
                title: pTitle,
                category: pCat,
                description: pDesc,
                technologies: pTech,
                github: pGithub,
                live: pLive,
                image: pImage
            };

            if (pId) {
                // Edit mode
                const index = currentProjects.findIndex(p => p.id === pId);
                if (index !== -1) {
                    currentProjects[index] = projectPayload;
                    showToast("Project details updated successfully.");
                }
            } else {
                // Add mode
                currentProjects.unshift(projectPayload);
                showToast("New project published successfully!");
            }

            localStorage.setItem("portfolio_projects", JSON.stringify(currentProjects));
            resetProjectForm();
            renderTable();
            initDashboardMetrics();
        });
    }

    window.editProject = function(id) {
        const p = currentProjects.find(item => item.id === id);
        if (!p) return;

        // Populate fields
        projIdInput.value = p.id;
        projTitleInput.value = p.title;
        projCatSelect.value = p.category;
        projDescText.value = p.description;
        projTechInput.value = p.technologies;
        projGithubInput.value = p.github || "";
        projLiveInput.value = p.live || "";
        projImageBase64.value = p.image || "";

        // Set Preview
        if (p.image) {
            document.getElementById("proj-image-preview").src = p.image;
            document.getElementById("project-image-preview-box").classList.remove("hidden");
            document.getElementById("project-drag-uploader").classList.add("hidden");
        } else {
            clearImagePreview("proj-image-input", "proj-image-preview", "project-image-preview-box", "proj-image-base64");
        }

        // Alter form visuals
        formTitle.textContent = "Edit Project Entry";
        submitBtn.querySelector("span").textContent = "Update Project";
        cancelEditBtn.classList.remove("hidden");

        // Focus form input
        projTitleInput.focus();
    };

    window.deleteProject = function(id) {
        if (!confirm("Are you sure you want to delete this project?")) return;

        currentProjects = currentProjects.filter(p => p.id !== id);
        localStorage.setItem("portfolio_projects", JSON.stringify(currentProjects));
        
        renderTable();
        initDashboardMetrics();
        showToast("Project entry removed.", "error");

        if (projIdInput.value === id) {
            resetProjectForm();
        }
    };

    function resetProjectForm() {
        projectsForm.reset();
        projIdInput.value = "";
        clearImagePreview("proj-image-input", "proj-image-preview", "project-image-preview-box", "proj-image-base64");
        
        formTitle.textContent = "Add New Project";
        submitBtn.querySelector("span").textContent = "Add Project";
        cancelEditBtn.classList.add("hidden");
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener("click", resetProjectForm);
    }

    if (adminSearch) {
        adminSearch.addEventListener("input", (e) => {
            renderTable(e.target.value.toLowerCase().trim());
        });
    }

    renderTable();
}

/* 8. Credentials (Certifications & Achievements) CRUD Setup */
function initCredentialsCrud() {
    const credsForm = document.getElementById("cred-crud-form");
    const credIdInput = document.getElementById("cred-id");
    const credTitleInput = document.getElementById("cred-title");
    const credTypeSelect = document.getElementById("cred-type");
    const credIssuerInput = document.getElementById("cred-issuer");
    const credDateInput = document.getElementById("cred-date");
    const credLinkInput = document.getElementById("cred-link");
    const credImageBase64 = document.getElementById("cred-image-base64");

    const cancelEditBtn = document.getElementById("btn-cred-cancel");
    const submitBtn = document.getElementById("btn-cred-submit");
    const formTitle = document.getElementById("cred-form-title");
    
    const credsTableBody = document.getElementById("admin-creds-tbody");
    const adminSearch = document.getElementById("admin-cred-search");

    let currentCreds = JSON.parse(localStorage.getItem("portfolio_certs") || "[]");

    function renderTable(filterQuery = "") {
        if (!credsTableBody) return;
        credsTableBody.innerHTML = "";

        const filtered = currentCreds.filter(c => 
            c.title.toLowerCase().includes(filterQuery) || 
            c.issuer.toLowerCase().includes(filterQuery)
        );

        if (filtered.length === 0) {
            credsTableBody.innerHTML = `<tr><td colspan="4" class="text-center">No certifications or achievements listed.</td></tr>`;
            return;
        }

        filtered.forEach(c => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${c.title}</strong></td>
                <td><span class="badge ${c.type === 'achievement' ? 'cred-badge-ach' : 'cred-badge-cert'}">${c.type}</span></td>
                <td>${c.issuer} (${c.date})</td>
                <td>
                    <div class="table-actions">
                        <button class="action-btn btn-edit" onclick="editCred('${c.id}')" title="Edit"><i class="fa-solid fa-pencil"></i></button>
                        <button class="action-btn btn-delete" onclick="deleteCred('${c.id}')" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </td>
            `;
            credsTableBody.appendChild(tr);
        });
    }

    if (credsForm) {
        credsForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const cId = credIdInput.value;
            const cTitle = credTitleInput.value.trim();
            const cType = credTypeSelect.value;
            const cIssuer = credIssuerInput.value.trim();
            const cDate = credDateInput.value.trim();
            const cLink = credLinkInput.value.trim();
            const cImage = credImageBase64.value;

            const credPayload = {
                id: cId || "cred_" + Date.now(),
                title: cTitle,
                type: cType,
                issuer: cIssuer,
                date: cDate,
                link: cLink,
                image: cImage
            };

            if (cId) {
                // Edit mode
                const index = currentCreds.findIndex(c => c.id === cId);
                if (index !== -1) {
                    currentCreds[index] = credPayload;
                    showToast("Credential details updated successfully.");
                }
            } else {
                // Add mode
                currentCreds.unshift(credPayload);
                showToast("New credential published successfully!");
            }

            localStorage.setItem("portfolio_certs", JSON.stringify(currentCreds));
            resetCredForm();
            renderTable();
            initDashboardMetrics();
        });
    }

    window.editCred = function(id) {
        const c = currentCreds.find(item => item.id === id);
        if (!c) return;

        // Populate fields
        credIdInput.value = c.id;
        credTitleInput.value = c.title;
        credTypeSelect.value = c.type;
        credIssuerInput.value = c.issuer;
        credDateInput.value = c.date;
        credLinkInput.value = c.link || "";
        credImageBase64.value = c.image || "";

        // Set Preview
        if (c.image) {
            document.getElementById("cred-image-preview").src = c.image;
            document.getElementById("cred-image-preview-box").classList.remove("hidden");
            document.getElementById("cred-drag-uploader").classList.add("hidden");
        } else {
            clearImagePreview("cred-image-input", "cred-image-preview", "cred-image-preview-box", "cred-image-base64");
        }

        // Alter form visuals
        formTitle.textContent = "Edit Credential Entry";
        submitBtn.querySelector("span").textContent = "Update Credential";
        cancelEditBtn.classList.remove("hidden");

        // Focus form input
        credTitleInput.focus();
    };

    window.deleteCred = function(id) {
        if (!confirm("Are you sure you want to delete this credential?")) return;

        currentCreds = currentCreds.filter(c => c.id !== id);
        localStorage.setItem("portfolio_certs", JSON.stringify(currentCreds));
        
        renderTable();
        initDashboardMetrics();
        showToast("Credential entry removed.", "error");

        if (credIdInput.value === id) {
            resetCredForm();
        }
    };

    function resetCredForm() {
        credsForm.reset();
        credIdInput.value = "";
        clearImagePreview("cred-image-input", "cred-image-preview", "cred-image-preview-box", "cred-image-base64");
        
        formTitle.textContent = "Add New Credential";
        submitBtn.querySelector("span").textContent = "Add Credential";
        cancelEditBtn.classList.add("hidden");
    }

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener("click", resetCredForm);
    }

    if (adminSearch) {
        adminSearch.addEventListener("input", (e) => {
            renderTable(e.target.value.toLowerCase().trim());
        });
    }

    renderTable();
}

/* 9. Traffic Logs Reader Display */
function initVisitorLogsView() {
    const logsTableBody = document.getElementById("visitor-logs-tbody");
    const clearLogsBtn = document.getElementById("clear-logs-btn");

    function renderLogs() {
        if (!logsTableBody) return;
        logsTableBody.innerHTML = "";

        const logs = JSON.parse(localStorage.getItem("portfolio_visitor_logs") || "[]");

        if (logs.length === 0) {
            logsTableBody.innerHTML = `<tr><td colspan="4" class="text-center">No traffic recorded yet.</td></tr>`;
            return;
        }

        logs.forEach(log => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${log.timestamp}</td>
                <td>${log.referrer}</td>
                <td>${log.platform}</td>
                <td><span class="badge tech-badge">${log.route}</span></td>
            `;
            logsTableBody.appendChild(tr);
        });
    }

    if (clearLogsBtn) {
        clearLogsBtn.addEventListener("click", () => {
            if (!confirm("Are you sure you want to delete all historical logs? (Views counter metric will not change)")) return;
            localStorage.setItem("portfolio_visitor_logs", "[]");
            renderLogs();
            showToast("Logs cleared.", "error");
        });
    }

    renderLogs();
}

/* 10. Toast Notification Alerts */
function showToast(message, type = "success") {
    const toast = document.getElementById("toast-notification");
    if (!toast) return;

    toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}"></i>
        <span>${message}</span>
    `;
    toast.className = `toast-notification ${type}`;
    
    // Auto clear after 3 seconds
    setTimeout(() => {
        toast.className = "toast-notification hidden";
    }, 3000);
}
