
var currentSelect=null;
var numberOfDays;
var stepsToAccountFor;
var eventCreator="Bob Smith";
var eventName="Quarterly BBQ";
var earliest_time="2015-03-10 9:30:00 UTC";
var latest_time="2015-03-20 16:30:00 UTC";

window.onload = function() {
	setNumberOfDays();
	setNumberOfStepsToAccountFor();
	getDayForColumn(3);
	getTimeForRow(3);
	drawPage();
}
function setNumberOfStepsToAccountFor(){
	earliest_time=earliest_time.replace(/[-]/g,"/");
	latest_time=latest_time.replace(/[-]/g,"/");
	var firstTime=new Date(earliest_time);
	var endTime=new Date(latest_time);
	
	var starthour=firstTime.getHours();
	var endhour=endTime.getHours();
	
	var startMinutes=firstTime.getMinutes();
	var endMinutes=endTime.getMinutes();
	
	starthour=starthour*2;
	endhour=endhour*2;

	if(startMinutes!=0){
		starthour=starthour+1;
	}
	if(endMinutes!=0){
		endhour=endhour+1;
	}
	var steps=0;
	while(starthour%24!=endhour){
		starthour+=1;
		steps+=1;
	}
	/*console.log(hours);
	var minutes=referenceDate.getMinutes();
	var hours2=referenceDate2.getHours();
	console.log(hours2);
	var minutes2=referenceDate2.getMinutes();
	var differenceHours=0;
	var differenceMinutes=minutes2-minutes;
	while(hours%24!=hours2){
		differenceHours++;
		hours++;
	}
	console.log(differenceHours);
	var steps=differenceHours*2;
	console.log(differenceMinutes);
	if(Math.abs(differenceMinutes)){
		//do nothing
		steps--;
	}
	else{
		steps++;
	}*/
	stepsToAccountFor=steps;

}
function setNumberOfDays(){
	earliest_time=earliest_time.replace(/[-]/g,"/");
	latest_time=latest_time.replace(/[-]/g,"/");
	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
	var referenceDate=new Date(earliest_time);
	//console.log(referenceDate);
	var referenceDate2=new Date(latest_time);
	//console.log(referenceDate2);
	var firstDate = new Date(referenceDate.getYear(),referenceDate.getMonth()+1,referenceDate.getYear());
	//console.log(firstDate);
	var secondDate = new Date(referenceDate2.getYear(),referenceDate2.getMonth()+1,referenceDate2.getYear());
	//console.log(secondDate);
	firstDate=referenceDate;
	secondDate=referenceDate2;
	var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
	//console.log(diffDays);
	numberOfDays=diffDays+1;
}
function getDayForColumn(column){
	//console.log(earliest_time);
	earliest_time=earliest_time.replace(/[-]/g,"/");
	//console.log(earliest_time);
	var referenceDate=new Date(earliest_time);
	//console.log(referenceDate);
	var addDays=(column-1);
	referenceDate.setDate(referenceDate.getDate()+addDays);
	//console.log(referenceDate);
	var month=referenceDate.getMonth();
	var months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	return months[referenceDate.getMonth()]+" "+referenceDate.getDate();
}

function getTimeForRow(row){
	//console.log(earliest_time);
	earliest_time=earliest_time.replace(/[-]/g,"/");
	//console.log(earliest_time);
	var referenceDate=new Date(earliest_time);
	//console.log(referenceDate);
	var addMinutes=(row-1)*30;
	referenceDate.setMinutes(referenceDate.getMinutes()+addMinutes);
	//console.log(referenceDate);
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


function drawPage(){
	document.getElementById("addEventCreator").innerHTML="Creator: "+eventCreator;
	document.getElementById("addEventName").innerHTML="Event Name: "+eventName;
	var table=document.getElementById("completeTable");
	table.innerHTML="";
	var tbody=document.createElement('tbody');
	//Draw the rows
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
				}
			}
			//tr.className="success";
			tbody.appendChild(tr);
		}
		
	}
	table.appendChild(tbody);
}