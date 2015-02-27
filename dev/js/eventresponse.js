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
	start_time = "07:00:00";
	end_time = "15:00:00";
	event_name = "Code Spree";
	event_description = "To make up for a shit ton of laziness, we need to bum rush this.";
	event_creator = "Maniac McGee";	
	// ====================================
	GRER.eName = event_name;
	GRER.eDesc = event_description;
	GRER.eCreator = event_creator;
	
	
	
	// Display the grid for each day.
	var grid_space = $("#event_response_days");
	grid_space.css({"background-color":"green"});
	
	// Find number of days.
	var x = (( (new Date(end_day)) - (new Date(start_day)) ) / (1000*60*60*24) ) + 1;
	
	// For each day, create a column.
	console.log(x);
	for(var i = 0; i < x; i++){
		var day = $("<div />");
		day.css({minWidth:"120px",backgroundColor:"#eee",marginRight:"10px",height:"100%",float:"left"});
		
		grid_space.append(day);
		
		// For each column, create subdiv to map to the hours.
		var y_day = (new Date()).toDateString();
		var y = (new Date(y_day+" "+end_time)) - (new Date(y_day+" "+start_time));
		y = y / (1000*60*15); // 15 min incr.
		
		var availHeight = day.height();
		
		for(var j = 0; j < y; j++){
			var time_incr = $("<div />");
			time_incr.css({height:"15px",width:"100%",backgroundColor:"#ccc",marginBottom:"2px"});
			time_incr.val({i:i,j:j});
			var epoch_day_diff = (new Date(start_day) - new Date(0));
			var epoch_time_diff = new Date("2015-01-01 "+start_time) - new Date(0);
			var offset = new Date().getTimezoneOffset();
			time_incr.hover(function(){
				var rel = $(this).val();
				var str = "";
				var day = new Date( epoch_day_diff  + rel.i*24*60*60*1000 + offset*60*1000 );
				//console.log(day);
				str += (1+day.getMonth()) + "/" + day.getDate() + "/" + day.getFullYear();
				var day2 = new Date( epoch_time_diff + rel.j*15*60*1000);
				str += " "+day2.toLocaleTimeString();
				var day3 = new Date( epoch_time_diff + (rel.j+1)*15*60*1000);
				str += " - "+day3.toLocaleTimeString();

				updateHover(str);
			});
			time_incr.click(function(){
				var rel = $(this).val();
				var ER_colors = ["#5cb85c","#337ab7","#f0ad4e","#d9534f"];
				$(this).css({backgroundColor:ER_colors[GRER.aMode]});
				
			});
			day.append(time_incr);
			//console.log(time_incr.val());
		}
		
	}
	
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






$(document).ready(function(){
});