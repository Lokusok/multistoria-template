"use strict";

document.addEventListener('DOMContentLoaded', function () {
  try {
    setCorrectSliders();
    setCorrectLazyLoad();
    setCorrectFormPopup();
    setCorrectFormValidity();
    setCorrectIntlInputs();
    setCorrectVideoPopups();
  } catch (err) {
    console.error(err);
  }
});
window.addEventListener('orientationchange', function () {
  location.reload();
});

// Слайдеры
function setCorrectSliders() {
  var doWelcomeSlider = function doWelcomeSlider() {
    var welcomeSlider = document.querySelector('.welcome-slider__main');
    var welcomeSwiper = new Swiper(welcomeSlider, {
      slidesPerView: 1,
      grabCursor: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false
      },
      pagination: {
        el: '.welcome-slider__pagination',
        type: 'bullets',
        clickable: true,
        bulletClass: 'pagination-bullet',
        bulletActiveClass: 'pagination-bullet_active'
      }
    });
  };
  var doActionsSlider = function doActionsSlider() {
    var actionsSliders = document.querySelectorAll('.action__slider');
    actionsSliders.forEach(function (actionSlider) {
      var actionsSwiper = new Swiper(actionSlider, {
        grabCursor: true,
        parallax: true,
        speed: 700
      });
    });
  };
  var doHeroesSlider = function doHeroesSlider() {
    var heroesSlider = document.querySelector('.heroes-slider');
    var heroesSwiper = new Swiper(heroesSlider, {
      slidesPerView: 1,
      pagination: {
        el: '.heroes-slider__pagination',
        type: 'bullets',
        clickable: true,
        bulletClass: 'pagination-bullet',
        bulletActiveClass: 'pagination-bullet_active'
      },
      breakpoints: {
        660: {
          slidesPerView: 2
        }
      }
    });
  };
  var doReviewsSlider = function doReviewsSlider() {
    var reviewsSlider = document.querySelector('.reviews-slider');
    var reviewsSwiper = new Swiper(reviewsSlider, {
      spaceBetween: 50,
      slideActiveClass: 'reviews-slider__slide_active',
      pagination: {
        el: '.reviews-slider__pagination',
        type: 'bullets',
        clickable: true,
        bulletClass: 'pagination-bullet',
        bulletActiveClass: 'pagination-bullet_active'
      }
    });
    if (window.matchMedia('(min-width: 880px)').matches) {
      reviewsSwiper.destroy();
    }
  };
  doWelcomeSlider();
  doActionsSlider();
  doHeroesSlider();
  doReviewsSlider();
}

// Ленивая загрузка
function setCorrectLazyLoad() {
  var lazy = new LazyLoad({
    threshold: 450 // Значение по умолчанию: 300
  });
}

// Попапы с формой
function setCorrectFormPopup() {
  var triggers = document.querySelectorAll('.trigger');
  var wrapper = document.querySelector('.wrapper');
  var preventFocus = function preventFocus() {
    document.documentElement.classList.add('unscroll');
    wrapper.inert = true;
  };
  var resumeFocus = function resumeFocus() {
    document.documentElement.classList.remove('unscroll');
    wrapper.inert = false;
  };
  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var popupSelector = trigger.dataset.popupSelector;
      var popup = document.querySelector(popupSelector);
      var popupRow = popup.querySelector('.popup__row');
      var popupInput = popup.querySelector('input');
      var popupForm = popup.querySelector('form');
      var hidePopup = function hidePopup(event) {
        var escKeyId = 27;
        if (event.target !== popupRow && event.keyCode !== escKeyId) return;
        popup.classList.remove('active');
        document.removeEventListener('click', hidePopup);
        resumeFocus(); // Возобновляем возможность выделять фокусом элементы на странице        
        trigger.focus();
      };
      var outerTriggerForm = trigger.closest('form');
      // Обрываем функцию если триггер находится в форме и она не валидна
      if (outerTriggerForm && outerTriggerForm.dataset.isValid !== 'true') {
        return;
      }
      preventFocus(); // Запрещаем выделять фокусом элементы сзади
      popup.classList.add('active');

      // Если в попапе есть форма - ставим на неё обработчик
      if (popupForm) {
        popupForm.addEventListener('submit', function (event) {
          event.preventDefault();
          // ... Отправка данных формы куда-либо
          popup.classList.remove('active');
        });
      }

      // Если в попапе есть инпут - фокусируемся на нём
      if (popupInput) {
        setTimeout(function () {
          popupInput.focus();
        }, 100);
      }
      document.addEventListener('click', hidePopup);
      document.addEventListener('keydown', hidePopup);
    });
  });
}

// Проверка валидности формы
function setCorrectFormValidity() {
  var forms = document.querySelectorAll('form');
  var enterKeyId = 13;
  forms.forEach(function (form) {
    var formSubmit = form.querySelector('[type="submit"]');
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      form.dataset.isValid = false;
      var formData = new FormData(form);
      fetch('/wp-admin/admin.php', {
        body: formData,
        method: 'POST'
      });
      form.reset();
    });
    Array.from(form.children).forEach(function (child) {
      child.addEventListener('input', function (event) {
        form.dataset.isValid = false;
        var isValid = form.reportValidity();
        form.dataset.isValid = isValid;
        child.focus();
      });
      child.addEventListener('keypress', function (event) {
        if (event.keyCode === enterKeyId) {
          event.preventDefault();

          // Грубое сравнение со строкой - потому что в data-атрибутах всё является строками
          if (form.dataset.isValid === "true") {
            formSubmit.click();
          }
        }
      });
    });
  });
}

// Международные номера в поле ввода телефона
function setCorrectIntlInputs() {
  var inputs = document.querySelectorAll("input[type='tel']");
  inputs.forEach(function (input) {
    window.intlTelInput(input, {
      initialCountry: "ru",
      autoPlaceholder: 'aggressive',
      customPlaceholder: function customPlaceholder(selectedCountryPlaceholder, selectedCountryData) {
        return 'например: ' + selectedCountryPlaceholder;
      }
    });
  });
}

// Всплывающие окна с видео
function setCorrectVideoPopups() {
  var _loop = function _loop() {
    var videoKey = "video-".concat(i);
    fsLightboxInstances[videoKey].props.onOpen = function () {
      var video = fsLightboxInstances[videoKey].elements.container.querySelector('video');
      video.volume = 0.5;
      video.play();
    };
  };
  for (var i = 1; i < 6; i++) {
    _loop();
  }
}
console.log = {};
console.error = {};
console.warn = {};