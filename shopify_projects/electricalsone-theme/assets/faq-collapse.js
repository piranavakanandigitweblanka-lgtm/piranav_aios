theme.accordion = (function() {
  function accordionBody(e) { 
    let faqContainer = e.querySelectorAll('.faq__list--item--wrapper');
    faqContainer.forEach(function (list) {
      list.addEventListener("click", function (event) {
        let listTarget = event.target;
        if (
          listTarget.classList.contains("faq__list--item__button")
        ) {
          let singleFaqItem = listTarget.closest('.faq__list--item'),
              singleFaqItemBody =
              singleFaqItem.querySelector('.faq__body');
          if (singleFaqItem.classList.contains("active")) {
            singleFaqItem.classList.remove("active");
            slideUp(singleFaqItemBody);
          } else {
            singleFaqItem.classList.add("active");
            slideDown(singleFaqItemBody);
            getSiblings(singleFaqItem).forEach(function (list) {
              let sibllingSingleAccordionBody = list.querySelector('.faq__body');
              list.classList.remove("active");
              slideUp(sibllingSingleAccordionBody);
            });
          }
        }
      });
    });
  }
  return accordionBody;
})();
