
/* =========================================================
   PORTFOLIO WEBSITE - COMPLETE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       1. SELECT ELEMENTS
       ========================= */

    const navbar = document.querySelector("#navbar");
    const navToggle = document.querySelector("#navToggle");
    const navLinks = document.querySelector("#navLinks");
    const navItems = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");
    const cursorGlow = document.querySelector(".cursor-glow");
    const skillCards = document.querySelectorAll(".skill-card");
    const skillProgressBars = document.querySelectorAll(".skill-progress");
    const contactForm = document.querySelector("#contactForm");
    const yearElement = document.querySelector("#year");
    const formFeedback = document.querySelector("#form-feedback");


    /* =========================
       2. MOBILE NAVIGATION
       ========================= */

    function syncMobileMenuAria() {
        const isMobile = window.innerWidth <= 768;
        const isOpen = navLinks?.classList.contains("active");

        navToggle?.setAttribute("aria-expanded", String(isOpen));

        if (!navLinks) return;
        if (isMobile) {
            navLinks.setAttribute("aria-hidden", String(!isOpen));
        } else {
            navLinks.removeAttribute("aria-hidden");
        }
    }

    function openMobileMenu() {
        navToggle?.classList.add("active");
        navLinks?.classList.add("active");
        document.body.classList.add("menu-open");
        syncMobileMenuAria();
    }

    function closeMobileMenu() {
        navToggle?.classList.remove("active");
        navLinks?.classList.remove("active");
        document.body.classList.remove("menu-open");
        syncMobileMenuAria();
    }

    function toggleMobileMenu() {
        const isOpen = navLinks?.classList.contains("active");

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    navToggle?.addEventListener("click", toggleMobileMenu);

    // Close menu after clicking a navigation link
    navItems.forEach((link) => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
        const clickedInsideMenu = navLinks?.contains(event.target);
        const clickedToggle = navToggle?.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {
            closeMobileMenu();
        }
    });

    // Close menu using Escape
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
            navToggle?.focus();
        }
    });


    /* =========================
       3. NAVBAR SCROLL EFFECT
       ========================= */

    function updateNavbar() {
        if (!navbar) return;

        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", updateNavbar, {
        passive: true
    });

    updateNavbar();


    /* =========================
       4. ACTIVE NAVIGATION LINK
       ========================= */

    function updateActiveNavigation() {
        let currentSection = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 150;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionBottom
            ) {
                currentSection = section.getAttribute("id");
            }
        });

        navItems.forEach((link) => {
            const linkTarget = link.getAttribute("href");

            link.classList.remove("active");

            if (linkTarget === `#${currentSection}`) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", updateActiveNavigation, {
        passive: true
    });

    updateActiveNavigation();


    /* =========================
       5. CURSOR GLOW EFFECT
       ========================= */

    if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {

        document.addEventListener("mousemove", (event) => {
            cursorGlow.style.left = `${event.clientX}px`;
            cursorGlow.style.top = `${event.clientY}px`;
        });

        document.addEventListener("mouseleave", () => {
            cursorGlow.style.opacity = "0";
        });

        document.addEventListener("mouseenter", () => {
            cursorGlow.style.opacity = "1";
        });
    }


    /* =========================
       6. SCROLL REVEAL ANIMATION
       ========================= */

    const revealElements = document.querySelectorAll(
        ".section-header, .about-content, .about-image, " +
        ".skill-card, .project-card, .timeline-item, " +
        ".contact-info, .contact-form"
    );

    revealElements.forEach((element, index) => {
        element.classList.add("reveal");

        if (
            element.classList.contains("skill-card") ||
            element.classList.contains("project-card")
        ) {
            element.style.transitionDelay = `${(index % 4) * 100}ms`;
        }
    });

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });

    } else {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });
    }


    /* =========================
       7. SKILL PROGRESS ANIMATION
       ========================= */

    function animateSkillBars() {

        skillProgressBars.forEach((bar) => {
            const progress = bar.style
        .getPropertyValue("--progress")
        .trim()
        .replace("%", "");

            if (progress) {
                bar.style.width = `${progress}%`;
            }
        });
    }

    if (skillCards.length > 0 && "IntersectionObserver" in window) {

        const skillObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateSkillBars();
                        observer.disconnect();
                    }
                });
            },
            {
                threshold: 0.2
            }
        );

        skillCards.forEach((card) => {
            skillObserver.observe(card);
        });

    } else {
        animateSkillBars();
    }


    /* =========================
       8. SMOOTH SCROLLING
       ========================= */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {

        link.addEventListener("click", (event) => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (!targetElement) {
                return;
            }

            event.preventDefault();

            const navbarHeight = navbar
                ? navbar.offsetHeight
                : 0;

            const targetPosition =
                targetElement.getBoundingClientRect().top +
                window.scrollY -
                navbarHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

        });

    });


    /* =========================
       9. CONTACT FORM
       ========================= */

    if (contactForm) {

        contactForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const nameInput = contactForm.querySelector(
                'input[name="name"]'
            );

            const emailInput = contactForm.querySelector(
                'input[name="email"]'
            );

            const subjectInput = contactForm.querySelector(
                'input[name="subject"]'
            );

            const messageInput = contactForm.querySelector(
                'textarea[name="message"]'
            );

            const name = nameInput?.value.trim() || "";
            const email = emailInput?.value.trim() || "";
            const subject = subjectInput?.value.trim() || "";
            const message = messageInput?.value.trim() || "";

            if (!name || !email || !subject || !message) {
                showFormFeedback("Please fill in all required fields.", "error");
                return;
            }

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {
                showFormFeedback("Please enter a valid email address.", "error");
                emailInput?.focus();
                return;
            }

            const recipient = "muhammadejaz2623088@gmail.com";

            const submitButton = contactForm.querySelector('button[type="submit"]');
            if (submitButton) submitButton.disabled = true;

            showFormFeedback("Sending your message...", "success");

            fetch(contactForm.action, {
                method: "POST",
                headers: { "Accept": "application/json" },
                body: new FormData(contactForm)
            })
            .then(async (response) => {
                if (response.ok) {
                    contactForm.reset();
                    showFormFeedback("Message sent successfully. I'll get back to you soon!", "success");
                } else {
                    const data = await response.json().catch(() => ({}));
                    showFormFeedback(data.error || "Something went wrong. Please try again.", "error");
                }
            })
            .catch(() => {
                showFormFeedback("Network error. Please try again later.", "error");
            })
            .finally(() => {
                if (submitButton) submitButton.disabled = false;
            });

            return;

        });

    }

    function showFormFeedback(message, type) {
        if (!formFeedback) return;
        formFeedback.textContent = message;
        formFeedback.className = `form-feedback ${type}`;
    }


    /* =========================
       10. FOOTER CURRENT YEAR
       ========================= */

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    /* =========================
       11. BACK TO TOP SUPPORT
       ========================= */

    document.querySelectorAll(".back-to-top").forEach((button) => {

        button.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });

    });


    /* =========================
       12. RESIZE HANDLING
       ========================= */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 768) {
            closeMobileMenu();
        }

        syncMobileMenuAria();

    });


    /* =========================
       13. INITIALIZE
       ========================= */

    closeMobileMenu();
    updateNavbar();
    updateActiveNavigation();

});
