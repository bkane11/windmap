(function() {
	var method;
	var noop = function () {};
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});

	while (length--) {
		method = methods[length];
		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}
}());

function makeTimestamp(prefix){
	return prefix += new Date().getTime()
}

$('.loading').data('inithtml', $('.loading').html());
function changeLoadingHTML(html){
	return $('.loading')
		.data('lasthtml', $('.loading').html())
		.html(html);
}

function fitImg(e){
  var img = e.data.target.find('img');
  var h = img.height(),
	  w = img.width(),
	  wh = $(window).height();
  img
	.css('margin-left', '-'+ (w/2 + $('.closer').width()/2) + 'px')
	  .parent()
		.css('margin', (wh - h)/2 + 'px auto')
		.parent()
		  .find('.closer')
			.hide()
			// .css('left', $(window).width()/2 + 'px')
			.css('margin-top', ((wh - h)/2 - 10) + 'px')
			.show()
}
function removeImage(cont){
	$(window).off('resize', fitImg)
		.off('orientationchange', fitImg)
	  if(cont){
	  	var img = cont.find('img');
	  	preparent = img.data('preparent'),
	  	preCSS = img.data('preCSS'),
		after = img.data('after');
	  	console.log(preparent, preCSS, after);
		if(preparent)
		  	img.insertBefore(after)
		  		.css('margin', preCSS)
		  		// .on('click', displayImage.bind(img[0]))
		  		.removeClass('fullsize');
		cont.stop().fadeOut(1000).delay(1000).remove();
	  }
}

function displayImage(src){
  var helper = $('<span></span>')
	.addClass('helper')
  var img = typeof src !=='string' ?
  	$(src) : // use the same img tag if it is what's being passed to the function
  	$(document.createElement('img'))
		.addClass('trans')
		.attr('src', src);

  if(img.hasClass('fullsize'))
  	return false

  img.data('preCSS', img.css('margin'))
	.data('preparent', img.parent())
	.data('after', img.next())
	.appendTo(helper)
	.addClass('fullsize')
	.on('load', {'target': helper}, fitImg)
	// .off('click', displayImage);

  var closer = $('<div>c  l  o  s  e</div>')
	.addClass('closer')
	.addClass('trans')
	.css('margin-top', '52px')
	// .hide()
	// .css({
	  // 'z-index': '1000'
	// })
	.on('click', function(){
	  removeImage(cont)
	})
  var cont = $('<div></div>')
	.addClass('fullSizeImageContainer')
	.addClass('fullcontainer')
	.addClass('trans')
	.addClass('image')
	.addClass('noBounce')
	.append(closer)
	.append(helper)
	.appendTo('body')
	.one('dblclick', function(){
	  removeImage(cont);
	})
	.one('contextmenu', function(){
	  removeImage(cont);
	})

  // $(window)
	// .on('resize', {'target': helper}, fitImg)
	// .on('orientationchange', {'target': helper}, fitImg)
	// .trigger('resize', {target: helper});
  // window.dispatchEvent(new Event('resize', {data:{target: helper}}));
}

function stopProp(e){
	e.preventDefault();
	e.stopPropagation();
	return e
}

