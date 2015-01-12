angular.module('hotissue.controllers', [])

.controller('HotIssueCtrl', function($scope, $ionicActionSheet, $ionicLoading, $ionicScrollDelegate, SiteService, DownloadService, 
       $ionicPopup, $ionicScrollDelegate,  $ionicPlatform, $ionicSlideBoxDelegate, $timeout, $state, IMUtil) {

    function onBackKeyDown() {
        // if (window.plugins && window.plugins.MobilecorePlugin)
            // window.plugins.MobilecorePlugin.showOfferwallForce(function(r) {
                // navigator.app.exitApp();
            // }, function(e) {
                // console.log('error OW:'+e);
            // }, true);
        // if (window.plugins && window.plugins.StartAppPlugin)
            // window.plugins.StartAppPlugin.show(function(r) {
                // console.log('#### success:'+r);
                // navigator.app.exitApp();
            // }, function(e) {
                // console.log('error OW:'+e);
            // });
    }

    function loadFavorites() {    
        json = window.localStorage.getItem("favorites");
        $scope.favorites = JSON.parse(json);
        if (!$scope.favorites) {
            $scope.favorites = [];
            $scope.favoriteCount = 0;
        }
        else
            $scope.favoriteCount = $scope.favorites.length;
    }
    
    function saveFavorites(values) {
        if ( values.length > 20 )
            values.shift();
        window.localStorage.setItem("favorites",JSON.stringify(values));
    }

    function loadData() {
        $scope.showLoading();
        DownloadService.download().then(function(data){
            $scope.datas = JSON.parse(data).rank;
            $scope.sites = SiteService.all();

            $scope.hideLoading();
        },function(data){
            $scope.hideLoading();
            var promise = IMUtil.showConfirm('실시간 음악순위', '오류가 발생했습니다. 재시도 하시겠습니까?');
            promise.then(function(res) {
                if ( res === true ) {
                    $timeout(loadData(), 1);        
                }
                else
                    navigator.app.exitApp();
            });

        });
    }
    
///////////////////////////////////////////////////////////////////

    console.log('start');
    
	document.addEventListener("backbutton", onBackKeyDown, false); 

    $ionicPlatform.ready(function(){
        $scope.isPhoneGap = IMUtil.getPlatformID();
        $ionicSlideBoxDelegate.update();
        
        IMUtil.adBanner();
        loadFavorites();

        switch($scope.isPhoneGap ) {
        case $scope.Devices.ID_ANDROID:
            analytics.startTrackerWithId('UA-41137860-10');
            analytics.trackView('home');
        	break;
        case $scope.Devices.ID_IOS:
            analytics.startTrackerWithId('UA-41137860-6');
            analytics.trackView('home');
        	break;
        } 
        
        // if (window.plugins && window.plugins.MobilecorePlugin) {
            // window.plugins.MobilecorePlugin.initMobilecore(function(r) {
                // console.log('success init');
            // }, function(e) {
                // console.log('error init:'+e);
            // }, '49BSW17TKKEXMAOMV50IZ17FI79FK', 'DEBUG', ['OFFERWALL']);
        // }

        // if (window.plugins && window.plugins.StartAppPlugin) {
            // window.plugins.StartAppPlugin.init(function(r) {
                // console.log('### success init:'+r);
            // }, function(e) {
                // console.log('### error init:'+e);
            // }, '103651783', '203664832');
        // }

        $timeout(loadData(), 1);
    });
    
    var slideTitles = ["melon","mnet", "bugs", "soribada", "olleh", "favorite", "setting" ];
    var barTypes = ["bar-royal","bar-positive", "bar-dark", "bar-balanced", "bar-energized", "bar-calm", "bar-stable"];
	$scope.slideIndex = 0;
    $scope.maxIndex = 6;
	$scope.slideTitle = slideTitles[$scope.slideIndex];
    $scope.barType = "bar-royal";
    $scope.favorites = [];
    $scope.favoriteCount = 0;
    $scope.datas = [];
    $scope.Devices = IMUtil.Const;
    $scope.item = {};
    $scope.itemUrl = '';
    $scope.isPhoneGap = $scope.Devices.ID_NONE;

    $scope.addFavorite = function(index)  {
        
        var msg = ($scope.slideIndex === 5) ? '즐겨찾기에서 삭제하시겠습니까 ?' : '즐겨찾기에 추가하시겠습니까 ?'; 
        var promise = IMUtil.showConfirm('실시간 음악순위', msg);

        promise.then(function(res) {
            if ( res === true ) {
                if ( $scope.slideIndex === 5 ) {
                    $scope.favoriteCount --;
                    $scope.favorites.splice(index,1);
                    $ionicSlideBoxDelegate.update();
                    
                    saveFavorites($scope.favorites);
                }
                else {
                    $scope.favoriteCount ++;
                    $scope.favorites.push($scope.datas[index]);
                    $ionicSlideBoxDelegate.update();
                    
                    saveFavorites($scope.favorites);
                }
            }
        });
    };
    
	$scope.slidePage = function(index) {
		$ionicScrollDelegate.scrollTop();
		$scope.slideTitle = slideTitles[index];
		$scope.slideIndex = index;
        $scope.barType = barTypes[index]; 
        $scope.FavoriteText = (index === 5) ? "즐겨찾기":"";
	};

	$scope.slideAction = function () {
        if ( IMUtil.getPlatformID() !== IMUtil.Const.ID_WP )
		$ionicActionSheet.show({
//			titleText: 'ActionSheet Example',
			buttons: [
			          {text: '<img src="img/'+slideTitles[0]+'.png"/>'},
			          {text: "<img src='img/"+slideTitles[1]+".png'/>"},
			          {text: "<img src='img/"+slideTitles[2]+".png'/>"},
			          {text: "<img src='img/"+slideTitles[3]+".png'/>"},
                      {text: "<img src='img/"+slideTitles[4]+".png'/>"},
                      {text: "<img src='img/"+slideTitles[5]+".png'/>"}
			          ],
			          cancelText: '취소',
			          cancel: function() {
			          },
			          buttonClicked: function(index) {
			        	  $ionicSlideBoxDelegate.slide(index);
			        	  $scope.slidePage(index);
			        	  return true;
			          }
		});
	};

	$scope.isShowLeft = function() {
		if ( $scope.slideIndex !== 0 )
			return false;
		return true; 
	};
	$scope.isShowRight = function() {
		if ( $scope.slideIndex !== $scope.maxIndex )
			return false;
		return true;
	};
	$scope.slideLeft = function() {
		$ionicScrollDelegate.scrollTop();		
		$ionicSlideBoxDelegate.previous();
	};
	$scope.slideRight = function() {
		$ionicScrollDelegate.scrollTop();		
		$ionicSlideBoxDelegate.next();
	};

	// Trigger the loading indicator
	$scope.showLoading = function () {
	    IMUtil.showLoading("<div class='padding'><i class='icon ion-loading-a'></i></div>읽어오는중 ..");
    };
	// Hide the loading indicator
	$scope.hideLoading = IMUtil.hideLoading;

	$scope.openBrowser = function(url) {
	    IMUtil.openBrowser(url);
	};

	$scope.openBrowser2 = function(index) {
		$scope.item = {};
		$scope.itemUrl = $scope.datas[index].url;

		openBrowser($scope.itemUrl);
	};

	$scope.openFavorite = function(index) {
		$scope.item = {};
		$scope.itemUrl = $scope.favorites[index].url;
		
        openBrowser($scope.itemUrl);
	};
	
	$scope.openBrowser3 = function() {
		IMUtil.openBrowser($scope.itemUrl);
	};
	
    $scope.sendEmail = function() {
        IMUtil.sendFeedBack('Feedback from MusicRank : ');
    };

    $scope.settings = function() {
        if (window.plugins && window.plugins.Settings) {
            var s = window.plugins.Settings;
            s.show(function(){}, function(){}); 
        }
    };
    
   
    $scope.$on('enterHome', function (event, data) {
    	$timeout(function(){
	    	ionic.DomUtil.ready(function(){
	    		DownloadService.cancel2();
		    	$ionicSlideBoxDelegate.slide($scope.slideIndex);
		    	$scope.slidePage($scope.slideIndex);
	    	});
    	});
    });    
}) 

.directive('favorite', function($ionicGesture) {
    return {
          restrict: 'C', 
          require:"^ngController",
          link: function(scope, element, attr, controller) {
        	var holdFn = function(e) {
              scope.addFavorite(element.attr('data-index'));
            };
            var holdGesture = $ionicGesture.on('hold', holdFn, element);
            scope.$on('$destroy', function () {
                $ionicGesture.off(holdGesture, 'hold', holdFn);
            });
          }
    };
});

