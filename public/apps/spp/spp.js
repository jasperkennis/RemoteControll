			var pusher_id = '7132d12d5d3ddf34b09e';
			var pusher_channel = 'presence-screen-interaction';
			var fps = 30;



			var Drawable = Class.create({
				initialize: function( size, position, direction, color, name, canvas){
					log("info", canvas);
					if(!self){ var self = this; }
					
					this.canvas = canvas;
					this.size = { w: size.w, h: size.h };
					this.position = { x: position.x, y: position.y };
					this.direction = { h: direction.h, v: direction.v }
					this.color = color;
					this.name = name;
					
					this.draw();
				},
				
				draw: function(){
					_canvas = this.canvas.getContext("2d");
					_canvas.fillStyle = "rgb(200,0,0)";
				},
				
				update: function(){
					this.position.x = this.position.x + this.direction.h;
					this.position.y = this.position.y + this.direction.v;
					
					//TODO: implement the out of screen logics:
					/*if(
						( this.position.x > window.game.width ) ||
						( this.position.y > window.game.height ) ||
						( this.position.x < ( -1 * this.position.x ) ) ||
						( this.position.y < ( ( -1 * this.position.y ) - 100 ) )
					){
						// should now do: this.remove(this);
					}*/
				},
				
				intersects: function(compare){
					var _return = false;
					if( 
						(
							( ( this.position.x > compare.position.x ) && ( this.position.x < ( compare.position.x + compare.size.w ) ) ) ||
							( ( ( this.position.x + this.size.w ) > compare.position.x ) && ( ( this.position.x + this.size.w ) < ( compare.position.x + compare.size.w ) ) )
						) && (
							( ( this.position.y > compare.position.y ) && ( this.position.y < ( compare.position.y + compare.size.h ) ) ) || 
							( ( ( this.position.y + this.size.h ) > compare.position.y ) && ( ( this.position.y + this.size.h ) < ( compare.position.y + compare.size.h ) ) )
						)
					){
						_return = true;
					}
					return _return;
				},
				
				remove: function(){}
			});



			var Score = Class.create(Drawable,{
				initialize: function($super, size, position, direction, color, name, canvas){
					$super.call(this, size, position, direction, color, name, canvas);
				},
				
				draw: function($super, name, score){
					$super();
					context.fillStyle    = '#00f';
					context.font         = 'italic 12px sans-serif';
					context.textBaseline = 'top';
					context.fillText  (name + ': ' + score.toString(), 0, 0);
				}
			});



			var Bullet = Class.create(Drawable,{
				initialize: function($super, size, position, direction, color, name, canvas){
					$super.call(this, size, position, direction, color, name, canvas);
				},
				
				draw: function($super){
					$super();
					_canvas.beginPath();
					_canvas.arc(this.position.x, this.position.y, this.size.w/2, 0, Math.PI*2, true); 
					_canvas.closePath();
					_canvas.fill();
				},
				
				remove: function(own_index, gun_index){
					if(!self){ var self = this; }
					window.game.render_tick_engine.drawables.detect(function(q){
						if(q == self){
							// Find the index of the element, and then splice the array of drawables at that point.
							window.game.render_tick_engine.drawables.splice( window.game.render_tick_engine.drawables.indexOf(q),1);
						}
					});
					
					// Remove the bullet from the bullets list too:
					window.game.allied_factions.collection[gun_index].gun.collection.splice(own_index, 1);
				}
			});



			var Player = Class.create(Drawable, {
				initialize: function($super, size, position, direction, color, name, canvas, id){
					$super.call(this, size, position, direction, color, name, canvas);
					this.fire_rate = 1;
					this.gun = new Gun(null, this.fire_rate, id);
					this.gun.registerPeriodicAction();
					this.id = id;
					this.is_shooting;
					this.controller = new Controller(id);
					this.score = 0;
					this.score_display = new Score(
						{ s: 100, w: 100 },
						{ x: 0, y: 0 },
						{ v:0, h: 0 },
						"black",
						"timer",
						canvas
					);
				},
				
				draw: function($super){
					$super();
					//this.score_display.draw(this.name, this.score);
					_canvas.fillStyle = this.color;
					_canvas.fillRect (this.position.x, this.position.y, this.size.w, this.size.h);
				},
				
				startShooting: function(){
					this.is_shooting = true;
				},
				
				stopShooting: function(){
					this.is_shooting = false;
				},
				
				remove: function(own_index) {
					if(!self){ var self = this; }
					window.game.render_tick_engine.drawables.detect(function(q){
						if(q == self){
							// Find the index of the element, and then splice the array of drawables at that point.
							window.game.render_tick_engine.drawables.splice( window.game.render_tick_engine.drawables.indexOf(q),1);
						}
					});
					
					// Remove the bullet from the bullets list too:
					window.game.allied_factions.collection.splice(own_index, 1);
				},
				
				update: function($super){
					$super.call( this );
					if( this.position.x < 20 ) {  this.position.x = 20; }
					if( this.position.x > window.game.width - 20 - this.size.w ) { this.position.x = window.game.width - this.size.w - 20 }
				}
			});



			var Enemy = Class.create(Drawable,{
				initialize: function($super, size, position, direction, color, name, canvas){
					$super.call(this, size, position, direction, color, name, canvas);
				},
				
				draw: function($super){
					$super();
					_canvas.fillStyle = "rgb(141,198,63)";
					_canvas.fillRect (this.position.x, this.position.y, this.size.w, this.size.h);
				},
				
				remove: function(own_index) {
					if(!self){ var self = this; }
					window.game.render_tick_engine.drawables.detect(function(q){
						if(q == self){
							// Find the index of the element, and then splice the array of drawables at that point.
							window.game.render_tick_engine.drawables.splice( window.game.render_tick_engine.drawables.indexOf(q),1);
						}
					});
					
					// Remove the bullet from the bullets list too:
					window.game.harm_hazard.collection.splice(own_index, 1);
				}
			});



			var DrawableFactory = Class.create({
				initialize: function(periodic_action){
					if(!self){ var self = this; }
					
					this.collection = Array();
					
					if( this.periodic_action == null ) {
						this.periodic_action = {
							options: { self: self },
							execute: this.defaultPeriodicAction 
						}
					}
				},
				
				addEntity: function(_entity){
					this.collection.push( _entity );
				},
				
				registerPeriodicAction: function(){
					window.game.render_tick_engine.addUpdatable(this.periodic_action);
				},
				
				defaultPeriodicAction: function(){
					
				}
			});



			var Gun = Class.create(DrawableFactory,{
				initialize: function( $super, periodic_action, fire_rate, player_id ) {
					this.frequency = fire_rate;
					this.player = player_id;
					this.delay = 0;
					$super.call(this);
				},
				
				defaultPeriodicAction: function(options){
					if(options.self.delay > 0) { options.self.delay--; }
					if( window.game.allied_factions.collection[options.self.player].is_shooting && ( options.self.delay == 0 ) ){
						var _bullet = new Bullet(
							{ h : 4 , w : 4 },
							{ x :  window.game.allied_factions.collection[options.self.player].position.x + 18 , y :  window.game.allied_factions.collection[options.self.player].position.y },
							{ h : 0 , v : -16 },
							"black",
							"bullet_time!",
							window.game.canvas
						);
						
						options.self.addEntity(_bullet);
						window.game.render_tick_engine.addDrawable(_bullet);
						options.self.delay = ( 30 / options.self.frequency);
					}
				}
			});



			var HarmsHazard = Class.create(DrawableFactory,{
				initialize: function($super, periodic_action){
					$super.call(this);
				},
				
				defaultPeriodicAction: function(options){
					if( ( Math.floor( Math.random() * ( ( window.game.fps/window.game.allied_factions.collection.length ) * 2 ) ) ) < 1 ){
						var _enemy = new Enemy(
							{h: 30, w: 30},
							{x: ( Math.floor( Math.random() * window.game.width ) ), y: - 30},
							{v: 1, h: 0},
							"black",
							"name",
							window.game.canvas
						);
						options.self.addEntity(_enemy);
						window.game.render_tick_engine.addDrawable(_enemy);
					}
				}
			});



			var AlliedFactions = Class.create(DrawableFactory,{
				initialize: function($super, connection){
					//window.players = new Array();
					this.connection = connection;
					this.listener = this.listen();
					$super.call(this);
				},
				
				addEntity: function(data){
					var _player = new Player(
						{h: 20, w: 40},
						{x: 20, y: window.game.height - 30},
						{v: 0, h: 0},
						"rgb(" + Math.floor( ( Math.random() * 155 ) + 100 ).toString() + " , " + Math.floor( ( Math.random() * 155 ) + 100 ).toString() + " , " + Math.floor( ( Math.random() * 155 ) + 100 ).toString() + ")",
						data.name,
						window.game.canvas,
						data.id
					);
					this.collection[data.id] = _player;
					this.collection.push(_player);
					window.game.render_tick_engine.addDrawable(_player);
				},
				
				listen: function(){
					if(!self){ var self = this; }
					this.connection.onNewUser(function(data){
						console.log(data.name);
						self.addEntity({id: data.id, name: data.name});
					});
				},
				
				scoreBoard: function(){
					if(!self){ var self = this; }
					
					if(this.collection.length > 0) {
						self.collection.each(function(){
							
						});
					}
				}
			});



			var RenderTickEngine = Class.create(PeriodicalExecuter,{
				initialize: function( $super, callback, fps, canvas ) {
					this.frequency = 1/fps;
					this.canvas = canvas;
					this.drawables = new Array();
					this.updatables = new Array();
					
					if( callback ){
						this.callback = callback;
					} else {
						this.callback = function(){
							this.runUpdatables();
							this.clearCanvas();
							this.updateDrawables();
							this.drawDrawables();
						}
					}
					$super.call(this, this.callback, this.frequency);
				},
				
				drawDrawables: function(){
					this.drawables.each(function(drawable){
						drawable.draw(this.canvas);
					});
				},
				
				updateDrawables: function(){
					this.drawables.each(function(drawable){
						drawable.update();
					});
				},
				
				addDrawable: function(drawable){
					if( !drawable ){
						log("error","Can't execute addDrawable if no drawable has been given.")
					} else {
						this.drawables.push(drawable);
					}
				},
				
				clearCanvas: function(){
					this.canvas.getContext("2d").clearRect(0,0,window.game.width,window.game.height);
				},
				
				addUpdatable: function(updatable){
					this.updatables.push(updatable);
				},
				
				runUpdatables: function(){
					this.updatables.each(function(e){
						if(Object.isFunction(e)){
							e.call();
						} else {
							e.execute(e.options);
						}
					});
				}
			});



			var Connection = Class.create({
				initialize: function(id, channel){
		
					setPusher(id);
					setPusherChannel(channel);
				},
				
				onKeyDown: function(callback){
					getPusherChannel().bind('client-key-down', callback);
				},
				
				onKeyUp: function(callback){
					getPusherChannel().bind('client-key-up', callback);
				},
				
				onNewUser: function(callback){
					getPusherChannel().bind('client-new-user', callback);
				}
			});



			var Controller = Class.create({
				initialize: function(id){
					this.right_is_pressed = false;
					this.left_is_pressed = false;
					this.space_bar_is_pressed = false;
					this.id = id;
					this.key_down_listener = this.listenForKeyDown();
					this.key_up_listener = this.listenForKeyUp();
				},
				
				listenForKeyDown: function(){
					if(!self){ var self = this; }
					window.game.connection.onKeyDown(function(data){
						if(data.id == self.id){
							switch (data.key) {
								case 37:
									if(!self.left_is_pressed){
										window.game.allied_factions.collection[self.id].direction.h = window.game.allied_factions.collection[self.id].direction.h - 4;
										self.left_is_pressed = true;
									}
									break;
								case 39:
									if(!self.right_is_pressed){
										window.game.allied_factions.collection[self.id].direction.h =  window.game.allied_factions.collection[self.id].direction.h + 4;
										self.right_is_pressed = true;
									}
									break;
								case 32:
									if(!self.space_bar_is_pressed) {
										window.game.allied_factions.collection[self.id].startShooting();
										self.space_bar_is_pressed = true;
									}
									break;
							}
						}
					});
				},
				
				listenForKeyUp: function(){
					if(!self){ var self = this; }
					window.game.connection.onKeyUp(function(data){
						if(data.id == self.id){	
							switch (data.key) {
								case 37:
									if(self.left_is_pressed){
										window.game.allied_factions.collection[self.id].direction.h = window.game.allied_factions.collection[self.id].direction.h + 4;
										self.left_is_pressed = false;
									}
									break;
								case 39:
									if(self.right_is_pressed){
										window.game.allied_factions.collection[self.id].direction.h =  window.game.allied_factions.collection[self.id].direction.h - 4;
										self.right_is_pressed = false;
									}
									break;
								case 32:
									if(self.space_bar_is_pressed){
										window.game.allied_factions.collection[self.id].stopShooting();
										self.space_bar_is_pressed = false;
									}
									break;
							}
						}
					});
				}
			});



			var DamageControl = Class.create({
				hitTest: function( first_collection , second_collection, callback ){

					if(
							Object.isArray( first_collection ) &&
							( first_collection.length > 0 ) &&
							Object.isArray( second_collection ) &&
							( second_collection.length > 0 ) 
						){
						for (var i = first_collection.length - 1; i >= 0; i--){
							for (var j = second_collection.length - 1; j >= 0; j--){
								if( first_collection[i].intersects( second_collection[j] ) ) {
									callback.call(this,i,j);
								}
							}
						}
					}
				},
				
				bulletVSEnemy: function(){
					if(!self){ var self = this; }
					for (var player = window.game.allied_factions.collection.length - 1; player >= 0; player--){
						window.game.damage_control.hitTest(window.game.allied_factions.collection[player].gun.collection, window.game.harm_hazard.collection, function(bullet_index,enemy_index){
							// Entering the process of deleting the object and all its references:
							_bullet = window.game.allied_factions.collection[player].gun.collection[bullet_index];
							_bullet.remove(bullet_index,player);
							
							// Do the same thing for the hit enemy:
							_enemy = window.game.harm_hazard.collection[enemy_index];
							_enemy.remove(enemy_index);
						});
					}
				},
				
				playerVSEnemy: function(){
					if(!self){ var self = this; }
					window.game.damage_control.hitTest(window.game.allied_factions.collection, window.game.harm_hazard.collection, function(player_index,enemy_index){
						// Entering the process of deleting the object and all its references:
						_player = window.game.allied_factions.collection[player_index];
						_player.remove(player_index);
						
						// Do the same thing for the hit enemy:
						_enemy = window.game.harm_hazard.collection[enemy_index];
						_enemy.remove(enemy_index);
					});
				}
			});



			var Game = Class.create({
				initialize: function(fps, pusher_id, pusher_channel){
					// Set simple variables:
					this.fps = fps;
					this.height = document.viewport.getHeight();
					this.width = document.viewport.getWidth();
					this.canvas = this.createCanvas("screen");
					
					// Create containers for main objects:
					this.bullets = new Array();
					
					// Create controlling objects:
					this.damage_control = new DamageControl();
					this.connection = new Connection(pusher_id, pusher_channel);
					this.allied_factions = new AlliedFactions(this.connection);
					this.harm_hazard = new HarmsHazard(fps);
					this.render_tick_engine = new RenderTickEngine( null, this.fps, this.canvas );
					
					// Add update functions to the updating loop:
					this.render_tick_engine.addUpdatable(this.harm_hazard.periodic_action);
					this.render_tick_engine.addUpdatable(this.damage_control.bulletVSEnemy);
					this.render_tick_engine.addUpdatable(this.damage_control.playerVSEnemy);
				},
				
				createCanvas: function( id ){
					if(!self){ var self = this; } 
					
					_canvas = new Element( 'canvas' , {
						'id' : id,
						'width' : this.width,
						'height' : this.height
					});

					_canvas = document.body.appendChild(_canvas);
					
					return _canvas;
				}
			});



			document.observe("dom:loaded", function(){
				if( $('screen_app_page') != undefined ){
					window.game = new Game(fps, pusher_id, pusher_channel);
				}
			});