function makeid(){
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for( var i=0; i < 5; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

// network connection
function checkConnection() {
	if(navigator.connection && navigator.connection.type){
	  var networkState = navigator.connection.type,
		states = {};
	  if(Connection){
		states[Connection.UNKNOWN]  = false;
		states[Connection.ETHERNET] = true;
		states[Connection.WIFI]	 = true;
		states[Connection.CELL_2G]  = true;
		states[Connection.CELL_3G]  = true;
		states[Connection.CELL_4G]  = true;
		states[Connection.CELL]	 = true;
		states[Connection.NONE]	 = false;
	  }
	  // console.log(states, navigator.connection.type, Connection);
	  if (states[networkState]) {
		  return true;
	  } else {
		return navigator.onLine
	  }
	}
	if(Object.keys(navigator).indexOf('onLine')!==-1)
		return navigator.onLine
	
	return true
}

function decodeFromBase64(input) {
  // input = input.replace(/\s/g, '');
  return atob(input);
}

function dataURItoBlob (dataURI) {
	// convert base64 to raw binary data held in a string
	// doesn't handle URLEncoded DataURIs
	var byteString;
	if (dataURI.split(',')[0].indexOf('base64') >= 0)
		byteString = atob(dataURI.split(',')[1]);
	else
		byteString = unescape(dataURI.split(',')[1]);
	// separate out the mime component
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	// write the bytes of the string to an ArrayBuffer
	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	// write the ArrayBuffer to a blob, and you're done
	return new Blob([ab],{type: mimeString});
}

// // fix bounce scroll on mobile
// function noBounceOnOverScroll(event) {
//   console.log(event)
//   // return;
//    if(event.target.parentNode.className.indexOf && event.target.className.indexOf)
// 	   if(event.target.parentNode.className.indexOf('noBounce') !== -1 || event.target.className.indexOf('noBounce') !== -1)//|| $(event.target).parents('.noBounce').length>0)
// 		event.preventDefault()
// }
// // if(document.addEventListener)
// //	 document.addEventListener('touchmove', noBounceOnOverScroll, false);
// // $(document).on('touchmove', noBounceOnOverScroll, false);

// function disableNoBounceForCordova(){
// 	$(document).off('touchmove', noBounceOnOverScroll);
// }

if(window.bouncefix)
	bouncefix.add('noBounce');

if(window.$){
	function autosize(){		
		// var wh = $(window).height();
		// $('#controls')
		// 	.removeClass('trans')
		// 	.height(wh-45)
		// 		.find('.autosize').height(wh-100);
		//  $('#controls').addClass('trans');
	}
	// Place any jQuery helper plugins in here.
	// function hideLoading(){
		// return $('.loading, #loading').fadeOut();
	// }
	// function showLoading(){
		// return $('.loading, #loading')
			// .html($('.loading').data('inithtml'))
			// .fadeIn();
	// }
	
	$('.loading').bind("dragstart", stopProp).bind("selectstart", stopProp);
	
	$.fn.insertAt = function(elements, index) {
		var children = this.children().clone(true);
		var array = $.makeArray(children);
		array.splice(index, 0, elements);
		this.empty().append(array);
		return this;
	};
	
	$.support.cors = true;
	
	$.fn.css2 = jQuery.fn.css;
	$.fn.css = function() {
		if (arguments.length) return jQuery.fn.css2.apply(this, arguments);
		var attr = ['font-family','font-size','font-weight','font-style','color',
		'text-transform','text-decoration','letter-spacing','word-spacing',
		'line-height','text-align','vertical-align','direction','background-color',
		'background-image','background-repeat','background-position',
		'background-attachment','opacity','width','height','top','right','bottom',
		'left','margin-top','margin-right','margin-bottom','margin-left',
		'padding-top','padding-right','padding-bottom','padding-left',
		'border-top-width','border-right-width','border-bottom-width',
		'border-left-width','border-top-color','border-right-color',
		'border-bottom-color','border-left-color','border-top-style',
		'border-right-style','border-bottom-style','border-left-style','position',
		'display','visibility','z-index','overflow-x','overflow-y','white-space',
		'clip','float','clear','cursor','list-style-image','list-style-position',
		'list-style-type','marker-offset'];
		var len = attr.length, obj = {};
		for (var i = 0; i < len; i++) 
			obj[attr[i]] = jQuery.fn.css2.call(this, attr[i]);
		return obj;
	}
//code to add show/hide custom event triggers
  $.each(['show', 'hide'], function (i, ev) {
	var el = $.fn[ev];
	$.fn[ev] = function () {
	  this.trigger(ev);
	  return el.apply(this, arguments);
	};
  });
}

if (!Object.keys) {
  Object.keys = (function () {
	'use strict';
	var hasOwnProperty = Object.prototype.hasOwnProperty,
		hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
		dontEnums = [
		  'toString',
		  'toLocaleString',
		  'valueOf',
		  'hasOwnProperty',
		  'isPrototypeOf',
		  'propertyIsEnumerable',
		  'constructor'
		],
		dontEnumsLength = dontEnums.length;
	return function (obj) {
	  if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
		throw new TypeError('Object.keys called on non-object');
	  }

	  var result = [], prop, i;

	  for (prop in obj) {
		if (hasOwnProperty.call(obj, prop)) {
		  result.push(prop);
		}
	  }
	  if (hasDontEnumBug) {
		for (i = 0; i < dontEnumsLength; i++) {
		  if (hasOwnProperty.call(obj, dontEnums[i])) {
			result.push(dontEnums[i]);
		  }
		}
	  }
	  return result;
	};
  }());
}
	
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function (searchElement, fromIndex) {
	  if ( this === undefined || this === null ) {
		throw new TypeError( '"this" is null or not defined' );
	  }

	  var length = this.length >>> 0; // Hack to convert object.length to a UInt32

	  fromIndex = +fromIndex || 0;

	  if (Math.abs(fromIndex) === Infinity) {
		fromIndex = 0;
	  }

	  if (fromIndex < 0) {
		fromIndex += length;
		if (fromIndex < 0) {
		  fromIndex = 0;
		}
	  }

	  for (;fromIndex < length; fromIndex++) {
		if (this[fromIndex] === searchElement) {
		  return fromIndex;
		}
	  }

	  return -1;
	};
  }
