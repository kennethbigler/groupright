function createTask(){
	//get the task name
	var task_title = document.getElementById("taskNameField").value;
	if (task_title == "" || task_title.length<=0) {
		alert("Your Task Name is invalid");
		return false;
	}

	//get group
	if ($( "#taskGroups" ).val()=="XXX") {
		document.getElementById('eventError').innerHTML="Please select a group for the event.";
		return false;
	}
	var taskGroup = $( "#eventGroups option:selected" ).text();
	var taskGroupID = $( "#eventGroups" ).val();

	//get personal/group status
	var is_personal = document.getElementById("is_personal").elements["personal"].value;

	//get task description
	var task_description = document.getElementById("taskDescription").value;
	
	//get user access code
	var _cookies = genCookieDictionary();
	var email = _cookies.user; 
	var ac = _cookies.accesscode;
	var obj = {
				"function":"create_task",
				"email":email,
				"cookie":ac,
				"group_uid":,
				"event_uid":"",
				"task_title":task_title,
				"task_description":task_description,
				"is_personal":is_personal,
	};
	console.log(obj);

	// Contact Server
	$.ajax("https://www.groupright.net/dev/groupserve.php",{
			type:'POST',
			data:obj,
			statusCode:{
				200:function(data,status,jqXHR) {
					alert("Group Created");
					window.location = "./home.html";				
				},
				210:function() {
					//access denied, redirect to login
					alert("Access Denied");	
					window.location = "./login.html";
				},
				220:function() {
					//something else happened
					alert("We have literally no idea what happened.")
				}
			}
	});
	return false;
}
