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


/* Pusher */
var pusher;
function setPusher(_pusher_app_id){
	if(!_pusher_app_id){ var _pusher_app_id = '7132d12d5d3ddf34b09e'; }
	pusher = new Pusher(_pusher_app_id);
}
function getPusher() { return window.pusher; }



/* Pusher channel */
var pusher_channel;
function setPusherChannel(_channel_name){
	if(!_channel_name){var _channel_name = 'test_channel'; }
	pusher_channel = getPusher().subscribe(_channel_name);
}
function getPusherChannel() { return window.pusher_channel; }



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
	initialize: function(control, to_id){
		log('info','Beginning creation of control using following control object.');
		log('log',control);
		
		if(!self){ var self = this; }

		this.type = null;
		this.size = { w: control.w, h: control.h };
		this.position = { x: control.x, y: control.y };
		this.color = control.color;
		this.name = control.name;
		this.active = false;
		this.shape = null;
		this.parent_canvas = to_id;
	},
	
	draw: function(){
		_canvas = $('screen-' + this.parent_canvas).getContext("2d");
	},
	
	listen: function(x,y,w,h){
		
		if(!self){ var self = this; }
		
		x = parseInt(x);
		y = parseInt(y);
		w = parseInt(w);
		h = parseInt(h);
		$('screen-' + this.parent_canvas).observe('click',function(event){
			if( ( event.pointer().x > ( x - ( w / 2 ) ) ) && 
					( event.pointer().y > ( y - ( h / 2 ) ) ) &&
					( event.pointer().x < ( ( x + w ) - ( w / 2 ) ) ) &&
					( event.pointer().y < ( ( y + h ) - ( h / 2 ) ) ) ){
						new Ajax.Request('/screen_app_communication/led',{
							method: 'get',
							onComplete: function(response){
								log('info','Some response has been generated.');
								log('log',response);
							}
						});
					}
		});
	}
});

