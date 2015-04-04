// grtopbar.js
//
//		Scripts To Populate / Initialize the [Shared] Top Bar.

//===========================================================================
// GRGroupsModule
/**
**	GRGroupsModule
**		Primary object for global storage.
**/
function GRGroupsModule(){
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
	
}


//=======================================================================
// LOADING / INITIALIZE
GRGroupsModule.prototype.load = function(cookies,successFn,failureFn){
	if(cookies.accesscode && cookies.user){
		
		this.user = cookies.user.trim();
	
		var obj = {
			"cookie":cookies.accesscode,
			"email":cookies.user,
			"function":"get_user_groups"
		};
		var self = this;
	
		// Contact Server
		$.ajax("https://www.groupright.net/dev/groupserve.php",{
			type:"POST",
			data:obj,
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
// PARSING

GRGroupsModule.prototype._parse = function(data){
	this._raw = data;
	
	var obj = JSON.parse(data);
	//console.log(obj);
	
	// Basic Info
	this.first_name = obj.first_name;
	this.last_name = obj.last_name;
	this.photo = obj.photo_url;
	
	// Groups
	this._parseGroups(obj.memberships);
	
	console.log(this);
}

GRGroupsModule.prototype._parseGroups = function(groups){
	//console.log(groups);
	
	for(var i = 0; i < groups.length; i++){
		var grp = groups[i];
		this._groups[grp.group_id] = grp;
	}
	//console.log(this._groups);
	//console.log(this._contacts);
};

//===========================================================================
// TOP BAR INITIALIZATION

var GRGROUPS;
$(document).ready(function(){
	console.log("winload");
	GRGROUPS = new GRGroupsModule();
	console.log("Here");
	console.log(GRGROUPS);
	GRGROUPS.load(genCookieDictionary(),
		function(){
			initTopBar();
		},
		function(){
			window.location="https://www.groupright.net/dev/login.html";
		}
	);
});

function initTopBar(){
	addUsersName();			// set name
	dealwithProfilePic();	// set profile picture
	addUsersGroups();		// add groups to drop down	
}


function addUsersName(){
	document.getElementById("profileName").innerHTML=GRGROUPS.first_name+'<span class="caret"></span>';
}

function dealwithProfilePic(){
	var url = GRGROUPS.photo;
	//alert(initials);
	var profileImage=document.getElementById("profileImage");
	if(url==null){
		//alert("here");
		//profileImage.src="images/black.png";
		profileImage.src="images/orange.jpg";
		profileImage.style.backgroundColor="orange";
		profileImage.style.border="2px solid #AF7817";
		//still have to do something with initials
		return;
	}
	profileImage.src=url;
}

/* Populate the groups field on the homepage with the "groups" json object */
function addUsersGroups(){
	var allGroups = GRGROUPS.groups();
	
	var groupMenu = document.getElementById("myGroups");
	var numGroups = allGroups.length;
	var allMyGroups = '';

	// All Groups
	allMyGroups += '<li><a href="?" ><span class="glyphicon glyphicon-stop" style="color:transparent;"></span>&nbsp;Show All Groups</a></li><hr />';
		
	for(var i = 0; i < numGroups; i ++) {
		allMyGroups += '<li><a href="?guid='+allGroups[i].group_id+'"><span class="glyphicon glyphicon-stop" style="color:' + 
			allGroups[i].group_color +
			';"></span>&nbsp;' +
			allGroups[i].group_name +
			'</a></li>';
	}
	groupMenu.innerHTML = allMyGroups;
}
