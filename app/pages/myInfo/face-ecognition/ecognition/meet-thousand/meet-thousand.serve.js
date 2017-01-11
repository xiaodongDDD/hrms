/**
 * Created by bobo on 2017/1/3.
 */
(function () {
  'use strict';

  angular
    .module('myInfoModule')
    .factory('meetThousandServe', meetThousandServe);

  meetThousandServe.$inject = [
    '$ionicLoading',
    '$cordovaToast',
    '$ionicPopup',
    'baseConfig'];

  function meetThousandServe($ionicLoading, $cordovaToast, $ionicPopup, baseConfig) {
    var service;

    service = {
      getLocalStorage: getLocalStorage,
      setLocalStorage: setLocalStorage,
      alertPopup: alertPopup
    };
    function getLocalStorage(key) {
      return window.localStorage.getItem(key)
    }

    function setLocalStorage(key, value) {
      window.localStorage.setItem(key, value);
    }

    function alertPopup(template, fun) {
      if (!baseConfig.nativeScreenFlag) {
        var myPopup = $ionicPopup.show({
          title: "提示",
          template: template,
          buttons: [{
            text: '确定',
            type: 'button button-cux-popup-confirm'
          }]
        });
        myPopup.then(function (res) {
          fun();
        });


      } else {
        navigator.notification.alert(
          template, // message
          fun, // callback
          "提示", // title
          '确定' // buttonName
        );

      }
      ;
    }

    return service;
  }

})();
