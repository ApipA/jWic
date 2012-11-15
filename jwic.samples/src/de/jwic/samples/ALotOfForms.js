{
	afterUpdate:function(e){
		var id = '${control.controlID}'
		console.log(id);
			
		var button = jQuery('#buttonTest');
		
		button.click(function(e){
			for(var i =0;i<100;i++)
				JWic.fireAction(id,'test','');
		});
	}



}