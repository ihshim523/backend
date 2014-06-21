var admob_ios_key = 'ca-app-pub-3241952602337815/2647907833';
var admob_android_key = 'ca-app-pub-3241952602337815/5629360632';
var admob_wp_key = 'ca-app-pub-3241952602337815/5601374237';

var app = angular.module('hotissue', ['ionic', 'hotissue.services', 'hotissue.controllers', 'ngTranslate', 'inapp.util']);

app.config(function ($translateProvider) {
    
    // Simply register translation table as object hash
    $translateProvider.translations('en_EN',{
        RATE_IT: 'Rate It!'
    });   
    $translateProvider.translations('ko_KR',{
        RATE_IT: '평가하기'
    });   
    $translateProvider.uses('ko_KR');
});

//.config(function($stateProvider, $urlRouterProvider) {

//// Ionic uses AngularUI Router which uses the concept of states
//// Learn more here: https://github.com/angular-ui/ui-router
//// Set up the various states which the app can be in.
//// Each state's controller can be found in controllers.js
//$stateProvider

//// // setup an abstract state for the tabs directive
//// .state('tab', {
////   url: "/tab",
////   abstract: true,
////   templateUrl: "templates/tabs.html"
//// })

//// the pet tab has its own child nav-view and history
//.state('hotissue', {
//url: '/',
//views: {
//'hotissue': {
//templateUrl: 'templates/naver.html',
//controller: 'PetIndexCtrl'
//}
//}
//})


//;

//// if none of the above states are matched, use this as the fallback
//$urlRouterProvider.otherwise('/');

//});

