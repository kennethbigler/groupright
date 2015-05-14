/*
*	grmainmodule.js
*
*	A class-like definition for the main GroupRight data module. 
*/

// DUMMY DATA
var _demoPhase = [];
var _baseDemoInfo = {
"first_name":"Scott",
"last_name":"Sarsfield",
"photo_url":null,
"memberships":[{
"group_name":"Air Networks",
"group_color":"#48CB09",
"group_id":"72",
"role":"leader",
"members":[{
"email":"ssarsfield@scu.edu",
"first_name":"Scott",
"last_name":"Sarsfield",
"photo_url":null,
"role":"leader"
},
{
"email":"zwilson@scu.edu",
"first_name":"Zachary",
"last_name":"Wilson",
"photo_url":null,
"role":"member"
},
{
"email":"kbigler@scu.edu",
"first_name":"Kenneth",
"last_name":"Bigler",
"photo_url":"https:\/\/www.groupright.net\/_profiles\/7d572ffc2aec0b676d691f5c4fbb248c4396399d.jpg",
"role":"member"
},
{
"email":"apotika@scu.edu",
"first_name":"Katerina",
"last_name":"Potika",
"photo_url":null,
"role":"member"
}]
},
],
"tasks":[{
"task_uid":"148",
"task_title":"Provide Availability for 'Safety Training'",
"task_description":"",
"group_id":"72",
"creator":"ssarsfield@scu.edu",
"is_completed":"1",
"is_individual":"1",
"link_type":"event",
"link_id":"104"
},
{
"task_uid":"149",
"task_title":"Pick Time for 'Safety Training'",
"task_description":"",
"group_id":"72",
"creator":"ssarsfield@scu.edu",
"is_completed":"1",
"is_individual":"1",
"link_type":"event_report",
"link_id":"104"
},
{
"task_uid":"150",
"task_title":"Bring Safety Vests",
"task_description":"For Safety",
"group_id":"72",
"creator":"kbigler@scu.edu",
"is_completed":"1",
"is_individual":"0",
"link_type":null,
"link_id":null
},
{
"task_uid":"151",
"task_title":"Contribute to 'Holiday Party Items'",
"task_description":"",
"group_id":"72",
"creator":"ssarsfield@scu.edu",
"is_completed":"1",
"is_individual":"1",
"link_type":"list",
"link_id":"29"
},
{
"task_uid":"156",
"task_title":"Contribute to 'Items for launch'",
"task_description":"",
"group_id":"72",
"creator":"kbigler@scu.edu",
"is_completed":"0",
"is_individual":"1",
"link_type":"list",
"link_id":"32"
},
{
"task_uid":"157",
"task_title":"Bring Food",
"task_description":"Bring Food",
"group_id":"72",
"creator":"kbigler@scu.edu",
"is_completed":"1",
"is_individual":"0",
"link_type":null,
"link_id":null
}],
"events":[{
"event_uid":"104",
"name":"Safety Training",
"description":"",
"group_id":"72",
"creator":"ssarsfield@scu.edu",
"start_time":"2015-05-14 21:00:00",
"end_time":"2015-05-14 23:00:00"
}],
"updates":[
{
"update_uid":"545",
"email":"zwilson@scu.edu",
"description":" completed task \"Bring Food\"",
"group_id":"72",
"timestamp":"2015-05-13 18:06:20",
"link_type":"task",
"link_id":"157"
},
{
"update_uid":"544",
"email":"kbigler@scu.edu",
"description":"created task \"Bring Food\"",
"group_id":"72",
"timestamp":"2015-05-13 18:05:47",
"link_type":"task",
"link_id":"157"
},
{
"update_uid":"543",
"email":"kbigler@scu.edu",
"description":"added an item to list \"Items for launch\"",
"group_id":"72",
"timestamp":"2015-05-13 18:02:35",
"link_type":"list",
"link_id":"32"
},
{
"update_uid":"542",
"email":"kbigler@scu.edu",
"description":"created list \"Items for launch\"",
"group_id":"72",
"timestamp":"2015-05-13 18:00:27",
"link_type":"list",
"link_id":"32"
},
{
"update_uid":"537",
"email":"zwilson@scu.edu",
"description":"added an item to list \"Holiday Party Items\"",
"group_id":"72",
"timestamp":"2015-05-13 17:24:49",
"link_type":"list",
"link_id":"29"
},
{
"update_uid":"536",
"email":"kbigler@scu.edu",
"description":"added an item to list \"Holiday Party Items\"",
"group_id":"72",
"timestamp":"2015-05-13 17:24:39",
"link_type":"list",
"link_id":"29"
},
{
"update_uid":"535",
"email":"ssarsfield@scu.edu",
"description":"added an item to list \"Holiday Party Items\"",
"group_id":"72",
"timestamp":"2015-05-13 17:24:38",
"link_type":"list",
"link_id":"29"
},
{
"update_uid":"534",
"email":"zwilson@scu.edu",
"description":"added an item to list \"Holiday Party Items\"",
"group_id":"72",
"timestamp":"2015-05-13 17:24:34",
"link_type":"list",
"link_id":"29"
},
{
"update_uid":"533",
"email":"ssarsfield@scu.edu",
"description":"created list \"Holiday Party Items\"",
"group_id":"72",
"timestamp":"2015-05-13 17:24:23",
"link_type":"list",
"link_id":"29"
},
{
"update_uid":"532",
"email":"ssarsfield@scu.edu",
"description":"chose a time for \"Safety Training\"",
"group_id":"72",
"timestamp":"2015-05-13 17:23:37",
"link_type":"event",
"link_id":"104"
},
{
"update_uid":"531",
"email":"zwilson@scu.edu",
"description":" completed task \"Bring Safety Vests\"",
"group_id":"72",
"timestamp":"2015-05-13 17:21:57",
"link_type":"task",
"link_id":"150"
},
{
"update_uid":"530",
"email":"kbigler@scu.edu",
"description":"created task \"Bring Safety Vests\"",
"group_id":"72",
"timestamp":"2015-05-13 17:19:41",
"link_type":"task",
"link_id":"150"
},
{
"update_uid":"529",
"email":"ssarsfield@scu.edu",
"description":"created event \"Safety Training\"",
"group_id":"72",
"timestamp":"2015-05-13 17:16:00",
"link_type":"event",
"link_id":"104"
}]
};

