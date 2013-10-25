/**
 * ErrorWarning.js
 */
{
	afterUpdate: function(element) {
		var me = jQuery('#'+JWic.util.JQryEscape('${control.controlID}'));
		JWic.controls.ErrorWarning.initialize(me,'${control.controlID}',$control.buildJsonOptions());
	}
}