import Swiper from 'swiper';
//import 'swiper/css';

const pageSlider = new Swiper('.slider', {
  speed: 1000,
  scrollbar: {
    el: '.slider__scrollbar',
    draggable: true,
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
      centeredSlides: false,
    },
    992: {
      slidesPerView: 2,
      centeredSlides: true,
    },
  },
});
