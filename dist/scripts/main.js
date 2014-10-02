function showloading(){$(".appName").addClass("loading")}function hideloading(){$(".appName.loading").removeClass("loading")}function switch_tab(e){for(var t=document.getElementsByTagName("div"),o=0;o<t.length;o++){var n=t[o];"model_container"==n.className&&(n.style.display=n.id=="Data_"+e?"block":"none")}var a=document.getElementsByTagName("td");for(o=0;o<a.length;o++){var i=a[o];if("selected"==i.className){i.className="tab";break}}document.getElementById("Tab_"+e).className="selected"}function toggle_extra_info(){for(var e=document.getElementsByTagName("tr"),t=0;t<e.length;t++){var o=e[t];"extra_info"==o.id&&(o.style.display="none"==o.style.display?"":"none")}for(var n=document.getElementsByName("additional_data"),t=0;t<n.length;t++){var a=n[t];a.innerHTML="Show Additional Data"==a.innerHTML?"Hide Additional Data":"Show Additional Data"}}function switch_extended(){var e=document.getElementById("Extended_Native"),t=document.getElementById("Extended_Hourly"),o=document.getElementById("switch_extended");"block"==e.style.display?(e.style.display="none",t.style.display="block",o.innerHTML="Fewer Hours",document.cookie="qlvt=1;expires=Tue, 31 Dec 2030 00:00:00 UTC"):(e.style.display="block",t.style.display="none",o.innerHTML="More Hours",document.cookie="qlvt=0;expires=Tue, 31 Dec 2030 00:00:00 UTC")}function loadMeteogram(e,t){showloading(),e=$(e),$.getJSON("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22"+encodeURIComponent(t)+"%22&format=xml'&callback=?",function(t){if(t.results[0]){var t=filterData(t.results[0]),o=$(t).find(".meteogram");e.html(o).css("margin-bottom","-100px"),o.find(" > :not(table, .heading, .model_container)").remove(),$(".leaflet-popup-content").width(500)}else{var n="<p>Error: could not load the page.</p>";e.html(n)}hideloading()})}function filterData(e){return e=e.replace(/<?\/body[^>]*>/g,""),e=e.replace(/[\r|\n]+/g,""),e=e.replace(/<--[\S\s]*?-->/g,""),e=e.replace(/<noscript[^>]*>[\S\s]*?<\/noscript>/g,""),e=e.replace(/<script[^>]*>[\S\s]*?<\/script>/g,""),e=e.replace(/<script.*\/>/,""),e=e.replace(/src="/g,'src="http://www.iwindsurf.com/')}var app=window.app=app||{},vendorprefix=function(){var e=window.getComputedStyle(document.documentElement,""),t=(Array.prototype.slice.call(e).join("").match(/-(moz|webkit|ms)-/)||""===e.OLink&&["","o"])[1],o="WebKit|Moz|MS|O".match(new RegExp("("+t+")","i"))[1];return{dom:o,lowercase:t,css:"-"+t+"-",js:t[0].toUpperCase()+t.substr(1)}}();!function(e,t,o,n){"use strict";function a(){var e=m.getBounds();return c+"&minLat="+e.getSouth()+"&minLon="+e.getWest()+"&maxLat="+e.getNorth()+"&maxLon="+e.getEast()+"&zoomLevel="+m.getZoom()}function i(e){e=e||n.stations,e&&m.removeLayer(e)}function s(){return o.layerGroup().addTo(m)}function r(e){if("abort"!==e.statusText){i();var t=n.stations=s(),a=JSON.parse(JSON.parse(e.responseText).error.split("//Total time:")[0]);$.each(a,function(){var e=this.sensorReadings.length>0?this.sensorReadings[0].direction:"",n=this.sensorReadings.length>0?this.sensorReadings[0].average:"",a=this.sensorReadings.length>0?this.sensorReadings[0].gust:"",i=this.fullName||"",s=this.fullName||"",r=e+(n?", avg: "+n:"")+(a?", gust: "+a:"");if(r){var d,l=2*(parseFloat(n)||1),c=a?2*parseFloat(a):l,p=1/Math.abs(l-c)*10,u='<div class="station" title="'+s+" "+(r||"no data")+'" style="font-size:'+l+"px; transition: all "+p+'s linear;">&#10148;</div>';(-1!==e.indexOf("E")||"N"===e)&&(d="green"),-1!==e.indexOf("W")&&(d="red"),d||(d="gray");var h=o.divIcon({html:u,iconsSize:[l,l],iconAnchor:[l/2-3,l],className:["direction",e,d].join(" ")}),g="http://www.iwindsurf.com/windandwhere.iws?regionID=1669&ISection=Forecast+Graphs&location_id="+this.id,f=$('<div class="meteogram-container"></div>'),v=$('<a class="showmeteogram">Show Meteogram</a>').on("click",function(){loadMeteogram(f,g)}),w=$("<div><h3>"+i+"</h3></div>").append(r).append('<a target="_blank" href="'+g+'"> forecast </a>').append(v).append(f),x=o.marker([this.baseLat,this.baseLon],{icon:h}).bindPopup(w[0]).on("mouseover",function(){this.infocus=!0;$(this._icon).find("div").css("text-shadow",d+" "+(c-l)+"px 0px 0px")}).on("mouseout",function(){this.infocus=!1;$(this._icon).find("div").css("text-shadow","")}).addTo(t);l!==c&&setTimeout(function(){var e=setInterval(function(){(!x||x&&!m.hasLayer(x))&&clearInterval(e);var t;x.infocus||(t=x._gusted||0),t=2===t?0:t+=1,$(x._icon).find("div").css("text-shadow",-1!==[2,0].indexOf(t)?"transparent "+(c-l)*t+"px 0px 0px":d+" "+(c-l)*t+"px 0px 0px"),x._gusted=t},1e3*p)},1e3*p)}}),hideloading()}}function d(e){n.ajaxCall&&n.ajaxCall.abort(),n.ajaxCall=$.get(p+encodeURIComponent(e),r).success(function(e){r(e)}).error(function(e){r(e)})}function l(){return m.hasPopup?!1:(showloading(),void d(a()))}var c=(vendorprefix.css+"transform","http://www.iwindsurf.com/json/dyn_weatherstation.php?region_id=1669&units=mph&tunits=F"),p="https://jsonp.nodejitsu.com/?url=",m=n.map=o.map("map",{center:[37.83853,-122.39182],zoom:10,minZoom:6}).on("popupopen",function(){this.hasPopup=!0}).on("popupclose",function(){this.hasPopup=!1}).on("moveend",l).on("zoomend",l);o.control.locate().addTo(m);var u={position:"topleft",showResultIcons:!0},h=o.Control.geocoder(u).addTo(m);h.markGeocode=function(e){var t=e.bbox;m.fitBounds(t)},l();new o.tileLayer("http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png",{minZoom:0,maxZoom:20,maxNativeZoom:18,attribution:'Map data © <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a>'}).addTo(m);n.reloadInterval=setInterval(l,6e4)}(window,document,L,app);