(function ( $ ) {

	function GRCalendar( elm, options ){
		this.element = elm;
		this.init( options );
	}

	GRCalendar.prototype.init = function( options ){
		
        // This is the easiest way to have default options.
        var settings = $.extend({
        }, options );
 
        // Greenify the collection based on the settings variable.
        return this.element.css({
        });
	}
	
	GRCalendar.prototype.render = function(){
	
		// Create calendar
		var calendar = $("<div />",{class:"gr-calendar"});
		
		var days = $("<div />",{class:"gr-days"});
		
		var hournames = ["7am","8am","9am","10am","11am","12pm",
							"1pm","2pm","3pm","4pm","5pm","6pm","7pm"];
		
		var hours = $("<div />",{class:"gr-hours"});
		for(var i = 0; i < hournames.length; i++){
			hours.append($("<div />",{class:"gr-hour",text:hournames[i]}));
		}
		days.append(hours);
		
		var daynames = ["M","T","W","R","F","S","U"];
		
		for(var i = 0; i < daynames.length; i++){
			var day = $("<div />",{class:"gr-day",id:daynames[i]});
			
			
			for(var j = 0; j < hournames.length; j++){
				day.append($("<div />",{class:"gr-hour"}));
			}
			
			
			days.append(day);
		}
		
		calendar.append(days);
			
		this.element.html("");
		this.element.append(calendar);
		
		
		
	}
	
	
	
 
    $.fn.grCalendar = function( options ) {
	
		return this.each(function(){
		
			this._grcalendar = new GRCalendar( $(this), options );
			this._grcalendar.render();
			
		});
 
    };
 
}( jQuery ));