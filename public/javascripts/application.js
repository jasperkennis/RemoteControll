/**
 * Defenition of globals, and their getters and setters
 */

/* Debug */
var debug;
function setDebug(_debug){
	if(!_debug){ var _debug = false; } 
	debug = _debug;
}
function getDebug(){ return window.debug; }



/**
 * Setting non default globals
 */

setDebug(true);



/**
 * Non program funcions
 */

/**
 * Log 
 */
function log(type,text){
	if(console && getDebug()){
		switch(type){
			case 'error':
				console.error(text);
				break;
			case 'info':
				console.info(text);
				break;
			case 'warn':
				console.warn(text);
				break;
			case 'error':
				console.error(text);
				break;
			default:
				console.log(text);
				break;
		}
	}
}

/**
 * Control
 * 
 * Class that represents a control on a screen. It is a super class
 * inherited by the specific types of controll classes.
 * 
 * @param control The control that is to be created and represented.
 */
var Control = Class.create({
	initialize: function(control){
		log('info','Beginning creation of control using following control object.');
		log('log',control);
		
		// Define self to prevent conflicts with frameworks
		if(!self){ var self = this; }

		this.type = null;
		this.size = { w: control.w, h: control.h };
		this.position = { x: control.x, y: control.y };
		this.color = control.color;
		this.name = control.name;
		this.active = false;
	}
});

var LED = Class.create(Control,{
	initialize: function($super){
		$super;
		this.type = "led";
	}
});



/**
 * InterfaceScreen
 * 
 * The InterfaceScreen class represents a single screen and contains
 * its controls.
 */
var InterfaceScreen = Class.create({
	/**
	 * initialize
	 * 
	 * Constructor method for the InterfaceScreen class.
	 * 
	 * @param controls An array of the controls to construct.
	 */
	initialize: function(controls){
		log('info','Beginning processing of screen with following controls.');
		log('log',controls);
		
		if(!self){ var self = this; } // Need this becuase the each iterator is going to overwirte this.
		
		this.controls = Array(); // Contains the controls that are on this screen.
		
		controls.each(function(control){
			self.addControl(control);
		});
		log('info','All controls processed into following set.');
		log('log',this.controls);
	},
	
	/**
	 * addControll
	 * 
	 * Constructs a single control and adds it to the controls array.
	 * 
	 * @param control An object representing a control.
	 */
	addControl: function(control){
		var _control = null;
		log('info','Finding out what type of control is to be constructed.');
		switch(control.type){
			log('info','Detected a LED control.');
			case "led":
				_control = new LED(control);
				break;
		}
		
		this.controls.push(_control);
	}
});



/**
 * InterfaceController
 * 
 * The InterfaceController class is a prototype class that is used for 
 * the construction of all interfaces and their actions. It is only used
 * if an interface is present.
 */
var InterfaceController = Class.create({
	/**
	 * initialize
	 * 
	 * Constructor method for the InterfaceController class.
	 */
	initialize: function(){
		log('info','Initializing an InterfaceController object.');
		// Define self to prevent conflicts with frameworks:
		if(!self){ var self = this; }
		
		this.screens = Array();
		this.canvas = null;
		
		/*
		 * If an interfaces JSON string is defined, the original screen
		 * contents are removed, and the JSON string is parsed into an
		 * object, which is than used to create that interface.
		 */
		
		if($('interfaces').innerText.isJSON()){
			
			log('info','Interface JSON string found.');
			
			// Parse the JSON string into an object before clearing body
			var interfaces = $('interfaces').innerText.evalJSON().interfaces;
			log('info','JSON string converted to following object.');
			log('log',interfaces);
			
			// Remove all elements from body
			$$('body')[0].childElements().each(function(e){
				e.remove();
			});
			log('info','Removed all elements from body.');
			
			// See if iteration is needed:
			if(interfaces.length > 1) {
				log('info','Set of screens found, beginning processing of all screens.');
				// Iterate over and build all the layouts
				interfaces.each(function(layout){
					self.processInterface(layout);
				});
			} else {
				log('info','One screen found. Beginning processing of screen.');
				self.processInterface(interfaces);
			}
			log('info','All screens processed into following set.');
			log('log',this.screens);
			return true;

		} else {
			alert("This interface is broken. Unfortunately, you can't use this application right now.");
			log('error','Broken interface. Aborting.');
			log('log',$('interfaces'));
			return false;
		}
	},
	
	initCanvas: function(){
		
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
		log('log','Screen processed and pushed into screens array.');
	}
});

document.observe("dom:loaded", function(){
	// If we're looking at an interface
	if($('interfaces') != undefined){
		log('info','Interface detected.');
		interface_controller = new InterfaceController();
	}
});