var InterfaceController = {
	initInterface: function(){
		
		// Define self to prevent conflicts with frameworks
		if(!self){ var self = this; }
		
		
		
		/*
		 * If an interfaces JSON string is defined, the original screen
		 * contents are removed, and the JSON string is parsed into an
		 * object, which is than used to create that interface.
		 */
		
		if($('interfaces').innerText.isJSON()){
			
			// Parse the JSON string into an object before clearing body
			var interfaces = $('interfaces').innerText.evalJSON().interfaces;
			
			// Remove all elements from body
			$$('body')[0].childElements().each(function(e){
				e.remove();
			});
			
			// See if iteration is needed:
			if(interfaces.length > 1) {
				// Iterate over and build all the layouts
				interfaces.each(function(layout){
					self.processInterface(layout);
				});
			} else {
				var layout = interfaces;
				self.processInterface(layout);
			}

		} else {
			alert("This interface is broken. Unfortunately, you can't use this application right now.");
			log($('interfaces'));
		}
	},
	
	
	
	/**
	 * processInterface
	 * Iterates over all widgets in an interface and calls
	 * buidWidget on them.
	 * 
	 * @param _interface The interface to process
	 */
	processInterface : function(_interface){
		if(!self){ var self = this; }
		
		log(_interface[0].layout);
		// Build all elements:
		_interface[0].layout.tabpage.control.each(function(widget){
			self.buildWidget(
				'led',
				{ w: widget.w, h: widget.h },
				{ x: widget.x, y: widget.y },
				widget.color,
				widget.name,
				false);
			//log(widget);
		});
	},
	
	
	
	/**
	 * buildWidget
	 * Takes a number of arguments and constructs the
	 * correct widget.
	 */
	buildWidget: function(type,size,position,color,name,relative){
		
		// Define self to prevent conflicts with frameworks
		if(!self){ var self = this; }
		
		/*
		 * Create a widget that responds to user input. Uses the
		 * paramaters destilled from the TouchOSC file.
		 */
		
		switch(type){
			case 'led':
				break;
			default:
				break;
		}
	}
}

function log(text){
	if(console){
		console.log(text);
	}
}

document.observe("dom:loaded", function(){
	
	// If we're looking at an interface
	if($('interfaces') != undefined){
		InterfaceController.initInterface();
	}
});