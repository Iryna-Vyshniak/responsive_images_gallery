import Swiper, { Scrollbar, Controller, EffectFade } from 'swiper';

const pageSlider = new Swiper('.slider', {
  modules: [Scrollbar, Controller],
  direction: 'horizontal',
  loop: true,
  grabCursor: true,

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

const page = document.querySelector('.page');
const images = document.querySelectorAll('.slide__picture');

if (images.length) {
  let backgroundSlides = ``;
  let textSlides = ``;

  images.forEach(image => {
    backgroundSlides += ` 
    <div class="background__slide swiper-slide">
      <div class="background__image">
        <img src="${image.getAttribute('src')}" alt="${image.alt}" />
      </div>
    </div>
    `;

    textSlides += `
    <div class="text__slide swiper-slide">
      <span>${image.dataset.title ? image.dataset.title : ''}</span>
    </div>
      `;
  });

  const background = `
    <div class="background swiper">
    <div class="background__wrapper swiper-wrapper">
    ${backgroundSlides}
     </div>
     </div>
    `;

  const text = `
    <div class="text swiper">
    <div class="text__wrapper swiper-wrapper">
    ${textSlides}
     </div>
     </div>
    `;

  page.insertAdjacentHTML('afterbegin', background);
  page.insertAdjacentHTML('beforeend', text);

  const pageBgSlider = new Swiper('.background', {
    modules: [Scrollbar, Controller],
    speed: 500,
  });

  const pageTextSlider = new Swiper('.text', {
    modules: [Scrollbar, Controller, EffectFade],
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    speed: 1000,
  });

  // controller
  pageSlider.controller.control = pageBgSlider;
  pageBgSlider.controller.control = pageTextSlider;
}

// add event listener
const speed = 800;
document.addEventListener('click', scrollImage);

function scrollImage(e) {
  const targetElement = e.target;
  const textBlock = document.querySelector('.text');
  textBlock.style.transitionDuration = `${speed}ms`;

  if (targetElement.closest('.slide')) {
    const slide = targetElement.closest('.slide');
    const slideImage = slide.querySelector('img');
    const activeImage = document.querySelector('.slide__picture.active');

    if (slide.classList.contains('swiper-slide-active')) {
      slideImage.classList.add('active');
      textBlock.classList.add('active');
      openImage(slideImage);
    } else {
      activeImage ? activeImage.classList.remove('active') : null;
      pageSlider.slideTo(getIndex(slide));
    }
    e.preventDefault();
  }

  // close image
  if (targetElement.closest('.open-image')) {
    const opensImage = targetElement.closest('.open-image');
    const activeImage = document.querySelector('.slide__picture.active');
    const imagesPos = getImagePos(activeImage);

    opensImage.style.cssText = `
      position: fixed;
      left: ${imagesPos.left}px;
      top: ${imagesPos.top}px;
      width: ${imagesPos.width}px;
      height: ${imagesPos.height}px;
      transition: all ${speed}ms;
    `;

    setTimeout(() => {
      activeImage.classList.remove('active');
      activeImage.style.opacity = 1;
      opensImage.remove();
    }, speed);

    textBlock.classList.remove('active');
  }
}

function getIndex(item) {
  return [...item.parentNode.children].indexOf(item);
}

// Метод Node.cloneNode() возвращает дубликат узла, из которого этот метод был вызван.
// The cloneNode() method of the Node interface returns a duplicate of the node on which this method was called.
function openImage(image) {
  const imagePos = getImagePos(image);

  const imageOpen = image.cloneNode();
  const openImageBlock = document.createElement('div');
  openImageBlock.classList.add('open-image');
  openImageBlock.append(imageOpen);

  openImageBlock.style.cssText = `
    position: fixed;
    left: ${imagePos.left}px;
    top: ${imagePos.top}px;
    width: ${imagePos.width}px;
    height: ${imagePos.height}px;
    transition: all ${speed}ms;
  `;

  document.body.append(openImageBlock);

  setTimeout(() => {
    image.style.opacity = 0;
    openImageBlock.style.left = 0;
    openImageBlock.style.top = 0;
    openImageBlock.style.width = '100%';
    openImageBlock.style.height = '100%';
  }, 0);
}

// Метод Element.getBoundingClientRect() возвращает размер элемента и его позицию относительно viewport (часть страницы, показанная на экране, и которую мы видим).
// The Element.getBoundingClientRect() method returns a DOMRect object providing information about the size of an element and its position relative to the viewport.

// Свойство HTMLElement.offsetWidth возвращает ширину элемента. Как правило, offsetWidth — это значение, включающее горизонтальный отступ элемента, ширину вертикального скроллбара (если он есть) и CSS ширину.
//The HTMLElement.offsetWidth read-only property returns the layout width of an element as an integer.Typically, offsetWidth is a measurement in pixels of the element's CSS width, including any borders, padding, and vertical scrollbars (if rendered).

function getImagePos(image) {
  return {
    left: image.getBoundingClientRect().left,
    top: image.getBoundingClientRect().top,
    width: image.offsetWidth,
    height: image.offsetHeight,
  };
}
