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
	$(memberSpan).text("Member");


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

var globalNewGroup;

function createGroup(){
	//clear errors
	document.getElementById("createGroupError").innerHTML="";
	//get the groupname
	var group_name=document.getElementById("groupnameField").value;
	if(group_name=="" || group_name.length<=0){
		document.getElementById("createGroupError").innerHTML="Your Group Name is invalid";
		return false;
	}
	if(globalNewGroup=="" ||globalNewGroup==undefined){
		document.getElementById("createGroupError").innerHTML="You must add at least one member to the group.";
		return false;
	}
	var allEmails=globalNewGroup.toLowerCase(globalNewGroup).split(", ");

	//Remove the leader's email if it is already in the array add the Group Leader's email to the front of the array
	var _cookies = genCookieDictionary();
	var leader=_cookies.user;
	leader="zwilson7@gmail.com";
	//console.log(allEmails);
	function unique(list) {
	    var result = [];
	    $.each(list, function(i, e) {
	        if ($.inArray(e, result) == -1) result.push(e);
	    });
	    return result;
	}
	allEmails=unique(allEmails);
	//console.log(allEmails);
	for(var i=0; i<allEmails.length; i++){
		if(allEmails[i]==leader){
			allEmails.splice(i,1);
			break;
		}
	}
	allEmails.unshift(leader);
	//verify all members emails
	for(var i=0; i<allEmails.length; i++){
		if(document.getElementById("member"+i)){
			tempEmail=allEmails[i];
			//validate the email
			var atpos = tempEmail.indexOf("@");
			var dotpos = tempEmail.lastIndexOf(".");
			if (atpos< 1 || dotpos<atpos+2 || dotpos+2>=tempEmail.length) {
			    document.getElementById("createGroupError").innerHTML="An invalid email was entered.";
			    return false;
			}
		}
	}

	//get user access code
	var ac=_cookies.accesscode;
	var email=_cookies.user;
	var obj = {
				"function":"create_group",
				"group_name":group_name,
				"member_array":allEmails,
				"email":email,
				"ac":ac
	};
	//console.log(obj);
	//alert("Contacting Server");
	// Contact Server
	$.ajax("https://www.groupright.net"+GR_DIR+"/groupserve.php",{
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
