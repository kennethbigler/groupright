/**
 *	eventresponse.js
 *
 *	Goes hand-in-hand with eventResponse.html (surprising, I know).
 *
 *	Written by: Scott Sarsfield
 *
 * 	(C) GroupRight 2015
 **/
 
// Global Var (Our "Model" in MVC)
 var GRER = {
	 aMode:0,
	 aMap:{},
	 tMap:{},
	 eUID:null,
	 eName:"Default Name",
	 eDesc:"Default Description",
	 eCreator:"Default Creator",
	 gUID:null
 };
 
 $(document).ready(function(){
	GRER_initialize(); 
 });

/**
 *	GRER_initialize()
 *
 *	Initializes the module
 *
 **/
function GRER_initialize(){
	
	var start_day,end_day;
	var start_time,end_time;
	var event_name,event_description,event_creator;
	
	// Load Event Information.
	
	// HARD-CODED =========================
	start_day = "2015-02-27";
	end_day = "2015-03-03";
	start_time = "06:15:00";
	end_time = "15:00:00";
	event_name = "Code Spree";
	event_description = "To make up for a shit ton of laziness, we need to bum rush this.";
	event_creator = "Maniac McGee";	
	// ====================================
	GRER.eName = event_name;
	GRER.eDesc = event_description;
	GRER.eCreator = event_creator;
	
	
	
	// Display the grid for each day.
	var orig_grid_space = $("#event_response_days");
	
	var grid_space = $("<div />",{class:"er_gridspace"});
	orig_grid_space.append(grid_space);
	
	// Find number of days.
	var x = (( (new Date(end_day)) - (new Date(start_day)) ) / (1000*60*60*24) ) + 1;
	
	// Find number of time segments (15 minutes)
	var y_day = (new Date()).toDateString();
	var y = (new Date(y_day+" "+end_time)) - (new Date(y_day+" "+start_time));
	y = y / (1000*60*15); // 15 min incr.
	
	// Populate the tMap (time map).	
	var epoch_day_diff = (new Date(start_day)).getTime();
	var epoch_time_diff = (new Date("2015-01-01 "+start_time)).getTime();
	var offset = new Date().getTimezoneOffset();
	var dates = [];
	var hours = {};
	for(var i = 0; i < x; i++){
		GRER.tMap[i] = {};
		GRER.aMap[i] = {};
		for(var j = 0; j < y; j++){
			var str = "";
			var day = new Date( epoch_day_diff  + i*24*60*60*1000 + offset*60*1000 );
			//console.log(day);
			str += (1+day.getMonth()) + "/" + day.getDate() + "/" + day.getFullYear();
			dates[i] = str;
			var day2 = new Date( epoch_time_diff + j*15*60*1000);
			if(day2.getMinutes() == 0) hours[j] = day2.getHours();
			str += " "+day2.toLocaleTimeString();
			var day3 = new Date( epoch_time_diff + (j+1)*15*60*1000);
			str += " - "+day3.toLocaleTimeString();
			GRER.tMap[i][j] = str;
			
			//----------------------
			GRER.aMap[i][j] = -1;
		}
	}
	
	// Check version of browser.
	var oldIE = false;
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	if(msie > 0){
		var version = parseInt(ua.substring(msie+5,ua.indexOf(".",msie)));
		if(version < 9) oldIE = true;
	}
	
	// Add the time column.
	var time_col = $("<div />",{class:"er_timecol"});
	grid_space.append(time_col);
	time_col.append( $("<div />",{class:"er_timecol_spacer"}) );
	for(var j = 0; j < y; j++){
		if(hours[j]){
			var hour_incr = $("<div />",{class:"er_hour_incr"});
			
			var ampm = (hours[j] >= 12) ? 'pm' : 'am';
			hours[j] = hours[j] % 12;
			hours[j] = hours[j] ? hours[j] : 12;
			var hour_str = "<span class='num'>" + hours[j] + "</span> " + ampm;
			
			
			hour_incr.html(hour_str);
			time_col.append(hour_incr);
			j+=3;
		}else{
			var hour_incr_spacer = $("<div />",{class:"er_hour_incr_spacer"});
			time_col.append(hour_incr_spacer);
		}
	}
	
	// For each day, create a column.
	for(var i = 0; i < x; i++){
		var day = $("<div />",{class:"er_daycol"});
		
		grid_space.append(day);
				
		// Add the day header.
		var day_header = $("<div />",{class:"er_dayheader"});
		day_header.text(dates[i]);
		day.append(day_header);
		
		// Add each of the hours
		for(var j = 0; j < y; j++){
			var time_incr = $("<div />",{class:"er_time_incr"});
			
			// won't necessarily start at hour, but workable.
			if(hours[j]) time_incr.addClass("hour_marker");
			
			time_incr.val({i:i,j:j});
			
			// Hover - update hover info.
			time_incr.hover(function(){
				var rel = $(this).val();
				updateHover(GRER.tMap[rel.i][rel.j]);
			});
			
			// Color cell mark availability.
			function colorCell(){
				var rel = $(this).val();
				var ER_colors = ["#5cb85c","#337ab7","#f0ad4e","#d9534f"];
				$(this).css({backgroundColor:ER_colors[GRER.aMode]});
				GRER.aMap[rel.i][rel.j] = GRER.aMode;
			};
			
			//time_incr.click(colorCell);
			var isButtonDown = false;
			var currentDayIndex = 0;
			var startTimeIndex = 0;
			var endTimeIndex = 0;
			time_incr.mousedown(function(e){
				var val = $(this).val();
				currentDayIndex = val.i;
				startTimeIndex = val.j;
				if(e.which === 1) isButtonDown = true; 
			});
			time_incr.mouseup(function(e){ if(e.which === 1) isButtonDown = false; });
			
			time_incr.mousemove(function(e){
				if(oldIE && !event.button){isButtonDown = false;}				
				if(e.which === 1 && !isButtonDown) e.which = 0;
				var val = $(this).val();				
				if(e.which && val.i == currentDayIndex) colorCell.call(this);
			});
			day.append(time_incr);
			//console.log(time_incr.val());
		}
		
	}
	
	// Relate the Availability Buttons
	$("#avail_perfect").click(function(){ GRER.aMode = 0; });
	$("#avail_ok").click(function(){ GRER.aMode = 1; });
	$("#avail_rather_not").click(function(){ GRER.aMode = 2; });
	$("#avail_no").click(function(){ GRER.aMode = 3; });
}


function updateHover(txt){
	$("#hoverTimePrintout").text(txt);
}
function updateAvailMap(loc){
	
}

function getEventVoteSettings(){

	var _cookies = genCookieDictionary();
	
	_cookies.user = "scomatbarsar@gmail.com";
	_cookies.accesscode = "J8vd7t9Y7KRimcA9z4ec2LxmqG24lz5V";

	if(_cookies.accesscode && _cookies.user){
	
		var obj = {
			"code":_cookies.accesscode,
			"email":_cookies.user,
			"function":"get_event_settings"
		};
	
		
		// Contact Server
		$.ajax("https://www.groupright.net/dev/groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
						eatCookies();
						var json = JSON.parse(data);
						console.log(json);
					},
				211: function(data, status, jqXHR){
						eatCookies();
					}
			}
		
		});
	}
}




$(document).ready(function(){
});