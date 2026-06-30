theme.headerSearch = (function () {
  function searchOverlay() {
    // Header Search offcanvas
    let offcanvasSearchTrigger = document.querySelector(
        ".header__actions_btn--search"
      ),
      offcanvasSidebarSearch = document.getElementById(
        "predictive__search_overlay"
      ),
      offcanvasSearchClose = document.getElementById("search__close_btn");

    if (offcanvasSearchTrigger) {
      offcanvasSearchTrigger.addEventListener("click", (event) => {
        event.preventDefault();
        offcanvasSidebarSearch.classList.add("active");
        document.querySelector("body").classList.add("added__overlay_search");

        offcanvasSidebarSearch.addEventListener(
          "transitionend",
          () => {
            offcanvasSidebarSearch.focus();
            trapFocus(offcanvasSidebarSearch);
          },
          { once: true }
        );
      });

      offcanvasSidebarSearch.addEventListener("keyup", (evt) => {
        if (evt.code === "Escape") {
          offcanvasSidebarSearch.classList.remove("active");
          document
            .querySelector("body")
            .classList.remove("added__overlay_search");
          removeTrapFocus(offcanvasSearchTrigger);
        }
      });
    }

    if (offcanvasSearchClose) {
      offcanvasSearchClose.addEventListener("click", (event) => {
        event.preventDefault();
        offcanvasSidebarSearch.classList.remove("active");
        document
          .querySelector("body")
          .classList.remove("added__overlay_search");
        removeTrapFocus(offcanvasSearchTrigger);
      });
    }

    document.addEventListener("click", function (event) {
      let eventTarget = event.target;
      if (
        !eventTarget.closest("#predictive__search_overlay") &&
        !eventTarget.closest(".header__actions_btn--search")
      ) {
        offcanvasSidebarSearch.classList.remove("active");
        document
          .querySelector("body")
          .classList.remove("added__overlay_search");
      }
    });
  }
  return searchOverlay;
})();
