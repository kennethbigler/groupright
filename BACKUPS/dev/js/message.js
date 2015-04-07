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