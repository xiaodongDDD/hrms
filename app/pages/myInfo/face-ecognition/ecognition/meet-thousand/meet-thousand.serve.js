/**
 * Created by bobo on 2017/1/3.
 */
(function () {
  'use strict';

  angular
    .module('myInfoModule')
    .factory('meetThousandServe', meetThousandServe);
    function meetThousandServe() {
      var service;

      service={
        getLocalStorage:getLocalStorage,
        setLocalStorage:setLocalStorage
      };
      function getLocalStorage(key) {
        return window.localStorage.getItem(key)
      }
      function setLocalStorage(key,value) {
        window.localStorage.setItem(key,value);
      }
      return service;
    }

})();