_demoPhase[1] = {};

_demoPhase[2] = {
"memberships":[{
"group_name":"Seventh Inning Stretchers",
"group_color":"#FFF763",
"group_id":"73",
"role":"leader",
"members":[{
"email":"ssarsfield@scu.edu",
"first_name":"Scott",
"last_name":"Sarsfield",
"photo_url":null,
"role":"leader"
},
{
"email":"zwilson@scu.edu",
"first_name":"Zachary",
"last_name":"Wilson",
"photo_url":null,
"role":"member"
},
{
"email":"kbigler@scu.edu",
"first_name":"Kenneth",
"last_name":"Bigler",
"photo_url":"https:\/\/www.groupright.net\/_profiles\/7d572ffc2aec0b676d691f5c4fbb248c4396399d.jpg",
"role":"member"
},
{
"email":"apotika@scu.edu",
"first_name":"Katerina",
"last_name":"Potika",
"photo_url":null,
"role":"member"
}]
}]
};

_demoPhase[3] = {
"tasks":[{
"task_uid":"158",
"task_title":"Provide Availability for 'Practice'",
"task_description":"",
"group_id":"73",
"creator":"ssarsfield@scu.edu",
"is_completed":"1",
"is_individual":"1",
"link_type":"event",
"link_id":"105"
},
{
"task_uid":"159",
"task_title":"Pick Time for 'Practice'",
"task_description":"",
"group_id":"73",
"creator":"ssarsfield@scu.edu",
"is_completed":"0",
"is_individual":"1",
"link_type":"event_report",
"link_id":"105"
}],
"events":[],
"updates":[{
"update_uid":"548",
"email":"ssarsfield@scu.edu",
"description":"created event \"Practice\"",
"group_id":"73",
"timestamp":"2015-05-13 18:32:36",
"link_type":"event",
"link_id":"105"
}]
};

