{
	afterUpdate: function(element) {
		JWic.controls.Menu.initialize("${control.controlID}", $control.buildJsonOptions())
	},
	destroy : function(element) {
		JWic.controls.Menu.destroy("$control.controlID");
	}
}