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
"photo_url":"https:\/\/www.groupright.net\/_profiles\/815fda376c535c047df8dff54d62b3097370e2f6.jpg",
"memberships":[{
"group_name":"Air Networks",
"group_color":"#48CB09",
"group_id":"74",
"role":"member",
"members":[{
"email":"zwilson@scu.edu",
"first_name":"Zachary",
"last_name":"Wilson",
"photo_url":"https:\/\/www.groupright.net\/_profiles\/195538e3714b75c2201e0e3e09c543229cdc20cb.png",
"role":"leader"
},
{
"email":"ssarsfield@scu.edu",
"first_name":"Scott",
"last_name":"Sarsfield",
"photo_url":"https:\/\/www.groupright.net\/_profiles\/815fda376c535c047df8dff54d62b3097370e2f6.jpg",
"role":"member"
},
{
"email":"kbigler@scu.edu",
"first_name":"Kenneth",
"last_name":"Bigler",
"photo_url":"https:\/\/www.groupright.net\/_profiles\/7d572ffc2aec0b676d691f5c4fbb248c4396399d.jpg",
"role":"member"
}]
},
{
"group_name":"COEN 177 Project",
"group_color":"#FFF763",
"group_id":"75",
"role":"member",
"members":[{
"email":"kbigler@scu.edu",
"first_name":"Kenneth",
"last_name":"Bigler",
"photo_url":"https:\/\/www.groupright.net\/_profiles\/7d572ffc2aec0b676d691f5c4fbb248c4396399d.jpg",
"role":"leader"
},
{
"email":"ssarsfield@scu.edu",
"first_name":"Scott",
"last_name":"Sarsfield",
"photo_url":"https:\/\/www.groupright.net\/_profiles\/815fda376c535c047df8dff54d62b3097370e2f6.jpg",
"role":"member"
},
{
"email":"zwilson@scu.edu",
"first_name":"Zachary",
"last_name":"Wilson",
"photo_url":"https:\/\/www.groupright.net\/_profiles\/195538e3714b75c2201e0e3e09c543229cdc20cb.png",
"role":"member"
}]
},
{
"group_name":"Orchestra",
"group_color":"#E03FFE",
"group_id":"76",
"role":"leader",
"members":[{
"email":"ssarsfield@scu.edu",
"first_name":"Scott",
"last_name":"Sarsfield",
"photo_url":"https:\/\/www.groupright.net\/_profiles\/815fda376c535c047df8dff54d62b3097370e2f6.jpg",
"role":"leader"
},
{
"email":"zwilson7@gmail.com",
"first_name":"Taylor",
"last_name":"McCarthy",
"photo_url":"https:\/\/www.groupright.net\/_profiles\/0f3b19e5f81cc394286add6e213f32fc150aeab3.jpg",
"role":"member"
},
{
"email":"apotika@scu.edu",
"first_name":"Katerina",
"last_name":"Potika",
"photo_url":null,
"role":"member"
},
{
"email":"kennethbigler@gmail.com",
"first_name":"Jessica",
"last_name":"Petersen",
"photo_url":"https:\/\/www.groupright.net\/_profiles\/6c91165b9015c55e4194085f45d635d1617936ca.png",
"role":"member"
}]
}],
"tasks":[{
"task_uid":"165",
"task_title":"Complete Report Introduction",
"task_description":"This is the basic overview of the report.",
"group_id":"75",
"creator":"kbigler@scu.edu",
"is_completed":"1",
"is_individual":"0",
"link_type":null,
"link_id":null
},
{
"task_uid":"166",
"task_title":"Study Beethoven's 5th",
"task_description":"We will do a practice performance soon.",
"group_id":"76",
"creator":"ssarsfield@scu.edu",
"is_completed":"0",
"is_individual":"0",
"link_type":null,
"link_id":null
},
{
"task_uid":"167",
"task_title":"Debug WiFi connection",
"task_description":"Some customers have been reporting dropouts when they use Android devices.",
"group_id":"74",
"creator":"zwilson@scu.edu",
"is_completed":"0",
"is_individual":"0",
"link_type":null,
"link_id":null
},
{
"task_uid":"168",
"task_title":"Contribute to 'Songs for the concert.'",
"task_description":"",
"group_id":"76",
"creator":"zwilson7@gmail.com",
"is_completed":"1",
"is_individual":"1",
"link_type":"list",
"link_id":"35"
}],
"events":[{
"event_uid":"108",
"name":"Code Review",
"description":"Detailed Review to get us all on the same page before the presentation.",
"group_id":"75",
"creator":"kbigler@scu.edu",
"start_time":"2015-05-14 18:00:00",
"end_time":"2015-05-14 20:00:00"
},
{
"event_uid":"107",
"name":"Closing Meeting",
"description":"Discussion of our week's progress and planning of what's to come next week.",
"group_id":"74",
"creator":"zwilson@scu.edu",
"start_time":"2015-05-16 21:00:00",
"end_time":"2015-05-16 22:30:00"
},
{
"event_uid":"109",
"name":"Meeting with Advisor",
"description":"Lets get things settled.",
"group_id":"75",
"creator":"zwilson@scu.edu",
"start_time":"2015-05-18 15:30:00",
"end_time":"2015-05-18 16:15:00"
}],
"updates":[{
"update_uid":"579",
"email":"zwilson7@gmail.com",
"description":"added an item to list \"Songs for the concert.\"",
"group_id":"76",
"timestamp":"2015-05-14 00:46:19",
"link_type":"list",
"link_id":"35"
},
{
"update_uid":"568",
"email":"kbigler@scu.edu",
"description":" completed task \"Complete Report Introduction\"",
"group_id":"75",
"timestamp":"2015-05-13 21:26:12",
"link_type":"task",
"link_id":"165"
},
{
"update_uid":"567",
"email":"ssarsfield@scu.edu",
"description":" completed task \"Debug WiFi connection\"",
"group_id":"74",
"timestamp":"2015-05-13 21:25:00",
"link_type":"task",
"link_id":"167"
},
{
"update_uid":"566",
"email":"zwilson@scu.edu",
"description":"created event \"Meeting with Advisor\"",
"group_id":"75",
"timestamp":"2015-05-13 21:24:25",
"link_type":"event",
"link_id":"109"
},
{
"update_uid":"565",
"email":"kennethbigler@gmail.com",
"description":"added an item to list \"Songs for the concert.\"",
"group_id":"76",
"timestamp":"2015-05-13 21:22:34",
"link_type":"list",
"link_id":"35"
},
{
"update_uid":"564",
"email":"kennethbigler@gmail.com",
"description":"added an item to list \"Songs for the concert.\"",
"group_id":"76",
"timestamp":"2015-05-13 21:22:12",
"link_type":"list",
"link_id":"35"
},
{
"update_uid":"563",
"email":"zwilson7@gmail.com",
"description":"created list \"Songs for the concert.\"",
"group_id":"76",
"timestamp":"2015-05-13 21:18:53",
"link_type":"list",
"link_id":"35"
},
{
"update_uid":"562",
"email":"zwilson@scu.edu",
"description":"created task \"Debug WiFi connection\"",
"group_id":"74",
"timestamp":"2015-05-13 21:16:44",
"link_type":"task",
"link_id":"167"
},
{
"update_uid":"561",
"email":"ssarsfield@scu.edu",
"description":"created task \"Study Beethoven's 5th\"",
"group_id":"76",
"timestamp":"2015-05-13 21:15:25",
"link_type":"task",
"link_id":"166"
},
{
"update_uid":"560",
"email":"kbigler@scu.edu",
"description":"created task \"Complete Report Introduction\"",
"group_id":"75",
"timestamp":"2015-05-13 21:12:03",
"link_type":"task",
"link_id":"165"
},
{
"update_uid":"559",
"email":"kbigler@scu.edu",
"description":"created event \"Code Review\"",
"group_id":"75",
"timestamp":"2015-05-13 21:10:47",
"link_type":"event",
"link_id":"108"
},
{
"update_uid":"558",
"email":"zwilson@scu.edu",
"description":"created event \"Closing Meeting\"",
"group_id":"74",
"timestamp":"2015-05-13 21:07:53",
"link_type":"event",
"link_id":"107"
}]
};

