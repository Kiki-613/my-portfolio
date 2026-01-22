var grid = document.querySelector(".grid");
var msnry = null;

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
    percentPosition: true,
    fitWidth: true,
    transitionDuration: 0.2,
  });

  msnry.layout();
}

/* Wait for ALL images, not just initial load */
imagesLoaded(grid, { background: true }, function () {
  initMasonry();
});

/* Relayout as images change size */
imagesLoaded(grid).on("progress", function () {
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
