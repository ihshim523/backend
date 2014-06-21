angular.module('hotissue.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('DownloadService', function($q, $http, IMUtil) {

    function downloadFirst(key, value) {
        var defered = $q.defer();

        var result = $http.get(
            encodeURI('http://hotissue.imapp.kr/get.dat'), {responseType:"arraybuffer"}
            ).success(function(data, status, headers, config){
                try {
                    var d1 = new Uint8Array(data);
                    var inflate = new Zlib.Inflate(d1);
                    var d2 = inflate.decompress();
                    
                    defered.resolve(IMUtil.ab2str(d2));
                }
                catch(err) {
                    defered.reject('error');    
                }
            })
            .error(function(data, status, headers, config){
                defered.reject('error');
            });


        return defered.promise;
    }

  return {
    download: downloadFirst
  };
})

.factory('SiteService', function() {
	function returnAll() {
		return ['naver','daum','google','nate','zum'];
	}
	
	return {
		all : returnAll
	};
});
