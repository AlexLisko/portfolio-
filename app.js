/* =========================================
   app.js (final + clean)
   - Modal open/close (Intro only)
   - Expanded Case Overlay (ALL projects)
   - Overlay supports images OR YouTube video (per case)
   - Theme toggle (light/dark)
   - Accent menu (basic)
   - Liquid Glass motion hooks (sheen vars)
   - Window reflections (cursor-tracked highlight)
   - Two-image hero toggle (mobile tap/swipe)
   ========================================= */

const THEME_KEY = "portfolio_theme_v1";
const ACCENT_KEY = "portfolio_accent_v1";

/* -----------------------------
   Modal (Intro only)
   ----------------------------- */
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const closeModalBtn = document.getElementById("closeModal");

function openModal(title, html) {
    if (!modal) return;
    if (modalTitle) modalTitle.textContent = title;
    if (modalBody) modalBody.innerHTML = html;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
}

function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
}

// Modal close interactions
closeModalBtn?.addEventListener("click", closeModal);
modal?.addEventListener("click", (e) => {
    const t = e.target;
    if (t?.matches?.("[data-close='true']")) closeModal();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden) closeModal();
});

/* -----------------------------
   Expanded Case Overlay (data-driven)
   ----------------------------- */
const caseOverlay = document.getElementById("caseOverlay");

const OVERLAY_CASES = {
    visionpro: {
        kicker: "Project 01",
        title: "Launching Apple Vision Pro Dual Knit Band",
        subtitle:
            "Designing and validating a comfort-critical wearable component for a first-generation spatial computer.",
        hero1: "./img/visionpro-band-hero-1.jpg",
        hero2: "./img/visionpro-band-hero-2.jpg",
        link: "./case-visionpro.html",
    },

    genaiqa: {
        kicker: "Project 02",
        title: "Led the Design and Launch of Two Research Lab Spaces",
        subtitle:
            "Building scalable research environments to support research at Apple due to company NDA - I cannot show nor share any details regarding the lab spaces",
        hero1: "./img/alex-lab-portrait-1.jpeg",
        link: "./case-genaiqa.html",
    },

    universal: {
        kicker: "Project 03",
        title: "Apple Intelligence Siri",
        subtitle: "Contributed toward 5+ key features for the Apple Intelligence launch (2024).",
        link: "./case-universal.html",
        youtubeId: "X3c916Mb02E",
        hero1: "./img/universal-hero-1.jpg",
        hero2: "./img/universal-hero-2.jpg",
    },
};

function openOverlay(caseId) {
    if (!caseOverlay) return;
    const data = OVERLAY_CASES[caseId];
    if (!data) return;

    // Populate text
    const kickerEl = caseOverlay.querySelector(".caseExpanded__kicker");
    const titleEl = caseOverlay.querySelector(".caseExpanded__title");
    const subtitleEl = caseOverlay.querySelector(".caseExpanded__subtitle");
    const linkEl = caseOverlay.querySelector(".linkCTA");

    if (kickerEl) kickerEl.textContent = data.kicker || "Project";
    if (titleEl) titleEl.textContent = data.title || "Case title";
    if (subtitleEl) subtitleEl.textContent = data.subtitle || "";
    if (linkEl) linkEl.href = data.link || "#";

    // Elements for hero switching
    const hero = caseOverlay.querySelector("[data-hero]");
    const imgs = caseOverlay.querySelectorAll(".caseHero__img");
    const videoWrap = caseOverlay.querySelector(".caseHero__video");
    const videoFrame = caseOverlay.querySelector("#caseVideo");

    // Reset mobile alt state
    hero?.classList.remove("isAlt");

    // Always stop any prior video first
    if (videoFrame) videoFrame.src = "";
    if (videoWrap) videoWrap.hidden = true;

    // --- Hero mode switch: YouTube vs Images ---
    if (data.youtubeId) {
        // Hide images
        imgs.forEach((img) => (img.style.display = "none"));

        // Show video
        if (videoWrap) videoWrap.hidden = false;

        // Autoplay (muted) + inline play
        if (videoFrame) {
            videoFrame.src =
                `https://www.youtube.com/embed/${data.youtubeId}` +
                `?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`;
        }
    } else {
        // Show images
        imgs.forEach((img) => (img.style.display = ""));

        // Set primary
        if (imgs[0]) imgs[0].src = data.hero1 || "";

        // Set/hide secondary depending on availability
        if (imgs[1]) {
            if (data.hero2) {
                imgs[1].src = data.hero2;
                imgs[1].style.display = "";
            } else {
                imgs[1].src = "";
                imgs[1].style.display = "none";
            }
        }
    }

    // Show overlay
    caseOverlay.hidden = false;
    document.body.style.overflow = "hidden";
    document.body.classList.add("isOverlayOpen");
    caseOverlay.setAttribute("data-open", caseId);

    // Accessibility focus
    const dialog = caseOverlay.querySelector('[role="dialog"]');
    dialog?.focus?.();
}

