/*
*	grmainmodule.js
*
*	A class-like definition for the main GroupRight data module. 
*/

// util function
function obj_to_arr(obj){
	return Object.keys(obj).map(function (key) {return obj[key]});
}

/**
**	GRMainModule
**		Primary object for global storage.
**/
function GRMainModule(){
	this.user = "";
	this.first_name = "";
	this.last_name = "";
	this.photo = "";
	
	// Raw
	this._raw = "";
	this.raw = function(){ return this._raw; };
	
	// Groups
	this._groups = {};	
	this.groups = function(){
		return obj_to_arr(this._groups);
	};
	this.group = function(id){ return this._groups[id]; };
	
	// Events
	this._events = {};
	this.events = function(){
		return obj_to_arr(this._events);
	};
	this.group = function(id){ return this._groups[id]; };
	
	// Tasks
	this._tasks = {};
	this.tasks = function(){
		return obj_to_arr(this._tasks);
	};
	this.task = function(id){ return this._tasks[id]; };
	
	// Updates
	this._updates = {};
	this.updates = function(){
		return obj_to_arr(this._updates);
	};
	this.update = function(id){ return this._updates[id]; };
	
	// Messages
	this._messages = {};
	this.messages = function(){
		return obj_to_arr(this._messages);
	};
	this.message = function(id){ return this._messages[id]; };
	
	// Contacts
	this._contacts = {};
	this.contacts = function(){
		return obj_to_arr(this._contacts);
	};
	this.contact = function(email){ return this._contacts[email]; };
}

//=======================================================================
// LOADING / INITIALIZE
GRMainModule.prototype.load = function(cookies,successFn,failureFn){
	if(cookies.accesscode && cookies.user){
		
		this.user = cookies.user.trim();
	
		var obj = {
			"cookie":cookies.accesscode,
			"email":cookies.user,
			"function":"get_user_info"
		};
	
		// Contact Server
		$.ajax("https://www.groupright.net/dev/groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
					this._parse(data);
					successFn();
				},
				220: function(data, status, jqXHR){
					failureFn();
				}
			}
		
		});
	}
	else{
		console.warn("You are currently an Unauthenticated User accessing this page...This type of user Will Be Forced to Redirect in Final Version");
		this._parse(DEFAULT_GROUPS);
		this.user = DEFAULT_USER;
		successFn();
	}
};

//=========================================================================
// PARSING

GRMainModule.prototype._parse = function(data){
	this._raw = data;
	
	var obj = JSON.parse(data);
	//console.log(obj);
	
	// Basic Info
	this.first_name = obj.first_name;
	this.last_name = obj.last_name;
	this.photo = obj.photo_url;
	
	// Groups
	this._parseGroups(obj.memberships);
	
	// Events
	this._parseEvents(obj.events);
	
	// Tasks
	this._parseTasks(obj.tasks);
	
	// Updates
	this._parseUpdates(obj.updates);
	
	// Messages
	//this._parseMessages(obj.messages);
	
	console.log(this);
}

GRMainModule.prototype._parseGroups = function(groups){
	//console.log(groups);
	
	for(var i = 0; i < groups.length; i++){
		var grp = groups[i];
		this._groups[grp.group_id] = grp;
		this._parseContacts(grp.members);
	}
	//console.log(this._groups);
	//console.log(this._contacts);
};

GRMainModule.prototype._parseContacts = function(contacts){
	//console.log(contacts);
	
	for(var i = 0; i < contacts.length; i++){
		var cnt = contacts[i];
		this._contacts[cnt.email] = cnt;
	}
}

GRMainModule.prototype._parseEvents = function(events){
	//console.log(events);
	
	for(var i = 0; i < events.length; i++){
		var evt = events[i];
		this._events[evt.event_uid] = evt;
	}
	
	//console.log(this._events);
};

GRMainModule.prototype._parseTasks = function(tasks){
	//console.log(tasks);
	
	for(var i = 0; i < tasks.length; i++){
		var tsk = tasks[i];
		this._tasks[tsk.task_uid] = tsk;
	}
	
	//console.log(this._tasks);
};

GRMainModule.prototype._parseUpdates = function(updates){
	//console.log(updates);
	
	for(var i = 0; i < updates.length; i++){
		var upd = updates[i];
		this._updates[upd.update_uid] = upd;
	}
	
	//console.log(this._updates);
};

GRMainModule.prototype._parseMessages = function(messages){
	console.log(messages);
};

/*
		console.log(memberships);
		addCalendarInfo();
		initializeEvents(allGroups);
		initializeTasks(allGroups);
		dealwithProfilePic(null,"ZW");
		addGRContacts(memberships);
		addTasks(tasks);
		addUpdates(updates);
	}
};*/