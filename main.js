const grid = document.querySelector(".grid");
let msnry;

/* ---------- REVEAL ANIMATION ---------- */
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");

        const video = entry.target.querySelector("video");
        if (video) video.play().catch(() => {});

        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 },
);

/* ---------- MASONRY INIT ---------- */
function initMasonry() {
  msnry = new Masonry(grid, {
    itemSelector: ".grid-item",
    columnWidth: ".grid-sizer",
    gutter: getGutter(),
    fitWidth: true,
    transitionDuration: "0.2s",
  });
}

/* ---------- GUTTER BASED ON SCREEN ---------- */
function getGutter() {
  if (window.innerWidth < 500) return 10;
  if (window.innerWidth < 900) return 15;
  return 20;
}

/* ---------- OBSERVE ITEMS ---------- */
document.querySelectorAll(".grid-item").forEach((item) => {
  revealObserver.observe(item);
});

/* ---------- MEDIA LOADING ---------- */
function waitForMedia() {
  const imagesPromise = new Promise((resolve) => {
    imagesLoaded(grid, { background: true }, resolve);
  });

  const videos = Array.from(grid.querySelectorAll("video"));
  const videosPromise = Promise.all(
    videos.map(
      (video) =>
        new Promise((resolve) => {
          if (video.readyState >= 1) resolve();
          else
            video.addEventListener("loadedmetadata", resolve, { once: true });
        }),
    ),
  );

  return Promise.all([imagesPromise, videosPromise]);
}

/* ---------- RELAYOUT HELPER ---------- */
let layoutTimeout;
function relayout() {
  clearTimeout(layoutTimeout);
  layoutTimeout = setTimeout(() => {
    if (msnry) msnry.layout();
  }, 100);
}

/* ---------- START ---------- */
initMasonry();

waitForMedia().then(() => {
  relayout();
});

/* ---------- IMAGE PROGRESS RELAYOUT ---------- */
imagesLoaded(grid).on("progress", relayout);

/* ---------- VIDEO EVENT RELAYOUT ---------- */
grid.querySelectorAll("video").forEach((video) => {
  ["loadedmetadata", "loadeddata", "canplay"].forEach((event) => {
    video.addEventListener(event, relayout);
  });
});

/* ---------- WINDOW RESIZE ---------- */
window.addEventListener("resize", () => {
  msnry.options.gutter = getGutter();
  relayout();
});
