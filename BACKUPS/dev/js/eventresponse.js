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
	 aMap:{},		// availability map
	 tMap:{},		// time label map
	 eUID:null,
	 eName:"Default Name",
	 eDesc:"Default Description",
	 eCreator:"Default Creator",
	 gUID:null,
 };
 var GRER_Settings;
 
 $(document).ready(function(){
	getEventVoteSettings(function(){
		
		GRER_initialize(GRER_Settings); 
		
	});
 });

/**
 *	GRER_initialize()
 *
 *	Initializes the module
 *
 **/
function GRER_initialize(obj){
	
	var start_day,end_day;
	var start_time,end_time;
	var event_name,event_description,event_creator;
	
	// Load Event Information.
	
	// HARD-CODED =========================
	start_day = (obj.start_date) ? obj.start_date : "2015-02-27";
	end_day = (obj.end_date) ? obj.end_date : "2015-03-03";
	start_time = (obj.start_time) ? obj.start_time : "06:15:00";
	end_time = (obj.end_time) ? obj.end_time : "15:00:00";
	event_name = (obj.name) ? obj.name : "Code Spree";
	event_description = (obj.description) ? obj.description : "To make up for a shit ton of laziness, we need to bum rush this.";
	event_creator = (obj.creator) ? obj.creator : "Maniac McGee";	
	
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
			//GRER.tMap[i][j] = str;
			
			
			var obj = {start_time:"",end_time:"",date:""};
			var day = new Date( epoch_day_diff  + i*24*60*60*1000 + offset*60*1000 );
			obj.date = day.getFullYear()+"-"+("0"+(1+day.getMonth())).slice(-2) + "-" + ("0"+day.getDate()).slice(-2);
			obj.start_time = day2.toLocaleTimeString({},{hour12:false});
			obj.end_time = day3.toLocaleTimeString({},{hour12:false});
			
			
			GRER.tMap[i][j] = obj;
			
			
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
	
	// ----------------------------------------------------------------------
	// FUNCTIONALITY
	
	var start_cell = null;
	var last_end_cell = null;
	var temp_aMap = $.extend(true,{},GRER.aMap);
				
	// Cell Coloring -------------------------------------------------
	function indvColorCell(elm, index){
		var ER_colors = ["#5cb85c","#337ab7","#f0ad4e","#d9534f"];
		var sel_color = (index == -1) ? "#ccc" : ER_colors[index];
		elm.css({backgroundColor:sel_color});
	}
	
	function colorSpanByFn(start,end,fn){
		var x_dir = (end.i > start.i) ? 1 : -1;
		var y_dir = (end.j > start.j) ? 1 : -1;
		for(var i = start.i; i != end.i + x_dir; i += x_dir){
			for(var j = start.j; j != end.j + y_dir; j+= y_dir){
				var index = fn(i,j);
				indvColorCell($(".er_row"+j+".er_col"+i),index);
				temp_aMap[i][j] = index;
			}
		}
	}
	function colorCellSpan(start,end,index){
		colorSpanByFn(start,end,function(i,j){return index;});
	}
	function revertToMap(start,end){
		colorSpanByFn(start,end,function(i,j){return GRER.aMap[i][j];});
	}
	
	function colorCell(){
		var rel = $(this).val();
		if(last_end_cell) revertToMap(start_cell,last_end_cell);
		colorCellSpan(start_cell,rel,GRER.aMode);
		last_end_cell = rel;
	};
	
	function saveGRERMap(){
		//console.log("saving");
		for(var i in GRER.aMap){
			for(var j in GRER.aMap[i]){
				GRER.aMap[i][j] = temp_aMap[i][j];
			}
		}
		//console.log(GRER.aMap);
	}
	
	var isButtonDown = false;
	
	function timeIncrDown(e){
		var val = $(this).val();
		start_cell = val;				
		if(e.which === 1) isButtonDown = true; 
	};
	
	function timeIncrUp(e){
		last_end_cell = null;
		saveGRERMap();
		//console.log(GRER.aMap);
		if(e.which === 1) isButtonDown = false; 
	};
	
	function timeIncrMove(e){
		//console.log("called");
		if(oldIE && !event.button){isButtonDown = false;}				
		if(e.which === 1 && !isButtonDown) e.which = 0;
		if(e.which){
			colorCell.call(this);
		}
	};
	
	// ---------------------------------------------------------------------
	// CONSTRUCTION
	
	// For each day, create a column.
	var day_grid_space = $("<div />",{class:"er_day_gridspace"});
	grid_space.append(day_grid_space);
	for(var i = 0; i < x; i++){
		var day = $("<div />",{class:"er_daycol"});
		
		day_grid_space.append(day);
				
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
			
			time_incr.addClass("er_row"+j);
			time_incr.addClass("er_col"+i);
			time_incr.mousedown(timeIncrDown)
					.mouseup(timeIncrUp)
					.mousemove(timeIncrMove);
			
			day.append(time_incr);
		}
		
	}
	
	// Relate the Availability Buttons
	/*
	$("#avail_perfect").click(function(){ GRER.aMode = 0; });
	$("#avail_ok").click(function(){ GRER.aMode = 1; });
	$("#avail_rather_not").click(function(){ GRER.aMode = 2; });
	$("#avail_no").click(function(){ GRER.aMode = 3; });
	*/
	$("#avail_perfect").click(function(){ 
		GRER.aMode = 1; 
		$(this).hide();
		$("#avail_ok").show();
	});
	$("#avail_ok").click(function(){ 
		GRER.aMode = 2; 
		$(this).hide();
		$("#avail_rather_not").show();
	}).hide();
	$("#avail_rather_not").click(function(){ 
		GRER.aMode = 3; 
		$(this).hide();
		$("#avail_no").show();
	}).hide();
	$("#avail_no").click(function(){ 
		GRER.aMode = 0;
		$(this).hide();
		$("#avail_perfect").show();
	}).hide();
	
	// Update other parts.
	$("#event_title").text(GRER.eName);
	$("#event_description").text(GRER.eDesc);
	
	// save button
	$("#er_save_button").click( function(){
		sendEventAvailability(function(){});
	});
}


