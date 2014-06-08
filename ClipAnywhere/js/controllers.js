var isPhoneGap;

angular.module('starter.controllers', [])

.controller('ListCtrl', function($scope, $ionicLoading, $ionicPopup, ClipService, $ionicActionSheet,  $ionicPlatform,$sce) {
	function adBanner() {
		if( window.plugins && window.plugins.AdMob ) {
		    var admob_ios_key = 'a151e6d43c5a28f';
		    var admob_android_key = 'ca-app-pub-3241952602337815/5472106633';
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
	function loadKey() {
	    $scope.clip.key = '';
        key = window.localStorage.getItem("key");
        
        console.log(key);

	    if ( key && key != '' ) {
            $scope.clip.key = parseInt(key);
	    }
	    else {
	        $scope.clip.key = Math.floor(Math.random()*89999+10000);
	        window.localStorage.setItem("key", $scope.clip.key);
        }
    }

    function loadValue() {
        json = window.localStorage.getItem("values");
        $scope.items = JSON.parse(json);
        if (!$scope.items)
            $scope.items = [];
        console.log("loadValue:"+JSON.stringify($scope.items));
    }
    function setValue(values) {
        if ( values.length > 5 )
            values.shift();
        console.log("setValue:"+JSON.stringify(values));
        window.localStorage.setItem("values",JSON.stringify(values));
    }

	// function onDeviceReady() {
		// adBanner();
	// }

    function copyToClipboard(text) {
        window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
    }

	isPhoneGap = (document.location.protocol == "file:");
	// if ( isPhoneGap )
		// document.addEventListener("deviceready", onDeviceReady, false);

    $ionicPlatform.ready(function(){
         adBanner();
    });

    if ( !isPhoneGap )
       $scope.google = '<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script><ins class="adsbygoogle" style="display:inline-block;width:728px;height:90px" data-ad-client="ca-pub-3241952602337815" data-ad-slot="5779831039"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>';
    $scope.clip = {};
	$scope.send = {};
    loadValue();
    loadKey();

    $scope.adsense = function() {
        return $sce.trustAsHtml($scope.google);
    }
	$scope.Send = function() {
	    window.localStorage.setItem("key", $scope.clip.key.toString());
	    
		$ionicLoading.show({
			template: 'Posting...'
		});

		ClipService.send($scope.clip.key, $scope.send.value).
			success(function(data, status, headers, config){
				$ionicLoading.hide();
				
                $ionicLoading.show({
                    template: 'Successfully posted!',
                    duration: 2000
                });
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
        window.localStorage.setItem("key", $scope.clip.key.toString());

        $ionicLoading.show({
            template: 'Loading...'
        });

        ClipService.receive($scope.clip.key).
            success(function(data, status, headers, config){
                if ( data.v == null )
                    $ionicPopup.alert({
                       title: 'Error',
                       template: 'Data not found'
                     });
                else {
                    exist = false;
                    for (i in $scope.items ){
                        if ( $scope.items[i].k == $scope.clip.key ) {
                            $scope.items[i].v = data.v;
                            exist = true;
                            break;
                        }
                    }
                    if ( !exist )
                        $scope.items.push(data);
                    setValue($scope.items);
                }
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

    $scope.Delete = function (index,data) {
        $scope.items.forEach(function(it){
            console.log('Delete:'+JSON.stringify(it));    
        });

        $scope.items = $scope.items.filter(function(item) {
            return item.k != data.k;
        });
        setValue($scope.items);
        
        $scope.items.forEach(function(it){
            console.log('Delete2:'+JSON.stringify(it));    
        });
    }
	$scope.Action = function (data) {
        $ionicActionSheet.show({
//          titleText: 'ActionSheet Example',
            buttons: [
                      {text: 'Copy to clipboard'},
                      {text: 'Open browser'},
                      {text: 'Google Search'}
                      ],
                      cancelText: 'Cancel',
                      cancel: function() {
                      },
                      buttonClicked: function(index) {
                          switch(index) {
                              case  0:
                                if ( !isPhoneGap )
                                    copyToClipboard(data);
                              break;
                              case  1:
                                if ( !isPhoneGap )
                                    window.location.href=data;
                              break;
                              case  2:
                                if ( !isPhoneGap )
                                    window.location.href="http://www.google.com/search?q="+data;
                              break;
                          }
                          return true;
                      }
        });
	    
	}
	
});

