var admob_ios_key="ca-app-pub-3241952602337815/2647907833",admob_android_key="ca-app-pub-3241952602337815/5629360632",admob_wp_key="ca-app-pub-3241952602337815/5601374237",app=angular.module("hotissue",["ionic","ui.router","hotissue.services","hotissue.controllers","pascalprecht.translate","inapp.util"]);app.config(["$compileProvider","$translateProvider",function(e,t){e.imgSrcSanitizationWhitelist("img"),t.translations("en_EN",{RATE_IT:"Rate It!"}),t.translations("ko_KR",{RATE_IT:"평가하기"}),t.preferredLanguage("ko_KR")}]).config(["$stateProvider","$urlRouterProvider",function(e,t){e.state("hotissue",{url:"/",templateUrl:"templates/home.html",onEnter:["$rootScope",function(e){e.$broadcast("enterHome")}]}).state("content",{url:"/content",templateUrl:"templates/content.html",onEnter:["$rootScope",function(e){e.$broadcast("enterContent")}]}),t.otherwise("/")}]),angular.module("hotissue.controllers",[]).controller("HotIssueCtrl",["$scope","$ionicActionSheet","$ionicLoading","$ionicScrollDelegate","SiteService","DownloadService","$ionicPopup","$ionicScrollDelegate","$ionicPlatform","$ionicSlideBoxDelegate","$timeout","$state","IMUtil",function(e,t,i,n,r,o,a,n,s,A,c,l,u){function f(){e.isContent||u.adInterstitial()}function h(){json=window.localStorage.getItem("favorites"),e.favorites=JSON.parse(json),e.favorites?e.favoriteCount=e.favorites.length:(e.favorites=[],e.favoriteCount=0)}function d(e){e.length>20&&e.shift(),window.localStorage.setItem("favorites",JSON.stringify(e))}function p(){e.showLoading(),o.download().then(function(t){e.datas=JSON.parse(t).rank,e.sites=r.all(),e.hideLoading()},function(){e.hideLoading();var t=u.showConfirm("실시간 검색어","오류가 발생했습니다. 재시도 하시겠습니까?");t.then(function(e){e===!0?c(p(),1):navigator.app.exitApp()})})}function g(t){e.showLoading(),o.download2(t).then(function(i){null!==i&&"null"!==i?e.item=JSON.parse(i):(e.item.k=t,e.item.v="데이터를 가져오기 실패했습니다. 자세히 보기를 눌러보세요.."),e.hideLoading()},function(i){if(e.hideLoading(),"cancel"!==i){var n=u.showConfirm("실시간 검색어","오류가 발생했습니다. 재시도 하시겠습니까?");n.then(function(e){e===!0?c(g(t),1):navigator.app.exitApp()})}})}console.log("start"),document.addEventListener("backbutton",f,!1),s.ready(function(){switch(e.isPhoneGap=u.getPlatformID(),A.update(),u.adBanner(),h(),e.isPhoneGap){case e.Devices.ID_ANDROID:analytics.startTrackerWithId("UA-41137860-10"),analytics.trackView("home");break;case e.Devices.ID_IOS:analytics.startTrackerWithId("UA-41137860-6"),analytics.trackView("home")}c(p(),1)});var m=["naver","daum","google","nate","zum","favorite","setting"],w=["bar-royal","bar-positive","bar-dark","bar-balanced","bar-energized","bar-calm","bar-stable"];e.slideIndex=0,e.maxIndex=6,e.slideTitle=m[e.slideIndex],e.barType="bar-royal",e.favorites=[],e.favoriteCount=0,e.datas=[],e.Devices=u.Const,e.item={},e.itemUrl="",e.isContent=!1,e.isPhoneGap=e.Devices.ID_NONE,e.addFavorite=function(t){var i=5===e.slideIndex?"즐겨찾기에서 삭제하시겠습니까 ?":"즐겨찾기에 추가하시겠습니까 ?",n=u.showConfirm("실시간 검색어",i);n.then(function(i){i===!0&&(5===e.slideIndex?(e.favoriteCount--,e.favorites.splice(t,1),A.update(),d(e.favorites)):(e.favoriteCount++,e.favorites.push(e.datas[t]),A.update(),d(e.favorites)))})},e.slidePage=function(t){n.scrollTop(),e.slideTitle=m[t],e.slideIndex=t,e.barType=w[t],e.FavoriteText=5===t?"즐겨찾기":""},e.slideAction=function(){u.getPlatformID()!==u.Const.ID_WP&&e.isContent===!1&&t.show({buttons:[{text:'<img src="img/'+m[0]+'_s.png"/>'},{text:"<img src='img/"+m[1]+"_s.png'/>"},{text:"<img src='img/"+m[2]+"_s.png'/>"},{text:"<img src='img/"+m[3]+"_s.png'/>"},{text:"<img src='img/"+m[4]+"_s.png'/>"},{text:"<img src='img/"+m[5]+".png'/>"}],cancelText:"취소",cancel:function(){},buttonClicked:function(t){return A.slide(t),e.slidePage(t),!0}})},e.isShowLeft=function(){return 0!==e.slideIndex?!1:!0},e.isShowRight=function(){return e.slideIndex!==e.maxIndex?!1:!0},e.slideLeft=function(){n.scrollTop(),A.previous()},e.slideRight=function(){n.scrollTop(),A.next()},e.showLoading=function(){u.showLoading("<div class='padding'><i class='icon ion-loading-a'></i></div>읽어오는중 ..")},e.hideLoading=u.hideLoading,e.openBrowser=function(e){u.openBrowser(e)},e.openBrowser2=function(t){e.item={},e.itemUrl=e.datas[t].url,l.go("content"),c(g(e.datas[t].title),1)},e.openFavorite=function(t){e.item={},e.itemUrl=e.favorites[t].url,l.go("content"),c(g(e.favorites[t].title),1)},e.openBrowser3=function(){u.openBrowser(e.itemUrl)},e.sendEmail=function(){u.sendFeedBack("Feedback from HotIssue : ")},e.settings=function(){if(window.plugins&&window.plugins.Settings){var e=window.plugins.Settings;e.show(function(){},function(){})}},e.$on("enterContent",function(){e.isContent=!0}),e.$on("enterHome",function(){c(function(){ionic.DomUtil.ready(function(){o.cancel2(),e.isContent=!1,A.slide(e.slideIndex),e.slidePage(e.slideIndex)})})})}]).directive("favorite",["$ionicGesture",function(e){return{restrict:"C",require:"^ngController",link:function(t,i){var n=function(){t.addFavorite(i.attr("data-index"))},r=e.on("hold",n,i);t.$on("$destroy",function(){e.off(r,"hold",n)})}}}]),angular.module("inapp.util",[]).factory("IMUtil",["$ionicLoading","$ionicPopup","$interval",function(e,t,i){function n(){switch(m){case w.ID_ANDROID:return admob_android_key;case w.ID_IOS:return admob_ios_key;case w.ID_WP:return admob_wp_key;case w.ID_FFOS:}return w.ID_NONE}function r(){if(window.plugins&&window.plugins.AdMob){var e=n(),t=window.plugins.AdMob;t.createBannerView({publisherId:e,adSize:t.AD_SIZE.SMART_BANNER,bannerAtTop:!1},function(){t.requestAd({isTesting:!1},function(){t.showAd(!0)},function(){console.log("failed to request ad")})},function(){console.log("failed to create banner view")})}else console.log("AdMob plugin not available/ready.")}function o(){if(window.plugins&&window.plugins.AdMob){var e=window.plugins.AdMob,t=n();e.createInterstitialView({publisherId:t},function(){e.requestInterstitialAd({isTesting:!1},function(){e.showAd(!0)},function(){console.log("failed to request ad")})})}}function a(e){h(e);var t=i(function(){d(),i.cancel(t)},3e3)}function s(e,i){var n=t.confirm({title:e,template:i});return n}function A(){if("undefined"!=typeof device)switch(device.platform){case"Android":return m=w.ID_ANDROID,w.ID_ANDROID;case"iOS":return m=w.ID_IOS,w.ID_IOS;case"WinCE":case"Win32NT":return m=w.ID_WP,w.ID_WP;case"firefoxos":return m=w.ID_FFOS,w.ID_FFOS}return m=w.ID_WEB,w.ID_WEB}function c(e){m===w.ID_WEB?window.open(e):window.open(e,"_system")}function l(e){var t,i,n,r,o,a;for(t="",n=e.length,i=0;n>i;)switch(r=e[i++],r>>4){case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:t+=String.fromCharCode(r);break;case 12:case 13:o=e[i++],t+=String.fromCharCode((31&r)<<6|63&o);break;case 14:o=e[i++],a=e[i++],t+=String.fromCharCode((15&r)<<12|(63&o)<<6|(63&a)<<0)}return t}function u(e){for(var t=new Uint8Array(e.length),i=0,n=e.length;n>i;++i)t[i]=e.charCodeAt(i);return t}function f(e){window.plugin&&window.plugin.email?window.plugin.email.isServiceAvailable(function(t){t?window.plugin.email.open({to:["imapp.help@gmail.com"],subject:"Hybrid Feedback",body:e}):c("mailto:imapp.help@gmail.com")}):c("mailto:imapp.help@gmail.com")}function h(t){e.show({content:t,animation:"fade-in",showBackdrop:!0,maxWidth:300,showDelay:500})}function d(){e.hide()}function p(){var e=window.location.pathname;return e=e.substr(e,e.length-10),"file://"+e}function g(){if(m===w.ID_WEB){var e=new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");e.play()}else{var t=p()+"media/ding.wav",i=new Media(t);i.play()}}var m,w={ID_NONE:-1,ID_WEB:0,ID_ANDROID:1,ID_IOS:2,ID_WP:3,ID_FFOS:4};return{Const:w,adBanner:r,openBrowser:c,getPlatformID:A,showConfirm:s,adInterstitial:o,ab2str:l,str2ab:u,sendFeedBack:f,showLoading:h,hideLoading:d,toast:a,beep:g}}]).directive("integer",function(){return{restrict:"A",require:"ngModel",link:function(e,t,i,n){n.$parsers.push(function(e){if(void 0===e)return"";var t=e.replace(/[^0-9]/g,"");return parseInt(t)<i.min&&(t=i.min),parseInt(t)>i.max&&(t=t.slice(0,-1)),t!==e&&(n.$setViewValue(t),n.$render()),console.log(parseInt(t)+"::"+i.min+":::"+i.max),t})}}}),function(){"use strict";function e(e,t){var i=e.split("."),n=s;!(i[0]in n)&&n.execScript&&n.execScript("var "+i[0]);for(var r;i.length&&(r=i.shift());)i.length||void 0===t?n=n[r]?n[r]:n[r]={}:n[r]=t}function t(e){var t,i,n,r,o,a,s,c,l,u,f=e.length,h=0,d=Number.POSITIVE_INFINITY;for(c=0;f>c;++c)e[c]>h&&(h=e[c]),e[c]<d&&(d=e[c]);for(t=1<<h,i=new(A?Uint32Array:Array)(t),n=1,r=0,o=2;h>=n;){for(c=0;f>c;++c)if(e[c]===n){for(a=0,s=r,l=0;n>l;++l)a=a<<1|1&s,s>>=1;for(u=n<<16|c,l=a;t>l;l+=o)i[l]=u;++r}++n,r<<=1,o<<=1}return[i,h,d]}function i(e,t){switch(this.g=[],this.h=32768,this.d=this.f=this.a=this.l=0,this.input=A?new Uint8Array(e):e,this.m=!1,this.i=l,this.s=!1,(t||!(t={}))&&(t.index&&(this.a=t.index),t.bufferSize&&(this.h=t.bufferSize),t.bufferType&&(this.i=t.bufferType),t.resize&&(this.s=t.resize)),this.i){case c:this.b=32768,this.c=new(A?Uint8Array:Array)(32768+this.h+258);break;case l:this.b=0,this.c=new(A?Uint8Array:Array)(this.h),this.e=this.A,this.n=this.w,this.j=this.z;break;default:throw Error("invalid inflate mode")}}function n(e,t){for(var i,n=e.f,r=e.d,o=e.input,a=e.a,s=o.length;t>r;){if(a>=s)throw Error("input buffer is broken");n|=o[a++]<<r,r+=8}return i=n&(1<<t)-1,e.f=n>>>t,e.d=r-t,e.a=a,i}function r(e,t){for(var i,n,r=e.f,o=e.d,a=e.input,s=e.a,A=a.length,c=t[0],l=t[1];l>o&&!(s>=A);)r|=a[s++]<<o,o+=8;return i=c[r&(1<<l)-1],n=i>>>16,e.f=r>>n,e.d=o-n,e.a=s,65535&i}function o(e){function i(e,t,i){var o,a,s,A=this.q;for(s=0;e>s;)switch(o=r(this,t)){case 16:for(a=3+n(this,2);a--;)i[s++]=A;break;case 17:for(a=3+n(this,3);a--;)i[s++]=0;A=0;break;case 18:for(a=11+n(this,7);a--;)i[s++]=0;A=0;break;default:A=i[s++]=o}return this.q=A,i}var o,a,s,c,l=n(e,5)+257,u=n(e,5)+1,f=n(e,4)+4,h=new(A?Uint8Array:Array)(p.length);for(c=0;f>c;++c)h[p[c]]=n(e,3);if(!A)for(c=f,f=h.length;f>c;++c)h[p[c]]=0;o=t(h),a=new(A?Uint8Array:Array)(l),s=new(A?Uint8Array:Array)(u),e.q=0,e.j(t(i.call(e,l,o,a)),t(i.call(e,u,o,s)))}function a(e,t){var n,r;switch(this.input=e,this.a=0,(t||!(t={}))&&(t.index&&(this.a=t.index),t.verify&&(this.B=t.verify)),n=e[this.a++],r=e[this.a++],15&n){case C:this.method=C;break;default:throw Error("unsupported compression method")}if(0!==((n<<8)+r)%31)throw Error("invalid fcheck flag:"+((n<<8)+r)%31);if(32&r)throw Error("fdict flag is not supported");this.r=new i(e,{index:this.a,bufferSize:t.bufferSize,bufferType:t.bufferType,resize:t.resize})}var s=this,A="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array&&"undefined"!=typeof DataView,c=0,l=1,u={u:c,t:l};i.prototype.k=function(){for(;!this.m;){var e=n(this,3);switch(1&e&&(this.m=!0),e>>>=1){case 0:var t=this.input,i=this.a,r=this.c,a=this.b,s=t.length,u=void 0,f=void 0,h=r.length,d=void 0;if(this.d=this.f=0,i+1>=s)throw Error("invalid uncompressed block header: LEN");if(u=t[i++]|t[i++]<<8,i+1>=s)throw Error("invalid uncompressed block header: NLEN");if(f=t[i++]|t[i++]<<8,u===~f)throw Error("invalid uncompressed block header: length verify");if(i+u>t.length)throw Error("input buffer is broken");switch(this.i){case c:for(;a+u>r.length;){if(d=h-a,u-=d,A)r.set(t.subarray(i,i+d),a),a+=d,i+=d;else for(;d--;)r[a++]=t[i++];this.b=a,r=this.e(),a=this.b}break;case l:for(;a+u>r.length;)r=this.e({p:2});break;default:throw Error("invalid inflate mode")}if(A)r.set(t.subarray(i,i+u),a),a+=u,i+=u;else for(;u--;)r[a++]=t[i++];this.a=i,this.b=a,this.c=r;break;case 1:this.j(U,Q);break;case 2:o(this);break;default:throw Error("unknown BTYPE: "+e)}}return this.n()};var f,h,d=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],p=A?new Uint16Array(d):d,g=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,258,258],m=A?new Uint16Array(g):g,w=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],v=A?new Uint8Array(w):w,b=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],I=A?new Uint16Array(b):b,y=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],k=A?new Uint8Array(y):y,D=new(A?Uint8Array:Array)(288);for(f=0,h=D.length;h>f;++f)D[f]=143>=f?8:255>=f?9:279>=f?7:8;var E,S,U=t(D),B=new(A?Uint8Array:Array)(30);for(E=0,S=B.length;S>E;++E)B[E]=5;var Q=t(B);i.prototype.j=function(e,t){var i=this.c,o=this.b;this.o=e;for(var a,s,A,c,l=i.length-258;256!==(a=r(this,e));)if(256>a)o>=l&&(this.b=o,i=this.e(),o=this.b),i[o++]=a;else for(s=a-257,c=m[s],0<v[s]&&(c+=n(this,v[s])),a=r(this,t),A=I[a],0<k[a]&&(A+=n(this,k[a])),o>=l&&(this.b=o,i=this.e(),o=this.b);c--;)i[o]=i[o++-A];for(;8<=this.d;)this.d-=8,this.a--;this.b=o},i.prototype.z=function(e,t){var i=this.c,o=this.b;this.o=e;for(var a,s,A,c,l=i.length;256!==(a=r(this,e));)if(256>a)o>=l&&(i=this.e(),l=i.length),i[o++]=a;else for(s=a-257,c=m[s],0<v[s]&&(c+=n(this,v[s])),a=r(this,t),A=I[a],0<k[a]&&(A+=n(this,k[a])),o+c>l&&(i=this.e(),l=i.length);c--;)i[o]=i[o++-A];for(;8<=this.d;)this.d-=8,this.a--;this.b=o},i.prototype.e=function(){var e,t,i=new(A?Uint8Array:Array)(this.b-32768),n=this.b-32768,r=this.c;if(A)i.set(r.subarray(32768,i.length));else for(e=0,t=i.length;t>e;++e)i[e]=r[e+32768];if(this.g.push(i),this.l+=i.length,A)r.set(r.subarray(n,n+32768));else for(e=0;32768>e;++e)r[e]=r[n+e];return this.b=32768,r},i.prototype.A=function(e){var t,i,n,r,o=this.input.length/this.a+1|0,a=this.input,s=this.c;return e&&("number"==typeof e.p&&(o=e.p),"number"==typeof e.v&&(o+=e.v)),2>o?(i=(a.length-this.a)/this.o[2],r=258*(i/2)|0,n=r<s.length?s.length+r:s.length<<1):n=s.length*o,A?(t=new Uint8Array(n),t.set(s)):t=s,this.c=t},i.prototype.n=function(){var e,t,i,n,r,o=0,a=this.c,s=this.g,c=new(A?Uint8Array:Array)(this.l+(this.b-32768));if(0===s.length)return A?this.c.subarray(32768,this.b):this.c.slice(32768,this.b);for(t=0,i=s.length;i>t;++t)for(e=s[t],n=0,r=e.length;r>n;++n)c[o++]=e[n];for(t=32768,i=this.b;i>t;++t)c[o++]=a[t];return this.g=[],this.buffer=c},i.prototype.w=function(){var e,t=this.b;return A?this.s?(e=new Uint8Array(t),e.set(this.c.subarray(0,t))):e=this.c.subarray(0,t):(this.c.length>t&&(this.c.length=t),e=this.c),this.buffer=e},a.prototype.k=function(){var e,t,i=this.input;if(e=this.r.k(),this.a=this.r.a,this.B){t=(i[this.a++]<<24|i[this.a++]<<16|i[this.a++]<<8|i[this.a++])>>>0;var n=e;if("string"==typeof n){var r,o,a=n.split("");for(r=0,o=a.length;o>r;r++)a[r]=(255&a[r].charCodeAt(0))>>>0;n=a}for(var s,A=1,c=0,l=n.length,u=0;l>0;){s=l>1024?1024:l,l-=s;do A+=n[u++],c+=A;while(--s);A%=65521,c%=65521}if(t!==(c<<16|A)>>>0)throw Error("invalid adler-32 checksum")}return e};var C=8;e("Zlib.Inflate",a),e("Zlib.Inflate.prototype.decompress",a.prototype.k);var x,L,R,W,N={ADAPTIVE:u.t,BLOCK:u.u};if(Object.keys)x=Object.keys(N);else for(L in x=[],R=0,N)x[R++]=L;for(R=0,W=x.length;W>R;++R)L=x[R],e("Zlib.Inflate.BufferType."+L,N[L])}.call(this),angular.module("hotissue.services",[]).factory("DownloadService",["$q","$http","IMUtil",function(e,t,i){function n(){if(!c){c=e.defer();{t.get(encodeURI(s),{responseType:"arraybuffer"}).success(function(e){try{var t=new Uint8Array(e),n=new Zlib.Inflate(t),r=n.decompress();c.resolve(i.ab2str(r)),c=null}catch(o){c.reject("error"),c=null}}).error(function(){c.reject("error"),c=null})}return c.promise}return null}function r(){c&&(c.reject("cancel"),c=null)}function o(n){if(!l){l=e.defer();{var r=encodeURI(A+n);t.get(r,{responseType:"arraybuffer"}).success(function(e){try{var t=new Uint8Array(e),n=new Zlib.Inflate(t),r=n.decompress();l.resolve(i.ab2str(r)),l=null}catch(o){l.reject("error:"+o),l=null}}).error(function(){l.reject("error"),l=null})}return l.promise}return null}function a(){l&&(l.reject("cancel"),l=null)}var s="http://hotissue.imapp.kr/get.dat",A="http://hotissue-back.imapp.kr/?k=",c=null,l=null;return{download:n,download2:o,cancel:r,cancel2:a}}]).factory("SiteService",function(){function e(){return["naver","daum","google","nate","zum"]}return{all:e}});