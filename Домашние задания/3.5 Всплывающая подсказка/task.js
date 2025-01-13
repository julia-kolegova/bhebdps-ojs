function onClickHandler(event, element, tooltipElement, state) {
  event.preventDefault();

  if (state.isOpen && state.currentElement === element) {
    tooltipElement.classList.remove("tooltip_active");
    state.isOpen = false;
    state.currentElement = null;
    return;
  }

  const title = element.getAttribute("title");
  const rect = element.getBoundingClientRect();

  const left = `${rect.left + window.scrollX}px`;
  const top = `${rect.top + window.scrollY + rect.height}px`;

  tooltipElement.style.top = top;
  tooltipElement.style.left = left;

  tooltipElement.textContent = title;
  tooltipElement.classList.add("tooltip_active");

  state.isOpen = true;
  state.currentElement = element;
}

(function () {
  const state = {
    isOpen: false,
    currentElement: null,
  };
  const elements = document.querySelectorAll(".has-tooltip");
  const tooltipElement = document.querySelector(".tooltip");

  elements.forEach((element) =>
    element.addEventListener("click", (event) =>
      onClickHandler(event, element, tooltipElement, state)
    )
  );
})();
