/*
*	grmainmodule.js
*
*	A class-like definition for the main GroupRight data module. 
*/


/**
**	GRMainModule
**		Primary object for global storage.
**/
function GRMainModule(){
	this.user = "";
	this.first_name = "";
	this.last_name = "";
	this.photo = "";
	
	// Filter
	this._filterGUID = null;
	this.removeFilter = function(){this._filterGUID = null;}
	this.filterByGroupID = function(guid){this._filterGUID = guid;}
	
	
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
		if(this._filterGUID) return this.eventsByGroupID(this._filterGUID);
		return obj_to_arr(this._events);
	};
	this.group = function(id){ return this._groups[id]; };
	
	// Tasks
	this._tasks = {};
	this.tasks = function(){
		if(this._filterGUID) return this.tasksByGroupID(this._filterGUID);
		return obj_to_arr(this._tasks);
	};
	this.task = function(id){ return this._tasks[id]; };
	
	// Updates
	this._updates = {};
	this.updates = function(){
		var x;
		if(this._filterGUID) x = this.updatesByGroupID(this._filterGUID);
		else x = obj_to_arr(this._updates);
		return x.reverse();
	};
	this.update = function(id){ return this._updates[id]; };
	
	// Messages
	this._messages = {};
	this.messages = function(){
		if(this._filterGUID) return this.messagesByGroupID(this._filterGUID);
		return obj_to_arr(this._messages);
	};
	this.message = function(id){ return this._messages[id]; };
	
	// Contacts
	this._contacts = {};
	this.contacts = function(){
		if(this._filterGUID) return this.contactsByGroupID(this._filterGUID);
		return obj_to_arr(this._contacts);
	};
	this.contact = function(email){ return this._contacts[email]; };
	
	// Update (Loading)
	this._lastEventID = 0;
	this.oneventupdate = function(){};
	this._lastTaskID = 0;
	this.ontaskupdate = function(){};
	this._lastUpdateID = 0;
	this.onupdateupdate = function(){};
	
	var self = this;
	this._updater = window.setInterval(function(){self._updateData();},5000);
}


//=========================================================================
// ADDITIONAL ACCESSORS

GRMainModule.prototype._filterByGUID = function(arr,guid){
	var ret = new Array();
	for(var i in arr){
		if(arr[i].group_id == guid) ret.push(arr[i]);
	}
	return ret;
}

GRMainModule.prototype.eventsByGroupID = function(guid){
	return this._filterByGUID(this._events,guid);
}

GRMainModule.prototype.tasksByGroupID = function(guid){
	return this._filterByGUID(this._tasks,guid);
}

GRMainModule.prototype.updatesByGroupID = function(guid){
	return this._filterByGUID(this._updates,guid);
}

GRMainModule.prototype.messagesByGroupID = function(guid){
	return this._filterByGUID(this._messages,guid);
}

GRMainModule.prototype.contactsByGroupID = function(guid){
	return this.group(guid).members;
}

//=======================================================================
// LOADING / INITIALIZE
GRMainModule.prototype.load = function(cookies,successFn,failureFn){
	if(cookies.accesscode && cookies.user){
		
		this.user = cookies.user.trim();
	
		var obj = {
			"ac":cookies.accesscode,
			"email":cookies.user,
			"function":"get_user_info"
		};
		var self = this;
	
		// Contact Server
		$.ajax("https://www.groupright.net"+GR_DIR+"/groupserve.php?r="+Math.random(),{
			type:"POST",
			data:obj,
			dataType:'text',
			cache:false,
			statusCode:{
				200: function(data, status, jqXHR){
					self._parse(data);
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
// UPDATE LOADING

GRMainModule.prototype._updateData = function(){
	var cookies = genCookieDictionary();
	if(cookies.accesscode && cookies.user){
		
		this.user = cookies.user.trim();
	
		var obj = {
			"ac":cookies.accesscode,
			"email":cookies.user,
			"event_id":this._lastEventID,
			"task_id":this._lastTaskID,
			"update_id":this._lastUpdateID,
			"function":"get_updated_info"
		};
		var self = this;
	
		// Contact Server
		$.ajax("https://www.groupright.net"+GR_DIR+"/groupserve.php?r="+Math.random(),{
			type:"POST",
			data:obj,
			dataType:'text',
			cache:false,
			statusCode:{
				200: function(data, status, jqXHR){
					var obj = JSON.parse(data);
					//console.log(obj);
					self._parseEvents(obj.events);	
					self.oneventupdate(obj.events);
					
					self._parseTasks(obj.tasks);	
					self.ontaskupdate(obj.tasks);
					
					self._parseUpdates(obj.updates);
					self.onupdateupdate(obj.updates);
				},
				220: function(data, status, jqXHR){
					console.warn("Unable to perform update.");
				}
			}
		
		});
	}
	else{
		console.warn("No cookies saved.");
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
	
	//console.log(this);
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
	var evt;
	for(var i = 0; i < events.length; i++){
		evt = events[i];
		if(evt.start_time) evt.start_time = evt.start_time.replace(/[-]/g,"/")+" UTC";
		if(evt.end_time) evt.end_time = evt.end_time.replace(/[-]/g,"/")+" UTC";
		this._events[evt.event_uid] = evt;
	}
	if(evt) this._lastEventID = parseInt(evt.event_uid);
	//console.log(this._events);
};

GRMainModule.prototype._parseTasks = function(tasks){
	//console.log(tasks);
	var tsk;
	for(var i = 0; i < tasks.length; i++){
		tsk = tasks[i];
		this._tasks[tsk.task_uid] = tsk;
	}
	if(tsk) this._lastTaskID = parseInt(tsk.task_uid);
	//console.log(this._tasks);
};

GRMainModule.prototype._parseUpdates = function(updates){
	//console.log(updates);
	
	for(var i = 0; i < updates.length; i++){
		var upd = updates[i];
		this._updates[upd.update_uid] = upd;
	}
	if(updates.length) this._lastUpdateID = parseInt(updates[0].update_uid);
	//console.log(this._updates);
};

GRMainModule.prototype._parseMessages = function(messages){
	console.log(messages);
};


var GRMAIN;