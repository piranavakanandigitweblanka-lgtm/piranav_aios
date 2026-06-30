theme.categoryMenu = (function () {
  function catMenuJs(e) {
    
    activeClassAction(".categories__menu--header", ".dropdown__categories--menu");
    
    const CategorySubMenu = document.querySelector(".category__mobile--menu");
    if (CategorySubMenu) {
      CategorySubMenu.querySelectorAll(".category__sub--menu").forEach(function (
                                                                       ul
      ) {
        let catsubMenuToggle = document.createElement("button");
        catsubMenuToggle.classList.add("category__sub--menu_toggle");
        ul.parentNode.appendChild(catsubMenuToggle);
      });
    }
    let categoryMenuWrapper = document.querySelector(
      ".category__mobile--menu_ul"
    );
    if (categoryMenuWrapper) {
      categoryMenuWrapper.addEventListener("click", function (e) {
        let targetElement = e.target;
        if (targetElement.classList.contains("category__sub--menu_toggle")) {
          const parent = targetElement.parentElement;
          if (parent.classList.contains("active")) {
            targetElement.classList.remove("active");
            parent.classList.remove("active");
            parent
            .querySelectorAll(".category__sub--menu")
            .forEach(function (subMenu) {
              subMenu.parentElement.classList.remove("active");
              subMenu.nextElementSibling.classList.remove("active");
              slideUp(subMenu);
            });
          } else {
            targetElement.classList.add("active");
            parent.classList.add("active");
            slideDown(targetElement.previousElementSibling);
            getSiblings(parent).forEach(function (item) {
              item.classList.remove("active");
              item
              .querySelectorAll(".category__sub--menu")
              .forEach(function (subMenu) {
                subMenu.parentElement.classList.remove("active");
                subMenu.nextElementSibling.classList.remove("active");
                slideUp(subMenu);
              });
            });
          }
        }
      });
    }
    
    
  }
  return catMenuJs;
})();