function closeOverlay() {
    if (!caseOverlay) return;

    // Stop playback immediately
    const videoFrame = caseOverlay.querySelector("#caseVideo");
    if (videoFrame) videoFrame.src = "";

    const videoWrap = caseOverlay.querySelector(".caseHero__video");
    if (videoWrap) videoWrap.hidden = true;

    // Restore images visibility for next open
    caseOverlay
        .querySelectorAll(".caseHero__img")
        .forEach((img) => (img.style.display = ""));

    // Reset alt image toggle
    const hero = caseOverlay.querySelector("[data-hero]");
    hero?.classList.remove("isAlt");

    // Hide overlay
    caseOverlay.hidden = true;
    document.body.style.overflow = "";
    document.body.classList.remove("isOverlayOpen");
    caseOverlay.removeAttribute("data-open");
}

// Overlay close interactions
caseOverlay?.addEventListener("click", (e) => {
    if (e.target?.matches?.("[data-close-overlay]")) closeOverlay();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && caseOverlay && !caseOverlay.hidden) closeOverlay();
});

/* -----------------------------
   Click handling
   - Any element with [data-open-case] => overlay
   ----------------------------- */
document.addEventListener(
    "click",
    (e) => {
        const btn = e.target.closest?.("[data-open-case]");
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation();

        openOverlay(btn.getAttribute("data-open-case"));
    },
    true
);

/* -----------------------------
   Resume (open real PDF)
   ----------------------------- */
function openResumePdf(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
    }
    // PDF in project root
    window.open("/Alex-lisko-resume-2026.pdf", "_blank", "noopener,noreferrer");
}

const openResume = document.getElementById("openResume");
const openResumeMobile = document.getElementById("openResumeMobile"); // if present

if (openResume) openResume.addEventListener("click", openResumePdf, true);
if (openResumeMobile) openResumeMobile.addEventListener("click", openResumePdf, true);

/* -----------------------------
   Intro (modal)
   ----------------------------- */
document.getElementById("openIntro")?.addEventListener("click", () => {
    openModal(
        "Intro",
        `<p>Drop an intro video embed here.</p>
     <p><em>Example:</em> YouTube/Vimeo embed, or a short statement.</p>`
    );
});

/* -----------------------------
   Theme
   ----------------------------- */
function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const systemDark =
        window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(saved || (systemDark ? "dark" : "light"));
}

document.getElementById("themeToggle")?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    applyTheme(current === "dark" ? "light" : "dark");
});

initTheme();

/* -----------------------------
   Accent
   ----------------------------- */
function applyAccent(accent) {
    document.documentElement.setAttribute("data-accent", accent);
    localStorage.setItem(ACCENT_KEY, accent);
}

function initAccent() {
    const saved = localStorage.getItem(ACCENT_KEY) || "ocean";
    applyAccent(saved);
}

const accentToggle = document.getElementById("accentToggle");
const accentMenu = document.getElementById("accentMenu");

