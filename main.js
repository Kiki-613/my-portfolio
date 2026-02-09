var grid = document.querySelector(".grid");
var msnry = null;

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);

let gutterSize = 20;
if (window.innerWidth < 900) gutterSize = 15;
if (window.innerWidth < 500) gutterSize = 10;

function initMasonry() {
  if (msnry) {
    msnry.destroy();
  }

  msnry = new Masonry(grid, {
    itemSelector: ".grid-item",
    columnWidth: ".grid-sizer",
    gutter: gutterSize,
    fitWidth: true,
    transitionDuration: "0.2s",
  });

  msnry.layout();
}

/* Wait for ALL images AND videos */
Promise.all([
  new Promise((resolve) => imagesLoaded(grid, { background: true }, resolve)),
  videosLoaded(grid),
]).then(() => {
  initMasonry();
  observeAllItems();
});

/* Observe items */
function observeAllItems() {
  document.querySelectorAll(".grid-item").forEach((item) => {
    revealObserver.observe(item);
  });
}

/* Relayout as images load */
imagesLoaded(grid).on("progress", function (instance, image) {
  if (msnry) msnry.layout();
});

/* Video loading helper */
function videosLoaded(container) {
  const videos = container.querySelectorAll("video");
  if (!videos.length) return Promise.resolve();

  return Promise.all(
    Array.from(videos).map((video) => {
      return new Promise((resolve) => {
        if (video.readyState >= 1) {
          resolve();
        } else {
          video.addEventListener("loadedmetadata", resolve, { once: true });
        }
      });
    }),
  );
}

/* Relayout when videos change size */
grid.querySelectorAll("video").forEach((video) => {
  ["loadedmetadata", "loadeddata", "canplay"].forEach((event) => {
    video.addEventListener(event, () => {
      if (msnry) msnry.layout();
    });
  });
});

/* Resize handling */
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (msnry) msnry.layout();
  }, 200);
});
