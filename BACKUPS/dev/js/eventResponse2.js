/**
	eventResponse2.js
	
		JavaScript file for the Event Response component of GroupRight.
**/

// ======================================================
// GLOBAL VARIABLES

var currentSelect=null;
var numberOfDays;
var stepsToAccountFor;
var eventCreator="Bob Smith";
var eventName="Quarterly BBQ";
var earliest_time="2015-03-28 23:00:00 PDT";
var latest_time="2015-04-03 5:30:00 PDT";

var color_classes = ["success","info","warning","danger"];
var current_color_class=1;

var availability_map = [];

// ======================================================
// ONLOAD / SERVER COMM.

window.onload = function() {
	
	getEventVoteSettings(function(data){
		var obj = JSON.parse(data);
		
		console.log(obj);
		if(obj.name) eventName = obj.name;
		if(obj.creator) eventCreator = obj.creator;
		if(obj.start_time) earliest_time = obj.start_time;
		if(obj.end_time) latest_time = obj.end_time;
		
		
		setNumberOfDays();
		setNumberOfStepsToAccountFor();
		//getDayForColumn(3);
		//getTimeForRow(3);
		drawPage();
	});
}
function getEventVoteSettings(parseFn){
	if(!(parseFn instanceof Function)){ parseFn = function(){}; }

	var _cookies = genCookieDictionary();
	
	var _group_uid = 10;
	var _event_uid = 50;

	if(_cookies.accesscode && _cookies.user){
	
		var obj = {
			"ac":_cookies.accesscode,
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
						parseFn(data);
					}
			},
			
		
		});
	}else{
		parseFn("{}");
	}
}