var LED = Class.create(Control,{
	initialize: function($super,control, to_id){
		$super.call(this, control, to_id);
		this.type = "led";
		this.draw(true,this.color);
		this.listen(this.position.x, this.position.y, this.size.w, this.size.h);
	},
	
	draw: function($super,from_state,color){
		$super();
		_canvas.beginPath();
		_canvas.arc(this.position.x, this.position.y, this.size.w/2, 0, Math.PI*2, true); 
		_canvas.closePath();
		_canvas.fill();
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
	initialize: function(controls, initial, id, no_canvas){
		
		if(!self){ var self = this; } // Need this because the each iterator is going to overwrite this.
		
		this.controls = Array(); // Contains the controls that are on this screen.
		this.canvas = null; // Contains the canvas that represents this screen
		this.id = id;
		this.left_is_pressed = false;
		this.right_is_pressed = false;
		this.space_bar_is_pressed = false;
		
		self.createCanvas(initial, id, no_canvas);
		self.addControls(controls);
		self.addKeyListeners();
	},



	/**
	 * addControls
	 * 
	 * Constructs the array of controls contained  within an instance of InterfaceScreen.
	 *
	 * @param controls A single control object or an array of control objects.
	 * @return Array
	 */
	addControls: function(controls) {
		
		if(!self){ var self = this; } // Need this because the each iterator is going to overwrite this.
		
		log( 'info' , 'Beginning creation of controls with following input:' );
		log( 'log' , controls );
		
		if( Object.isArray( controls ) ){
			controls.each(function(control){
				self.addControl(control);
			});
		} else {
			self.addControl(controls);
		}
		
		log('info','All controls processed into following set.');
		log('log',this.controls);
	},


	
	/**
	 * addControll
	 * 
	 * Constructs a single control and adds it to the controls array.
	 * 
	 * @param control An object representing a control.
	 * @return Object
	 */
	addControl: function(control){
		
		if(!self){ var self = this; } // Need this because the each iterator is going to overwrite this.
		
		log( 'info' , 'Beginning creation of a single control with the following input:' );
		log( 'log' , control );
		
		var _control = null;
		
		log('info','Finding out what type of control is to be constructed.');
		switch(control.type){
			case "led":
				log('info','Detected a LED control.');
				_control = new LED(control, self.id);
				break;
			default:
				log('info','Detected unknown control type. Constructing an instance of Control.');
				_control = new Control(control, self.id);
				break;
		}
		
		this.controls.push(_control);
		
		log( 'info' , 'The following single control element has been created.' );
		log( 'log' , _control );
	},
	
	
	
	addKeyListeners: function(){
		
		if(!self){ var self = this; } // Need this because the each iterator is going to overwrite this.
		
		document.addEventListener("keydown", function(e){
			if(
				( ( e.keyCode == 37 ) && !self.left_is_pressed ) ||
				( ( e.keyCode == 39 ) && !self.right_is_pressed ) ||
				( ( e.keyCode == 32 ) && !self.space_bar_is_pressed )
				) {
				new Ajax.Request('/screen_app_communication/keyDown',{
					method: 'get',
					parameters: {key: e.keyCode, id: pusher.connection.socket_id },
					onComplete: function(response){
						log('info','Some response has been generated.');
						log('log',response);
					}
				});
				
				if( e.keyCode == 37 ){ self.left_is_pressed = true }
				if( e.keyCode == 39 ){ self.right_is_pressed = true }
				if( e.keyCode == 32 ){ self.space_bar_is_pressed = true }
			}
		});
		
		document.addEventListener("keyup", function(e){
			new Ajax.Request('/screen_app_communication/keyUp',{
				method: 'get',
				parameters: {key: e.keyCode, id: pusher.connection.socket_id},
				onComplete: function(response){
					log('info','Some response has been generated.');
					log('log',response);
				}
			});
			if( e.keyCode == 37 ){ self.left_is_pressed = false }
			if( e.keyCode == 39 ){ self.right_is_pressed = false }
			if( e.keyCode == 32 ){ self.space_bar_is_pressed = false }
		});
	},
	
	
	
	/**
	 * 
	 */
	createCanvas: function( initial, id, no_canvas){
		
		if(!self){ var self = this; } // Need this because the each iterator is going to overwrite this.
		
		log( 'info' , 'Beginning creation of a screens canvas with, respectivly, the following initial, id and no_canvas arguments:' );
		log( 'log' , initial );
		log( 'log' , id );
		log( 'log' , no_canvas );
		
		self.canvas = new Element( 'canvas' , {
			'id' : 'screen-' + id,
			'width' : document.viewport.getWidth(),
			'height' : document.viewport.getHeight()
		}).update(no_canvas);
		
		if(!initial){
			self.canvas.hide();
		}
		
		document.body.appendChild(self.canvas);
		
		log( 'info' , "Created following canvas element:" );
		log( 'log' , self.canvas );
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
	initialize: function(args){

		if(!self){ var self = this; }
		
		log('info','Initializing an InterfaceController object. Got the following arguments:');
		log('log' , args);
		
		this.screens = Array();
		
		/*
		 * If an interfaces JSON string is defined, the original screen
		 * contents are removed, and the JSON string is parsed into an
		 * object, which is than used to create that interface.
		 */
		
		if($('interfaces_page').innerText.isJSON()){
			
			log('info','Interface JSON string found.');
			
			// Parse the JSON string into an object before clearing body
			var interfaces = $('interfaces_page').innerText.evalJSON().interfaces;
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
				self.processInterface(interfaces, args.no_canvas);
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
	
	/**
	 * processInterface
	 * Iterates over all widgets in an interface and calls
	 * buidWidget on them.
	 * 
	 * @param _interface The interface to process
	 */
	processInterface : function(_interface, no_canvas){
		
		if(!self){ var self = this; }
		
		var interface_screen = new InterfaceScreen(_interface[0].layout.tabpage.control,true, 0, no_canvas);
		self.screens.push(interface_screen);
		log('log','Screen processed and pushed into screens array.');
	}
});



/**
 * Main initiation takes place right here:
 */
document.observe("dom:loaded", function(){
	/**
	 * First, we set debugging requirements if debug is on:
	 */
	if(getDebug()){
	  Pusher.log = function(message) {
	    if (window.console && window.console.log) window.console.log(message);
	  };
	  WEB_SOCKET_DEBUG = true;
 	}
 
 
  // Binds to the remove task link...
	$$('.remove_interface').each(function(element){
		element.observe( 'click', function(e){
		  e.stop();
		  $(this).parents('.interface').remove();
		});
	});
	
	// Add task link, note that the content we're appending
	// to the tasks list comes straight out of the data-partial
	// attribute that we defined in the link itself.
	$$('.add_interface').each(function(element){
	  element.observe( 'click', function(e){
		  e.stop();
	  	$('#interfaces').append($(this).data('partial'));
	  });
	});

	/**
	 * Here, we perform actions based on what screen is detected:
	 */
	
	/* Interface */
	if( $('interfaces_page') != undefined ){
		
		log('info','Interface detected.');
		
		setPusher('7132d12d5d3ddf34b09e');
		setPusherChannel('private-screen-interaction');
		
    getPusherChannel().bind('my_event', function(data) {
      //alert(data);
    });
    
    pusher.connection.bind('connected', function() {
    	new Ajax.Request('/screen_app_communication/newUser',{
				method: 'get',
				parameters: { id: pusher.connection.socket_id},
				onComplete: function(response){
					log('info','Some response has been generated.');
					log('log',response);
				}
			});
    });
		
		var args = {
			no_canvas: 'This text is displayed if your browser does not support HTML5 Canvas.'
		}
		
		interface_controller = new InterfaceController(args);
		
	}
	
	/* App */
	if( $('app') != undefined ){
		
		log('info','App detected.');
		
		setPusher('7132d12d5d3ddf34b09e');
		setPusherChannel('private-screen-interaction');
		
    getPusherChannel().bind('led-activated', function(data) {
      alert(data);
    });
	}
});