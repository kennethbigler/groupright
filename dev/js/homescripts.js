// homescripts.js
//
//		Scripts that are applied more or less exclusively to home.html


//============================================================
// GLOBALS
GRMAIN;	// GRMainModule - as defined in grmainmodule.js


//============================================================
// UTILITY FUNCTIONS

//returns a contact if it is in the user's global address book
//FALSE otherwise
function isInContacts(email){
	return (GRMAIN.contact(email)) ? true : false;
}

function getFullNameForEmail(email){
	var person = GRMAIN.contact(email);
	if(person) return person.first_name+" "+person.last_name;
	
	console.warn("No contact found in fx: getFullNameForEmail");
	return "Unknown";
}

function getColorForGroup(groupid){
	var color= GRMAIN.group(groupid).group_color;
	return color;

	console.warn("No color found in fx: getColorForGroup");
	return "FFFFFF";	
}



//============================================================
// LOADING / INITIALIZATION

window.onload = function() {
	//get the cookies and get all of the data from the server
	var _cookies = genCookieDictionary();
	
	GRMAIN = new GRMainModule();
	
	// Filtering
	var filter_guid = getGETArguments()["guid"];
	if(filter_guid) GRMAIN.filterByGroupID(filter_guid);
	
	GRMAIN.load(_cookies,
		function(){
			addUsersInfo();
		},	
		function(){
			//they don't have the necessary access to see this page have them login again
			window.location="https://www.groupright.net/dev/login.html";
		}
	);

};


function addUsersInfo(){
		
	// Dashboard -------------------------------------
	addCalendarInfo();		// init calendar
	addTasks();				// init tasks
	addUpdates();			// init updates
	
	// Lightbox Forms --------------------------------
	initCreateGroup();		// 'Create a Group'
	initScheduleEvent();	// 'Schedule an Event'
	initStartTask();		// 'Start a Task'
	initSendMessage();	// 'Send Message'
	
}


