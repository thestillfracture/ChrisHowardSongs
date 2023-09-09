export const swipeFn = (midSlide, leftSlide, rightSlide) => {
  let touchstartX = 0;
  let touchendX = 0;

  const gestureZone = document.getElementById('slider-content');

  gestureZone.addEventListener(
    'touchstart',
    function (event) {
      touchstartX = event.changedTouches[0].screenX;
    },
    false
  );

  gestureZone.addEventListener(
    'touchend',
    function (event) {
      touchendX = event.changedTouches[0].screenX;
      //console.log(touchstartX - touchendX);
      if (Math.abs(touchstartX - touchendX) > 60) {
        // console.log(touchendX);
        //handleGesture();
        const checkModal = document
          .querySelector('.App')
          .getAttribute('data-modal');
        if (touchendX < touchstartX && checkModal !== 'modal-open') {
          let curFocus = document
            .querySelector('.swiper-focused')
            .getAttribute('id'); //.attr('id');
          switch (curFocus) {
            case 'swiper-1': // show #2
              midSlide();
              break;
            case 'swiper-2': // show #3
              rightSlide();
              break;
            default:
            // console.log('end of carousel')
          }
        }

        if (touchendX > touchstartX && checkModal !== 'modal-open') {
          let curFocus = document
            .querySelector('.swiper-focused')
            .getAttribute('id');
          switch (curFocus) {
            case 'swiper-2': // show #1
              leftSlide();
              break;
            case 'swiper-3': // show #2
              midSlide();
              break;
            default:
            // console.log('end of carousel')
          }
        }
      }
    },
    false
  );
};
