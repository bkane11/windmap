var vidimgs = {
	"OB-Kelly's Cove" : function(){ 
			return $("<img src='http://ob-kc.com/images/current_sm.jpg?" + new Date().getTime() +"'/>")
				.on('click', function(){
					displayImage(this);
				}).css('cursor', 'pointer') ;
		}
}