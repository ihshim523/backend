var admob_ios_key="ca-app-pub-3241952602337815/2647907833",admob_android_key="ca-app-pub-3241952602337815/5629360632",admob_wp_key="ca-app-pub-3241952602337815/5601374237",app=angular.module("hotissue",["ionic","hotissue.services","hotissue.controllers","ngTranslate","inapp.util"]);app.config(["$translateProvider",function(t){t.translations("en_EN",{RATE_IT:"Rate It!"}),t.translations("ko_KR",{RATE_IT:"평가하기"}),t.uses("ko_KR")}]),angular.module("hotissue.controllers",[]).controller("HotIssueCtrl",["$scope","$ionicActionSheet","$ionicLoading","$ionicScrollDelegate","SiteService","DownloadService","$ionicPopup","$ionicScrollDelegate","$ionicPlatform","$ionicSlideBoxDelegate","$interval","IMUtil",function(t,i,e,r,n,s,o,r,a,h,f,l){function c(){}function u(){json=window.localStorage.getItem("favorites"),t.favorites=JSON.parse(json),t.favorites?t.favoriteCount=t.favorites.length:(t.favorites=[],t.favoriteCount=0)}function d(t){t.length>20&&t.shift(),window.localStorage.setItem("favorites",JSON.stringify(t))}function p(){t.showLoading(),s.download().then(function(i){t.datas=JSON.parse(i).rank,t.sites=n.all(),t.hideLoading()},function(){t.hideLoading();var i=l.showConfirm("실시간 검색어","오류가 발생했습니다. 재시도 하시겠습니까?");i.then(function(t){t===!0?f(p(),1,1):navigator.app.exitApp()})})}t.addFavorite=function(i){var e=5==t.slideIndex?"즐겨찾기에서 삭제하시겠습니까 ?":"즐겨찾기에 추가하시겠습니까 ?",r=l.showConfirm("실시간 검색어",e);r.then(function(e){e===!0&&(5==t.slideIndex?(t.favoriteCount--,t.favorites.splice(i,1),h.update(),d(t.favorites)):(t.favoriteCount++,t.favorites.push(t.datas[i]),h.update(),d(t.favorites)))})},document.addEventListener("backbutton",c,!1),a.ready(function(){t.isPhoneGap=l.getPlatformID(),h.update(),l.adBanner(),u(),f(p(),1,1)});var g=["naver","daum","google","nate","zum","favorite","setting"],b=["bar-royal","bar-positive","bar-dark","bar-balanced","bar-energized","bar-calm","bar-stable"];t.slideIndex=0,t.maxIndex=6,t.slideTitle=g[t.slideIndex],t.barType="bar-royal",t.favorites=[],t.favoriteCount=0,t.datas=[],t.Devices=l.Const,t.slidePage=function(i){r.scrollTop(),t.slideTitle=g[i],t.slideIndex=i,t.barType=b[i],t.FavoriteText=5==i?"즐겨찾기":""},t.slideAction=function(){i.show({buttons:[{text:'<img src="img/'+g[0]+'_s.png"/>'},{text:"<img src='img/"+g[1]+"_s.png'/>"},{text:"<img src='img/"+g[2]+"_s.png'/>"},{text:"<img src='img/"+g[3]+"_s.png'/>"},{text:"<img src='img/"+g[4]+"_s.png'/>"},{text:"<img src='img/"+g[5]+".png'/>"}],cancelText:"취소",cancel:function(){},buttonClicked:function(i){return t.slideTitle=g[i],t.slideIndex=i,t.$broadcast("slideBox.setSlide",i),r.scrollTop(),t.barType=b[i],t.FavoriteText=5==i?"즐겨찾기":"",!0}})},t.isShowLeft=function(){return 0!=t.slideIndex?1:0},t.isShowRight=function(){return t.slideIndex!=t.maxIndex?1:0},t.slideLeft=function(){r.scrollTop(),t.$broadcast("slideBox.prevSlide")},t.slideRight=function(){r.scrollTop(),t.$broadcast("slideBox.nextSlide")},t.showLoading=function(){l.showLoading("<div class='padding'><i class='icon ion-loading-a'></i></div>읽어오는중 ..")},t.hideLoading=l.hideLoading,t.openBrowser=function(t){l.openBrowser(t)},t.sendEmail=function(){l.sendFeedBack("Feedback from HotIssue : ")},t.settings=function(){if(console.log("### settings"),window.plugins&&window.plugins.Settings){console.log("### settings1111");var t=window.plugins.Settings;t.show(function(){},function(){})}}}]).directive("favorite",["$ionicGesture",function(t){return{restrict:"C",require:"^ngController",link:function(i,e){var r=function(){i.addFavorite(e.attr("data-index"))},n=t.on("hold",r,e);i.$on("$destroy",function(){t.off(n,"hold",r)})}}}]),function(){"use strict";function t(t,i){var e=t.split("."),r=a;!(e[0]in r)&&r.execScript&&r.execScript("var "+e[0]);for(var n;e.length&&(n=e.shift());)e.length||void 0===i?r=r[n]?r[n]:r[n]={}:r[n]=i}function i(t){var i,e,r,n,s,o,a,f,l,c,u=t.length,d=0,p=Number.POSITIVE_INFINITY;for(f=0;u>f;++f)t[f]>d&&(d=t[f]),t[f]<p&&(p=t[f]);for(i=1<<d,e=new(h?Uint32Array:Array)(i),r=1,n=0,s=2;d>=r;){for(f=0;u>f;++f)if(t[f]===r){for(o=0,a=n,l=0;r>l;++l)o=o<<1|1&a,a>>=1;for(c=r<<16|f,l=o;i>l;l+=s)e[l]=c;++n}++r,n<<=1,s<<=1}return[e,d,p]}function e(t,i){switch(this.g=[],this.h=32768,this.d=this.f=this.a=this.l=0,this.input=h?new Uint8Array(t):t,this.m=!1,this.i=l,this.s=!1,(i||!(i={}))&&(i.index&&(this.a=i.index),i.bufferSize&&(this.h=i.bufferSize),i.bufferType&&(this.i=i.bufferType),i.resize&&(this.s=i.resize)),this.i){case f:this.b=32768,this.c=new(h?Uint8Array:Array)(32768+this.h+258);break;case l:this.b=0,this.c=new(h?Uint8Array:Array)(this.h),this.e=this.A,this.n=this.w,this.j=this.z;break;default:throw Error("invalid inflate mode")}}function r(t,i){for(var e,r=t.f,n=t.d,s=t.input,o=t.a,a=s.length;i>n;){if(o>=a)throw Error("input buffer is broken");r|=s[o++]<<n,n+=8}return e=r&(1<<i)-1,t.f=r>>>i,t.d=n-i,t.a=o,e}function n(t,i){for(var e,r,n=t.f,s=t.d,o=t.input,a=t.a,h=o.length,f=i[0],l=i[1];l>s&&!(a>=h);)n|=o[a++]<<s,s+=8;return e=f[n&(1<<l)-1],r=e>>>16,t.f=n>>r,t.d=s-r,t.a=a,65535&e}function s(t){function e(t,i,e){var s,o,a,h=this.q;for(a=0;t>a;)switch(s=n(this,i)){case 16:for(o=3+r(this,2);o--;)e[a++]=h;break;case 17:for(o=3+r(this,3);o--;)e[a++]=0;h=0;break;case 18:for(o=11+r(this,7);o--;)e[a++]=0;h=0;break;default:h=e[a++]=s}return this.q=h,e}var s,o,a,f,l=r(t,5)+257,c=r(t,5)+1,u=r(t,4)+4,d=new(h?Uint8Array:Array)(g.length);for(f=0;u>f;++f)d[g[f]]=r(t,3);if(!h)for(f=u,u=d.length;u>f;++f)d[g[f]]=0;s=i(d),o=new(h?Uint8Array:Array)(l),a=new(h?Uint8Array:Array)(c),t.q=0,t.j(i(e.call(t,l,s,o)),i(e.call(t,c,s,a)))}function o(t,i){var r,n;switch(this.input=t,this.a=0,(i||!(i={}))&&(i.index&&(this.a=i.index),i.verify&&(this.B=i.verify)),r=t[this.a++],n=t[this.a++],15&r){case _:this.method=_;break;default:throw Error("unsupported compression method")}if(0!==((r<<8)+n)%31)throw Error("invalid fcheck flag:"+((r<<8)+n)%31);if(32&n)throw Error("fdict flag is not supported");this.r=new e(t,{index:this.a,bufferSize:i.bufferSize,bufferType:i.bufferType,resize:i.resize})}var a=this,h="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array&&"undefined"!=typeof DataView,f=0,l=1,c={u:f,t:l};e.prototype.k=function(){for(;!this.m;){var t=r(this,3);switch(1&t&&(this.m=!0),t>>>=1){case 0:var i=this.input,e=this.a,n=this.c,o=this.b,a=i.length,c=void 0,u=void 0,d=n.length,p=void 0;if(this.d=this.f=0,e+1>=a)throw Error("invalid uncompressed block header: LEN");if(c=i[e++]|i[e++]<<8,e+1>=a)throw Error("invalid uncompressed block header: NLEN");if(u=i[e++]|i[e++]<<8,c===~u)throw Error("invalid uncompressed block header: length verify");if(e+c>i.length)throw Error("input buffer is broken");switch(this.i){case f:for(;o+c>n.length;){if(p=d-o,c-=p,h)n.set(i.subarray(e,e+p),o),o+=p,e+=p;else for(;p--;)n[o++]=i[e++];this.b=o,n=this.e(),o=this.b}break;case l:for(;o+c>n.length;)n=this.e({p:2});break;default:throw Error("invalid inflate mode")}if(h)n.set(i.subarray(e,e+c),o),o+=c,e+=c;else for(;c--;)n[o++]=i[e++];this.a=e,this.b=o,this.c=n;break;case 1:this.j(U,$);break;case 2:s(this);break;default:throw Error("unknown BTYPE: "+t)}}return this.n()};var u,d,p=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],g=h?new Uint16Array(p):p,b=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,258,258],v=h?new Uint16Array(b):b,y=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0],w=h?new Uint8Array(y):y,m=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],A=h?new Uint16Array(m):m,k=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],x=h?new Uint8Array(k):k,I=new(h?Uint8Array:Array)(288);for(u=0,d=I.length;d>u;++u)I[u]=143>=u?8:255>=u?9:279>=u?7:8;var S,T,U=i(I),E=new(h?Uint8Array:Array)(30);for(S=0,T=E.length;T>S;++S)E[S]=5;var $=i(E);e.prototype.j=function(t,i){var e=this.c,s=this.b;this.o=t;for(var o,a,h,f,l=e.length-258;256!==(o=n(this,t));)if(256>o)s>=l&&(this.b=s,e=this.e(),s=this.b),e[s++]=o;else for(a=o-257,f=v[a],0<w[a]&&(f+=r(this,w[a])),o=n(this,i),h=A[o],0<x[o]&&(h+=r(this,x[o])),s>=l&&(this.b=s,e=this.e(),s=this.b);f--;)e[s]=e[s++-h];for(;8<=this.d;)this.d-=8,this.a--;this.b=s},e.prototype.z=function(t,i){var e=this.c,s=this.b;this.o=t;for(var o,a,h,f,l=e.length;256!==(o=n(this,t));)if(256>o)s>=l&&(e=this.e(),l=e.length),e[s++]=o;else for(a=o-257,f=v[a],0<w[a]&&(f+=r(this,w[a])),o=n(this,i),h=A[o],0<x[o]&&(h+=r(this,x[o])),s+f>l&&(e=this.e(),l=e.length);f--;)e[s]=e[s++-h];for(;8<=this.d;)this.d-=8,this.a--;this.b=s},e.prototype.e=function(){var t,i,e=new(h?Uint8Array:Array)(this.b-32768),r=this.b-32768,n=this.c;if(h)e.set(n.subarray(32768,e.length));else for(t=0,i=e.length;i>t;++t)e[t]=n[t+32768];if(this.g.push(e),this.l+=e.length,h)n.set(n.subarray(r,r+32768));else for(t=0;32768>t;++t)n[t]=n[r+t];return this.b=32768,n},e.prototype.A=function(t){var i,e,r,n,s=this.input.length/this.a+1|0,o=this.input,a=this.c;return t&&("number"==typeof t.p&&(s=t.p),"number"==typeof t.v&&(s+=t.v)),2>s?(e=(o.length-this.a)/this.o[2],n=258*(e/2)|0,r=n<a.length?a.length+n:a.length<<1):r=a.length*s,h?(i=new Uint8Array(r),i.set(a)):i=a,this.c=i},e.prototype.n=function(){var t,i,e,r,n,s=0,o=this.c,a=this.g,f=new(h?Uint8Array:Array)(this.l+(this.b-32768));if(0===a.length)return h?this.c.subarray(32768,this.b):this.c.slice(32768,this.b);for(i=0,e=a.length;e>i;++i)for(t=a[i],r=0,n=t.length;n>r;++r)f[s++]=t[r];for(i=32768,e=this.b;e>i;++i)f[s++]=o[i];return this.g=[],this.buffer=f},e.prototype.w=function(){var t,i=this.b;return h?this.s?(t=new Uint8Array(i),t.set(this.c.subarray(0,i))):t=this.c.subarray(0,i):(this.c.length>i&&(this.c.length=i),t=this.c),this.buffer=t},o.prototype.k=function(){var t,i,e=this.input;if(t=this.r.k(),this.a=this.r.a,this.B){i=(e[this.a++]<<24|e[this.a++]<<16|e[this.a++]<<8|e[this.a++])>>>0;var r=t;if("string"==typeof r){var n,s,o=r.split("");for(n=0,s=o.length;s>n;n++)o[n]=(255&o[n].charCodeAt(0))>>>0;r=o}for(var a,h=1,f=0,l=r.length,c=0;l>0;){a=l>1024?1024:l,l-=a;do h+=r[c++],f+=h;while(--a);h%=65521,f%=65521}if(i!==(f<<16|h)>>>0)throw Error("invalid adler-32 checksum")}return t};var _=8;t("Zlib.Inflate",o),t("Zlib.Inflate.prototype.decompress",o.prototype.k);var C,L,z,B,j={ADAPTIVE:c.t,BLOCK:c.u};if(Object.keys)C=Object.keys(j);else for(L in C=[],z=0,j)C[z++]=L;for(z=0,B=C.length;B>z;++z)L=C[z],t("Zlib.Inflate.BufferType."+L,j[L])}.call(this),angular.module("hotissue.services",[]).factory("DownloadService",["$q","$http","IMUtil",function(t,i,e){function r(){{var r=t.defer();i.get(encodeURI("http://hotissue.imapp.kr/get.dat"),{responseType:"arraybuffer"}).success(function(t){try{var i=new Uint8Array(t),n=new Zlib.Inflate(i),s=n.decompress();r.resolve(e.ab2str(s))}catch(o){r.reject("error")}}).error(function(){r.reject("error")})}return r.promise}return{download:r}}]).factory("SiteService",function(){function t(){return["naver","daum","google","nate","zum"]}return{all:t}});