function addCalendarInfo(){
	
	// FILTERING
	//	[may need to be moved to GRMainModule / Server]
	var evnts = GRMAIN.events();
	
	var good = new Array();
	for(var i = 0; i < evnts.length; i++){
		var ent = evnts[i];
		
		if(!ent.start_time || !ent.end_time) continue;	// not set.
		
		var start_date = new Date(ent.start_time);
		if(isNaN(start_date.getTime())) continue;		// invalid date
		
		//console.log(start_date);
		if(new Date() > start_date) continue;			// event is past.
		
		good.push(ent);
	}
	
	console.log(good);
	
	var sh,eh,sd;	// start hour, end hour, start day
	
	var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	sd = days[ (new Date()).getDay() ];
	
	var hours = ["12am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
					"12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
	sh = 9; eh = 18;
	
	var prepped = new Array();
	
	for(var i = 0; i < good.length; i++){
		var gs = new Date(good[i].start_time);
		var ge = new Date(good[i].end_time);
		
		var obj = {};
		obj.title = good[i].name;
		obj.description = good[i].description;
		obj.color = GRMAIN.group(good[i].group_id).group_color;
		obj.day = days[ gs.getDay() ];
		
		function formatAMPM(date) {
			var hours = date.getHours();
			var minutes = date.getMinutes();
			var ampm = hours >= 12 ? 'pm' : 'am';
			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? '0'+minutes : minutes;
			var strTime = hours + ':' + minutes + '' + ampm;
			return strTime;
		}
		
		obj.start_time = formatAMPM(gs);
		obj.end_time = formatAMPM(ge);
		
		prepped.push(obj);
		
		// update bounds
		if( gs.getHours() < sh) sh = gs.getHours();
		if( ge.getHours()+1 > eh) eh = ge.getHours() + 1;
	}
	
	console.log(sh+","+eh+","+sd);
	console.log(prepped);
	
	var cal = $("#calendar");
		cal.grCalendar({
			num_days:5,
			start_hour:hours[sh],
			end_hour:hours[eh],
			start_day:sd
		});
		
		cal[0]._grcalendar.addEvents(prepped);
}

function addTasks(){
	var task_array = GRMAIN.tasks();
	
	var tasks=document.getElementById('addTasks');
	if(task_array.length==0){
		//Add no pending tasks
		return;
	}
	//document.getElementById('taskNumber').innerHTML=task_array.length;
	for(var i=0; i<task_array.length; i++){
		var div=document.createElement('div');
		div.className="alert alert-danger";
		var temp=i+1;
		var containingDiv=document.createElement('div');
		containingDiv.className="panel panel-default";
		var headingDiv=document.createElement('div');
		headingDiv.className="panel-heading row";
		$(headingDiv).attr( 'role', 'tab' );
		$(headingDiv).attr( 'id', 'heading'+temp );
		headingDiv.style.marginLeft="0px";
		headingDiv.style.marginRight="0px";
		var heading=document.createElement('h4');
		heading.className="panel-title";
		var link=document.createElement('a');
		link.style.color="black";
		$(link).attr( 'data-toggle', 'collapse' );
		$(link).attr( 'data-parent', '#addTasks' );
		$(link).attr( 'href', '#collapse'+temp);
		$(link).attr( 'aria-expanded', 'false' );
		$(link).attr( 'aria-controls', 'collapse1' );
		link.innerText=task_array[i].task_title;
		var collapseDiv=document.createElement('div');
		$(collapseDiv).attr( 'id', 'collapse'+temp );
		$(collapseDiv).attr( 'class', 'panel-collapse collapse' );
		$(collapseDiv).attr( 'role', 'tabpannel' );
		$(collapseDiv).attr( 'aria-labelledby', 'heading'+temp );
		var detailDiv=document.createElement('div');
		detailDiv.className="panel-body";
		var createdPar=document.createElement('p');
		
		createdPar.innerText+="Created By: "+getFullNameForEmail(task_array[i].creator);
		createdPar.style.marginLeft="5px";
		collapseDiv.appendChild(createdPar);
		//var responsibilityPar=document.createElement('p');
		if(task_array[i].task_description==""){
			detailDiv.innerText="No Description Provided";
		}
		else{
			detailDiv.innerText=task_array[i].task_description;
		}

		var headingDivColLeft=document.createElement('div');
		$(headingDivColLeft).attr( 'class', 'col-sm-10' );

		var headingDivColRight=document.createElement('div');
		$(headingDivColRight).attr( 'class', 'col-sm-2' );

		var button=document.createElement('button');
		$(button).attr('class','btn btn-default btn-circle pull-right vcenter');
		if(task_array[i].is_completed=="1"){
			button.style.backgroundColor=getColorForGroup(task_array[i].group_id);
		}
		else{
			button.style.border="2px solid"+getColorForGroup(task_array[i].group_id);
		}
		$(button).attr('onclick','toggleTask(this,'+task_array[i].task_uid+')');


		collapseDiv.appendChild(detailDiv);
		heading.appendChild(headingDivColLeft);
		heading.appendChild(headingDivColRight);
		headingDivColLeft.appendChild(link);
		headingDivColRight.appendChild(button);
		headingDiv.appendChild(heading);
		containingDiv.appendChild(headingDiv);
		containingDiv.appendChild(collapseDiv);
		containingDiv.style.margin="10px";
		//headingDiv.style.color="darkBlue";
		//headingDiv.style.backgroundColor="#8AB5E3";
		//headingDiv.style.backgroundColor=gr_colors[Math.floor(Math.random() * 12) ];
		//containingDiv.style.borderLeft="12px solid "+DEFAULT_GR_COLORS[Math.floor(Math.random() * 8) ];
		containingDiv.style.borderLeft="12px solid "+getColorForGroup(task_array[i].group_id);
		/*div.className="alert";
		div.style.backgroundColor="lightBlue";
		div.style.border="1px solid darkBlue";
		var paragraph=document.createElement('p');
		paragraph.style.color="darkBlue";
		paragraph.innerText=task_array[i].task_title;
		//paragraph.innerHTML='<a id="popoverData" class="btn" href="#" data-content="Popover with data-trigger" rel="popover" data-placement="bottom" data-original-title="Title" data-trigger="hover">Popover with data-trigger</a>'
		div.appendChild(paragraph);
		*/
		document.getElementById('addTasks').appendChild(containingDiv);
	}

}


function addUpdates(){
	
	var updates = GRMAIN.updates();

	var adder=document.getElementById("addUpdates");
	for(var i=0; i<updates.length; i++){
		//var span = document.createElement('span');
		//$(span).attr('class','glyphicon glyphicon-asterisk');
		//span.style.color=gr_colors[Math.floor(Math.random() * 8) ];
		var a=document.createElement('a');
		$(a).attr( 'class', 'list-group-item' );
		$(a).attr( 'href', '#' );
		var h4=document.createElement('h4');
		//h4.appendChild(span);
		$(h4).attr('class','list-group-item-heading');
		h4.innerText=getFullNameForEmail(updates[i].email)+" "+updates[i].description;
		var p=document.createElement('p');
		$(p).attr('class','list-group-item-text');
		p.innerText=getFullNameForEmail(updates[i].email)+" "+updates[i].description;
		//a.style.backgroundColor=DEFAULT_GR_COLORS[Math.floor(Math.random() * 8) ];
		a.style.backgroundColor=getColorForGroup(updates[i].group_id);
		a.appendChild(h4);
		a.appendChild(p);
		adder.appendChild(a);

	}


}

//-------------------------------------------------------------------

function initCreateGroup(){
	document.getElementById("member1").value = GRMAIN.user;
}

function initScheduleEvent(){
	var allGroups = GRMAIN.groups();
	// adding todays date as the value to the datepickers.
	var d = new Date();
	var curr_day = d.getDate();
	var curr_month = d.getMonth() + 1; //Months are zero based
	var curr_year = d.getFullYear();
	var ustoday = curr_month + "/" + curr_day + "/" + curr_year;
	$("div.datepicker input").attr('value', ustoday);

	//calling the datepicker for bootstrap plugin
	// https://github.com/eternicode/bootstrap-datepicker
	// http://eternicode.github.io/bootstrap-datepicker/
	$('.input-daterange').datepicker({
		autoclose:true,
    	todayHighlight: true
	});
	$('#startdatefixed').datepicker({
    	todayHighlight: true,
    	autoclose:true
	});
	$('#enddatefixed').datepicker({
    	todayHighlight: true,
    	autoclose:true
	});
	$('#timepicker1').timepicker();
	$('#timepicker2').timepicker();

	var groupMenu = document.getElementById("eventGroups");
	var numGroups = allGroups.length;

	//If no groups
	if(numGroups==0){
		console.warn("You currently have no groups. Events will not work.");
	}

	//If only one group, make it default
	if(numGroups==1){
		groupMenu.innerHTML="";
	}

	for(var i = 0; i < numGroups; i ++) {
		var item=document.createElement('option');
		//item.style.color=allGroups[i].group_color;
		item.value=allGroups[i].group_id;
		item.innerHTML=allGroups[i].group_name;
		groupMenu.appendChild(item);
	}
}

function initStartTask(){

	var allGroups = GRMAIN.groups();
	var groupMenu = document.getElementById("taskGroups");
	var numGroups = allGroups.length;

	//If no groups
	if(numGroups==0){
		console.warn("You currently have no groups. Events will not work.");
	}

	//If only one group, make it default
	if(numGroups==1){
		groupMenu.innerHTML="";
	}

	for(var i = 0; i < numGroups; i ++) {
		var item=document.createElement('option');
		//item.style.color=allGroups[i].group_color;
		item.value=allGroups[i].group_id;
		item.innerHTML=allGroups[i].group_name;
		groupMenu.appendChild(item);
	}
}

function initSendMessage(){

	var allGroups = GRMAIN.groups();
	var groupMenu = document.getElementById("messageGroups");
	var numGroups = allGroups.length;

	//If no groups
	if(numGroups==0){
		console.warn("You currently have no groups. Events will not work.");
	}

	//If only one group, make it default
	if(numGroups==1){
		groupMenu.innerHTML="";
	}

	for(var i = 0; i < numGroups; i ++) {
		var item=document.createElement('option');
		//item.style.color=allGroups[i].group_color;
		item.value=allGroups[i].group_id;
		item.innerHTML=allGroups[i].group_name;
		groupMenu.appendChild(item);
	}
}



function toggleTask(element, taskid){

	alert("Toggling Task");
}


//============================================================
// LOGOUT

function logoutAndRedirect(){
	
	var _cookies = genCookieDictionary();

	if(_cookies.accesscode && _cookies.user){
	
		var obj = {
			"code":_cookies.accesscode,
			"email":_cookies.user,
			"function":"logout_user"
		};
	
		// Contact Server
		$.ajax("https://www.groupright.net/dev/groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
						eatCookies();
						window.location = "./index.html"; /* presumed redirect */
					},
				211: function(data, status, jqXHR){
						eatCookies();
						window.location = "./index.html"; //redirect, but be kind of misleading when doing it
					}
			}
		
		});
	}
	//For Safety Do it here too
	/*eatCookies();
	window.location = "./index.html"; //redirect, but be really misleading when doing it
	*/
}

