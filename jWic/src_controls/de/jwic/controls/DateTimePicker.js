{
	afterUpdate: function(element){
		var inpElm = jQuery('#'+JWic.util.JQryEscape("${control.controlID}"));
		var options = $control.buildJsonOptions(); 
		JWic.controls.DateTimePicker.initialize(inpElm, '${control.controlID}', options);
	}
}