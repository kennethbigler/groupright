//eventReport.js
//Responding to availability

// ======================================================
// GLOBAL VARIABLES

var currentSelect=null;
var numberOfDays;
var stepsToAccountFor;
var eventCreator="Bob Smith";
var eventName="Quarterly BBQ";
var earliest_time="2015-04-16 21:00:00 UTC";
var latest_time="2015-04-23 04:00:00 UTC";

var color_classes = ["success","info","warning","danger"];
var current_color_class=1;

var availability_map = [];

var correspondenceMatrix;
var statusMatrix=[];
var maxScore=0;
var minScore=99999999;
var groupAvail;

var groupMembers=[];
var respondersArray=[];
var nonRespondersArray=[];
// ======================================================
// ONLOAD / SERVER COMM.

window.onload = function() {
	
	getGroupMembers();
	getEventVoteSettings(function(data){
		//console.log(data);
		var obj = JSON.parse(data);
		
		//console.log(obj);
		if(obj.event_name) eventName = obj.event_name;
		if(obj.creator) eventCreator = obj.creator;
		if(obj.start_time) earliest_time = obj.start_time;
		if(obj.end_time) latest_time = obj.end_time;
		if(obj.dump) groupAvail=obj.dump;
		
		
		setNumberOfDays();
		setNumberOfStepsToAccountFor();
		//getDayForColumn(3);
		//getTimeForRow(3);
		fillCorrespondenceMatrix();
		initStatusMatrix();
		drawPage();
		drawColorScale();
		addRespondersInfo();
		findSuggestedTimes();
	});
}

function getEventVoteSettings(parseFn){
	if(!(parseFn instanceof Function)){ parseFn = function(){}; }

	var _cookies = genCookieDictionary();
	
	var _get = getGETArguments();
	//console.log(_get);
	var _event_uid = _get.event_id;
	var _group_uid = _get.guid;

	//console.log(_get);

	if(_cookies.accesscode && _cookies.user && _event_uid && _group_uid){
	
		var obj = {
			"ac":_cookies.accesscode,
			"email":_cookies.user,
			"function":"get_availability_dump",
			"event_uid":_event_uid,
			"group_uid":_group_uid
		};
	
		
		// Contact Server
		$.ajax("groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
						//alert("Success");
						parseFn(data);
					}
			},
			
		
		});
	}else{
		parseFn("{}");
	}
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
	//console.log(stepsToAccountFor);
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
					th.innerHTML=getDayForColumn(j);//"Day "+j;
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
				td.style.cursor="pointer";
				td.align="center";
				td.className="success";
				td.style.border="1px solid gray";
				if(j==0){
					td.innerHTML=getTimeForRow(i);
					td.className="text-center";
					tr.appendChild(td);
				}
				else{
					tr.appendChild(td);
					
					td.onclick = function(){ colorCell(this); }
					td.style.backgroundColor=getColorForPercentage((statusMatrix[i-1][j-1]-minScore)/maxScore);
					td.value = {i:i,j:j};
					td.className += " er_row"+i+" er_col"+j;
					availability_map[i][j] = 0;
					//td.innerHTML=getScoreForRowColumn(i,j);
					td.innerHTML=statusMatrix[i-1][j-1];
					//prepareCell(td);

				}
			}
			//tr.className="success";
			tbody.appendChild(tr);
		}
		
	}
	table.appendChild(tbody);
	
}

function fillCorrespondenceMatrix(){
	var start_time=9;
	var referenceDate=new Date(earliest_time);
	//console.log(referenceDate);
	correspondenceMatrix=new Array(stepsToAccountFor);
	for(var i=0; i<stepsToAccountFor; i++){
		correspondenceMatrix[i]=new Array(numberOfDays);
		for(var j=0; j<numberOfDays; j++){
			var minutesFromStartTime=(30*i) + (j*60*24);
			//console.log(minutesFromStartTime);
			var newDate= new Date(referenceDate.getTime() + minutesFromStartTime*60000)
			correspondenceMatrix[i][j]= newDate;
		}
	}
	//console.log(correspondenceMatrix);
}

function initStatusMatrix(){
	//Allocate
	statusMatrix=new Array(stepsToAccountFor);
	for(var i=0; i<stepsToAccountFor; i++){
		statusMatrix[i]=new Array(numberOfDays);
	}
	//Gather
	for(var i=0; i<stepsToAccountFor;i++){
		for (var j=0; j<numberOfDays; j++){
			statusMatrix[i][j]=getScoreForRowColumn(i,j);
		}
	}
	//console.log(minScore);
	//console.log(maxScore);
}

function getScoreForRowColumn(row, column){
	var referencedDate=new Date(correspondenceMatrix[row][column]);
	//console.log(correspondenceMatrix[row-1][column-1]);
	var score=0;
	for(var i=0; i<groupAvail.length;i++){
		var compareDate= new Date(groupAvail[i].start_time.replace(/[-]/g,"/"));
		//console.log(compareDate);
		if (compareDate.getTime()==referencedDate.getTime()){
			score+= parseInt(groupAvail[i].score);
			//console.log("match found");
		}
		else{
			//console.log(compareDate);
			//console.log(referencedDate);

		}
	}
	//console.log(score)
	//statusMatrix[row][column]=score;
	if(score<minScore){
		minScore=score;
	}
	if(score>maxScore){
		maxScore=score;
	}
	return score;
}

