theme.instagramFeed = (function () {
  function insatgramGallery(e) {
    let accesstoken = e.dataset.accesstoken,
        limit = parseInt(e.dataset.limit);
    var feed = new Instafeed({
      accessToken: accesstoken,
      limit: limit,
      template: '<div class="swiper-slide"><a target="_blank" class="instagram__feed--image" href="{{link}}"><img title="{{caption}}" src="{{image}}" /></a></div>'
    });
    feed.run();
    
    let sliderWrapper = e.querySelector(".instagram--activation"), 
       slideNavPrev = e.querySelector(".swiper-button-prev"),
        slideNavNext = e.querySelector(".swiper-button-next");
    
    var swiper = new Swiper(sliderWrapper, {
      slidesPerView: 2,
      autoplay: false,
      loop: false,
      clickable: true,
      speed: 500,
      spaceBetween: 15,
      navigation: {
        nextEl: slideNavNext,
        prevEl: slideNavPrev,
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4
        },
        1400: {
          slidesPerView: 5
        }
      }
    });
  }
  return  insatgramGallery;
})();  