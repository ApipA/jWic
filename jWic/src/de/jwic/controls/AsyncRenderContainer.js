{
	// Attach to events...
	afterUpdate: function(element) {
		
		var seqNumFld = jQuery('seqnum_${control.controlID}');
		var param = {};
		param["seqNum"] = seqNumFld.value;
		
		JWic.resourceRequest('$control.controlID', function(ajaxResponse) {
			try {
				JWic.log("AsyncRenderingStart ");
				var elm = jQuery.parseJSON(ajaxResponse.responseText);
				
				var seqNumFld = jQuery('seqnum_${control.controlID}');
				if (seqNumFld.value != elm.seqNum) {
					JWic.log("Invalid seqNum - skipping update (" + seqNumFld.value + "; received: " + elm.seqNum + ")");
					return;
				}
								
				//var control = jQuery('arc_${control.controlID}');
				var control = jQuery("#arc_" + JQryEscape('${control.controlID}')).get(0);
				JWicInternal.updateControl(elm, control);

			} catch (x) {
				JWic.log("Error in AsyncRenderStart: " + x);
			}
		}, param);
		
	}, 
	
	destroy: function(element) {
		
	}
}