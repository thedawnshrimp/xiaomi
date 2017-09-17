(function ($) {
  'use strict';
  $.y = {
    format: function (value) {
      var args = arguments;
      return value.replace(/\{(\d+)\}/g, function (a, b) {
        return args[Number(b) + 1];
      });
    },
    toCurrency: function (value) {
      return '$' + value.toFixed(2);
    },
    sum: function (array, fn) {
      var total = 0;
      for (var i = 0, len = array.length; i < len; i++) {
        if (typeof fn == 'function') {
          total += fn(array[i], i);
        }
        else {
          total += array[i];
        }
      }
      return total;
    }
  }
})(jQuery);
