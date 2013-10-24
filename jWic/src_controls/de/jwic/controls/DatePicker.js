{
	afterUpdate: function(element){
		var inpElm = jQuery('#'+JWic.util.JQryEscape("${control.controlID}"));
		JWic.controls.DatePicker.initialize(inpElm,'${control.controlID}', $control.buildJsonOptions());
	}
}