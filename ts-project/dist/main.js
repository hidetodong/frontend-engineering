(function () {
  'use strict';

  // 枚举
  // 1）普通枚举
  var STATUS_CODE;
  (function (STATUS_CODE) {
      STATUS_CODE[STATUS_CODE["NOT_FOUND"] = 404] = "NOT_FOUND";
      STATUS_CODE[STATUS_CODE["NOT_ALLOWED"] = 405] = "NOT_ALLOWED";
      STATUS_CODE[STATUS_CODE["ERROR"] = 400] = "ERROR";
  })(STATUS_CODE || (STATUS_CODE = {}));
  // 2) 异构枚举
  var STATUS_CODE_2;
  (function (STATUS_CODE_2) {
      STATUS_CODE_2[STATUS_CODE_2["NOT_FOUND"] = 404] = "NOT_FOUND";
      STATUS_CODE_2["NOT_ALLOWED"] = "405";
  })(STATUS_CODE_2 || (STATUS_CODE_2 = {}));

})();
//# sourceMappingURL=main.js.map
