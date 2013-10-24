{
	// Attach to events...
	afterUpdate: function(element) {
		var inpElm = jQuery('#'+JWic.util.JQryEscape("${control.controlID}"));
		if (inpElm) {
			JWic.controls.InputBoxControl.initialize(inpElm,"${control.controlID}",$control.buildJsonOptions());
		}
	}, 
	destroy: function(element) {
		var inpElm =jQuery('#'+JWic.util.JQryEscape("${control.controlID}"));
		if (inpElm) {
			JWic.controls.InputBoxControl.destroy(inpElm);
		}
	}
}