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

	//get user access code
	var _cookies = genCookieDictionary();
	var email = _cookies.user; 
	var ac = _cookies.accesscode;
	var obj = {
				"function":"send_message",
				"email":email,
				"cookie":ac,
				"group_uid":messageGroupID,
				"message_content":message_content,
	};
	console.log(obj);

	//add messages
	name = getFullNameForEmail(email)
	if (!Date.now) {
    	Date.now = function() { return new Date().getTime(); }
	}
	var element = document.getElementById("messageBox");
	var htmlString	=	'<div class="convoTail"></div>'
					+	'<div class="userMessage">'
					+	'<h4 class="nameTag">'
					+	name + '</h4>'
					+	'<p>' + message_content + '</p>'
					+	'<p class="timeStamp">'
					+	Date.now + '</p></div>'
	element.insertAdjacentHTML('beforeend', htmlString);

	document.getElementById("myMessage").value = '';

	// Contact Server
	$.ajax("https://www.groupright.net/dev/groupserve.php",{
			type:'POST',
			data:obj,
			statusCode:{
				200:function(data,status,jqXHR) {
					alert("Message Sent");
					//window.location = "./home.html";				
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
				"cookie":ac,
				"group_uid":messageGroupID,
	};
	console.log(obj);

	// Contact Server
	$.ajax("https://www.groupright.net/dev/groupserve.php",{
			type:'POST',
			data:obj,
			statusCode:{
				200:function(data,status,jqXHR) {
					alert("Message Sent");
					//window.location = "./home.html";
					var array = JSON.parse(data);
					//console.log(obj);
					
					//Iterate through returned array
					for (var i = 0; i < array.length; i++) {
						name = getFullNameForEmail(array[i].email);
						message = array[i].content;
						timestamp = array[i].timestamp;

						//remove placeholder message
						var parent = document.getElementById("messageBox");
						var child = document.getElementById("tempMessage");
						parent.removeChild(child);
						
						//add messages
						var element = document.getElementById("messageBox");
						var htmlString	=	'<div class="convoTail"></div>'
										+	'<div class="userMessage">'
										+	'<h4 class="nameTag">'
										+	name + '</h4>'
										+	'<p>' + message + '</p>'
										+	'<p class="timeStamp">'
										+	timestamp + '</p></div>'
						element.insertAdjacentHTML('beforeend', htmlString);
					}
					
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