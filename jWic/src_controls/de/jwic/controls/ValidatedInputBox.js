//ValidatedInputBox
{
	afterUpdate:function(){
		#if($control.visible)
			var options = $control.buildJsonOptions();
			var control = JWic.$('${control.controlID}');
			JWic.controls.ValidatedInputBox.initialize(control,'${control.controlID}',options);
		#end
	}
}
