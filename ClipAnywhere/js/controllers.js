var isPhoneGap;angular.module("starter.controllers",[]).controller("ListCtrl",function(m,f,a,e,l,k,j){function g(){if(window.plugins&&window.plugins.AdMob){var q="a151e6d43c5a28f";var r="ca-app-pub-3241952602337815/5472106633";var p="a14d161d31d73a4";var n=(navigator.userAgent.indexOf("Android")>=0)?r:q;var o=window.plugins.AdMob;o.createBannerView({publisherId:n,adSize:o.AD_SIZE.SMART_BANNER,bannerAtTop:false},function(){o.requestAd({isTesting:false},function(){o.showAd(true)},function(){console.log("failed to request ad")})},function(){console.log("failed to create banner view")})}else{console.log("AdMob plugin not available/ready.")}}function b(){m.clip.key="";key=window.localStorage.getItem("key");console.log(key);if(key&&key!=""){m.clip.key=parseInt(key)}else{m.clip.key=Math.floor(Math.random()*89999+10000);window.localStorage.setItem("key",m.clip.key)}}function h(){json=window.localStorage.getItem("values");m.items=JSON.parse(json);if(!m.items){m.items=[]}console.log("loadValue:"+JSON.stringify(m.items))}function c(n){if(n.length>5){n.shift()}console.log("setValue:"+JSON.stringify(n));window.localStorage.setItem("values",JSON.stringify(n))}function d(n){window.prompt("Copy to clipboard: Ctrl+C, Enter",n)}isPhoneGap=(document.location.protocol=="file:");k.ready(function(){g()});if(!isPhoneGap){m.google='<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"><\/script><ins class="adsbygoogle" style="display:inline-block;width:728px;height:90px" data-ad-client="ca-pub-3241952602337815" data-ad-slot="5779831039"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});<\/script>'}m.clip={};m.send={};h();b();m.adsense=function(){return j.trustAsHtml(m.google)};m.Send=function(){window.localStorage.setItem("key",m.clip.key.toString());f.show({template:"Posting..."});e.send(m.clip.key,m.send.value).success(function(p,n,q,o){f.hide();f.show({template:"Successfully posted!",duration:2000})}).error(function(p,n,q,o){a.alert({title:"Error",template:"Network problem occurred"});f.hide()})};m.Receive=function(){window.localStorage.setItem("key",m.clip.key.toString());f.show({template:"Loading..."});e.receive(m.clip.key).success(function(p,n,q,o){if(p.v==null){a.alert({title:"Error",template:"Data not found"})}else{exist=false;for(i in m.items){if(m.items[i].k==m.clip.key){m.items[i].v=p.v;exist=true;break}}if(!exist){m.items.push(p)}c(m.items)}f.hide()}).error(function(p,n,q,o){a.alert({title:"Error",template:"Network problem occurred"});f.hide()})};m.Delete=function(n,o){m.items.forEach(function(p){console.log("Delete:"+JSON.stringify(p))});m.items=m.items.filter(function(p){return p.k!=o.k});c(m.items);m.items.forEach(function(p){console.log("Delete2:"+JSON.stringify(p))})};m.Action=function(n){l.show({buttons:[{text:"Copy to clipboard"},{text:"Open browser"},{text:"Google Search"}],cancelText:"Cancel",cancel:function(){},buttonClicked:function(o){switch(o){case 0:if(!isPhoneGap){d(n)}break;case 1:if(!isPhoneGap){window.location.href=n}break;case 2:if(!isPhoneGap){window.location.href="http://www.google.com/search?q="+n}break}return true}})}});