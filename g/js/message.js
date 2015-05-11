/* message.js
*
*	Handles all parts crucial to message handling between groups.
*	
*/

function GRMessageModule(){
	this.groupMsgs = {};
	this.groupID = 0;		// current group id
	this.lastMessage = new Date();
	
		
	this.listeners = new Array();
	this.newMsgs = [];
	
	var self = this;
	this.updater = window.setInterval(function(){
		self.update();
	},5000);
	
}

GRMessageModule.prototype.addUpdateListener = function(fn){
	if(!(fn instanceof Function)) return;
	else this.listeners.push(fn);
}


GRMessageModule.prototype.getMessages = function(guid){
	if(guid) this.groupID = guid;
	else guid = this.groupID;
	return this.groupMsgs[ guid ].messages;
};

GRMessageModule.prototype.getNewMessages = function(){
	return this.newMsgs;
};

GRMessageModule.prototype.getNumUnread = function(guid){
	if(guid) this.groupID = guid;
	else guid = this.groupID;
	return this.groupMsgs[ guid ].num_unread;
};

GRMessageModule.prototype.update = function(){
	//get user access code
	var _cookies = genCookieDictionary();
	var email = _cookies.user; 
	var ac = _cookies.accesscode;
	var obj = {
				"function":"get_new_messages",
				"email":email,
				"ac":ac,
				"group_uid":this.groupID,
				"last_timestamp":this.lastMessage.toJSON()
	};
	//console.log(obj);

	var self = this;
	if(email && ac){
		// Contact Server
		$.ajax("https://www.groupright.net"+GR_DIR+"/groupserve.php?r="+Math.random(),{
				type:'POST',
				data:obj,
				statusCode:{
					200:function(data,status,jqXHR) {
						// cleared.
						var obj = JSON.parse(data);
						self.newMsgs = obj.messages;
						if(obj.messages.length){
							var ts = obj.messages[ obj.messages.length - 1 ].timestamp;
							ts = ts.replace(/[-]/g,"/");
							self.lastMessage = new Date(ts);
						}
						for(var i = 0; i < self.listeners.length; i++){
							self.listeners[i]();
						}
					},
					210:function() {
						//access denied, redirect to login
						console.warn("Access Denied -- get_new_messages");	
						//window.location = "./login.html";
					},
					220:function() {
						//something else happened
						//alert("We have literally no idea what happened.")
						failureFn();
					}
				},
				error:function(x,s,e){
					//console.log(JSON.stringify(x)+" "+s+" "+JSON.stringify(e));
				}
		});
	}
};

