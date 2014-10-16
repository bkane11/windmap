var vidimgs = {
	// SF
	"OB-Kelly's Cove" : function(){ 
			return $("<img src='http://ob-kc.com/images/current_sm.jpg?" + new Date().getTime() +"'/>")
				.on('click', function(){
					displayImage(this);
				}).css('cursor', 'pointer') ;
	},
	"OB Fulton" : function(){ 
			return $("<img src='http://camstills.cdn-surfline.com/oceanbeachncam/latest_small.jpg?" + new Date().getTime() +"'/>")
				.on('click', function(){
					displayImage(this);
				}).css('cursor', 'pointer') ;
	},
	"SF Zoo" : function(){ 
			return $("<img src='http://camstills.cdn-surfline.com/obsfsouthcam/latest_small.jpg?" + new Date().getTime() +"'/>")
				.on('click', function(){
					displayImage(this);
				}).css('cursor', 'pointer') ;
	},
	// santa cruz
	"Santa Cruz Boardwalk" : function(){ 
			return $("<img src='http://camstills.cdn-surfline.com/steamercam/latest_small.jpg?" + new Date().getTime() +"'/>")
				.on('click', function(){
					displayImage(this);
				}).css('cursor', 'pointer') ;
	},
	"East Cliff" : function(){ 
			return $("<img src='http://camstills.cdn-surfline.com/pleasureptcam/latest_small.jpg?" + new Date().getTime() +"'/>")
				.on('click', function(){
					displayImage(this);
				}).css('cursor', 'pointer') ;
	},
	// Ventura
	"Surfer's Point at Seaside Park" : function(){ 
			return $("<img src='http://camstills.cdn-surfline.com/venturacam/latest_small.jpg?" + new Date().getTime() +"'/>")
				.on('click', function(){
					displayImage(this);
				}).css('cursor', 'pointer') ;
	},
	// Malibu
	"Malibu Hills" : function(){ 
			return $("<img src='http://camstills.cdn-surfline.com/malibucam/latest_small.jpg" + "?" + new Date().getTime() +"'/>")
				.on('click', function(){
					displayImage(this);
				}).css('cursor', 'pointer') ;
	}
}