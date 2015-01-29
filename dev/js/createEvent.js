var eventstep=1;
var eventIsFixed=false;
function previous(){
	if(eventstep==1){
		return;
	}
	else{
		eventstep--;
		displayPreviousEvent(eventstep);
	}
}
function next(){
	if(eventstep==5){
		return;
	}
	else{
		if(isValid(eventstep)){
			eventstep++;
			displayNextEvent(eventstep);
		}
	}
}
function updateProgressBar(step){
	if(step==5){
		var percent=step*20 -3;
	}
	else{
		var percent=step*20;
	}
	percent=percent+"%";
	document.getElementById("eventprogress").style.width=percent;
}
function displayNextEvent(step){
	updateProgressBar(step);
	if(step==2){
		document.getElementById("eventStep1").style.display="none";
		document.getElementById("eventStep2").style.display="block";
		document.getElementById("eventPreviousButton").style.display="block";
	}
	else if(step==3 && eventIsFixed){
		document.getElementById("eventStep2").style.display="none";
		document.getElementById("eventStep3fixed").style.display="block";
	}
	else if(step==3 && !eventIsFixed){
		document.getElementById("eventStep2").style.display="none";
		document.getElementById("eventStep3help").style.display="block";
	}
	else if(step==4 && eventIsFixed){
		document.getElementById("eventStep4fixed").style.display="block";
		document.getElementById("eventStep3fixed").style.display="none";
	}
	else if(step==4 && !eventIsFixed){
		document.getElementById("eventStep4help").style.display="block";
		document.getElementById("eventStep3help").style.display="none";
	}
	else if(step==5 && eventIsFixed){
		document.getElementById("eventStep4fixed").style.display="none";
		document.getElementById("eventStep5").style.display="block";
		document.getElementById("eventNextButton").style.display="none";
		document.getElementById("createEventButton").style.display="block";
	}
	else if(step==5 && !eventIsFixed){
		document.getElementById("eventStep4help").style.display="none";
		document.getElementById("eventStep5").style.display="block";
		document.getElementById("eventNextButton").style.display="none";
		document.getElementById("createEventButton").style.display="block";
	}
}
function displayPreviousEvent(step){
	updateProgressBar(step);
	if(step==1){
		document.getElementById("eventStep2").style.display="none";
		document.getElementById("eventStep1").style.display="block";
		document.getElementById("eventPreviousButton").style.display="none";
	}
	else if(step==2){
		document.getElementById("eventStep2").style.display="block";
		document.getElementById("eventStep3help").style.display="none";
		document.getElementById("eventStep3fixed").style.display="none";
	}
	else if(step==3 && eventIsFixed){
		document.getElementById("eventStep4fixed").style.display="none";
		document.getElementById("eventStep3fixed").style.display="block";
	}
	else if(step==3 && !eventIsFixed){
		document.getElementById("eventStep4help").style.display="none";
		document.getElementById("eventStep3help").style.display="block";
	}
	else if(step==4 && eventIsFixed){
		document.getElementById("eventStep4fixed").style.display="block";
		document.getElementById("eventStep5").style.display="none";
		document.getElementById("eventNextButton").style.display="block";
		document.getElementById("createEventButton").style.display="none";
	}
	else if(step==4 && !eventIsFixed){
		document.getElementById("eventStep4help").style.display="block";
		document.getElementById("eventStep5").style.display="none";
		document.getElementById("eventNextButton").style.display="block";
		document.getElementById("createEventButton").style.display="none";
	}
}
function isValid(step){
	if(step==1){
		return true;
	}
	else if(step==2){
		var type=$('input[name="fixedtime"]:checked').val();
		if(type==1){
			eventIsFixed=true;
		}
		else if(type==2){
			eventIsFixed=false;
		}
		else{
			alert("Select an option");
			return false;
		}
		return true;
	}
	else{
		return true;
	}

}

function createEvent(){
	var group_id="";
	//get the event name
	var event_name="";
	var description="";
	//get all emails json stringify
	var start_date="";
	var end_date="";
	var start_time="";
	var end_time="";
	var duration="";

	var creator_email="";
	//get user email and get user access code
	var _cookies = genCookieDictionary();

	var obj = {
				"function":"create_event",
				"event_name":event_name,
				"start_date":start_date,
				"group_id":group_id,
				"end_date":end_date,
				"start_time":start_time,
				"end_time":end_time,
				"duration":duration,
				"creator_email":_cookies.user,
				"ac":_cookies.accesscode
	};
	
	// Contact Server
	$.ajax("https://www.groupright.net/dev/groupserve.php",{
			type:'POST',
			data:obj,
			statusCode:{
				200:function(data,status,jqXHR){
					alert("Event Created");
					window.location = "./home.html";				
				},
				210:function(){
					//access denied, redirect to login
					alert("Access Denied");	
					window.location = "./login.html";
				},
				220:function(){
					//something else happened
					alert("We have literally no idea what happened.")
				}
			}
	});
	return false;
}
