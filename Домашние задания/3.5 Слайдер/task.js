const onSliderChange = function (direction) {
  const className = "slider__item_active";
  const activeSlide = document.querySelector(`.${className}`);

  activeSlide.classList.remove(className);

  if (direction === "next") {
    const nextSlide =
      activeSlide?.nextElementSibling ||
      activeSlide?.parentElement.firstElementChild;
    nextSlide.classList.add(className);
  }

  if (direction === "previous") {
    const previousSlide =
      activeSlide?.previousElementSibling ||
      activeSlide?.parentElement.lastElementChild;
    previousSlide.classList.add(className);
  }
};
