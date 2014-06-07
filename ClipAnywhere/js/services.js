angular.module('starter.services', [])

.factory('ClipService', function($http) {

  return {
    send: function(key, value) {
		var result = $http({method: 'POST', url: 'http://clip-back.imapp.kr',
			data:{k:key,v:value}});
    	
      return result;
    },
    receive: function(key) {
        var result = $http({method: 'GET', url: 'http://clip-back.imapp.kr',
            params:{k:key}});

      return result;
    }
  };
});