_demoPhase[1] = {};

_demoPhase[2] = {
"memberships":[{
"group_name":"Seventh Inning Stretchers",
"group_color":"#E03FFE",
"group_id":"173",
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
"task_uid":"1158",
"task_title":"Provide Availability for 'Practice'",
"task_description":"",
"group_id":"173",
"creator":"ssarsfield@scu.edu",
"is_completed":"1",
"is_individual":"1",
"link_type":"event",
"link_id":"105"
},
{
"task_uid":"1159",
"task_title":"Pick Time for 'Practice'",
"task_description":"",
"group_id":"173",
"creator":"ssarsfield@scu.edu",
"is_completed":"0",
"is_individual":"1",
"link_type":"event_report",
"link_id":"105"
}],
"events":[],
"updates":[{
"update_uid":"1548",
"email":"ssarsfield@scu.edu",
"description":"created event \"Practice\"",
"group_id":"173",
"timestamp":"2015-05-13 18:32:36",
"link_type":"event",
"link_id":"105"
}]
};

_demoPhase[4] = {
"tasks":[
{
"task_uid":"1159",
"task_title":"Pick Time for 'Practice'",
"task_description":"",
"group_id":"173",
"creator":"ssarsfield@scu.edu",
"is_completed":"1",
"is_individual":"1",
"link_type":"event_report",
"link_id":"105"
},
{
"task_uid":"167",
"task_title":"Debug WiFi connection",
"task_description":"Some customers have been reporting dropouts when they use Android devices.",
"group_id":"74",
"creator":"zwilson@scu.edu",
"is_completed":"0",
"is_individual":"0",
"link_type":null,
"link_id":null
}],
"events":[
{
"event_uid":"1105",
"name":"Practice",
"description":"",
"group_id":"173",
"creator":"ssarsfield@scu.edu",
"start_time":"2015-05-15 21:00:00",
"end_time":"2015-05-15 22:00:00"
}],
"updates":[
{
"update_uid":"1551",
"email":"ssarsfield@scu.edu",
"description":"chose a time for \"Practice\"",
"group_id":"173",
"timestamp":"2015-05-13 18:37:11",
"link_type":"event",
"link_id":"105"
},
{
"update_uid":"1550",
"email":"zwilson@scu.edu",
"description":" completed task \"Bring bases.\"",
"group_id":"173",
"timestamp":"2015-05-13 18:35:52",
"link_type":"task",
"link_id":"160"
},
{
"update_uid":"1549",
"email":"ssarsfield@scu.edu",
"description":"created task \"Bring bases.\"",
"group_id":"173",
"timestamp":"2015-05-13 18:34:17",
"link_type":"task",
"link_id":"160"
}]
};

