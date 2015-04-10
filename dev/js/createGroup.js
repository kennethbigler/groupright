var numberOfFields=2;
function addField(fieldnumber){
	if(fieldnumber<numberOfFields){
		return;
	}
	numberOfFields++;
	console.log(numberOfFields);
	var members="";
	
	var rowDiv = document.createElement('div');
	rowDiv.className="row";
	rowDiv.style.marginTop="4px";
	
	var leftColDiv = document.createElement('div');
	leftColDiv.className="col-xs-8";

	
	var rightColDiv = document.createElement('div');
	rightColDiv.className="col-xs-2";
	
	var holderDiv=document.createElement('div');
	holderDiv.style.marginTop="6px";

	var memberSpan = document.createElement('span');
	memberSpan.className="label label-info";
	memberSpan.innerText="Member";


	var br=document.createElement('br');

	var inputBox=document.createElement('input');
	inputBox.type="text";
	inputBox.className="form-control";
	inputBox.id="member"+numberOfFields;
	inputBox.placeholder="Member "+numberOfFields;
	//inputBox.onkeydown= function(){addField(numberOfFields);};
	inputBox.onkeydown=function(x){ return function(){addField(x);};}(numberOfFields);
	//rightColDiv.appendChild(br);
	holderDiv.appendChild(memberSpan);
	rightColDiv.appendChild(holderDiv);
	leftColDiv.appendChild(inputBox);
	rowDiv.appendChild(leftColDiv); 
	rowDiv.appendChild(rightColDiv);
	document.getElementById("members").appendChild(rowDiv);
}

function createGroup(){
	//clear errors
	document.getElementById("createGroupError").innerHTML="";
	//get the groupname
	var group_name=document.getElementById("groupnameField").value;
	if(group_name=="" || group_name.length<=0){
		document.getElementById("createGroupError").innerHTML="Your Group Name is invalid";
		return false;
	}
	var allEmails=[];
	//Add the Group Leader's email
	var _cookies = genCookieDictionary();
	var leader=_cookies.user; 
	allEmails.push(leader);
	//get and verify all members emails
	for(var i=2; i<numberOfFields; i++){
		if(document.getElementById("member"+i)){
			tempEmail=document.getElementById("member"+i).value;
			console.log(tempEmail);
			//validate the email
			var atpos = tempEmail.indexOf("@");
			var dotpos = tempEmail.lastIndexOf(".");
			if(tempEmail==""){
				//do nothing
			}
			else if (atpos< 1 || dotpos<atpos+2 || dotpos+2>=tempEmail.length) {
			    document.getElementById("createGroupError").innerHTML="An invalid email was entered.";
			    return false;
			}
			else{
				console.log("added 1");
				allEmails.push(tempEmail);
			}
		}
	}
	//json stringify
	var members=allEmails;
	console.log(members);

	//get user access code
	var ac=_cookies.accesscode;
	var email=_cookies.user;
	var obj = {
				"function":"create_group",
				"group_name":group_name,
				"member_array":members,
				"email":email,
				"ac":ac
	};
	console.log(obj);
	//alert("Contacting Server");
	// Contact Server
	$.ajax("https://www.groupright.net/dev/groupserve.php",{
			type:'POST',
			data:obj,
			statusCode:{
				200:function(data,status,jqXHR){
					//alert("Group Created");
					//window.location = "./home.html";
					$('#createGroupBox').modal('toggle');				
				},
				211:function(){
					//access denied, redirect to login
					//alert("Access Denied");	
					window.location = "./login.html";
				},
				220:function(){
					//something else happened, redirect anyway
					window.location = "./login.html";
					//alert("We have literally no idea what happened.");
				}
			}
	});
	return false;
}
