/**
 * Created by daiwen on 16/7/25.
 * @description get view history stack
 */

'use strict';
angular.module('HmsModule')
  .factory('stackViewService', [
    'hmsHttp',
    'hmsPopup',
    'baseConfig',
    '$ionicHistory',
    function (hmsHttp,
              hmsPopup,
              baseConfig,
              $ionicHistory) {
      // get the right history stack based on the current view
      var _historyId = $ionicHistory.currentHistoryId();
      var _history = $ionicHistory.viewHistory().histories[_historyId].stack;
      var _color = '#F99D32';
      var _stackList = [];

      return {
        view2BackState: function (stateName) {
          warn("history.length : " + _history.length);
          for (var i = _history.length - 1; i >= 0; i--) {
            warn("stateName " + _history[i].stateName);

              $ionicHistory.backView(_history[i]);
              $ionicHistory.goBack();

          }
        },
        getCurrentStack: function (viewName) {
          if (baseConfig.debug) {
            warn($ionicHistory.currentHistoryId());
            warn(_history);
            warn($ionicHistory.viewHistory());
          }
          angular.forEach(_history, function (view, index) {
            warn('history stack:' + view.stateName);
            if (index === _history.length - 1) {
              _color = 'black';
            }
            var _stackItem = {
              viewId: view.viewId,
              stateName: view.stateName,
              url: view.url
            };
            _stackList.push(_stackItem);
          });
          return _stackList;
        }
      }
    }]);