function getEventVoteSettings(postFn){
	if(!(postFn instanceof Function)){ postFn = function(){}; }

	var _cookies = genCookieDictionary();
	
	var _group_uid = 10;
	var _event_uid = 31;

	if(_cookies.accesscode && _cookies.user){
	
		var obj = {
			"cookie":_cookies.accesscode,
			"email":_cookies.user,
			"function":"get_event_settings",
			"group_uid":_group_uid,
			"event_uid":_event_uid
		};
	
		
		// Contact Server
		$.ajax("groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
						//eatCookies();
						GRER_Settings = JSON.parse(data);
						postFn();
					}
			},
			
		
		});
	}else{
		GRER_initialize({});
	}
}

function synthesizeAvailability(){
	var avail = new Array();
	for(var i in GRER.aMap){
		for(var j in GRER.aMap[i]){
			var obj = {};
			//console.log(GRER.tMap[i][j]);
			obj.start_time = GRER.tMap[i][j].start_time; // "07:00:00";
			obj.end_time = GRER.tMap[i][j].end_time; // "07:15:00";
			obj.date = GRER.tMap[i][j].date; //"2015-03-07";
			obj.score = GRER.aMap[i][j];
			console.log(obj);
			avail.push(obj);
		}
	}
	return avail;
}

function sendEventAvailability(postFn){
	if(!(postFn instanceof Function)){ postFn = function(){}; }
	
	var _cookies = genCookieDictionary();
	
	var _group_uid = 10;
	var _event_uid = 31;

	if(_cookies.accesscode && _cookies.user){
	
		var obj = {
			"cookie":_cookies.accesscode,
			"email":_cookies.user,
			"function":"submit_availability",
			"group_uid":_group_uid,
			"event_uid":_event_uid,
			"availability":synthesizeAvailability()
		};
	
		
		// Contact Server
		$.ajax("groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
						//eatCookies();
						GRER_Settings = JSON.parse(data);
						postFn();
					}
			},
			
		
		});
	}else{
		console.log(synthesizeAvailability());
	}
}




$(document).ready(function(){
});