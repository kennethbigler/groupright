function createGRTask(){
	document.getElementById('taskError').innerHTML="";
	//get group
	if ($( "#taskGroups" ).val()=="XXX") {
		document.getElementById('taskError').innerHTML="Please select a group for the task.";
		return false;
	}

	//get the task name
	var task_title = document.getElementById("taskNameField").value;
	if (task_title == "" || task_title.length<=0) {
		document.getElementById('taskError').innerHTML="Your Task Name is invalid";
		return false;
	}

	
	var taskGroup = $( "#taskGroups option:selected" ).text();
	var taskGroupID = $( "#taskGroups" ).val();

	//get personal/group status
	var is_personal = $('input[name="personal"]:checked').val();
	if (is_personal == undefined) {
		document.getElementById('taskError').innerHTML="Please indicate if the task is personal or for the group.";
		return false;
	}

	//get task description
	var task_description = document.getElementById("taskDescription").value;
	if (task_description == undefined) {
		document.getElementById('taskError').innerHTML="Your Task Name is invalid";
		return false;
	}

	//get user access code
	var _cookies = genCookieDictionary();
	var email = _cookies.user; 
	var ac = _cookies.accesscode;
	var obj = {
				"function":"create_task",
				"email":email,
				"cookie":ac,
				"group_uid":taskGroupID,
				"task_title":task_title,
				"task_description":task_description,
				"is_personal":is_personal
	};
	console.log(obj);

	// Contact Server
	$.ajax("https://www.groupright.net/dev/groupserve.php",{
			type:'POST',
			data:obj,
			statusCode:{
				200:function(data,status,jqXHR) {
					alert("Task Created");
					$('#createTaskBox').modal('hide');
					//window.location = "./home.html";				
				},
				210:function() {
					//access denied, redirect to login
					alert("Access Denied");
					$('#createTaskBox').modal('hide');
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