_demoPhase[4] = {
"tasks":[
{
"task_uid":"159",
"task_title":"Pick Time for 'Practice'",
"task_description":"",
"group_id":"73",
"creator":"ssarsfield@scu.edu",
"is_completed":"1",
"is_individual":"1",
"link_type":"event_report",
"link_id":"105"
},
{
"task_uid":"160",
"task_title":"Bring bases.",
"task_description":"Include home plate.",
"group_id":"73",
"creator":"ssarsfield@scu.edu",
"is_completed":"1",
"is_individual":"0",
"link_type":null,
"link_id":null
}],
"events":[
{
"event_uid":"105",
"name":"Practice",
"description":"",
"group_id":"73",
"creator":"ssarsfield@scu.edu",
"start_time":"2015-05-15 21:00:00",
"end_time":"2015-05-15 22:00:00"
}],
"updates":[
{
"update_uid":"551",
"email":"ssarsfield@scu.edu",
"description":"chose a time for \"Practice\"",
"group_id":"73",
"timestamp":"2015-05-13 18:37:11",
"link_type":"event",
"link_id":"105"
},
{
"update_uid":"550",
"email":"zwilson@scu.edu",
"description":" completed task \"Bring bases.\"",
"group_id":"73",
"timestamp":"2015-05-13 18:35:52",
"link_type":"task",
"link_id":"160"
},
{
"update_uid":"549",
"email":"ssarsfield@scu.edu",
"description":"created task \"Bring bases.\"",
"group_id":"73",
"timestamp":"2015-05-13 18:34:17",
"link_type":"task",
"link_id":"160"
}]
};

_demoPhase[5] = {
"tasks":[
{
"task_uid":"161",
"task_title":"Contribute to 'Party Items'",
"task_description":"",
"group_id":"73",
"creator":"ssarsfield@scu.edu",
"is_completed":"1",
"is_individual":"1",
"link_type":"list",
"link_id":"33"
}],
"events":[],
"updates":[
{
"update_uid":"555",
"email":"zwilson@scu.edu",
"description":"added an item to list \"Party Items\"",
"group_id":"73",
"timestamp":"2015-05-13 18:38:19",
"link_type":"list",
"link_id":"33"
},
{
"update_uid":"554",
"email":"kbigler@scu.edu",
"description":"added an item to list \"Party Items\"",
"group_id":"73",
"timestamp":"2015-05-13 18:38:18",
"link_type":"list",
"link_id":"33"
},
{
"update_uid":"553",
"email":"ssarsfield@scu.edu",
"description":"added an item to list \"Party Items\"",
"group_id":"73",
"timestamp":"2015-05-13 18:38:13",
"link_type":"list",
"link_id":"33"
},
{
"update_uid":"552",
"email":"ssarsfield@scu.edu",
"description":"created list \"Party Items\"",
"group_id":"73",
"timestamp":"2015-05-13 18:37:55",
"link_type":"list",
"link_id":"33"
}]
};


var _addedData = [];
_addedData[0] = [{
"task_uid":"158",
"task_title":"Provide Availability for 'Practice'",
"task_description":"",
"group_id":"73",
"creator":"ssarsfield@scu.edu",
"is_completed":"0",
"is_individual":"1",
"link_type":"event",
"link_id":"105"
},
{
"task_uid":"159",
"task_title":"Pick Time for 'Practice'",
"task_description":"",
"group_id":"73",
"creator":"ssarsfield@scu.edu",
"is_completed":"0",
"is_individual":"1",
"link_type":"event_report",
"link_id":"105"
}];

_addedData[1] = [{
"update_uid":"548",
"email":"ssarsfield@scu.edu",
"description":"created event \"Practice\"",
"group_id":"73",
"timestamp":"2015-05-13 18:32:36",
"link_type":"event",
"link_id":"105"
}];

_addedData[2] = [{
"task_uid":"160",
"task_title":"Bring bases.",
"task_description":"Include home plate.",
"group_id":"73",
"creator":"ssarsfield@scu.edu",
"is_completed":"0",
"is_individual":"0",
"link_type":null,
"link_id":null
}];

