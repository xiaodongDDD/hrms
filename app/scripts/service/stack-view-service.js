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
          warn("history.length : " + _history.stack.length);
          for (var i = _history.stack.length - 1; i >= 0; i--) {
            warn("stateName " + _history[i].stateName);
            $ionicHistory.backView(_history[i]);
            $ionicHistory.goBack();
          }
        },
        getCurrentStack: function (viewName) {
          warn($ionicHistory.viewHistory());
          angular.forEach(_history, function (view, index) {
            warn('history stack:' + view.stateName);
            if (index === _history.length - 1) {
              _color = 'back';
            }
            var _stackItem = {
              viewId: view.viewId,
              stateName: view.stateName,
              title: view.title,
              color: _color
            }
            _stackList.push(_stackItem);
          });
          _stackList[_stackList.length - 1].title = viewName;
          return _stackList;
        }
      }
    }]);



