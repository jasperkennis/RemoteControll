document.observe("dom:loaded", function(){
	
	// If we're looking at an interface
	if($('interfaces') != undefined){
		
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
			
			
			
		} else {
			alert("This interface is broken. Unfortunately, you can't use this application right now.");
			log($('interfaces'));
		}
	}
});

function log(text){
	if(console){
		console.log(text);
	}
}
