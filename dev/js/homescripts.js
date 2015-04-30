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
	
	// Updates
	GRMAIN.oneventupdate = function(x){
		if(x.length){
			__resetEvents();
		}
	};
	GRMAIN.ontaskupdate = function(x){
		if(x.length){
			__resetTasks();
		}
	};
	GRMAIN.onupdateupdate = function(x){
		if(x.length){
			__resetUpdates();
		}
	};
	
	GRMAIN.load(_cookies,
		function(){
			addUsersInfo();
		},	
		function(){
			//they don't have the necessary access to see this page have them login again
			window.location="https://www.groupright.net"+GR_DIR+"/login.html";
		}
	);

};

var __initialized = false;

function addUsersInfo(){
	
	var initLightbox = !__initialized;
	
	// Top Bar (Adjustment) --------------------------
	fixGroupFilter();
		
	// Dashboard -------------------------------------
	addCalendarInfo();		// init calendar
	addTasks();				// init tasks
	addUpdates();			// init updates
	
	if(!initLightbox) return;
	

	// Lightbox Forms --------------------------------
	initCreateGroup();		// 'Create a Group'
	initScheduleEvent();	// 'Schedule an Event'
	initStartTask();		// 'Start a Task'
	initSendMessage();		// 'Send Message'
	
}

function __resetDashboard(){
	// Clear
	$("#calendar").empty(); // calendar
	$("#addTasks").empty(); // tasks
	$("#addUpdates").empty(); // updates
	
	
	// Re-Populate
	addUsersInfo();
	
}

function __resetEvents(){
	$("#calendar").empty(); // calendar
	addCalendarInfo();		// init calendar	
}
function __resetTasks(){
	$("#addTasks").empty(); // calendar
	addTasks();		// init calendar	
}
function __resetUpdates(){
	$("#addUpdates").empty(); // calendar
	addUpdates();		// init calendar	
}

function fixGroupFilter(){
	var x = GRMAIN._filterGUID;
	if(x){
		var gname = GRMAIN.group(x).group_name;
		$("#usergroups").text(gname).append( $("<span />",{class:"caret"}) );
	}else{
		$("#usergroups").text("All Groups").append( $("<span />",{class:"caret"}) );		
	}
	
	if(!__initialized){
		$(".usergrouplinks").click(function(){
			$(this).parent().parent().parent().removeClass('open');
			
			var guid_href = $(this).attr("href");
			guid_href = guid_href.match(/guid=([0-9]*)/);
			if(guid_href instanceof Array) guid_href = guid_href[1];
			else guid_href = "";
			
			// Set Filter
			if(guid_href.trim() != "")
				GRMAIN.filterByGroupID(parseInt(guid_href));
			else
				GRMAIN.removeFilter();
			
			__resetDashboard();
					
			return false;
		});
		__initialized = true;
	}
}

function __checkEvent(ent){	
	if(!ent.start_time || !ent.end_time) return false;	// not set.
	
	var start_date = new Date(ent.start_time);
	if(isNaN(start_date.getTime())) return false;		// invalid date
	
	//console.log(start_date);
	if((new Date()) - start_date > 24*60*60*1000) return false;			// event is older than a day.
	
	return true;
}

function __formatEvent(raw){
		var gs = new Date(raw.start_time);
		var ge = new Date(raw.end_time);
		
		var obj = {};
		obj.title = raw.name;
		obj.description = raw.description;
		obj.color = GRMAIN.group(raw.group_id).group_color;
		
		var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
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
		
		obj.__startHour = gs.getHours();
		obj.__endHour = ge.getHours();
		
		return obj;
}

