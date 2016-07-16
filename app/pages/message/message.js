/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('messageModule')

  .controller('messageCtrl', [
    '$scope',
    '$state',
    '$timeout',
    '$ionicPlatform',
    'imService',
    'checkVersionService',
    'baseConfig',
    '$q',
    function ($scope,
              $state,
              $timeout,
              $ionicPlatform,
              imService,
              checkVersionService,
              baseConfig,
              $q) {

      $scope.messageList = [];

      //将页面的导航bar设置成白色
      $ionicPlatform.ready(function () {
        if (window.StatusBar) {
          StatusBar.styleLightContent();
        }
      });


      var getMessageList = function () {
        if(baseConfig.debug) {
          console.log('in getMessageList');
        }
        if (HandIMPlugin) {
          HandIMPlugin.returnConversationList(function success(result) {
            console.log('returnConversationList result ' + angular.toJson(result));
            $scope.messageList = [];
            angular.forEach(result.message,function (data) {
              var user = userInfo[data.message.SendId];
              var item = {
                "name": user.name,
                "content": data.message.Content,
                "imgUrl": user.imgUrl,
                "count": data.message.messageNum,
                "employee": data.message.SendId,
                "time": data.message.SendTime
              };
              $scope.messageList.push(item);
            });
            $scope.$apply();

          }, function error() {
          }, '');
        }

        $timeout(function() {
          loop();
        }, 1000);
      };

      var loop = function () {
        getMessageList();
      };

      $timeout(function() {
        loop();
      }, 1000);

      var userInfo = {"9403":{"name":"\u738B\u5174\u56FD","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8Zt8H491ycduA0PaB1U1MJEOERssnYcIzDic3kdsvOk055w/"},"7941":{"name":"\u738B\u7434","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvaCkJrVVMqZ9MOpwDk54RbkicO9NPg2NCzSULG9ef0UnQ/"},"3547":{"name":"\u5218\u4FDD\u7965","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZsWficvFV4no403kUNcjtTC3bT5EUo3mMClpWgR9iawZc7w/"},"7940":{"name":"\u8FDE\u559C\u5803","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvGL3Q5QJtR9EkiarrteYKtibXibiagct68s552JiaJ9hJYOeA/"},"3719":{"name":"\u53F2\u78CA","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZtJkHvibqPtwzW2wic8ms1F8bqyo7OcpaianZ3SNC469x3BA/"},"5633":{"name":"\u674E\u96C1\u519B","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZuficCNyicoHOrG30Omda81L8gwvJsfdR2ehx6zaEgf8u9A/"},"9361":{"name":"\u9B4F\u5B50\u9F99","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZtnRGwx94Xnz0eb78Rl1Yy5htOeKvtXKuOOVmLGIS15Xw/"},"10103":{"name":"\u9EC4\u6D69","imgUrl":""},"7978":{"name":"\u8BB8\u57CE\u57CE","imgUrl":""},"9599":{"name":"\u5434\u6D01\u6021","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZuoyNBB4UNPYtBdCWGib6Be71fEpuniaUCM9xKRadw2iaqCQ/"},"7968":{"name":"\u9EC4\u677E","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZsrWxd09iaxgZibUH9ZW86yBT16v9B0tloBhw89DXwz2W1A/"},"7715":{"name":"\u848B\u5DE6\u52C7","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvibTaKiaoLiciaiaZDPWvaAiaJM7spYzP4xNU1PK7zUxAXcQibw/"},"3927":{"name":"\u5468\u5B97\u4E91","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvhaXAjVjjpv2CBow6GXr6hJUEV13nAbZNMRI7Pfh23kQ/"},"4822":{"name":"\u4F55\u946B\u94ED","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZsbK8X0fLXNtia3SvLbiaRcI2E5mnpFCGflX3icKKibMokGww/"},"10100":{"name":"\u738B\u80DC","imgUrl":""},"10172":{"name":"\u5218\u6587\u4FCA","imgUrl":""},"5086":{"name":"\u4EE3\u65ED","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvaODHfSA8lRncXLmWvKGQmpH4CwxktzwpGBM9qXTPZaQ/"},"7972":{"name":"\u5F20\u731B","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZsrWxd09iaxgZibUH9ZW86yBTLklos7FL6JDDuc3aG35ib0w/"},"9604":{"name":"\u9648\u598D\u84D3","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZtqMGS6tnGJ3j4M62eNc45b31tHC8tUrdEcs0PUdibm3BQ/"},"9607":{"name":"\u6F58\u65ED","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZsZshND1oQJqTNavic6WI5jy0VqWSmucL1RyjoSzB6Qf0A/"},"9602":{"name":"\u738B\u8D85\u53D1","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZtnRGwx94Xnz0eb78Rl1Yy5A7uPcqNC4YPUbPyxs6AZQQ/"},"8456":{"name":"\u9648\u5B87\u8D85","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZtQ0S9qBDCFialm32Fh8KB0cKicQ4qiapwZvLiar6jDgzxt2w/"},"7929":{"name":"\u66F9\u9633","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvqV8M2nWNOly330u7Mfq14zgMfWbdXicDKo9WUDRILnAw/"},"7964":{"name":"\u65B9\u5F3A","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8Zv0naoele7ccDJjqQOxue4ovAWePCtfjy1L70UEOHC1Bw/"},"7665":{"name":"\u82CF\u6D9B","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8Zvp9aaiadOuegWWUnVXzCcDM6qzjfFjd3HHk5fZ61UOVvw/"},"8474":{"name":"\u5F20\u97E7","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZurARA0CjiadewoRtqJjzcZhu6Scsmsb7lRX4bxcj9MQGA/"},"9221":{"name":"\u5355\u7EA2\u51AC","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZtJkHvibqPtwzW2wic8ms1F8bticjfOy4y3o60a4onPQJLJA/"},"7949":{"name":"\u6C5F\u94ED\u94ED","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZsFxRC8FVKJYemjpdsu5Ziba8FwHWq8jgdgnp5ibDUJUSNw/"},"7971":{"name":"\u6731\u98CE","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZtOfnCyl73qB4S26diauaFNUzqh8BiarTBtMpIEwddmo8XA/"},"4929":{"name":"\u5F20\u6653\u6CE2","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZsbZGDqPVTVyTrINBiasBWrO702bRKJ5G5oX9BPPwicjznA/"},"10000":{"name":"\u6768\u5BCC\u7A0B","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8Zt6eG3xRI1LicHuh2EgmJWibUDLBEf8m2QtBaAfTNabAibQA/"},"7957":{"name":"\u738B\u9E4F","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8Zu6Xoia92SbibIDbLRnON8ibY8arch6uU72KTheC6tnbZqicw/"},"3037":{"name":"\u848B\u96EF\u971E","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZsbZGDqPVTVyTrINBiasBWrOdML8ZP9k0aKAbO0mjibcPqw/"},"10133":{"name":"\u738B\u91D1\u5C71","imgUrl":""},"10114":{"name":"\u6BB5\u4EAC\u826F","imgUrl":""},"9316":{"name":"\u5F20\u677E\u677E","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvniaV3JFQtqmXo3oOLMLh67GDqdLbBC16qhZ4M0AVNUiaQ/"},"7917":{"name":"\u6BDB\u7BAB\u8587","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZuhyZtHaoOvXpNeQXn6DicJcqYE3vxUnYHaJl6zWtdRibeg/"},"6853":{"name":"\u80E1\u5FD7\u654F","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZujVAibgkMg7iaPc4QXibeL84fgPSPvB2KeJLsY38heqB4tA/"},"5659":{"name":"\u5D14\u4F1F\u624D","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvlJppqhXaBicTu8lWfx0yj159uGXQUJQKib88dQeIKWHow/"},"2205":{"name":"\u9A6C\u4E91\u98DE","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZuKNqopcialjic0LIpP0kibLb1CQ3uau5rptwm0UJOcCbZ8A/"},"7955":{"name":"\u6797\u9F99","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvZ9kst1wiahI5L2KCPq5NQkp6cQC215V9p9L0Wve34BDg/"},"7965":{"name":"\u5459\u6797\u7F8E","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZtQ0S9qBDCFialm32Fh8KB0cPBhXd5BzeVLYiaPY5iad7TKw/"},"7980":{"name":"\u8D3A\u7426","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZsXjlfubzwNBAe1SEfSEtmXTuV3X2dMVzq1wTeKkunnEQ/"},"8467":{"name":"\u9EC4\u660A","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZsMfnqtdRR0ia8q6K4VQBibMKb7qcZzW1R8tWDvTBINqjAw/"},"6088":{"name":"\u9646\u6D69\u661F","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8Zv4VkNR2NLSdCvpLwCicyqSFknbE7eB6aM4f0cEHp0ey2w/"},"9364":{"name":"\u5434\u7B11\u8BDA","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8Zv6AEHG6zwkkkGFQHgO90LT0TnAGWVwZOicjlibyNEOtx4w/"},"1107":{"name":"\u80E1\u5F3A","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZskwuH230Zz3I8m6WTqicb3a1pw1Ebiauw16VZwpic6SBtIA/"},"9360":{"name":"\u621A\u65ED\u8D85","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvtKnr7LId62YDAFuXlaq34CXLib9IeqpXvzZHQejFESGA/"},"9294":{"name":"\u5434\u6E05","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZtsrMgyq4XOxI3UvZuUkS6TKhEY8iaXpiccliawaymuMJweQ/"},"9600":{"name":"\u6768\u5A77\u5A77","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvibTaKiaoLiciaiaZDPWvaAiaJM7DJA6zOTZmFV8LT2DWeytjg/"},"9606":{"name":"\u6C6A\u7FD4","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8Zt6eG3xRI1LicHuh2EgmJWibUASkxFy03IfOLfEKRWO6pBw/"},"7982":{"name":"\u8521\u67EF","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvibTaKiaoLiciaiaZDPWvaAiaJM7CA4bJKbSR1wvZ2NZ3rPOLA/"},"6976":{"name":"\u5362\u4E4B\u6DA6","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvibTaKiaoLiciaiaZDPWvaAiaJM7mX93ctIUBVQu6N2Db3LBdQ/"},"7944":{"name":"\u5B59\u6D77\u4E1C","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZsFxRC8FVKJYemjpdsu5ZibaXY6bQukK2w6056AS7NWA4Q/"},"9406":{"name":"\u738B\u51EF\u534E","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvibTaKiaoLiciaiaZDPWvaAiaJM7DgxzkhMvh4VLuloep6kDlQ/"},"9392":{"name":"\u9648\u6A91","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvaODHfSA8lRncXLmWvKGQmgtpA1lTnm5S2TrUNgUvcQQ/"},"7946":{"name":"\u6C5F\u6155","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvtKnr7LId62YDAFuXlaq34TKbRKfbz0egkjXfwiazvpcg/"},"7919":{"name":"\u4E07\u91D1\u5FE0","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZtOfnCyl73qB4S26diauaFNUFyThgHdf894ib7N6uSNqaWg/"},"7915":{"name":"\u9A6C\u6668\u6866","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvVPQ13XxoA1t8BrhlZBFNqEccB97jHUicsSJzWumjLicyw/"},"7974":{"name":"\u5B59\u7EAA\u5149","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZsXjlfubzwNBAe1SEfSEtmXic1GH9HQ3qdboVglzsOWibHw/"},"2238":{"name":"\u5F20\u9896","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvpJTVWq5bJT6Gs4CSSKhcfO5ibiafp5w1mBvJM4ue6oiaAg/"},"7921":{"name":"\u5218\u9576\u73AE","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZsXjlfubzwNBAe1SEfSEtmXnWrstScISnX6mm7GnriaibNw/"},"9290":{"name":"\u5C39\u8BD7","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZsHYW0ej5ibsLSSOLDVhrTibFP0NvraU9EaSb0BTNYShbhw/"},"2203":{"name":"\u77F3\u987A","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZtViaeUGB2WuYGEOjNKpibmQ5ymbviaibTjiare6jI0MEtaEBw/"},"7920":{"name":"\u9A6C\u7389\u6D01","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvibTaKiaoLiciaiaZDPWvaAiaJM7JgMFhzeicLl861kG7DCfq6Q/"},"9325":{"name":"\u4ED8\u4F1F","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZsIibTLFVBicj9YCgsofzeFF7cbiaLx4ic9Tjam8qcmIOHxQw/"},"7942":{"name":"\u5218\u6653\u83B9","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvVPQ13XxoA1t8BrhlZBFNqZ8S0ibqiaHIG6IQq62qG4yyw/"},"7916":{"name":"\u738B\u73FA","imgUrl":""},"9356":{"name":"\u6731\u601D\u51E4","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZuX2QKOmeVdOxG8IFPf8t0wlKaAuysPiaGlRTHlT0WEZ7w/"},"9291":{"name":"\u6881\u5B87","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZtSjoXE409DquYysvwnrOocAHOD563IE4PruCVB1g9eeQ/"},"8859":{"name":"\u66F9\u5A77\u5A77","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8Zue0JCIriaugz4W9AEdLHaggtyib38wJyqKWQVZKLvUuCzg/"},"7939":{"name":"\u9EC4\u7389\u5E05","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZsgzdOg3zXZUlcRAuerXBjZG1HkkdQHBvkfE87uIJ83Aw/"},"7300":{"name":"\u9EC4\u5B87\u534E","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvibTaKiaoLiciaiaZDPWvaAiaJM7n4TFIDUiaV89Fv7R1tibnqmQ/"},"7913":{"name":"\u6C88\u745E\u826F","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZuVeu6N9m3uUEqiakWWo677Y12ysnPxSCD1zx5OWxqf8Vg/"},"7209":{"name":"\u859B\u535A\u4EC1","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8Zv0BUoLWjVmDib9mprZvToxbwbIB8jNe6NLZYVvX6jTVZA/"},"8595":{"name":"\u9F9A\u514B","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZtoX4ciaVVKgjbLZfmm0QIFibjZYdOcvJGqRKLzm6hHdrIA/"},"4040":{"name":"\u6210\u5FD7\u552F","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8Zvxnl9PXC90GibYIdibIOfiajSgAeWiaXtXnnb75C8raIQe8w/"},"10109":{"name":"\u738B\u5BB6\u5764","imgUrl":""},"3705":{"name":"\u987E\u68EE\u6797","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZsbZGDqPVTVyTrINBiasBWrOWBUuYGDXfeovenGoKXA8jA/"},"7963":{"name":"\u6234\u6587","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZsXjlfubzwNBAe1SEfSEtmXf2beEl8mTEYDcRTY8lTySA/"},"9279":{"name":"\u4F55\u6D41","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZtqMGS6tnGJ3j4M62eNc45baqYviaudpvE0S1hGNicibSSAw/"},"7975":{"name":"\u8881\u5F00\u5B87","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZtSjoXE409DquYysvwnrOocpoLVUDp1Swvoj4euws25icw/"},"7932":{"name":"\u5434\u8F89","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8Zue0JCIriaugz4W9AEdLHagguo6WYjerjUFzLatVast3zg/"},"7956":{"name":"\u6768\u7206","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZsXjlfubzwNBAe1SEfSEtmXurGKChuU7NM0AGicicYIOyjA/"},"6827":{"name":"\u6768\u96E8\u68EE","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8Zs0SZDYVWWPu2ib7e2OxgquOwnGC4u94eWnmn5nvz83cUg/"},"7945":{"name":"\u5C01\u5065\u709C","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZsXjlfubzwNBAe1SEfSEtmXlOhT94YqK9trGZekdKOhicA/"},"8897":{"name":"\u5F90\u65B9\u6CFD","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvhaXAjVjjpv2CBow6GXr6hLicPdbeSUmJ3EOS2DBbNDiaQ/"},"7977":{"name":"\u5F20\u946B\u624D","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvNAIxWiccYLpahWA2yYJQmopX6lbwgG54iaSv4cH6uaxYw/"},"7960":{"name":"\u4EE3\u4E1C\u4E1C","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZtGxBQQj7rL50xsxeO2FxiaXRvQJia84uU3VPDz16iapqKpg/"},"10223":{"name":"\u5218\u4E9A\u676D","imgUrl":""},"9412":{"name":"\u66F9\u4F20\u8D77","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8Zvp9aaiadOuegWWUnVXzCcDMhIeticyYPXHJo7u0UBuwVJA/"},"7936":{"name":"\u8A79\u534E\u660C","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvibTaKiaoLiciaiaZDPWvaAiaJM7aiaIicEcwvQ896k5VTfKhib6w/"},"7937":{"name":"\u4E0A\u5B98\u6587\u658C","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvibTaKiaoLiciaiaZDPWvaAiaJM7LeIYFicfD9DVbPIE3O4o4eQ/"},"9433":{"name":"\u6881\u5A77","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZvaODHfSA8lRncXLmWvKGQmrCl6a2xJVd0aGs0cibI3DlQ/"},"9738":{"name":"\u80E1\u6F47\u9759","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8Zt6eG3xRI1LicHuh2EgmJWibUZBVj3hWeeNGDXeBDV1zib1g/"},"8472":{"name":"\u6768\u78CA","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZtibWNKxfJ5MxB5lgUicsqM2ibQrh9t0VBeKaicPiarTB6VXOA/"},"10088":{"name":"\u90D1\u831C","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8ZsWficvFV4no403kUNcjtTC3THusrZG0mUAY4PFtUSKicicA/"},"7931":{"name":"\u6768\u5B97\u4E91","imgUrl":"http://shp.qpic.cn/bizmp/A3gUw79X8Zue0JCIriaugz4W9AEdLHaggIR3buib8vFHd9dLcPJe1RBw/"}};

      $scope.chatWithYou = function (message) {
        if (baseConfig.debug) {
          console.log('message ' + angular.toJson(message));
        }
        var emp = {
          "friendId": message.employee,
          "friendName": message.name
        }
        imService.toNativeChatPage(emp);
      };

      $scope.talk = function (message) {
        console.log('$scope.talk');
        $state.go("tab.messageDetail", {message: message});
      };

      $scope.refresh = function () {
        $timeout(function () {
          $scope.$broadcast("scroll.refreshComplete");
        }, 700);
      };

      console.log('messageCtrl.enter');

      $scope.$on('$ionicView.enter', function (e) {
        console.log('messageCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('messageCtrl.$destroy');
      });
    }
  ]);
