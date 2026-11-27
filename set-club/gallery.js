const cover = document.querySelector(".cover img");
const caption = document.querySelector(".cover figcaption");
const counter = caption.querySelector("span");
const slides = [
  [cover.getAttribute("src"), cover.alt, "Partner rope intervals"],
  ["images/lift.jpg", "An athlete lowering into a push-up", "Bodyweight strength"],
  ["images/session.jpg", "An athlete doing a cross-body crunch on a mat", "Core practice"]
];
let current = 0;
const controls = document.querySelector(".gallery-controls");
function changePhoto(step) {
  current = (current + step + slides.length) % slides.length;
  const [src, alt, label] = slides[current];
  cover.alt = alt;
  cover.src = src;
  counter.textContent = `Floor notes / 0${current + 1}`;
  caption.replaceChildren(counter, ` ${label}`);
}
controls.firstElementChild.addEventListener("click", () => changePhoto(-1));
controls.lastElementChild.addEventListener("click", () => changePhoto(1));
controls.hidden = false;