function addCalendarInfo(){
	
	// FILTERING
	//	[may need to be moved to GRMainModule / Server]
	var evnts = GRMAIN.events();
	
	var good = new Array();
	for(var i = 0; i < evnts.length; i++){		
		if(__checkEvent(evnts[i])) good.push(evnts[i]);
	}
	
	//console.log(good);
	
	var sh,eh,sd;	// start hour, end hour, start day
	
	var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	sd = days[ (new Date()).getDay() ];
	
	var hours = ["12am","1am","2am","3am","4am","5am","6am","7am","8am","9am","10am","11am",
					"12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm","11pm"];
	sh = 9; eh = 18;
	
	var prepped = new Array();
	
	for(var i = 0; i < good.length; i++){
		var obj = __formatEvent(good[i]);
		prepped.push(obj);
		
		// update bounds
		if( obj.__startHour < sh) sh = obj.__startHour;
		if( obj.__endHour+1 > eh) eh = obj.__endHour+1;
	}
		
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
	//for(var i=0; i<task_array.length; i++){
	for(var i=task_array.length-1; i >= 0; i--){
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
		$(link).text( task_array[i].task_title );
		var collapseDiv=document.createElement('div');
		$(collapseDiv).attr( 'id', 'collapse'+temp );
		$(collapseDiv).attr( 'class', 'panel-collapse collapse' );
		$(collapseDiv).attr( 'role', 'tabpannel' );
		$(collapseDiv).attr( 'aria-labelledby', 'heading'+temp );
		var detailDiv=document.createElement('div');
		detailDiv.className="panel-body";
		var createdPar=document.createElement('p');
		
		$(createdPar).text( "Created By: "+getFullNameForEmail(task_array[i].creator) );
		createdPar.style.marginLeft="5px";
		collapseDiv.appendChild(createdPar);
		//var responsibilityPar=document.createElement('p');
		if(task_array[i].task_description==""){
			$(detailDiv).text( "No Description Provided" );
		}
		else{
			$(detailDiv).text( task_array[i].task_description );
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
			if(task_array[i].link_id!=null){
				//It's a task to provide availability
				var eventLink=document.createElement('a');
				console.log(task_array[i]);
				if(task_array[i].link_type == "event")
					eventLink.href="eventResponse.html?guid="+task_array[i].group_id+"&event_id="+task_array[i].link_id;
				else if(task_array[i].link_type == "event_report")
					eventLink.href="eventReport.html?guid="+task_array[i].group_id+"&event_id="+task_array[i].link_id;
				else
					eventLink.href="#";
				var span=document.createElement('span');
				span.className="glyphicon glyphicon-arrow-right";
				span.style.color=getColorForGroup(task_array[i].group_id);
				eventLink.appendChild(span);
				button.appendChild(eventLink);
				button.style.border="2px solid"+getColorForGroup(task_array[i].group_id);
			}
			else{
				//It's a default task
				button.style.border="2px solid"+getColorForGroup(task_array[i].group_id);
				$(button).attr('onclick','toggleTask(this,'+task_array[i].task_uid+','+i+')');
			}
		}
		


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
		$(h4).text( getFullNameForEmail(updates[i].email)+" "+updates[i].description );
		var p=document.createElement('p');
		$(p).attr('class','list-group-item-text');
		$(p).text( getFullNameForEmail(updates[i].email)+" "+updates[i].description );
		//a.style.backgroundColor=DEFAULT_GR_COLORS[Math.floor(Math.random() * 8) ];
		a.style.backgroundColor=getColorForGroup(updates[i].group_id);
		a.appendChild(h4);
		//a.appendChild(p);
		adder.appendChild(a);

	}


}

//-------------------------------------------------------------------

function initCreateGroup(){
	$('#selectize').selectize({
	    plugins: ['remove_button'],
	    valueField: 'email',
	    labelField: 'first_name',
	    searchField: ['first_name','email'],
	    options: GRMAIN.contacts(),
	    delimiter: ', ',
	    persist: false,
	    create: function (input) {
	      return {
	        email: input,
	        first_name: input,
	        last_name: input
	      };
	    },
	    hideSelected: true,
	    openOnFocus: false,
	});

	$('#selectize').change(function(){
		//console.log("you select value="+$(this).val());
		globalNewGroup=$(this).val();
		//console.log(globalNewGroup);
	});
	
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
	
	function updateMessageCount(){
		var _cookies = genCookieDictionary();
		if(_cookies.accesscode && _cookies.user){
				var obj = {
						"ac":_cookies.accesscode,
						"email":_cookies.user,
						"function":"get_num_unread"
				};

				// Contact Server
				$.ajax("https://www.groupright.net"+GR_DIR+"/groupserve.php",{
						type:"POST",
						data:obj,
						statusCode:{
								200: function(data, status, jqXHR){
									try{
										var num_unread = parseInt(data);
										$("#messageCount").show().text(num_unread);
										if(num_unread == 0) $("#messageCount").hide();
									}catch(e){
										$("#messageCount").hide().text("?");
									}
								},
								211: function(data, status, jqXHR){
									console.warn("Could Not Get # Unread fx: initSendMessage")
								}
						}

				});
		}
		else{
				console.warn("Unauthorized User send to login fx: toggleTask");
		}
	};
	
	updateMessageCount();
	GRMSG.addUpdateListener(updateMessageCount);
}



function toggleTask(element, taskid, localIndex){
    var task_array=GRMAIN.tasks();
    var _cookies = genCookieDictionary();
	if(_cookies.accesscode && _cookies.user){
			var obj = {
					"ac":_cookies.accesscode,
					"email":_cookies.user,
					"function":"mark_task_complete",
					"task_id":taskid
			};

			// Contact Server
			$.ajax("https://www.groupright.net"+GR_DIR+"/groupserve.php",{
					type:"POST",
					data:obj,
					statusCode:{
							200: function(data, status, jqXHR){
											element.style.backgroundColor=getColorForGroup(task_array[localIndex].group_id);
											element.style.border="2px solid #666";
											$(element).attr('onclick','return;');
											//Clean the global object
											GRMAIN.task(taskid).isCompleted="1";
											//Do something with the update
											
									},
							211: function(data, status, jqXHR){
											console.warn("Could Not Mark Task Completed fx: toggleTask")
									}
					}

			});
	}
	else{
			console.warn("Unauthorized User send to login fx: toggleTask");
	}

}




