//Global Variable for Event Walk through process
var eventstep=1;
var eventIsFixed=false;
var attendance=false;
var grouprightDecides=false;
var eventName="Not Added";
var eventDescription="";

var eventGroup="Not Added";
var eventGroupID="";

var fixedStartTime="Not Added";
var fixedEndTime="Not Added";
var fixedStartDate="Not Added";
var fixedEndDate="Not Added";
var startHourFixed="Not Added";
var	startMinuteFixed="Not Added";
var startAMPMFixed="Not Added";
var endHourFixed="Not Added";
var endMinuteFixed="Not Added";
var endAMPMFixed="Not Added";

var helpEndTime="Not Added";
var helpStartTime="Not Added";
var helpEndDate="Not Added";
var helpStartDate="Not Added";


function resetEventParameters(){
	eventstep=1;
	eventIsFixed=false;
	attendance=false;
	grouprightDecides=false;
	eventName="Not Added";
	fixedStartDate="Not Added";
	helpEndDate="Not Added";
	helpStartDate="Not Added";
	fixedEndDate="Not Added";
	eventGroup="Not Added";
	eventGroupID="";
	fixedStartTime="Not Added";
	helpEndTime="Not Added";
	helpStartTime="Not Added";
	fixedEndTime="Not Added";
	startHourFixed="Not Added";
	startMinuteFixed="Not Added";
	startAMPMFixed="Not Added";
	endHourFixed="Not Added";
	endMinuteFixed="Not Added";
	endAMPMFixed="Not Added";
	event_descripton="";
	updateProgressBar(1);
	//close the modal view
	$('#createEventBox').modal('hide');
	//Hide all but the initial steps

}
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
	else if(step==6){
		var percent=100;
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
		writeStep5();
		document.getElementById("eventStep4fixed").style.display="none";
		document.getElementById("eventStep5").style.display="block";
		document.getElementById("eventNextButton").style.display="none";
		document.getElementById("createEventButton").style.display="block";

	}
	else if(step==5 && !eventIsFixed){
		writeStep5();
		document.getElementById("eventStep4help").style.display="none";
		document.getElementById("eventStep5").style.display="block";
		document.getElementById("eventNextButton").style.display="none";
		document.getElementById("createEventButton").style.display="block";
	}
}
function writeStep5(){
	//delete all previous elements in the confirmation page
	var myNode = document.getElementById("eventReview");
	while (myNode.firstChild) {
	    myNode.removeChild(myNode.firstChild);
	}
	var line1="Your Event: <b>"+eventName+"</b> for group <b>"+eventGroup+"</b>.";

	if(eventIsFixed){
		var line2="is fixed from <b>"+fixedStartDate+"</b> at <b>"+(startHourFixed%12)+":"+startMinuteFixed+" "+startAMPMFixed+" </b>to<b> "+fixedEndDate+" </b>at<b> "+(endHourFixed%12)+":"+endMinuteFixed+" "+endAMPMFixed+"</b>.";
	}
	else{
		var line2="will be group scheduled sometime between <b>"+helpStartDate+"</b> at <b>"+helpStartTime+" </b>to<b> "+helpEndDate+" </b>at<b> "+helpEndTime+"</b>.";
	}
	if(attendance && eventIsFixed){
		var line3="Your group members <b>will</b> be asked if they can make it.";
	}
	else if(!attendance && eventIsFixed){
		var line3="Your group members will <b>not</b> be asked whether or not they can make it.";
	}
	if(!eventIsFixed){
		if(grouprightDecides){
			var line3="GroupRight will <b>automatically schedule</b> the best time once the group has responded.";
		}
		else{
			var line3="GroupRight will provide you with the <b>best options</b> once the group has responded.";
		}
	}
	var par1 = document.createElement('p');
	par1.innerHTML=line1;
	var par2 = document.createElement('p');
	par2.innerHTML=line2;
	var par3 = document.createElement('p');
	par3.innerHTML=line3;
	myNode.appendChild(par1);
	myNode.appendChild(par2);
	myNode.appendChild(par3);
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
	var errorMessage=document.getElementById('eventError').innerHTML="";
	if(step==1){
		var name=document.getElementById('eventName').value;
		if(name==""){
			document.getElementById('eventError').innerHTML="Event Name is a required field.";
			return false;
		}
		if(name.length<4){
			document.getElementById('eventError').innerHTML="Event Names must be at least 4 characters.";
			return false;
		}
		if($( "#eventGroups" ).val()=="XXX"){
			document.getElementById('eventError').innerHTML="Please select a group for the event.";
			return false;
		}
		eventGroup=$( "#eventGroups option:selected" ).text();
		eventGroupID=$( "#eventGroups" ).val();
		eventDescription=$( "#eventDescription" ).val();
		eventName=name;
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
			document.getElementById('eventError').innerHTML="Please select and option before continuing.";
			return false;
		}
		return true;
	}
	else if(step==3 && eventIsFixed){
		var startdate=document.getElementById('startdatefixed').value;
		var todaysDate = new Date();
		todaysDate.setDate(todaysDate.getDate()-1);
		if(!isValidDate(startdate)){
			document.getElementById('eventError').innerHTML="Invalid Start Date (format should be MM/DD/YYYY)";
			return false;
		}
		var testDate=new Date(startdate);
		if(testDate<todaysDate){
			document.getElementById('eventError').innerHTML="The start date can't be before today.";
			return false;
		}
		var enddate=document.getElementById('enddatefixed').value;
		if(!isValidDate(enddate)){
			document.getElementById('eventError').innerHTML="Invalid End Date (format should be MM/DD/YYYY)";
			return false;
		}
		var test2date=new Date(enddate);
		if(test2date<testDate){
			document.getElementById('eventError').innerHTML="The end date can't be before the start date.";
			return false;
		}
		var startHour=parseInt( document.getElementById("startHourFixed").value );
		var startMinute=parseInt( document.getElementById("startMinuteFixed").value );
		if(startHour<1 || startHour>12 || startMinute<0 || startMinute>59){
			document.getElementById('eventError').innerHTML="Invalid Start time entered";
			return false;
		}
		var endHour=parseInt( document.getElementById("endHourFixed").value );
		var endMinute=parseInt( document.getElementById("endMinuteFixed").value );
		if(endHour<1 || endHour>12 || endMinute<0 || endMinute>59){
			document.getElementById('eventError').innerHTML="Invalid End time entered";
			return false;
		}
		var startAMPM=document.getElementById("startAMPMFixed").value;
		var endAMPM=document.getElementById("endAMPMFixed").value;
		if(startAMPM=="PM"){
			startHour+=12;
		}
		if(endAMPM=="PM"){
			endHour+=12;
		}
		if(fixedStartDate==fixedEndDate){
			if(startHour > endHour){
				document.getElementById('eventError').innerHTML="The end date can't be before the start date.";
				return false;
			}
			if(startHour==endHour){
				if(startMinute > endMinute){
					document.getElementById('eventError').innerHTML="The end date can't be before the start date.";
					return false;
				}
			}
		}
		startHourFixed=startHour;
		startMinuteFixed=startMinute;
		startAMPMFixed=startAMPM;
		endHourFixed=endHour;
		endMinuteFixed=endMinute;
		endAMPMFixed=endAMPM;
		fixedStartDate=startdate;
		fixedEndDate=enddate;
		return true;
	}
	else if(step==3 && !eventIsFixed){
		var startdate=document.getElementById('startdatehelp').value;
		var todaysDate = new Date();
		todaysDate.setDate(todaysDate.getDate()-1);
		if(!isValidDate(startdate)){
			document.getElementById('eventError').innerHTML="Invalid Start Date (format should be MM/DD/YYYY)";
			return false;
		}
		var testDate=new Date(startdate);
		if(testDate<todaysDate){
			document.getElementById('eventError').innerHTML="The start date can't be before today.";
			return false;
		}
		var enddate=document.getElementById('enddatehelp').value;
		if(!isValidDate(enddate)){
			document.getElementById('eventError').innerHTML="Invalid End Date (format should be MM/DD/YYYY)";
			return false;
		}
		var test2date=new Date(enddate);
		if(test2date<testDate){
			document.getElementById('eventError').innerHTML="The end date can't be before the start date.";
			return false;
		}
		helpStartDate=startdate;
		helpEndDate=enddate;
		return true;

	}
	else if(step==4 && eventIsFixed){
		var type=$('input[name="whoscoming"]:checked').val();
		if(type==1){
			attendance=true;
			return true;
		}
		else if(type==2){
			attendance=false;
			return true;
		}
		else{
			document.getElementById('eventError').innerHTML="Please select and option before continuing.";
			return false;
		}
		return true;
	}
	else if(step==4 && !eventIsFixed){
		var type=$('input[name="whodecides"]:checked').val();
		if(type==1){
			grouprightDecides=true;
			return true;
		}
		else if(type==2){
			grouprightDecides=false;
			return true;
		}
		else{
			document.getElementById('eventError').innerHTML="Please select and option before continuing.";
			return false;
		}
		return true;
	}
	else{
		return true;
	}

}

