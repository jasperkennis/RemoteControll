/**
 * InterfaceScreen
 * 
 * The InterfaceScreen class represents a single screen and contains
 * its controls.
 * 
 * @param controls An array of the controls to construct.
 */
function InterfaceScreen(controls){
	this.controls = Array(); // Contains the controls that are on this screen.
	
	
	
	/**
	 * init
	 * 
	 * Initializes the interface screen.
	 * 
	 * @param controls An array of controls to construct.
	 */
	this.init = function(controls){
		controls.each(function(control){
			//log(control);
			
			
		});
	}
	
	
	
	/**
	 * createControll
	 * 
	 * Constructs a single control and adds it to the controls array.
	 * 
	 * @param control An object representing a control.
	 */
	this.addControll = function(control){
		
	}
	
	// Run init per default.
	this.init(controls);
}






/**
 * Control
 * 
 * Class that represents a control on a screen.
 * 
 * @param control The control that is to be created and represented.
 */
function Control(control){
	this.init = function(control){}
	
	this.init();
}






/**
 * InterfaceController
 * 
 * The InterfaceController class is a singleton that is used for the
 * construction of all interfaces and their actions. It is only used
 * if an interface is present.
 */
var InterfaceController = {
	screens: Array(),
	
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
		
		var interface_screen = new InterfaceScreen(_interface[0].layout.tabpage.control);
		self.screens.push(interface_screen);
		
		// Build all elements:
		/*_interface[0].layout.tabpage.control.each(function(widget){
			self.buildWidget(
				'led',
				{ w: widget.w, h: widget.h },
				{ x: widget.x, y: widget.y },
				widget.color,
				widget.name,
				false);
		});*/
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