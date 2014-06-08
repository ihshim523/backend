angular.module('starter.services', [])

.factory('ClipService', function($http) {

  return {
    send: function(key, value) {
		var result = $http.jsonp(
		    encodeURI('http://clip-back.imapp.kr/?f=2&callback=JSON_CALLBACK&k='+key+'&v='+value)
		    );

      return result;
    },
    receive: function(key) {
        var result = $http.jsonp(
            encodeURI('http://clip-back.imapp.kr/?f=1&callback=JSON_CALLBACK&k='+key)
            );

      return result;
    }
  };
});