accentToggle?.addEventListener("click", () => {
    if (!accentMenu) return;
    const isOpen = !accentMenu.hidden;
    accentMenu.hidden = isOpen;
    accentToggle.setAttribute("aria-expanded", String(!isOpen));
});

accentMenu?.addEventListener("click", (e) => {
    const btn = e.target.closest?.("[data-accent]");
    if (!btn) return;
    const accent = btn.getAttribute("data-accent");
    if (!accent) return;

    applyAccent(accent);

    accentMenu.hidden = true;
    accentToggle?.setAttribute("aria-expanded", "false");
});

document.addEventListener("click", (e) => {
    if (!accentMenu || accentMenu.hidden) return;
    const withinMenu = e.target.closest?.("#accentMenu");
    const withinToggle = e.target.closest?.("#accentToggle");
    if (!withinMenu && !withinToggle) {
        accentMenu.hidden = true;
        accentToggle?.setAttribute("aria-expanded", "false");
    }
});

initAccent();

/* -----------------------------
   Liquid Glass motion hooks
   (updates --sheen-x / --sheen-y)
   - NOTE: ambient is kept STATIC to avoid Chrome veil issues
   ----------------------------- */
(() => {
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    function setSheen(x, y) {
        document.documentElement.style.setProperty("--sheen-x", `${x}%`);
        document.documentElement.style.setProperty("--sheen-y", `${y}%`);
    }

    if (!prefersReduced) {
        window.addEventListener(
            "pointermove",
            (e) => {
                const x = (e.clientX / window.innerWidth) * 100;
                const y = (e.clientY / window.innerHeight) * 100;
                setSheen(x, y);
            },
            { passive: true }
        );

        // Keep ambient static (no scroll transform)
        const ambient = document.querySelector(".ambient");
        if (ambient) ambient.style.transform = "";
    } else {
        setSheen(50, 35);
    }
})();

/* -----------------------------
   Window reflections: cursor-tracked highlight
   ----------------------------- */
(() => {
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReduced) return;

    const reflective = () =>
        document
            .querySelectorAll(".card, .modal__panel, .header, .caseExpanded")
            .forEach((el) => el.classList.add("reflect"));

    reflective();

    document.addEventListener(
        "pointermove",
        (e) => {
            const el = e.target.closest?.(".reflect");
            if (!el) return;

            const r = el.getBoundingClientRect();
            const px = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
            const py = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1);

            el.style.setProperty("--rx", `${px * 100}%`);
            el.style.setProperty("--ry", `${py * 100}%`);
            el.style.setProperty("--rtiltX", `${(px - 0.5) * 8}px`);
            el.style.setProperty("--rtiltY", `${(py - 0.5) * 8}px`);
        },
        { passive: true }
    );

    document.addEventListener(
        "pointerleave",
        (e) => {
            const el = e.target.closest?.(".reflect");
            if (!el) return;
            el.style.removeProperty("--rx");
            el.style.removeProperty("--ry");
            el.style.removeProperty("--rtiltX");
            el.style.removeProperty("--rtiltY");
        },
        true
    );
})();

/* -----------------------------
   Two-image hero toggle (mobile tap/swipe)
   - Disabled automatically if video is visible
   ----------------------------- */
(() => {
    if (!caseOverlay) return;
    const hero = caseOverlay.querySelector("[data-hero]");
    if (!hero) return;

    let startX = 0;

    hero.addEventListener(
        "touchstart",
        (e) => {
            startX = e.touches[0].clientX;
        },
        { passive: true }
    );

    hero.addEventListener(
        "touchend",
        (e) => {
            if (caseOverlay.hidden) return;

            const videoWrap = caseOverlay.querySelector(".caseHero__video");
            if (videoWrap && !videoWrap.hidden) return;

            const endX = e.changedTouches[0].clientX;
            const dx = endX - startX;

            // tap or swipe toggles
            if (Math.abs(dx) >= 0) {
                hero.classList.toggle("isAlt");
            }
        },
        { passive: true }
    );
})();
