var numberOfFields=2;
function addField(fieldnumber){
	if(fieldnumber<numberOfFields){
		return;
	}
	numberOfFields++;
	var members="";
	
	var rowDiv = document.createElement('div');
	rowDiv.className="row";
	
	var leftColDiv = document.createElement('div');
	leftColDiv.className="col-xs-9";
	
	var rightColDiv = document.createElement('div');
	rightColDiv.className="col-xs-2";
	
	var memberSpan = document.createElement('span');
	memberSpan.className="label label-info";
	memberSpan.innerText="Member";

	var br=document.createElement('br');

	var inputBox=document.createElement('input');
	inputBox.type="text";
	inputBox.className="form-control";
	inputBox.id="member "+numberOfFields;
	inputBox.placeholder="Member "+numberOfFields;
	//inputBox.onkeydown= function(){addField(numberOfFields);};
	inputBox.onkeydown=function(x){ return function(){addField(x);};}(numberOfFields);
	rightColDiv.appendChild(br);
	rightColDiv.appendChild(memberSpan);
	leftColDiv.appendChild(inputBox);
	rowDiv.appendChild(leftColDiv); 
	rowDiv.appendChild(rightColDiv);
	document.getElementById("members").appendChild(rowDiv);
}

function createEvent(){
	//get the event name

	//get all emails json stringify

	//get user email

	//get user access code

	var obj = {
				"function":"create_event",
				"event_name":event_name,
				"member_array":members,
				"email":email,
				"ac":ac
	};
	
	// Contact Server
	$.ajax("https://www.groupright.net/dev/groupserve.php",{
			type:'POST',
			data:obj,
			statusCode:{
				200:function(data,status,jqXHR){
					alertSuccessBanner("Thanks for signing up for GroupRight. Please check your email and follow the instructions to verify your account.");				
				},
				210:function(){
					//access denied, redirect to login
				},
				220:function(){
					//something else happened
				}
			}
	});
	return false;
}

