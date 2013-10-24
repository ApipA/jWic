{ //NummericInputControl.js
	
	afterUpdate: function(element) {
		var inpElm = jQuery('#'+JWic.util.JQryEscape("${control.controlID}"));
		JWic.controls.NumericInputControl.initialize(inpElm, "${control.controlID}", $control.buildJsonOptions());
	}, 
	
	destroy: function(element) {
		var inpElm =jQuery('#'+JWic.util.JQryEscape("${control.controlID}"));
		JWic.controls.NumericInputControl.destroy(inpElm);
	}
}