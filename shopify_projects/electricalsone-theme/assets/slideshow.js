theme.SlideShow = (function() {
  function Slider(e) { 
    
    let sliderWrapper = e.querySelector(".hero__slider--activation"),
        slideLoop = e.dataset.slideLoop,
        slideAutoplay = e.dataset.slideAutoplay,
        autoplayDuration = e.dataset.autoplayDuration,
        slideLoopValue = true,
        autoplay = false,
        slideNavPrev = e.querySelector(".swiper-button-prev"),
        slideNavNext = e.querySelector(".swiper-button-next"),
        sliderPagination = e.querySelector(".swiper-pagination"),
        slideShowSpace = parseInt(e.dataset.slideshow) ? parseInt(e.dataset.slideshow) : 0,
        sliderPerView = parseInt(e.dataset.slidesperview) ? parseInt(e.dataset.slidesperview) : 1,
        smallDesktop = parseInt(e.dataset.samlldesktopview) ? parseInt(e.dataset.samlldesktopview) : 1,
        tabletShow = parseInt(e.dataset.showTablet) ? parseInt(e.dataset.showTablet): 1,
        mobileShow = parseInt(e.dataset.showMobile) ? parseInt(e.dataset.showMobile) : 1;
    
    //console.log(sliderPerView);
    
    if(slideLoop == "false"){
    	 slideLoopValue = false;
    }
    if(slideAutoplay == "true"){
        let sliderDuration = parseInt(autoplayDuration);
    	autoplay = {delay: autoplayDuration, disableOnInteraction: false}
    }
    
    var swiper = new Swiper(sliderWrapper, {
      slidesPerView: mobileShow,
      autoplay: autoplay,
      loop: slideLoopValue,
      clickable: true,
      speed: 500,
      spaceBetween: slideShowSpace,
      pagination: {
        el: sliderPagination,
        clickable: true,
      },
      navigation: {
        nextEl: slideNavNext,
        prevEl: slideNavPrev,
      },
      breakpoints: {
        640: {
          slidesPerView: mobileShow,
        },
        768: {
          slidesPerView: tabletShow,
        },
        1024: {
          slidesPerView: smallDesktop
        },
        1400: {
          slidesPerView: sliderPerView
        }
      }
    });
    
  }
  return Slider;
})();

