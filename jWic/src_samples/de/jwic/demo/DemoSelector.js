{
	
	beforeUpdate: function() {
		// might be used to clean up some stuff..
	},

	afterUpdate: function(element) {
		jQuery(element).find(".demo_module_selector").accordion();
	},
	
	destroy: function(element) {

	}
}