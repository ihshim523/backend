var admob_ios_key = 'ca-app-pub-3241952602337815/9493079837';
var admob_android_key = 'ca-app-pub-3241952602337815/1338761839';
var admob_wp_key = 'ca-app-pub-3241952602337815/3446546235';

var app = angular.module('hotissue', ['ionic', 'ui.router', 'hotissue.services', 
	'hotissue.controllers', 'pascalprecht.translate', 'inapp.util']);

app.config(function ($compileProvider, $translateProvider) {

	$compileProvider.imgSrcSanitizationWhitelist('img');

	// Simply register translation table as object hash
	$translateProvider.translations('en_EN',{
		RATE_IT: 'Rate It!'
	});   
	$translateProvider.translations('ko_KR',{
		RATE_IT: '평가하기'
	});   
	$translateProvider.preferredLanguage('ko_KR');
})


.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider

	.state('hotissue', {
		url: '/',
		templateUrl: 'templates/home.html',
		onEnter:[ '$rootScope', function($rootScope) {
			$rootScope.$broadcast('enterHome');		
		}]
	})

	.state('content', {
		url: "/content",
		templateUrl: "templates/content.html",
		onEnter:[ '$rootScope', function($rootScope) {
			$rootScope.$broadcast('enterContent');		
		}]
	})

	;

	$urlRouterProvider.otherwise('/');

})

;