var percentColors = [
    { pct: 0.0, color: { r: 0x00, g: 0xff, b: 0 } },
    { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
    { pct: 1.0, color: { r: 0xff, g: 0x00, b: 0 } } ];

var getColorForPercentage = function(pct) {
    for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            break;
        }
    }
    var lower = percentColors[i - 1];
    var upper = percentColors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
    // or output as hex if preferred
}
function drawColorScale(){
	var addLocation=document.getElementById("addScale");
	var td=document.createElement("td");
	//td.innerHTML="Worst Times";
	addLocation.appendChild(td);
	for(var i=100; i>0;i--){
		var div=document.createElement("td");
		div.style.backgroundColor=getColorForPercentage(i/100);
		div.style.width="5px";
		div.style.height="21px";
		addLocation.appendChild(div);
	}
	td=document.createElement("td");
	//td.innerHTML="Best Times";
	addLocation.appendChild(td);

}

function colorCell(elem){
	if(elem.innerHTML=="<span class='glyphicon glyphicon-star' aria-hidden='true' style='color:white;text-align:center'></span>"){
		//elem.backgroundColor=elem.data;
		elem.style.border="1px solid gray";
		elem.innerHTML="";
	}
	else{
		//elem.data=elem.backgroundColor;
		//elem.style.backgroundColor="dodgerBlue";
		elem.innerHTML="<span class='glyphicon glyphicon-star' aria-hidden='true' style='color:white;text-align:center'></span>";
		elem.style.border="1px solid white";
	}
}

function addRespondersInfo(){
	getRespondersInfo();
	var responders=document.getElementById("addResponders");
	var nonResponders=document.getElementById("addNonResponders");
	for(var i=0; i<respondersArray.length;i++){
		var span=document.createElement("span");
		span.innerHTML=getFullNameForEmail(respondersArray[i]);
		span.className="label label-success";
		span.style.marginRight="2px";
		span.style.marginTop="6px";
		responders.appendChild(span);
	}
	for(var i=0; i<nonRespondersArray.length;i++){
		var span=document.createElement("span");
		span.innerHTML=getFullNameForEmail(nonRespondersArray[i]);
		span.className="label label-danger";
		span.style.marginRight="2px";
		span.style.marginTop="6px";
		nonResponders.appendChild(span);
	}
}

function _isInArray(array,value){
	for(var i=0; i<array.length; i++){
		if(array[i]==value){
			return true;
		}
	}
	return false;
}

function getRespondersInfo(){
	_populateRespondersArray();
	_populateNonRespondersArray();
}

function _populateNonRespondersArray(){
	for(var i=0; i<groupMembers.length; i++){
		//console.log(groupMembers[i]);
		if(_isInArray(respondersArray,groupMembers[i].email)){
			//do nothing
			//console.log(groupMembers[i].email+" is in array");
		}
		else{
			nonRespondersArray.push(groupMembers[i].email);
			//console.log("added non responder"+groupMembers[i].email);
		}
	}
}
function _populateRespondersArray(){
	for(var i=0; i<groupAvail.length; i++){
		if(_isInArray(respondersArray,groupAvail[i].email)){
			//do nothing
		}
		else{
			respondersArray.push(groupAvail[i].email);
			//console.log("added responder"+groupAvail[i].email);
		}
	}
}

function findSuggestedTimes(){
	var currentLongestColumn=-1;
	var currentLongestRow=-1;
	var currentLongestSteps=-1;
	var tempCounter=0;
	var k;
	//figure this out in morning
	console.log(correspondenceMatrix);
	console.log(statusMatrix);
	for(var i=0; i<numberOfDays; i++){
		for(var j=0; j<stepsToAccountFor;j++){
			tempCounter=0;
			k=j
			while(statusMatrix[k][i]==minScore){
				tempCounter++;
				k++;
			}
			if(tempCounter>currentLongestSteps){
				currentLongestSteps=tempCounter;
				currentLongestColumn=i;
				currentLongestRow=j;
			}
		}
	}
	console.log(currentLongestColumn);
	console.log(currentLongestRow);
	console.log(currentLongestSteps);
	document.getElementById("addOurSuggestion").innerHTML=correspondenceMatrix[currentLongestRow][currentLongestColumn] +"("+(30*currentLongestSteps)+"minute window)";
}

function getGroupMembers(){
	var _cookies = genCookieDictionary();
	
	var _get = getGETArguments();
	//console.log(_get);
	var _event_uid = _get.event_id;
	var _group_uid = _get.guid;

	//console.log(_get);

	if(_cookies.accesscode && _cookies.user && _event_uid && _group_uid){
	
		var obj = {
			"ac":_cookies.accesscode,
			"email":_cookies.user,
			"function":"get_group_members",
			"group_uid":_group_uid
		};
	
		
		// Contact Server
		$.ajax("groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
						//alert("Success");
						groupMembers=JSON.parse(data);
						//console.log(groupMembers);
					}
			},
			
		
		});
	}else{
		if(GR_Dir=="/dev"){
			console.warn("Forced Redirect to Login on Production")
		}
		else{
			window.location="login.html";
		}
	}
}

function getFullNameForEmail(email){
	//console.log(email);
	for(var i=0; i<groupMembers.length; i++){
		//console.log(groupMembers[i])
		if(groupMembers[i].email==email){

			return (groupMembers[i].first_name +" "+groupMembers[i].last_name);
		}
	}
	return "Bob";
	console.warn("Reached end of getFullNameForEmail without finding a member")
}



