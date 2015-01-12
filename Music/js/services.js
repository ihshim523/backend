angular.module('hotissue.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('DownloadService', function($q, $http, IMUtil) {

	var test = true;

	var mURL1 = 'http://music.imapp.kr/get.dat';
	if (test) {
		mURL1 = 'http://test-music.imapp.kr/get.dat';
	}
	
    var downloadFirstDefered = null;
    
    function downloadFirst(key, value) {
    	if ( !downloadFirstDefered ) {
    		downloadFirstDefered = $q.defer();
	
	        var result = $http.get(
	            encodeURI(mURL1), {responseType:"arraybuffer"}
	            ).success(function(data, status, headers, config){
	                try {
	                    var d1 = new Uint8Array(data);
	                    var inflate = new Zlib.Inflate(d1);
	                    var d2 = inflate.decompress();
	                    
	                    downloadFirstDefered.resolve(IMUtil.ab2str(d2));
	                    downloadFirstDefered = null;
	                }
	                catch(err) {
	                	downloadFirstDefered.reject('error');
	                	downloadFirstDefered = null;
	                }
	            })
	            .error(function(data, status, headers, config){
	            	downloadFirstDefered.reject('error');
	            	downloadFirstDefered = null;
	            });
	
	
	        return downloadFirstDefered.promise;
    	}
    	return null;
    }

    function cancelDownloadFirst() {
    	if ( downloadFirstDefered ) {
    		downloadFirstDefered.reject('cancel');
    		downloadFirstDefered = null;
    	}
    }
    
    
  return {
	    download: downloadFirst,
	    cancel: cancelDownloadFirst
  };
})

.factory('SiteService', function() {
	function returnAll() {
		return ['melon','mnet','bugs','soribada','olleh'];
	}
	
	return {
		all : returnAll
	};
});