function sendEventAvailability(postFn){
	if(!(postFn instanceof Function)){ postFn = function(){}; }
	
	var _cookies = genCookieDictionary();
	
	var _group_uid = 10;
	var _event_uid = 50;

	if(_cookies.accesscode && _cookies.user){
	
		var obj = {
			"ac":_cookies.accesscode,
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

function synthesizeAvailability()
{
	var step_size = 30*60*1000;
	var day_size = 24*60*60*1000;
	var arr = new Array();
	for(var i in availability_map){
		for(var j in availability_map[i]){
			var obj = {};
			var d = new Date( new Date(earliest_time).getTime() + step_size*(i-1) + day_size*(j-1));
			obj.start_time = d.toJSON();
			obj.end_time = new Date(d.getTime()+step_size).toJSON();
			obj.score = availability_map[i][j];
			arr.push(obj);
		}
	}
	return arr;
}

// ======================================================
// DATA INITIALIZATION

function setNumberOfDays(){
	
	// Fix date format.
	earliest_time=earliest_time.replace(/[-]/g,"/");
	latest_time=latest_time.replace(/[-]/g,"/");
	
	// Derive dates
	var referenceDate=new Date(earliest_time);
	var referenceDate2=new Date(latest_time);
	
	// Count # of days.
	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
	numberOfDays = Math.ceil(Math.abs((referenceDate2.getTime() - referenceDate.getTime())/(oneDay)));
}

function setNumberOfStepsToAccountFor(){
	
	// Fix date format.
	earliest_time=earliest_time.replace(/[-]/g,"/");
	latest_time=latest_time.replace(/[-]/g,"/");
	
	// Derive dates
	var firstTime=new Date(earliest_time);
	var endTime=new Date(latest_time);
	
	// Determine # of 30 minute steps
	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
	
	stepsToAccountFor = Math.ceil(
		( 
			( 
				endTime.getTime() - firstTime.getTime()
			) % oneDay
		) / (30*60*1000)
	);
	console.log(stepsToAccountFor);
}

// ======================================================
// DATE / TIME ACCESS

function getDayForColumn(column){
	earliest_time=earliest_time.replace(/[-]/g,"/");
	var referenceDate=new Date(earliest_time);
	var addDays=(column-1);
	referenceDate.setDate(referenceDate.getDate()+addDays);
	var month=referenceDate.getMonth();
	var months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	return months[referenceDate.getMonth()]+" "+referenceDate.getDate();
}

function getTimeForRow(row){
	earliest_time=earliest_time.replace(/[-]/g,"/");
	var referenceDate=new Date(earliest_time);
	var addMinutes=(row-1)*30;
	referenceDate.setMinutes(referenceDate.getMinutes()+addMinutes);
	var hour=referenceDate.getHours();
	var minutes=referenceDate.getMinutes();
	var ampm="AM"
	if(hour==12){
		ampm="PM";
	}
	if(hour>12){
		ampm="PM";
		hour=hour%12;
	}
	if(String(minutes).length<2){
		minutes=minutes+"0";
	}
	if(hour==0){
		hour="12";
	}
	return hour+":"+minutes+" "+ampm;

}

// ======================================================
// DRAWING

function drawPage(){
	document.getElementById("addEventCreator").innerHTML="Creator: "+eventCreator;
	document.getElementById("addEventName").innerHTML="Event Name: "+eventName;
	var table=document.getElementById("completeTable");
	table.innerHTML="";
	var tbody=document.createElement('tbody');
	//Draw the rows
	availability_map = {};
	for(var i=0; i<stepsToAccountFor+1; i++){
		var tr=document.createElement('tr');
		//Draw the heading rows column specially
		if(i==0){
			var thead=document.createElement('thead');
			for(var j=0; j<numberOfDays+1;j++){
				var th=document.createElement('th');
				th.className="text-center";
				if(j==0){
					tr.appendChild(th);
				}
				else{
					th.innerText=getDayForColumn(j);//"Day "+j;
					tr.appendChild(th);
				}
			}
			thead.appendChild(tr);
			table.appendChild(thead);
		}
		else{
			availability_map[i] ={};
			for(var j=0; j<numberOfDays+1;j++){				
				var td=document.createElement('td');
				td.className="success";
				td.style.border="1px solid gray";
				if(j==0){
					td.innerText=getTimeForRow(i);
					td.className="text-center";
					tr.appendChild(td);
				}
				else{
					tr.appendChild(td);
					
					td.onclick = function(){ colorCell(this); }
					td.value = {i:i,j:j};
					td.className += " er_row"+i+" er_col"+j;
					availability_map[i][j] = 0;
					prepareCell(td);
				}
			}
			//tr.className="success";
			tbody.appendChild(tr);
		}
		
	}
	table.appendChild(tbody);
	
	// Functionality Setup
	Coloring.temp_a_map = $.extend(true, availability_map);
}


// ======================================================
// RUNTIME FUNCTIONALITY

//----------------------------------------
// Coloring

function setCurrentColorClass(cc)
{
	current_color_class = cc;
}

function colorCell(elm)
{
	$(elm).removeClass("success info warning danger");
	$(elm).addClass(color_classes[current_color_class]);
}

function colorCellByIndex(elm,index)
{
	$(elm).removeClass("success info warning danger");
	$(elm).addClass(color_classes[index]);	
}

var Coloring = {
	temp_a_map:[],
	start_cell:null,
	last_end_cell:null,
	isButtonDown : false
};

function prepareCell(elm)
{
	
	// Check version of browser.
	var oldIE = false;
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");
	if(msie > 0){
		var version = parseInt(ua.substring(msie+5,ua.indexOf(".",msie)));
		if(version < 9) oldIE = true;
	}
	
	/**
		colorSpan
			colors cells area selected by the user. (from start to end)
	**/
	function colorSpanByFn(start,end,fn){
		var x_dir = (end.i > start.i) ? 1 : -1;
		var y_dir = (end.j > start.j) ? 1 : -1;
		for(var i = start.i; i != end.i + x_dir; i += x_dir){
			for(var j = start.j; j != end.j + y_dir; j+= y_dir){
				index = fn(i,j);
				colorCellByIndex($(".er_row"+i+".er_col"+j)[0],index);
				Coloring.temp_a_map[i][j] = index;
			}
		}
	}
	
	function colorCellSpan(start,end,index){
		colorSpanByFn(start,end,function(i,j){return index;});
	}
	function revertToMap(start,end){
		colorSpanByFn(start,end,function(i,j){return availability_map[i][j];});
	}
	
	function colorCell(){
		
		// [optimization]
		if($(this).val() == Coloring.last_end_cell) return;
		
		// Revert previous coloring.
		if(Coloring.last_end_cell && Coloring.start_cell != Coloring.last_end_cell) 
			revertToMap(
				Coloring.start_cell,
				Coloring.last_end_cell
			);
			
		// Color the span.
		colorCellSpan(
			Coloring.start_cell,
			$(this).val(),
			current_color_class
		);
		
		// Save last_end_cell.
		Coloring.last_end_cell = $(this).val();
	};
	
	function saveMap(){
		//console.log("saving");
		for(var i in availability_map){
			for(var j in availability_map[i]){
				availability_map[i][j] = Coloring.temp_a_map[i][j];
			}
		}
		//console.log(availability_map);
	}
	
	// Event Listeners
	
	
	function timeIncrDown(e){
		var val = $(this).val();
		Coloring.start_cell = val;				
		if(e.which === 1) Coloring.isButtonDown = true; 
	};
	
	function timeIncrUp(e){
		Coloring.last_end_cell = null;
		saveMap();
		//console.log(availability_map);
		if(e.which === 1) Coloring.isButtonDown = false; 
	};
	
	function timeIncrMove(e){
		//console.log("called");
		if(oldIE && !event.button){Coloring.isButtonDown = false;}				
		if(e.which === 1 && !Coloring.isButtonDown) e.which = 0;
		if(e.which){
			colorCell.call(this);
		}
	};
	
	$(elm).mousedown(timeIncrDown)
			.mouseup(timeIncrUp)
			.mousemove(timeIncrMove);
	
}
