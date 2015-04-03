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



//============================================================
// LOADING / INITIALIZATION

window.onload = function() {
	//get the cookies and get all of the data from the server
	var _cookies = genCookieDictionary();
	
	GRMAIN = new GRMainModule();
	
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


function addUsersInfo(data){
	
	// Top Bar ---------------------------------------	
	initTopBar();
		
	// Dashboard -------------------------------------
	addCalendarInfo();		// init calendar
	addTasks();				// init tasks
	addUpdates();			// init updates
	
	// Lightbox Forms --------------------------------
	initCreateGroup();			// 'Create a Group'
	initScheduleEvent();		// 'Schedule an Event'
	initStartTask();			// 'Start a Task'
	
}


function addCalendarInfo(){
	var cal = $("#calendar");
		cal.grCalendar({num_days:5,start_hour:"7am",end_hour:"11pm",start_day:"Monday"});
		cal[0]._grcalendar.addEvent(
			{title:"Team Practice", color:"#FF6068", day:"Monday",start_time:"11am",end_time:"12:30pm"},
			{title:"Game 3", color:"#FF6068", day:"Thursday",start_time:"8:30pm",end_time:"9:30pm"},
			
			{title:"Project Meeting",color:"rgb(138, 181, 227)",day:"Tuesday",start_time:"7:30am",end_time:"9:00am"},
			{title:"Project Meeting",color:"rgb(138, 181, 227)",day:"Friday",start_time:"1:30pm",end_time:"2:45pm"},
			
			{title:"Product Test Meeting",color:"rgb(150, 232, 194)",day:"Tuesday",start_time:"10:15am",end_time:"11:30am"},
			{title:"Sales Call",color:"rgb(150, 232, 194)",day:"Wednesday",start_time:"12pm",end_time:"1pm"},
			{title:"Staff Picnic",color:"rgb(150, 232, 194)",day:"Friday",start_time:"10:30am",end_time:"12:15pm"},
			
			{title:"Zach's Dinner",color:"rgb(255, 240, 127)",day:"Monday",start_time:"7:15pm",end_time:"9:30pm"},
			{title:"Scott's Dinner",color:"rgb(255, 240, 127)",day:"Friday",start_time:"7:45pm",end_time:"10:00pm"}
		);
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
		headingDiv.className="panel-heading";
		$(headingDiv).attr( 'role', 'tab' );
		$(headingDiv).attr( 'id', 'heading'+temp );
		var heading=document.createElement('h4');
		heading.className="panel-title";
		var link=document.createElement('a');
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
		collapseDiv.appendChild(detailDiv);
		heading.appendChild(link);
		headingDiv.appendChild(heading);
		containingDiv.appendChild(headingDiv);
		containingDiv.appendChild(collapseDiv);
		containingDiv.style.margin="10px";
		//headingDiv.style.color="darkBlue";
		//headingDiv.style.backgroundColor="#8AB5E3";
		//headingDiv.style.backgroundColor=gr_colors[Math.floor(Math.random() * 12) ];
		containingDiv.style.borderLeft="12px solid "+DEFAULT_GR_COLORS[Math.floor(Math.random() * 8) ];
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
		a.style.backgroundColor=DEFAULT_GR_COLORS[Math.floor(Math.random() * 8) ];

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
		item.style.color=allGroups[i].group_color;
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
		item.style.color=allGroups[i].group_color;
		item.value=allGroups[i].group_id;
		item.innerHTML=allGroups[i].group_name;
		groupMenu.appendChild(item);
	}
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

