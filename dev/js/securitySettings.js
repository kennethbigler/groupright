sessions=[{expiration:"date"},{expiration:"date"},{expiration:"date"}];
window.onload = function() {
	addSessions(sessions);
}


function addSessions(sessions){
	var table=document.getElementById("addSessions");
	for(var i=0; i<sessions.length; i++){
		var tr=document.createElement('tr');
		var td1=document.createElement('td');
		td1.innerHTML="Session "+(i+1);
		var td2=document.createElement('td');
		td2.innerHTML=sessions[i].expiration;
		var td3=document.createElement('td');
		var button=document.createElement('button');
		$(button).attr('onclick','killSessionWithDate('+sessions[i].expiration+')');
		button.className="btn btn-danger pull-right";
		button.innerHTML="Stop";
		td3.appendChild(button);
		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		table.appendChild(tr);
	}
}