GRMessageModule.prototype.markMessagesRead = function(group_id){
	//get user access code
	var _cookies = genCookieDictionary();
	var email = _cookies.user; 
	var ac = _cookies.accesscode;
	var obj = {
				"function":"mark_messages_read",
				"email":email,
				"ac":ac,
				"group_uid":group_id
	};
	//console.log(obj);

	if(email && ac){
		// Contact Server
		$.ajax("https://www.groupright.net"+GR_DIR+"/groupserve.php",{
				type:'POST',
				data:obj,
				dataType:'text',
				cache:false,
				statusCode:{
					200:function(data,status,jqXHR) {
						// cleared.
					},
					210:function() {
						//access denied, redirect to login
						console.warn("Access Denied -- mark messages read");	
						//window.location = "./login.html";
					},
					220:function() {
						//something else happened
						//alert("We have literally no idea what happened.")
						failureFn();
					}
				}
		});
	}
};

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

	var self = this;

	// Contact Server
	$.ajax("https://www.groupright.net"+GR_DIR+"/groupserve.php",{
			type:'POST',
			data:obj,
			dataType:'text',
			cache:false,
			statusCode:{
				200:function(data,status,jqXHR) {
					//alert("Message Sent");
					self.update();
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

GRMessageModule.prototype.loadMessages = function(group_id,successFn,failureFn){
//get user access code
	var _cookies = genCookieDictionary();
	var email = _cookies.user; 
	var ac = _cookies.accesscode;
	var obj = {
				"function":"get_messages",
				"email":email,
				"ac":ac,
				"group_uid":group_id,
	};
	//console.log(obj);
	
	var self = this;

	if(email && ac){
		// Contact Server
		$.ajax("https://www.groupright.net"+GR_DIR+"/groupserve.php",{
				type:'POST',
				data:obj,
				dataType:'text',
				cache:false,
				statusCode:{
					200:function(data,status,jqXHR) {
						
						//alert("Load Group Messages");
						self._parse(group_id,data);
						
						successFn();
					},
					210:function() {
						//access denied, redirect to login
						alert("Access Denied");	
						failureFn();
					},
					220:function() {
						//something else happened
						alert("We have literally no idea what happened.")
						failureFn();
					}
				}
		});
	}else{
		self._parse(group_id,DEFAULT_MESSAGES);
		successFn();
	}
};

GRMessageModule.prototype._parse = function(guid,data){
	var obj = JSON.parse(data);
	this.groupMsgs[ guid ] = obj;
	
	var msg;
	for(var i = 0; i < this.groupMsgs[ guid ].messages.length; i++)
	{
		msg = this.groupMsgs[guid].messages[i];
		msg.timestamp = msg.timestamp.replace(/[-]/g,"/");
		//console.log(msg.timestamp);
	}
	if(msg) this.lastMessage = new Date(msg.timestamp);
	//console.log(this);
};

// ============================================================

var GRMSG;
$(document).ready(function(){
	GRMSG = new GRMessageModule();
	
	function addNewMsgs(){
		var array = GRMSG.getNewMessages();
		
		//Iterate through returned array
		for (var i = 0; i < array.length; i++) {
			
			if(array[i].email == GRMAIN.user) continue;
			
			// get elements from message.
			name = getFullNameForEmail(array[i].email);
			message = array[i].content;
							
			// get time string.
			var date = new Date(array[i].timestamp);
			var time = date.toLocaleTimeString();
			
			// determine if user or other member
			var msgclass, ctailclass;
			if(GRMAIN.user == array[i].email){
				msgclass = "userMessageUser";
				ctailclass = "convoTailUser";
			}else{
				msgclass = "userMessage";
				ctailclass = "convoTail";
			}
			
			//add message
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
		
		// mark messages read
		GRMSG.markMessagesRead(GRMSG.groupID);
		
		// scrolling stuff
		if((element.scrollHeight - element.scrollTop) > element.offsetHeight + 150) return;
		element.scrollTop = element.scrollHeight; // zoom to bottom
	};
	
	GRMSG.addUpdateListener(addNewMsgs);
	
	function returnListener(e){
		var key = e.keyCode ? e.keyCode : e.which;
		
		if(key == 13){
			createGRMessage();
			return false;
		}
		return true;
	}
	
	$("#myMessage").on('keydown',returnListener);
		
});


// ============================================================

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
	
	
	// get name
	var email = genCookieDictionary().user;
	name = getFullNameForEmail(email)

	// get timestamp
    var today = new Date();
	var time = today.toLocaleTimeString();
	
	// add message
	var element = document.getElementById("messageBox");
	var htmlString	=	'<div class="row"><div class="convoTailUser"></div>'
					+	'<div class="userMessageUser">'
					+	'<h4 class="nameTag">'
					+	name + '</h4>'
					+	'<p>' + message_content + '</p>'
					+	'<p class="timeStamp">'
					+	time + '</p></div></div>'
	element.insertAdjacentHTML('beforeend', htmlString);
	
	element.scrollTop = element.scrollHeight; // zoom to bottom

	// clear 'Enter Message' field
	document.getElementById("myMessage").value = '';
	
	return false;
}

function populateMessages(){
	var messageGroup = $( "#messageGroups option:selected" ).text();
	var messageGroupID = $( "#messageGroups" ).val();
	
	GRMSG.loadMessages(
		messageGroupID,
		function(){
			var array = GRMSG.getMessages(messageGroupID);
			
			// clear message box
			document.getElementById("messageBox").innerHTML = "";
			
			//Iterate through returned array
			for (var i = 0; i < array.length; i++) {
				
				// get elements from message.
				name = getFullNameForEmail(array[i].email);
				message = array[i].content;
								
				// get time string.
				var date = new Date(array[i].timestamp);
				var time = date.toLocaleTimeString();
				
				// determine if user or other member
				var msgclass, ctailclass;
				if(GRMAIN.user == array[i].email){
					msgclass = "userMessageUser";
					ctailclass = "convoTailUser";
				}else{
					msgclass = "userMessage";
					ctailclass = "convoTail";
				}
				
				//add message
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
			
			// mark messages read
			GRMSG.markMessagesRead(messageGroupID);
		},
		function(){
			window.location = "./login.html";
		}
	);
	
	return false;
}
