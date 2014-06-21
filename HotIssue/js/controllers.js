angular.module('hotissue.controllers', [])

.controller('HotIssueCtrl', function($scope, $ionicActionSheet, $ionicLoading, $ionicScrollDelegate, SiteService, DownloadService, 
       $ionicPopup, $ionicScrollDelegate,  $ionicPlatform, $ionicSlideBoxDelegate, IMUtil) {

	function onBackKeyDown() { 
//		window.plugins.MobilecorePlugin.showOfferwall( function(r){navigator.app.exitApp();}, 
//				function(e){console.log('error OW');
//		}) ;
		IMUtil.adInterstitial();
	}

    $scope.addFavorite = function(index)  {
        
        var msg = ($scope.slideIndex == 5) ? '즐겨찾기에서 삭제하시겠습니까 ?' : '즐겨찾기에 추가하시겠습니까 ?'; 
        var promise = IMUtil.showConfirm('실시간 검색어', msg);

        promise.then(function(res) {
            if ( res === true ) {
                if ( $scope.slideIndex == 5 ) {
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
        })
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

///////////////////////////////////////////////////////////////////

	document.addEventListener("backbutton", onBackKeyDown, false); 

    $ionicPlatform.ready(function(){
        $scope.isPhoneGap = IMUtil.getPlatformID();
        $ionicSlideBoxDelegate.update();
        
         IMUtil.adBanner();

        $scope.showLoading();
        DownloadService.download().then(function(data){
            $scope.datas = JSON.parse(data).rank;
            $scope.sites = SiteService.all();

            $scope.hideLoading();
        },function(data){
            $ionicPopup.alert({
                title: 'Error',
                   template: 'Network problem occurred'
                });
            $scope.hideLoading();
        });
        loadFavorites();
    });
    
    var slideTitles = ["naver","daum", "google", "nate", "zum", "favorite", "setting" ];
    var barTypes = ["bar-royal","bar-positive", "bar-dark", "bar-balanced", "bar-energized", "bar-calm", "bar-stable"];
	$scope.slideIndex = 0;
    $scope.maxIndex = 6;
	$scope.slideTitle = slideTitles[$scope.slideIndex];
    $scope.barType = "bar-royal";
    $scope.favorites = [];
    $scope.favoriteCount = 0;
    $scope.datas = [];
    $scope.Devices = IMUtil.Const;

	$scope.slidePage = function(index) {
		$ionicScrollDelegate.scrollTop();
		$scope.slideTitle = slideTitles[index];
		$scope.slideIndex = index;
        $scope.barType = barTypes[index]; 
        $scope.FavoriteText = (index == 5) ? "즐겨찾기":"";
	};

	$scope.slideAction = function() {
		$ionicActionSheet.show({
//			titleText: 'ActionSheet Example',
			buttons: [
			          {text: '<img src="img/'+slideTitles[0]+'_s.png"/>'},
			          {text: "<img src='img/"+slideTitles[1]+"_s.png'/>"},
			          {text: "<img src='img/"+slideTitles[2]+"_s.png'/>"},
			          {text: "<img src='img/"+slideTitles[3]+"_s.png'/>"},
                      {text: "<img src='img/"+slideTitles[4]+"_s.png'/>"},
                      {text: "<img src='img/"+slideTitles[5]+".png'/>"}
			          ],
			          cancelText: '취소',
			          cancel: function() {
			          },
			          buttonClicked: function(index) {
			        	  $scope.slideTitle = slideTitles[index];
			        	  $scope.slideIndex = index;
			        	  $scope.$broadcast('slideBox.setSlide', index);
			        	  $ionicScrollDelegate.scrollTop();
	        	          $scope.barType = barTypes[index]; 
                          $scope.FavoriteText = (index == 5) ? "즐겨찾기":"";

			        	  return true;
			          }
		});
	};

	$scope.isShowLeft = function() {
		return $scope.slideIndex != 0 ? 1 : 0; 
	};
	$scope.isShowRight = function() {
		return $scope.slideIndex != $scope.maxIndex ? 1 : 0; 
	};
	$scope.slideLeft = function() {
		$ionicScrollDelegate.scrollTop();		
		$scope.$broadcast('slideBox.prevSlide');
	};
	$scope.slideRight = function() {
		$ionicScrollDelegate.scrollTop();		
		$scope.$broadcast('slideBox.nextSlide');
	};


	// Trigger the loading indicator
	$scope.showLoading = function () {
	    IMUtil.showLoading("<div class='padding'><i class='icon ion-loading-a'></i></div>읽어오는중 ..");
    }
	// Hide the loading indicator
	$scope.hideLoading = IMUtil.hideLoading;

	$scope.openBrowser = function(url) {
	    IMUtil.openBrowser(url);
	};

    $scope.sendEmail = function() {
        IMUtil.sendFeedBack('Feedback from HotIssue : ');
    }

    $scope.settings = function() {
        console.log('### settings');
        if (window.plugins && window.plugins.Settings) {
            console.log('### settings1111');
            var s = window.plugins.Settings;
            s.show(function(){}, function(){}); 
        }
    }
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
    }
});

