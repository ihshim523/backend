angular.module('starter.services', [])

.factory('ClipService', function($http) {

  return {
    send: function(key, value) {
    	
		var result = $http({method: 'POST', url: 'http://c50.imapp.kr:8080/get',
			data:{
				"k":key,
				"v":value
			}});
    	
      return result;
    },
    receive: function(friendId) {

      return friends[friendId];
    }
  }
});
