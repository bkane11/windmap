/*jslint browser: true*/
/*global L */
var app = window.app = app || {};

function showloading(){
	$('.appName').addClass('loading');
}
function hideloading(){
	$('.appName.loading').removeClass('loading');
}

var vendorprefix = (function () {
  var styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice
      .call(styles)
      .join('') 
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1],
    dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
  return {
    dom: dom,
    lowercase: pre,
    css: '-' + pre + '-',
    js: pre[0].toUpperCase() + pre.substr(1)
  };
})();

// direct from site
function switch_tab(model_id, active_tab) {var models=document.getElementsByTagName("div"); for(var i = 0; i < models.length; i++){var m=models[i]; if (m.className=="model_container"){if(m.id==("Data_" + model_id)){m.style.display="block";}else{m.style.display="none";}}}  var tabs=document.getElementsByTagName("td");  for (i=0;i<tabs.length;i++){var t=tabs[i];if(t.className=="selected"){t.className="tab";break;}} document.getElementById("Tab_" + model_id).className = "selected"; } 
function toggle_extra_info() { var elements=document.getElementsByTagName("tr"); for(var i = 0; i < elements.length; i++) { var e = elements[i]; if (e.id == "extra_info") { if (e.style.display == "none") { e.style.display = ""; } else { e.style.display = "none"; } } } var links=document.getElementsByName("additional_data"); for(var i=0;i<links.length;i++){var l=links[i];if(l.innerHTML=="Show Additional Data"){l.innerHTML="Hide Additional Data";}else{l.innerHTML="Show Additional Data";}}} 
function switch_extended() { var n=document.getElementById("Extended_Native");var h=document.getElementById("Extended_Hourly");var l=document.getElementById("switch_extended");if(n.style.display=='block'){n.style.display="none";h.style.display="block";l.innerHTML="Fewer Hours";document.cookie="qlvt=1;expires=Tue, 31 Dec 2030 00:00:00 UTC";}else{n.style.display="block";h.style.display="none";l.innerHTML="More Hours"; document.cookie="qlvt=0;expires=Tue, 31 Dec 2030 00:00:00 UTC";} } 

