var grid = document.querySelector(".grid");
var msnry = null;

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // animate only once
      }
    });
  },
  {
    threshold: 0.15, // 15% visible before triggering
  },
);

let gutterSize = 20;
if (window.innerWidth < 900) gutterSize = 15;
if (window.innerWidth < 500) gutterSize = 10;

function initMasonry() {
  if (msnry) {
    msnry.destroy(); //  prevent duplicate instances
  }

  msnry = new Masonry(grid, {
    itemSelector: ".grid-item",
    columnWidth: ".grid-sizer",
    gutter: 20,
    fitWidth: true,
    transitionDuration: 0.2,
  });

  msnry.layout();
}

/* Wait for ALL images, not just initial load */
imagesLoaded(grid, { background: true }, function () {
  initMasonry();
  observeAllItems();
});

function observeAllItems() {
  document.querySelectorAll(".grid-item").forEach((item) => {
    revealObserver.observe(item);
  });
}

/* Relayout as images change size */
imagesLoaded(grid).on("progress", function () {
  if (msnry) msnry.layout();
});

imagesLoaded(grid).on("progress", function (instance, image) {
  const item = image.img.closest(".grid-item");

  if (item) {
    revealObserver.observe(item);
  }

  if (msnry) msnry.layout();
});

/* Resize handling */
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (msnry) msnry.layout();
  }, 200);
});