function createGREvent(){
	//get the event parameters
	var group_id=eventGroupID;
	var event_name=eventName;
	var description=eventDescription;
	var location="Location";

	//Times 24 hour format
	var time="9:30";
	var time2="10:30";

	var obj;

	//get user email and get user access code
	var _cookies = genCookieDictionary();

	if(eventIsFixed){
		time=startHourFixed+":"+startMinuteFixed;
		time2=endHourFixed+":"+endMinuteFixed;

		var start_time=makeDateAndTimeObject(fixedStartDate,time);
		var end_time=makeDateAndTimeObject(fixedEndDate,time2);

		obj = {
			"function":"create_fixed_event",
			"email":_cookies.user,
			"cookie":_cookies.accesscode,
			"event_title":event_name,
			"event_descripton":description,
			"group_uid":group_id,
			"start_time":start_time,
			"location":location,
			"end_time":end_time
			
		};
		console.log(obj);
	}
	else{

		/*
		var start_date=makeDateAndTimeObject(helpStartDate,null);
		var end_date=makeDateAndTimeObject(helpEndDate,null);
		var start_time=time;
		var end_time=time2;
		*/
		var start_time=makeDateAndTimeObject(helpStartDate,time);
		var end_time=makeDateAndTimeObject(helpEndDate,time2);
		var duration=30;
		obj = {
			"function":"create_votable_event",
			"email":_cookies.user,
			"cookie":_cookies.accesscode,
			"event_title":event_name,
			"event_descripton":description,
			"group_uid":group_id,
			"start_time":start_time,
			"end_time":end_time,
			"duration":duration,
			"location":location
		};
	}

	// Contact Server
	$.ajax("https://www.groupright.net/dev/groupserve.php",{
			type:'POST',
			data:obj,
			statusCode:{
				200:function(data,status,jqXHR){
					alert("Event Created");
					updateProgressBar(6);
					resetEventParameters();
					$('#createTaskBox').modal('hide');
					//window.location = "./home.html";				
				},
				206:function(){
					$('#createTaskBox').modal('hide');
					//access denied, redirect to login
					alert("Access Denied");	
					//window.location = "./login.html";
				},
				220:function(){
					//something else happened
					alert("We have literally no idea what happened.")
				}
			}
	});
	return false;
}
function makeDateAndTimeObject(_date,_time){
	var dateAndTime= new Date(_date);
	if(_time!=null){
		_time=_time.split(":");
		var hours=_time[0];
		var minutes=_time[1];
		dateAndTime.setHours(hours);
		dateAndTime.setMinutes(minutes);
	}
	dateAndTime=dateAndTime.toJSON();
	return dateAndTime;
}
function isValidDate(dateString)
{
    // First check for the pattern
    if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
}