if (!Array.prototype.some){
  Array.prototype.some = function(fun /*, thisArg */)
  {
	'use strict';

	if (this === void 0 || this === null)
	  throw new TypeError();

	var t = Object(this);
	var len = t.length >>> 0;
	if (typeof fun !== 'function')
	  throw new TypeError();

	var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
	for (var i = 0; i < len; i++)
	{
	  if (i in t && fun.call(thisArg, t[i], i, t))
		return true;
	}

	return false;
  };
}

if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (callback, thisArg) {

	var T, k;

	if (this == null) {
	  throw new TypeError(" this is null or not defined");
	}

	// 1. Let O be the result of calling ToObject passing the |this| value as the argument.
	var O = Object(this);

	// 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
	// 3. Let len be ToUint32(lenValue).
	var len = O.length >>> 0;

	// 4. If IsCallable(callback) is false, throw a TypeError exception.
	// See: http://es5.github.com/#x9.11
	if (typeof callback !== "function") {
	  throw new TypeError(callback + " is not a function");
	}

	// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
	if (thisArg) {
	  T = thisArg;
	}

	// 6. Let k be 0
	k = 0;

	// 7. Repeat, while k < len
	while (k < len) {

	  var kValue;

	  // a. Let Pk be ToString(k).
	  //   This is implicit for LHS operands of the in operator
	  // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
	  //   This step can be combined with c
	  // c. If kPresent is true, then
	  if (k in O) {

		// i. Let kValue be the result of calling the Get internal method of O with argument Pk.
		kValue = O[k];

		// ii. Call the Call internal method of callback with T as the this value and
		// argument list containing kValue, k, and O.
		callback.call(T, kValue, k, O);
	  }
	  // d. Increase k by 1.
	  k++;
	}
	// 8. return undefined
  };
}

var mimes = {
	// image files
	'png' : 'image/png',
	'jpg' : 'image/jpeg',
	'gif' : 'image/gif'
	// other file types
	// 'pdf' : 'application/pdf',
	// 'doc' : 'application/msword',
	// 'docx' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	// 'xls' : 'application/vnd.ms-excel',
	// 'xlxs' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	// 'mp4' : 'video/mp4',
	// 'mpeg-4' : 'video/mp4',
	// 'mpeg' : 'video/mpeg',
	// 'mov' : 'video/quicktime',
	// 'mp3' : 'audio/mpeg'
}