_demoPhase[5] = {
"tasks":[
{
"task_uid":"1161",
"task_title":"Contribute to 'Party Items'",
"task_description":"",
"group_id":"173",
"creator":"ssarsfield@scu.edu",
"is_completed":"1",
"is_individual":"1",
"link_type":"list",
"link_id":"33"
}],
"events":[],
"updates":[
{
"update_uid":"1555",
"email":"zwilson@scu.edu",
"description":"added an item to list \"Party Items\"",
"group_id":"173",
"timestamp":"2015-05-13 18:38:19",
"link_type":"list",
"link_id":"33"
},
{
"update_uid":"1554",
"email":"kbigler@scu.edu",
"description":"added an item to list \"Party Items\"",
"group_id":"173",
"timestamp":"2015-05-13 18:38:18",
"link_type":"list",
"link_id":"33"
},
{
"update_uid":"1553",
"email":"ssarsfield@scu.edu",
"description":"added an item to list \"Party Items\"",
"group_id":"173",
"timestamp":"2015-05-13 18:38:13",
"link_type":"list",
"link_id":"33"
},
{
"update_uid":"1552",
"email":"ssarsfield@scu.edu",
"description":"created list \"Party Items\"",
"group_id":"173",
"timestamp":"2015-05-13 18:37:55",
"link_type":"list",
"link_id":"33"
}]
};


var _addedData = [];
_addedData[0] = [{
"task_uid":"1158",
"task_title":"Provide Availability for 'Practice'",
"task_description":"",
"group_id":"173",
"creator":"ssarsfield@scu.edu",
"is_completed":"0",
"is_individual":"1",
"link_type":"event",
"link_id":"105"
},
{
"task_uid":"1159",
"task_title":"Pick Time for 'Practice'",
"task_description":"",
"group_id":"173",
"creator":"ssarsfield@scu.edu",
"is_completed":"0",
"is_individual":"1",
"link_type":"event_report",
"link_id":"105"
}];

_addedData[1] = [{
"update_uid":"1548",
"email":"ssarsfield@scu.edu",
"description":"created event \"Practice\"",
"group_id":"173",
"timestamp":"2015-05-13 18:32:36",
"link_type":"event",
"link_id":"105"
}];

_addedData[2] = [{
"task_uid":"1160",
"task_title":"Bring bases.",
"task_description":"Include home plate.",
"group_id":"173",
"creator":"ssarsfield@scu.edu",
"is_completed":"0",
"is_individual":"0",
"link_type":null,
"link_id":null
}];

_addedData[3] = [{
"update_uid":"1549",
"email":"ssarsfield@scu.edu",
"description":"created task \"Bring bases.\"",
"group_id":"173",
"timestamp":"2015-05-13 18:34:17",
"link_type":"task",
"link_id":"160"
}];

_addedData[4] = [{
"update_uid":"1550",
"email":"zwilson@scu.edu",
"description":" completed task \"Debug Wifi connection.\"",
"group_id":"74",
"timestamp":"2015-05-13 18:35:52",
"link_type":"task",
"link_id":"167"
}];

_addedData[5] = [{
"task_uid":"1161",
"task_title":"Contribute to 'Party Items'",
"task_description":"",
"group_id":"173",
"creator":"ssarsfield@scu.edu",
"is_completed":"0",
"is_individual":"1",
"link_type":"list",
"link_id":"33"
}];

_addedData[6] = [
{
"update_uid":"1552",
"email":"ssarsfield@scu.edu",
"description":"created list \"Party Items\"",
"group_id":"173",
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