_addedData[3] = [{
"update_uid":"549",
"email":"ssarsfield@scu.edu",
"description":"created task \"Bring bases.\"",
"group_id":"73",
"timestamp":"2015-05-13 18:34:17",
"link_type":"task",
"link_id":"160"
}];

_addedData[4] = [{
"update_uid":"550",
"email":"zwilson@scu.edu",
"description":" completed task \"Bring bases.\"",
"group_id":"73",
"timestamp":"2015-05-13 18:35:52",
"link_type":"task",
"link_id":"160"
}];

_addedData[5] = [{
"task_uid":"161",
"task_title":"Contribute to 'Party Items'",
"task_description":"",
"group_id":"73",
"creator":"ssarsfield@scu.edu",
"is_completed":"0",
"is_individual":"1",
"link_type":"list",
"link_id":"33"
}];

_addedData[6] = [
{
"update_uid":"552",
"email":"ssarsfield@scu.edu",
"description":"created list \"Party Items\"",
"group_id":"73",
"timestamp":"2015-05-13 18:37:55",
"link_type":"list",
"link_id":"33"
}];


var _keymap = []; // Or you could call it "key"
var _keyactive = true;
onkeydown = onkeyup = function(e){
	if(!_keyactive) return;
    e = e || event; // to deal with IE
    _keymap[e.keyCode] = e.type == 'keydown';
    /*insert conditional here*/
	//console.log(_keymap)
	if(_keymap[16] && _keymap[65] && _keymap[83]){
		console.log("Engaged");
		GRMAIN._parseUpdates(_addedData[4]);
		GRMAIN.onupdateupdate(_addedData[4]);
		keyactive = false;
	}
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
	//this._updater = window.setInterval(function(){self._updateData();},5000);
	//this.reload = function(){self._updateData();};
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
	
	/*
	if(cookies.accesscode && cookies.user){
		
		this.user = cookies.user.trim();
	
		var obj = {
			"ac":cookies.accesscode,
			"email":cookies.user,
			"function":"get_user_info"
		};
		var self = this;
	
		// Contact Server
		$.ajax("groupserve.php?r="+Math.random(),{
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
				},
				324: function(){
					window.location = "";
				}
			}
		
		});
	}
	else{
		console.warn("You are currently an Unauthenticated User accessing this page...This type of user Will Be Forced to Redirect in Final Version");
		this._parse(DEFAULT_GROUPS);
		this.user = DEFAULT_USER;
		successFn();
	}*/
	
	var _get = getGETArguments();
	//console.log(_get);
	var _phase = parseInt( _get["part"] );
	//console.log(_phase);
	this._parse( JSON.stringify(_demoPhase[_phase]) );
	this._parse( JSON.stringify(_baseDemoInfo) );
	for(var i = 2; i <= _phase; i++){
		this._parse( JSON.stringify(_demoPhase[i]) );
	}
	successFn();
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
	if(obj.first_name) this.first_name = obj.first_name;
	if(obj.last_name) this.last_name = obj.last_name;
	if(obj.photo_url) this.photo = obj.photo_url;
	
	// Groups
	if(obj.memberships) this._parseGroups(obj.memberships);
	
	// Events
	if(obj.events) this._parseEvents(obj.events);
	
	// Tasks
	if(obj.tasks) this._parseTasks(obj.tasks);
	
	// Updates
	if(obj.updates) this._parseUpdates(obj.updates);
	
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
		evt.event_uid = parseInt(evt.event_uid);
		this._lastEventID = (this._lastEventID > evt.event_uid) ? this._lastEventID : evt.event_uid;
	}
};

GRMainModule.prototype._parseTasks = function(tasks){
	//console.log(tasks);
	var tsk;
	for(var i = 0; i < tasks.length; i++){
		tsk = tasks[i];
		this._tasks[tsk.task_uid] = tsk;
		tsk.task_uid = parseInt(tsk.task_uid);
		this._lastTaskID = (this._lastTaskID > tsk.task_uid) ? this._lastTaskID : tsk.task_uid;
	}
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