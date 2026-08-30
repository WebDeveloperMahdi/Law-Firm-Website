/* =========================================================
   PROTECT MY IDEA — CLEAN INTERACTION SCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const mobileNav = document.getElementById("mobileNav");
    const backTop = document.getElementById("backTop");
    const contactForm = document.getElementById("contactForm");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* Header */
    const updateHeader = () => {
        if (header) header.classList.toggle("scrolled", window.scrollY > 30);
        if (backTop) backTop.classList.toggle("visible", window.scrollY > 600);
    };
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    /* Mobile menu */
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener("click", () => {
            const open = mobileNav.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(open));
            menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
        });

        mobileNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileNav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation menu");
            });
        });
    }

    /* Scroll reveal */
    const revealElements = [...document.querySelectorAll(".reveal")];
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
        revealElements.forEach(el => el.classList.add("visible"));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const siblings = el.parentElement
                    ? [...el.parentElement.children].filter(child => child.classList.contains("reveal"))
                    : [];
                const index = Math.max(0, siblings.indexOf(el));
                el.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
                el.classList.add("visible");
                observer.unobserve(el);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -45px 0px" });
        revealElements.forEach(el => revealObserver.observe(el));
    }

    /* FAQ accordion */
    const faqItems = [...document.querySelectorAll(".faq-item")];
    faqItems.forEach((item, index) => {
        const button = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");
        if (!button || !answer) return;

        button.type = "button";
        const answerId = answer.id || `faq-answer-${index + 1}`;
        answer.id = answerId;
        button.setAttribute("aria-controls", answerId);
        button.setAttribute("aria-expanded", "false");

        button.addEventListener("click", () => {
            const willOpen = !item.classList.contains("open");

            faqItems.forEach(other => {
                const otherButton = other.querySelector(".faq-question");
                const otherAnswer = other.querySelector(".faq-answer");
                other.classList.remove("open");
                if (otherButton) otherButton.setAttribute("aria-expanded", "false");
                if (otherAnswer) otherAnswer.style.maxHeight = null;
            });

            if (willOpen) {
                item.classList.add("open");
                button.setAttribute("aria-expanded", "true");
                answer.style.maxHeight = `${answer.scrollHeight}px`;
            }
        });
    });

    /* Active navigation */
    const sections = [...document.querySelectorAll("main section[id]")];
    const navLinks = [...document.querySelectorAll(".desktop-nav .nav-link")];
    if (sections.length && navLinks.length && "IntersectionObserver" in window) {
        const navObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const id = entry.target.id;
                navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${id}`));
            });
        }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
        sections.forEach(section => navObserver.observe(section));
    }

    /* Back to top */
    if (backTop) {
        backTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
        });
    }

    /* Anchor scrolling */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const id = link.getAttribute("href");
            if (!id || id === "#") return;
            const target = document.querySelector(id);
            if (!target) return;
            event.preventDefault();
            const offset = header ? header.offsetHeight + 15 : 15;
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - offset,
                behavior: reducedMotion.matches ? "auto" : "smooth"
            });
        });
    });

    /* Trust-bar counters */
    const counters = [...document.querySelectorAll(".trust-stat strong")];
    const animateCounter = (element) => {
        const raw = element.textContent.trim();
        if (!/^(20\+|100%)$/.test(raw)) return;
        const target = parseInt(raw, 10);
        const suffix = raw.includes("%") ? "%" : "+";
        if (reducedMotion.matches) {
            element.textContent = `${target}${suffix}`;
            return;
        }
        const duration = 1100;
        const start = performance.now();
        const tick = now => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            element.textContent = `${Math.floor(target * eased)}${suffix}`;
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    if (counters.length && "IntersectionObserver" in window) {
        const counterObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            });
        }, { threshold: 0.7 });
        counters.forEach(counter => counterObserver.observe(counter));
    } else {
        counters.forEach(animateCounter);
    }

    /* Contact form demo feedback */
    if (contactForm) {
        contactForm.addEventListener("submit", event => {
            event.preventDefault();
            const submitButton = contactForm.querySelector(".form-submit");
            if (!submitButton) return;
            const original = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message Ready';
            submitButton.disabled = true;
            window.setTimeout(() => {
                submitButton.innerHTML = original;
                submitButton.disabled = false;
                contactForm.reset();
            }, 2500);
        });
    }



    /* ---------------------------------------------------------
       SERVICES — UNIFIED PREMIUM 3D TILT
       All three service cards use the exact same interaction.
    --------------------------------------------------------- */
    const serviceCards = [...document.querySelectorAll(".services .service-card")];

    if (!reducedMotion.matches && serviceCards.length) {
        const canTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

        if (canTilt) {
            serviceCards.forEach(card => {
                let frame = null;
                let pointerX = 50;
                let pointerY = 50;
                let rotateX = 0;
                let rotateY = 0;

                const render = () => {
                    frame = null;
                    card.style.setProperty("--mx", `${pointerX}%`);
                    card.style.setProperty("--my", `${pointerY}%`);
                    card.style.transform =
                        `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.012)`;
                };

                card.addEventListener("pointerenter", () => {
                    card.style.transition =
                        "transform .12s ease-out, box-shadow .45s cubic-bezier(.22,1,.36,1), border-color .3s ease";
                });

                card.addEventListener("pointermove", event => {
                    const rect = card.getBoundingClientRect();
                    pointerX = ((event.clientX - rect.left) / rect.width) * 100;
                    pointerY = ((event.clientY - rect.top) / rect.height) * 100;

                    /* Same tilt strength for all cards, regardless of size. */
                    rotateY = ((pointerX - 50) / 50) * 7;
                    rotateX = ((50 - pointerY) / 50) * 7;

                    if (!frame) frame = requestAnimationFrame(render);
                });

                card.addEventListener("pointerleave", () => {
                    if (frame) cancelAnimationFrame(frame);
                    frame = null;
                    card.style.setProperty("--mx", "50%");
                    card.style.setProperty("--my", "50%");
                    card.style.transition =
                        "transform .55s cubic-bezier(.22,1,.36,1), box-shadow .45s ease, border-color .3s ease";
                    card.style.transform = "";
                });
            });
        }
    }

    /* Current year */
    const footerText = document.querySelector(".footer-bottom span");
    if (footerText) footerText.textContent = `© ${new Date().getFullYear()} ProtectMyIdea. All Rights Reserved.`;
});
