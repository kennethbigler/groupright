window.onload = function() {
	//get the cookies and get all of the data from the server
	var _cookies = genCookieDictionary();
	if(_cookies.accesscode && _cookies.user){
	
		var obj = {
			"cookie":_cookies.accesscode,
			"email":_cookies.user,
			"function":"get_user_info"
		};
	
		// Contact Server
		$.ajax("https://www.groupright.net/dev/groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
					addUsersInfo(data);
				},
				220: function(data, status, jqXHR){
					//they don't have the necessary access to see this page have them login again
					window.location="https://www.groupright.net/dev/login.html";
				}
			}
		
		});
	}
	else{
		console.warn("You are currently an Unauthenticated User accessing this page...This type of user Will Be Forced to Redirect in Final Version");
		//window.location="https://www.groupright.net/dev/login.html";
		var allGroups=[{"group_name":"Test1","group_color":"red","group_id":"77"},
				{"group_name":"Potatoes","group_color":"blue","group_id":"78"}];

		var tasks=[{
			"task_title":"Provide Availability for 'Yo Gabba Gabba'",
			"task_description":"",
			"group_id":"10",
			"creator":"scomatbarsar@gmail.com",
			"is_completed":"0",
			"is_personal":"1"
			},
			{
			"task_title":"Provide Availability for 'South Park Marathon'",
			"task_description":"",
			"group_id":"10",
			"creator":"scomatbarsar@gmail.com",
			"is_completed":"0",
			"is_personal":"1"
			}];
		console.log(allGroups);
		addCalendarInfo();
		initializeEvents(allGroups);
		addTasks(tasks);
	}

};

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
function initializeEvents(allGroups){
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

function addUsersInfo(data){
	var _cookies = genCookieDictionary();
	//What to do on the page load
	obj = JSON.parse(data);
	//Add their name
	addUsersName(obj.first_name);
	//Add their groups
	addUsersGroups(obj.memberships);
	//Deal with Profile Pick
	initials=obj.first_name[0] + obj.last_name[0];
	dealwithProfilePic(obj.photo_url,initials);
	//Do some calendar Stuff (Eventually will need some of the data)
	addCalendarInfo();
	//Add tasks
	addTasks(obj.tasks);
	//Add Updates
	addUpdates();
	//Set the user's email for creating groups
	document.getElementById("member1").value=_cookies.user;
	//initialize event date
	initializeEvents(obj.memberships);
	
}

function addUpdates(){


}
function addTasks(task_array){
	var tasks=document.getElementById('addTasks');
	if(task_array.length==0){
		//Add no pending tasks
		return;
	}
	//document.getElementById('taskNumber').innerHTML=task_array.length;
	for(var i=0; i<task_array.length; i++){
		var div=document.createElement('div');
		div.className="alert alert-danger";
		div.style.backgroundColor="lightBlue";
		div.style.border="1px solid darkBlue";
		var paragraph=document.createElement('p');
		paragraph.style.color="darkBlue";
		paragraph.innerText=task_array[i].task_title;
		//paragraph.innerHTML='<a id="popoverData" class="btn" href="#" data-content="Popover with data-trigger" rel="popover" data-placement="bottom" data-original-title="Title" data-trigger="hover">Popover with data-trigger</a>'
		div.appendChild(paragraph);
		document.getElementById('addTasks').appendChild(div);
	}

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
function addUsersName(firstName){
	document.getElementById("profileName").innerHTML=firstName+'<span class="caret"></span>';
}

function dealwithProfilePic(url, initials){
	//alert(initials);
	var profileImage=document.getElementById("profileImage");
	if(url==null){
		//alert("here");
		profileImage.src="images/black.png";
		profileImage.style.backgroundColor="orange";
		profileImage.style.border="2px solid #AF7817";
		//still have to do something with initials
		return;
	}
	profileImage.src=url;
}

/* Populate the groups field on the homepage with the "groups" json object */
function addUsersGroups(allGroups){
	
	var groupMenu = document.getElementById("myGroups");
	var numGroups = allGroups.length;
	var allMyGroups = '';

	for(var i = 0; i < numGroups; i ++) {
		allMyGroups += '<li><a href="#"><span class="glyphicon glyphicon-stop" style="color:' + 
			allGroups[i].group_color +
			';"></span>&nbsp;' +
			allGroups[i].group_name +
			'</a></li>';
	}
	groupMenu.innerHTML = allMyGroups;
}


