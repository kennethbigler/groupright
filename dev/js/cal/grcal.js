(function ( $ ) {

	function GRCalendar( elm, options ){
		this.element = elm;
		this.init( options );
	}
	
	//---------------------------------------------------------------------
	
	var hournames = ["5am","6am","7am","8am","9am","10am","11am","12pm",
						"1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm",
						"9pm","10pm","11pm","12am"];
						
	var daynames = ["M","T","W","R","F","S","U"];
	
	var daytitles = ["Monday","Tuesday","Wednesday","Thursday",
						"Friday","Saturday","Sunday"];
						
	var standardColors = ["#96e8c2","#FFF07F","#8AB5E3","#6ED3EF","#FF6068",
							"#DD8DDD","#E3A345","#C6928D","#BCCC90"];
	var colorIndex = 0;
						
	//---------------------------------------------------------------------
	
	GRCalendar.prototype.init = function( options ){
		
        // This is the easiest way to have default options.
        var settings = $.extend({
			start_hour:"7am",
			end_hour:"7pm",
			num_days:7,
			start_day:"Monday",
        }, options );
 
		this.options = this.parseSettings(settings);
		
		// Dimensions / Sizing
		this.dim = {};
		this.resize();
		
		// Events
		this.events = {};
		for(var i = 0; i < 7; i++) this.events[ daytitles[i] ] = new Array();
 
        return this.element;
	}
	
	GRCalendar.prototype.parseSettings = function(settings){
		
		if(settings.num_days > 7){
			console.warn("GRCalendar -- Cannot display more than 7 days");
			settings.num_days = 7;
		}
	
		return settings;
	};
	
	//---------------------------------------------------------------------
	
	GRCalendar.prototype.render = function(){
	
		// Create calendar
		var calendar = $("<div />",{class:"gr-calendar"});
		
		// Days subdiv.
		var days = $("<div />",{class:"gr-days"});
		
		// Hour labels
		var hours = $("<div />",{class:"gr-hours"});
		
		// Add each label.
		for(var i = hournames.indexOf(this.options.start_hour);
				i <= hournames.indexOf(this.options.end_hour);
				i++){
			hours.append(
				$("<div />",{class:"gr-hour",text:hournames[i]}).height(this.dim.cell_height)
				);
		}
		days.append(hours);
		
		// Add each day.
		for(var i = 0; i < this.options.num_days; i++){
			var sday = daytitles.indexOf(this.options.start_day);
			var ind = (sday+i)%7;
		
			// make the day
			var day = $("<div />",{class:"gr-day",id:daynames[ind]});
			day.width(this.dim.day_width);
			
			// make the title
			day.append( $("<div />",{class:"gr-day-title",text:daytitles[ind]}) );
			
			// make the hour markers.
			var contDiv = $("<div />").css("position","relative");
			for(var j = hournames.indexOf(this.options.start_hour);
				j < hournames.indexOf(this.options.end_hour);
				j++){
				contDiv.append(
					$("<div />",{class:"gr-hour"}).height(this.dim.cell_height)
				);
			}
			
			for(var j = 0; j < this.events[daytitles[ind]].length; j++){
				var ev = this.events[ daytitles[ind] ][ j ];
				var evDiv = ev.render();
				var stMark = hoursBetween(parseTime(this.options.start_hour),
											parseTime(ev.options.start_time));
				var enMark = hoursBetween(parseTime(ev.options.start_time),
											parseTime(ev.options.end_time));
				evDiv.css({
					"top":(stMark*this.dim.cell_height)+"px",
					"height":(enMark*this.dim.cell_height)+"px"
				});
				contDiv.append(evDiv);
			}
			
			day.append(contDiv);
			
			
			
			days.append(day);
		}
		
		// Append the days subdiv.
		calendar.append(days);
		
		// Replace the contents of the element with the calendar.
		this.element.html("");
		this.element.append(calendar);

	};
	
	//---------------------------------------------------------------------
	
	GRCalendar.prototype.resize = function(){
		var height = this.element.height();
		var width = this.element.width();
		
		// fix day width (assume 5% for hours labels)
		this.dim.day_width = Math.floor(94/this.options.num_days)+"%";
		
		// fix height
		var nHours = hournames.indexOf(this.options.end_hour) 
						- hournames.indexOf(this.options.start_hour);
						
		this.dim.cell_height = Math.floor((height-30)/nHours);
	};
	
	//---------------------------------------------------------------------
	
	GRCalendar.prototype.addEvent = function( event_options ){
		// incidentally, we can probably ignore the pass-in value.
		for(var i = 0; i < arguments.length; i++){
			var options = arguments[i];
			if(!options.color){ 
				options.color = standardColors[colorIndex]; 
				colorIndex = (colorIndex + 1) % standardColors.length;
			}
			var ev = new GRCalendarEvent( options );
			this.events[ ev.options.day ].push( ev );
		}
		this.render();
	};
	
	//---------------------------------------------------------------------
	
	function hoursBetween(a,b){
		if(!(a instanceof Date) || !(b instanceof Date)) return;
		return (b - a) / 1000 / 60 / 60;
	}
	
	function parseTime( timeStr ){
		var x;
		var d = new Date();
		
		// reset.
		d.setMinutes(0);
		d.setSeconds(0);
		
		// 8am, 10pm, (hour)(:minutes)(Am/Pm)
		if(x = timeStr.match(/([1]?[0-9])(:([0-5][0-9]))?([AaPp][Mm])?/)){
			//console.log(x);
			// 0 => expression, 1 => hour, 2 => (ignore)
			// 3 => minutes, 4 => Am/Pm
			
			// parse the hours
			var h = parseInt(x[1]);
			
			// adjust hours for am / pm
			if( (h!=12) && x[4].match(/[Pp][Mm]/)){ h += 12; }
						
			// set the hours
			d.setHours(h);
						
			// parse the minutes
			if(x[3]){
				var m = parseInt(x[3]);
				d.setMinutes(m);
			}
		}
		return d;
	}	
	//---------------------------------------------------------------------
	
	function GRCalendarEvent( options ){
		this.init( options );
	}
	
	GRCalendarEvent.prototype.init = function ( options ){
	
        // This is the easiest way to have default options.
        var settings = $.extend({
			title:"New Event",
			color:'#96e8c2',
			day:'Monday',
			start_time:'8:30am',
			end_time:'10am'
        }, options );
 
		this.options = this.parseSettings(settings);
 
        return this.element;
	};
	
	GRCalendarEvent.prototype.parseSettings = function( settings ){
		return settings;
	};
	
	GRCalendarEvent.prototype.render = function(){
		var div = $("<div />",{class:"gr-event"});
		
		div.append( $("<p />",{class:"title",text:this.options.title}),
					$("<p />",{class:"subtitle",text:this.options.start_time+" - "+this.options.end_time}));
					
		div.css("background-color",this.options.color);
		
		return div;
	};
	
	//---------------------------------------------------------------------
 
    $.fn.grCalendar = function( options ) {
	
		return this.each(function(){
		
			this._grcalendar = new GRCalendar( $(this), options );
			this._grcalendar.render();
			
		});
 
    };
 
}( jQuery ));