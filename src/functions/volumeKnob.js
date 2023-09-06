/**
 * @name		jQuery KnobKnob plugin
 * @author		Martin Angelov (mostly)
 * @author2    Chris Howard (removed jQuery)
 * @version 	1.0
 * @url			http://tutorialzine.com/2011/11/pretty-switches-css3-jquery/
 * @license		MIT License
 */

export const volumeKnob = function (volume, setVolume) {
  var options = {
    snap: 0,
    value: 0,
    turn: function () {},
  };

  var knob = document.querySelector('.knob'),
    knobTop = document.querySelector('.knob .top'),
    startDeg = -1,
    currentDeg = 0,
    rotation = 190,
    lastDeg = 0;

  if (options.value > 0 && options.value <= 359) {
    rotation = currentDeg = options.value;
    knobTop.style.transform = 'rotate(' + currentDeg + 'deg)';
    options.turn(currentDeg / 360);
  }

  var active;

  knob.onmouseup = function (e) {
    active = false;
  };

  knob.onmousedown = function (e) {
    active = true;
    // touchstart
    e.preventDefault();
    var rect = knob.getBoundingClientRect();
    var offset = {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
    };
    var center = {
      y:
        offset.top +
        parseFloat(getComputedStyle(knob, null).height.replace('px', '')) / 2,
      x:
        offset.left +
        parseFloat(getComputedStyle(knob, null).width.replace('px', '')) / 2,
    };

    var a,
      b,
      deg,
      tmp,
      rad2deg = 180 / Math.PI,
      originalEvent = e;
    knob.onmousemove = function (e) {
      // touchmove.rem
      //e = originalEvent.touches ? originalEvent.touches[0] : e;

      a = center.y - e.pageY;
      b = center.x - e.pageX;
      deg = Math.atan2(a, b) * rad2deg;

      // we have to make sure that negative
      // angles are turned into positive:
      if (deg < 0) {
        deg = 330 + deg;
      }

      // Save the starting position of the drag
      if (startDeg == -1) {
        startDeg = deg;
      }

      // Calculating the current rotation
      tmp = Math.floor(deg - startDeg + rotation);

      // Making sure the current rotation
      // stays between 0 and 329
      if (tmp < 0) {
        tmp = 330 + tmp;
      } else if (tmp > 329) {
        tmp = tmp % 330;
      }

      // Snapping in the off position:
      if (options.snap && tmp < options.snap) {
        tmp = 0;
      }

      // This would suggest we are at an end position;
      // we need to block further rotation.
      if (Math.abs(tmp - lastDeg) > 180) {
        return false;
      }

      currentDeg = tmp;
      lastDeg = tmp;
      if (active === true) {
        knobTop.style.transform = 'rotate(' + currentDeg + 'deg)';
        options.turn(currentDeg / 360);
        var vol;
        vol = currentDeg / 3.6;
        var safety = parseInt(
          knobTop
            .getAttribute('style')
            .replace('transform: rotate(', '')
            .replace('deg);', '')
        );
        setVolume(Math.floor(vol) / 100);
      }
    };
  };
};
