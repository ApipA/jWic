{
	// Attach to events...
	afterUpdate: function(element) {
	#if($control.visible)
		var link = JWic.$('${control.controlID}'),
			options = $control.buildJsonOptions();
		
		if (link) {
			JWic.controls.AnchorLink.initialize(link, "${control.controlID}", options);
		}
	#end
	}
}