{
	//Tab Strip
	afterUpdate: function(element) {
	#if($control.visible)
		var tabStrip = JWic.$('${control.controlID}');
		JWic.controls.TabStrip.initialize(tabStrip, "${control.controlID}", $control.buildJsonOptions());
	#end
	}
}