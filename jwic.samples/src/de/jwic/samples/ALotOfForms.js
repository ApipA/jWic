{
	afterUpdate:function(e){
		var id = '${control.controlID}'
		console.log(id);
			
		var button = jQuery('#buttonTest');
		
		button.click(function(e){
			JWic.fireAction(id,'timestamp_start',new Date().getTime());
			
			
			for(var i =0;i<100;i++)
				JWic.fireAction(id,'test','');
			
			
			JWic.fireAction(id,'timestamp_stop',new Date().getTime());
		});
	}



}