function loadMeteogram(container, url){
	showloading();
	container = $(container);
      $.getJSON("http://query.yahooapis.com/v1/public/yql?"+
                "q=select%20*%20from%20html%20where%20url%3D%22"+
                encodeURIComponent(url)+
                "%22&format=xml'&callback=?",
        function(data){
          if(data.results[0]){
			var closer = $('<div class="closer">close</div>').on('click', function(){
				$(this).closest('.removeme').remove();
			})
            var data = filterData(data.results[0]);
			var html = $(data).find('.meteogram').css('width', '100%');
			html.find(' > :not(table, .heading, .model_container)').remove();
			html.find('a[href]:not([href^=javascript])')
				.attr('target', '_blank')
				.each(function(){
					$(this).attr('href', "http://www.iwindsurf.com/" + $(this).attr('href'));
				})

			displayImage(html)
    //         container.html(html)
				// .addClass('removeme')
				// .appendTo(document.body)
				// // .find('.meteogram')
				// 	.prepend(closer);
          } else {
            var errormsg = '<p>Error: could not load the page.</p>';
            container.html(errormsg);
          }
		  hideloading();
        }
      )
}
function filterData(data){
	data = data.replace(/<?\/body[^>]*>/g,'');
	data = data.replace(/[\r|\n]+/g,'');
	data = data.replace(/<--[\S\s]*?-->/g,'');
	data = data.replace(/<noscript[^>]*>[\S\s]*?<\/noscript>/g,'');
	data = data.replace(/<script[^>]*>[\S\s]*?<\/script>/g,'');
	data = data.replace(/<script.*\/>/,'');
	data = data.replace(/src="/g, 'src="http://www.iwindsurf.com/');
	// data = data.replace(/href="/g, 'src="http://www.iwindsurf.com/');
	return data;
}

(function (window, document, L, app, undefined) {
	'use strict';
	var transform = vendorprefix.css + 'transform';
	var windJSONurlBase = 'http://www.iwindsurf.com/json/dyn_weatherstation.php?region_id=1669&units=mph&tunits=F',
		proxyURL = 'https://jsonp.nodejitsu.com/?url='
	
	function getWindJSONurl(){
		var bounds = map.getBounds();
		return windJSONurlBase + '&minLat=' + bounds.getSouth() + '&minLon=' + bounds.getWest() + '&maxLat=' + bounds.getNorth() + '&maxLon=' + bounds.getEast() + '&zoomLevel=' + map.getZoom()// + '&callback=?'
	}
	
	function removeStations(layer){
		layer = layer || app.stations;
		if(layer)
			map.removeLayer(layer);
	}
	function addStations(){
		return L.layerGroup().addTo(map);
	}
	
	function processWindJSON(res){
		if(res.statusText==='abort') return
		removeStations();
		var stations = app.stations = addStations();
		var json =  JSON.parse(JSON.parse(res.responseText).error.split('//Total time:')[0]) ; // hacky way using the nodejistsu proxy
		console.log(json[0]);
		$.each(json, function(){
			var direction = this.sensorReadings.length > 0 ? this.sensorReadings[0].direction : '',
				avg = this.sensorReadings.length > 0 ? this.sensorReadings[0].average : '',
				gust = this.sensorReadings.length > 0 ? this.sensorReadings[0].gust : '',
				temp = this.sensorReadings.length > 0 ? this.sensorReadings[0].temperature : '',
				fullname = this.fullName || '',
				shortname = this.fullName || '';
				var mouseover = direction + (avg ? ', avg: ' + avg : '') + (gust ? ', gust: ' + gust : '');
				if(!mouseover) return
				var size = (parseFloat(avg) || 1) * 2;
				var gustsize = gust ? parseFloat(gust) * 2 : size;
				var scaledsize = size/((gustsize-size)*2);
				var vidimg;
				if(window.vidimgs)
					vidimg = vidimgs[this.id] || vidimgs[this.fullName];
				// var html = '<div class="station trans" title="' + shortname + ' ' + (mouseover || 'no data') +'" style="font-size:'+ size +'px; ">&#10148;</div>';
				var transspeed = 1/Math.abs(size-gustsize)*10;
				var html = '<div class="station" title="' + shortname + ' ' + (mouseover || 'no data') +'" style="font-size:'+ size +'px; transition: all '+transspeed+'s linear;">&#10148;</div>';
				var color;
					if (direction.indexOf('E')!==-1 || direction === 'N') color = 'green';
					if (direction.indexOf('W')!==-1) color = 'red';
					if(!color) color = 'gray';
			var icon = L.divIcon({
				html: html,
				iconsSize: [size, size],
				iconAnchor: [size/2-3, size],
				className: ['direction',direction, color].join(' ')
			});
			var stationurl = 'http://www.iwindsurf.com/windandwhere.iws?regionID=1669&ISection=Forecast+Graphs&location_id=' + this.id;
			var meteogram = $('<div class="fullcontainer meteogram-container"></div>')
			var showmeteogram = $('<a class="showmeteogram">Show Meteogram</a>')
				.on('click', function(){loadMeteogram(meteogram, stationurl)})
			// if(vidimg) console.log(vidimg);
			var info = $('<div><h3>' + fullname + '</h3></div>')
				.append(mouseover)
				.append(temp ? '<br/>' + temp + '&deg;' : '')
				.append(vidimg ? vidimg instanceof Function ?  vidimg() : vidimg : '')
				.append('<a target="_blank" href="' + stationurl + '"> forecast </a>')
				.append(showmeteogram)
				// .append(meteogram);
			
			var marker = L.marker([this.baseLat, this.baseLon], {icon: icon})
				.bindPopup( info[0] )
				.on('mouseover', function(){
					this.infocus = true;
					var el = $(this._icon).find('div')
						.css('text-shadow', color + ' ' + (gustsize - size) + 'px 0px 0px')
					// if(scaledsize)
						// el
						// .data(transform, el.data(transform) || el.css(transform))
						// .css(transform, ( el.data('transform') ||  el.css(transform) + ' scale('+ scaledsize +')') )
				})
				.on('mouseout', function(){
					this.infocus = false;
					var el = $(this._icon).find('div')
						.css('text-shadow', '')
					// if(scaledsize)
						// el.css(transform, el.data(transform))
				})
				.addTo(stations);
			// start the animation randomly so not all arrows move at the same time
			if(size!==gustsize)
				setTimeout(function(){
					var animate = setInterval( function(){
						if(!marker || (marker && !map.hasLayer(marker)) )
							clearInterval(animate)
						var distance;
						if(!marker.infocus)
							distance = marker._gusted || 0;
							distance = distance === 2 ? 0 : distance += 1,
							$(marker._icon).find('div')
								// .css(vendorprefix.css+'text-stroke-color', [2,0].indexOf(distance)!==-1 ? 'transparent' : color )
								// .css(vendorprefix.css+'text-stroke-width', Math.abs(2-distance) )
								.css('text-shadow', ([2,0].indexOf(distance)!==-1 ? 'transparent ' + (gustsize - size)*distance + 'px 0px 0px' : color + ' ' + (gustsize - size)*distance + 'px 0px 0px' ) ),
							marker._gusted = distance
					// }, 3000)
					}, transspeed*1000)
				// },  Math.round(Math.random()*3000) + 1);
				},  transspeed*1000);
		})
		hideloading();
	}
	
	function addMarker(marker){
		this.addLayer(marker);
	}
	function removeMarker(marker){
		if(this.hasLayer(marker))
			this.removeLayer(marker);
	}
	function getWindJSON(url){
		if(app.ajaxCall) app.ajaxCall.abort();
		app.ajaxCall = $.get( proxyURL + encodeURIComponent(url), processWindJSON )
			.success( function(data){processWindJSON(data) })
			.error( function(data){processWindJSON(data) })
	}
	
	function loadStations(){
		if(map.hasPopup)return false
		showloading();
		getWindJSON( getWindJSONurl() );
	}
	
	/* create leaflet map */
	var map = app.map = L.map('map', {
		center: [37.83853, -122.39182],
		zoom: 10,
		minZoom: 6
	})
	.on('popupopen',  function(){this.hasPopup = true})
	.on('popupclose',  function(){this.hasPopup = false})
	.on('moveend',  loadStations)
	.on('zoomend',  loadStations);
	
	L.control.locate().addTo(map);
	var geocoderOptions = {position: 'topleft', showResultIcons: true}
	var geocoder = L.Control.geocoder(geocoderOptions).addTo(map);
	geocoder.markGeocode = function(result) {
		var bbox = result.bbox;
		map.fitBounds(bbox);
	};

	loadStations();

	/* add default stamen tile layer */
	var watercolor = new L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png', {
		minZoom: 0,
		maxZoom: 20,
		maxNativeZoom: 18,
		attribution: 'Map data © <a href="http://www.openstreetmap.org">OpenStreetMap contributors</a>'
	}).addTo(map);

	app.reloadInterval = setInterval( loadStations, 60000) // reload every minute
	
	// $('.closer').on('click', function(){
		// $(this).closest('.removeme').remove();
	// })

}(window, document, L, app));