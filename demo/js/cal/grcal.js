(function ( $ ) {

	function GRCalendar( elm, options ){
		this.element = elm;
		this.init( options );
	}
	
	//---------------------------------------------------------------------
	
	var hournames = ["12am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
						"12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm","12am"];
						
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
			start_day:"2015-05-09T01:20:06.320Z",
        }, options );
 
		this.options = this.parseSettings(settings);
		
		// Dimensions / Sizing
		this.dim = {};
		this.resize();
		var self = this;
		window.onresize = function(){self.resize();self.render()}
		
		// Events
		this.events = {};
 
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
	GRCalendar.prototype.shiftCalBack = function(){
		var x = new Date( this.options.start_day );
		x.setDate( x.getDate() - 1 );
		this.options.start_day = x.toDateString();
		this.render();
	}
	//---------------------------------------------------------------------
	GRCalendar.prototype.shiftCalForward = function(){
		var x = new Date( this.options.start_day );
		x.setDate( x.getDate() + 1 );
		this.options.start_day = x.toDateString();
		this.render();
	}
	//---------------------------------------------------------------------
	
	GRCalendar.prototype.render = function(){
	
		// Create calendar
		var calendar = $("<div />",{class:"gr-calendar"});
		
		// Days subdiv.
		var days = $("<div />",{class:"gr-days"});
		if(this.mobile) days.addClass("mobile-compliant");
		
		// Hour labels
		var hours = $("<div />",{class:"gr-hours"});
		if(this.mobile) hours.addClass("mobile-compliant");
		
		// Add each label.
		var eInd = hournames.indexOf(this.options.end_hour);
		if(eInd == 0) eInd = 24;
		for(var i = hournames.indexOf(this.options.start_hour);
				i <= eInd;
				i++){
			hours.append(
				$("<div />",{class:"gr-hour",text:hournames[i]}).height(this.dim.cell_height)
				);
		}
		calendar.append(hours);
		
		//console.log(this.events);
		//console.log(this.options);
		
		var refDate = new Date(this.options.start_day);
		
		// Add each day.
		for(var i = 0; i < this.options.num_days; i++){
			
			// Get index / key.
			var ind = refDate.toDateString();
			//console.log(ind);
			//var sday = daytitles.indexOf(this.options.start_day);
			//var ind = (sday+i)%7;
		
			// make the day
			var day = $("<div />",{class:"gr-day"});
			day.width(this.dim.day_width);
			
			// make the title
			
			var dateStr = refDate.toDateString();
			var __days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
			dateStr = __days[ refDate.getDay() ]+" "+(refDate.getMonth()+1) + "/" + refDate.getDate();
			
			if(!this.mobile)day.append( 
				$("<div />",{
					class:"gr-day-title",
					style:((refDate.toDateString() == new Date().toDateString()) ? "font-weight:bold" : ""),
					text:dateStr
				}) 
			);
			else day.append( 
				$("<div />",{
					class:"gr-day-title",
					text:daynames[refDate.getDay()]
				})
			);
			
			// make the hour markers.
			var contDiv = $("<div />").css("position","relative");
			for(var j = hournames.indexOf(this.options.start_hour);
				j < eInd;
				j++){
				contDiv.append(
					$("<div />",{class:"gr-hour"}).height(this.dim.cell_height)
				);
			}
						
			if(this.events[ind]){
				
				for(var j = 0; j < this.events[ind].length; j++){
					var ev = this.events[ ind ][ j ];
					var evDiv = ev.render({mobile:this.mobile});
					var stMark = new Date(this.events[ind][ j ].options.start_time).getHours() +
									new Date(this.events[ind][ j ].options.start_time).getMinutes()/60.0;
					var enMark = new Date(this.events[ind][ j ].options.end_time).getHours() +
									new Date(this.events[ind][ j ].options.end_time).getMinutes()/60.0;
					
					// fix event length
					enMark = enMark - stMark;
					
					// fix start
					stMark = stMark - hournames.indexOf(this.options.start_hour);
					evDiv.css({
						"top":(stMark*this.dim.cell_height)+"px",
						"height":(enMark*this.dim.cell_height)+"px"
					});
					contDiv.append(evDiv);
				}
			}
			
			// update for next iteration.
			
			refDate.setDate(refDate.getDate()+1)
			
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
		this.dim.day_width = 100/this.options.num_days+"%";
		
		// fix height
		var sInd = hournames.indexOf(this.options.start_hour);
		var eInd = (this.options.end_hour == "12am") ? 24 : hournames.indexOf(this.options.end_hour);
		var nHours = eInd - sInd;
						
		this.dim.cell_height = Math.floor((height-30)/nHours);
		
		// determine mobile view
		this.mobile = (width <= 589);
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
	
	GRCalendar.prototype.addEvents = function( arr ){
		// incidentally, we can probably ignore the pass-in value.
		for(var i = 0; i < arr.length; i++){
			var options = arr[i];
			if(!options.color){ 
				options.color = standardColors[colorIndex]; 
				colorIndex = (colorIndex + 1) % standardColors.length;
			}
			var ev = new GRCalendarEvent( options );
			var day = new Date(ev.options.start_time).toDateString();
			if(!this.events[ day ]) this.events[ day ] = new Array();
			this.events[ day ].push( ev );
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
			if( (h==12) && x[4].match(/[Aa][Mm]/)){ h -= 12; }
						
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
			start_time:'2015-05-09T01:20:06.320Z',
			end_time:'2015-05-09T02:20:06.320Z'
        }, options );
 
		this.options = this.parseSettings(settings);
 
        return this.element;
	};
	
	GRCalendarEvent.prototype.parseSettings = function( settings ){
		return settings;
	};
	
	GRCalendarEvent.prototype._formatTime = function( date ){
		if(!(date instanceof Date )){
			try{
				date = new Date(date);
			}catch(e){
				console.warn(" Input is not a date. "); return;
			}
		}
		
		return date.toLocaleTimeString();
	};
	
	GRCalendarEvent.prototype.render = function(opt){
		var div = $("<div />",{class:"gr-event-cont"});
		var div2 = $("<div />",{class:"gr-event"});
		
		//if(!opt.mobile){
			div2.append( 
				$("<p />",{class:"title",text:this.options.name})
			);
		//}
					
		div2.css("background-color",this.options.color);
		div.append(div2);
		
		// add popup window click event
		var windowSettings = {
			color:this.options.color,
			description:(this.options.description)? this.options.description : "[No description]",
			title:this.options.name,
			time:this._formatTime(this.options.start_time)+" - "+this._formatTime(this.options.end_time),
			attending:[],
			exit:function(){
				$(".gr-event").removeClass("active");
				$(".gr-event-cont").removeClass("inactive");
			}
		};
		div.on('click',function(){
			var p = new GRCalendarPopWindow(this,windowSettings);
			var div = p.render();
			if(opt.mobile){ div.addClass("mobile-compliant"); }
			_positionRelativeTo(div,$(this));			
			$(".gr-event").removeClass("active");
			$(".gr-event-cont").addClass("inactive");
			$(this).removeClass("inactive");
			$(this).children(".gr-event").addClass("active");
		});
		
		return div;
	};
	
	function _positionRelativeTo(popup,source){
		console.log(popup);
		console.log(source);
		
		var ref = {l:0,r:0,t:0,b:0};
		
		var x = source;
		while(!x.hasClass("gr-days")){
			//console.log(x[0].offsetLeft+","+x[0].offsetTop);
			ref.l += x[0].offsetLeft;
			ref.t += x[0].offsetTop;
			x = x.parent();
		}
		
		ref.b = ref.t + source[0].offsetHeight;
		ref.r = ref.l + source[0].offsetWidth;
		
		
		
		var src = {w:0,h:0};
		src.w = source[0].offsetWidth;
		src.h = source[0].offsetHeight;
		
		var playarea = {w:0,h:0};
		playarea.w = x[0].offsetWidth;
		playarea.h = x[0].offsetHeight;
		
		var pop = {w:0,h:0};
		pop.w = popup[0].offsetWidth;
		pop.h = popup[0].offsetHeight;
		
		var coords = {l:0,t:0};
		
		// proportional response
		coords.l = (ref.l / (playarea.w - src.w))*(playarea.w - pop.w);
		
		// fix vert.
		coords.t = ref.b;
		if(coords.t+pop.h > playarea.h){
			coords.t = ref.t - pop.h - 10;
		}
		
		// below, to right.
		//coords.l = ref.l;
		//coords.t = ref.b;
		console.log(playarea.w+","+pop.w);
		console.log(coords.l+","+coords.t);
		popup.css("left",coords.l);
		popup.css("top",coords.t);
		console.log(ref);
	}
	
	//---------------------------------------------------------------------
	function GRCalendarPopWindow( elm, options ){
		options = $.extend({
			color:"red",
			description:"Standard corportate potluck.  Bring potato salad.",
			title:"Picnic",
			attending:["A","B","C","D","E","F","G","H","..."],
			time:"1p - 3p",
			exit:function(){}
			
		},options);
		
		this.el = (elm instanceof jQuery)? elm : $(elm);
		this.init( options );
	}
	
	GRCalendarPopWindow.prototype.init = function( options ){
		this.color = options.color;
		this.description = options.description;
		this.timeString = options.time;
		this.attending = options.attending;
		this.title = options.title;		
		this.exitFn = options.exit;
	};
	GRCalendarPopWindow.prototype.render = function(){
		if(!this.el) return;
		
		var elm = this.el.parent().parent().parent();
		
		$(".gr-calendar .gr-pop-window").remove();
		
		var cont = $("<div />",{class:"gr-pop-window"});
		
		var cont_head = $("<div />",{class:"gr-pop-head"});
				// color box
				var color_box = $("<div />",{class:"gr-pop-color"});
				color_box.css("background-color",this.color);
				cont_head.append(color_box);
				
				// title
				var title_div = $("<div />",{class:"gr-pop-title"});
				title_div.text(this.title);
				cont_head.append(title_div);
				
				// time
				var time_div = $("<div />",{class:"gr-pop-time"});
				time_div.text(this.timeString);
				cont_head.append(time_div);
				
				// exit
				var exit_div = $("<div />",{class:"gr-pop-exit"});
				exit_div.text("X");
				
				var exitOptFn = this.exitFn;
				exit_div.on('click',function(){
					exitOptFn();
					$(this).parent().parent().remove();
					return false; // make sure it doesn't propagate
				});
				
				cont_head.append(exit_div);
				
				
		cont.append(cont_head);
		
		// description
		var descr_div = $("<div />",{class:"gr-pop-desc"});
		descr_div.text(this.description);
		cont.append(descr_div);
		
		// attending
		var attend_div = $("<div />",{class:"gr-pop-attending"});
		for(var i = 0; i < this.attending.length; i++){
			var x = $("<div />",{class:"gr-attending-personal"});
			x.text(this.attending[i]);
			attend_div.append(x);
		}		
		cont.append(attend_div);
		
		elm.append(cont);
		
		return cont;
	}
	
	
	//---------------------------------------------------------------------
 
    $.fn.grCalendar = function( options ) {
	
		return this.each(function(){
		
			this._grcalendar = new GRCalendar( $(this), options );
			this._grcalendar.render();
			$(this).on('resize',function(){
				this._grcalendar.render();
			});
			
		});
 
    };
 
}( jQuery ));