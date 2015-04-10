/* message.js
*
*	Handles all parts crucial to message handling between groups.
*	
*/

function GRMessageModule(){
	this.groups = {};
	this.groupID = 0;		// current group id
	
}

GRMessageModule.prototype.sendMessage = function(content,group_id,successFn,failureFn){
	//get user access code
	var _cookies = genCookieDictionary();
	var email = _cookies.user; 
	var ac = _cookies.accesscode;
	var obj = {
				"function":"send_message",
				"email":email,
				"ac":ac,
				"group_uid":group_id,
				"message_content":content,
	};
	//console.log(obj);


	// Contact Server
	$.ajax("https://www.groupright.net/dev/groupserve.php",{
			type:'POST',
			data:obj,
			statusCode:{
				200:function(data,status,jqXHR) {
					//alert("Message Sent");
					successFn();
					//window.location = "./home.html";				
				},
				210:function() {
					//access denied, redirect to login
					alert("Access Denied");	
					failureFn();
					//window.location = "./login.html";
				},
				220:function() {
					//something else happened
					//alert("We have literally no idea what happened.")
					failureFn();
				}
			}
	});
};



var GRMSG;
$(document).ready(function(){
	GRMSG = new GRMessageModule();
});



function createGRMessage(){
	document.getElementById('messageError').innerHTML="";
	//get group
	if ($( "#messageGroups" ).val()=="XXX") {
		document.getElementById('messageError').innerHTML="Please select a group for the message.";
		return false;
	}

	//get the message text
	var message_content = document.getElementById("myMessage").value;
	if (message_content == "" || message_content.length<=0) {
		document.getElementById('messageError').innerHTML="Your message is invalid";
		return false;
	}

	var messageGroup = $( "#messageGroups option:selected" ).text();
	var messageGroupID = $( "#messageGroups" ).val();

	GRMSG.sendMessage(
		message_content,
		messageGroupID,
		function(){},
		function(){
			window.location = "index.html";
		}
	);
	
	
	//add messages
	var email = genCookieDictionary().user;
	name = getFullNameForEmail(email)

    function checkTime(i) {
        return (i < 10) ? "0" + i : i;
    }
    var today = new Date(),
        h = checkTime(today.getHours()),
        m = checkTime(today.getMinutes()),
        s = checkTime(today.getSeconds());

	var element = document.getElementById("messageBox");
	var htmlString	=	'<div class="convoTailUser"></div>'
					+	'<div class="userMessageUser">'
					+	'<h4 class="nameTag">'
					+	name + '</h4>'
					+	'<p>' + message_content + '</p>'
					+	'<p class="timeStamp">'
					+	h + ":" + m + ":" + s + '</p></div>'
	element.insertAdjacentHTML('beforeend', htmlString);

	document.getElementById("myMessage").value = '';
	
	return false;
}

function populateMessages(){
	var messageGroup = $( "#messageGroups option:selected" ).text();
	var messageGroupID = $( "#messageGroups" ).val();
	//get user access code
	var _cookies = genCookieDictionary();
	var email = _cookies.user; 
	var ac = _cookies.accesscode;
	var obj = {
				"function":"get_messages",
				"email":email,
				"ac":ac,
				"group_uid":messageGroupID,
	};
	console.log(obj);

	// Contact Server
	$.ajax("https://www.groupright.net/dev/groupserve.php",{
			type:'POST',
			data:obj,
			statusCode:{
				200:function(data,status,jqXHR) {
					alert("Load Group Messages");
					//window.location = "./home.html";
					var obj = JSON.parse(data);
					var array = obj.messages;
					//console.log(obj);

    					function checkTime(i) {
    					    return (i < 10) ? "0" + i : i;
    					}

					//remove placeholder message
					//var parent = document.getElementById("messageBox");
					//var child = document.getElementById("tempMessage");
					//parent.removeChild(child);
					document.getElementById("messageBox").innerHTML = "";
					console.log("Cleared MessageBox");
					
					//Iterate through returned array
					for (var i = 0; i < array.length; i++) {
						name = getFullNameForEmail(array[i].email);
						message = array[i].content;
						console.log(array[i]);
						var time=array[i].timestamp.substr(11,12);
						// timestamp = array[i].timestamp;

						// create a javascript Date object based on the timestamp
						// multiplied by 1000 to get arg in milliseconds, not seconds
						var date = new Date(array[i].timestamp * 1000);
						// hours part from the timestamp
						var h = checkTime(date.getHours());
						// minutes part from the timestamp
						var m = checkTime(date.getMinutes());
						// seconds part from the timestamp
						var s = checkTime(date.getSeconds());
						
						var msgclass, ctailclass;
						if(GRMAIN.user == array[i].email){
							msgclass = "userMessageUser";
							ctailclass = "convoTailUser";
						}else{
							msgclass = "userMessage";
							ctailclass = "convoTail";
						}
						
						//add messages
						var element = document.getElementById("messageBox");
						var htmlString	=	'<div class="row"><div class="'+ctailclass+'"></div>'
										+	'<div class="'+msgclass+'">'
										+	'<h4 class="nameTag">'
										+	name + '</h4>'
										+	'<p>' + message + '</p>'
										+	'<p class="timeStamp">'
										+	time  + '</p></div></div>'
						element.insertAdjacentHTML('beforeend', htmlString);
					}
					
					var element = document.getElementById("messageBox");
					element.scrollTop = element.scrollHeight; // zoom to bottom
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
