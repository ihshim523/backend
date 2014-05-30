var isPhoneGap;

angular.module('starter.controllers', [])

.controller('ListCtrl', function($scope, $ionicLoading, $ionicPopup, ClipService) {
	function adBanner() {
		if( window.plugins && window.plugins.AdMob ) {
		    var admob_ios_key = 'a151e6d43c5a28f';
		    var admob_android_key = 'a14d161d31d73a4';
		    var admob_wp_key = 'a14d161d31d73a4';
		    var adId = (navigator.userAgent.indexOf('Android') >=0) ? admob_android_key : admob_ios_key;
		    var am = window.plugins.AdMob;

		    am.createBannerView( 
		        {
		        'publisherId': adId,
		        'adSize': am.AD_SIZE.SMART_BANNER,
		        'bannerAtTop': false
		        }, 
		        function() {
		            am.requestAd(
		                { 'isTesting':false }, 
		                function(){
		                	am.showAd( true );
		                }, 
		                function(){ console.log('failed to request ad'); }
		            );
		        }, 
		        function(){ console.log('failed to create banner view'); }
		    );
		} else {
			console.log('AdMob plugin not available/ready.');
		}
	}

	function onDeviceReady() {
		adBanner();
	}

	isPhoneGap = (document.location.protocol == "file:");
	if ( isPhoneGap )
		document.addEventListener("deviceready", onDeviceReady, false);

	$scope.receive = [];
	$scope.send = [];
	 
	$scope.Send = function() {
		$ionicLoading.show({
			template: 'Loading...'
		});

		ClipService.send($scope.send.key, $scope.send.value).
			success(function(data, status, headers, config){
				$ionicLoading.hide();
			}).
			error(function(data, status, headers, config){
				$ionicPopup.alert({
				       title: 'Error',
				       template: 'Network problem occurred'
				     });
				$ionicLoading.hide();
			});
	}
	$scope.Receive = function() {
		
	}
	
});

