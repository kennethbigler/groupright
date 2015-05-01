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
			"ac":cookies.accesscode,
			"email":cookies.user,
			"function":"get_user_groups"
		};
		var self = this;
	
		// Contact Server
		$.ajax("https://www.groupright.net"+GR_DIR+"/groupserve.php",{
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
	
	//console.log(this);
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
	GRGROUPS = new GRGroupsModule();
	GRGROUPS.load(genCookieDictionary(),
		function(){
			initTopBar();
		},
		function(){
			window.location="https://www.groupright.net"+GR_DIR+"/login.html";
		}
	);
});

function initTopBar(){
	addUsersName();			// set name
	dealwithProfilePic();	// set profile picture
	addUsersGroups();		// add groups to drop down
	addSettingsLinks();		// add settings pages links
	addMode();
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
	allMyGroups += '<li><a class="usergrouplinks" href="home.html?" ><span class="glyphicon glyphicon-stop" style="color:transparent;"></span>&nbsp;Show All Groups</a></li><hr />';
		
	for(var i = 0; i < numGroups; i ++) {
		allMyGroups += '<li><a class="usergrouplinks" href="home.html?guid='+allGroups[i].group_id+'"><span class="glyphicon glyphicon-stop" style="border:1px solid white;color:' + 
			allGroups[i].group_color +
			';"></span>&nbsp;' +
			allGroups[i].group_name +
			'</a></li>';
	}
	groupMenu.innerHTML = allMyGroups;
}
function addSettingsLinks(){
	var settingsMenu=document.getElementById("settingsMenu");
	settingsMenu.innerHTML='<li onclick="logoutAndRedirect()"><a href="#"><span class="glyphicon glyphicon-log-out"></span> Logout</a></li>';
	settingsMenu.innerHTML+='<li><a href="account_settings.html"><span class="glyphicon glyphicon-th-list"></span> My Account</a></li>';
	settingsMenu.innerHTML+='<li><a href="group_settings.html"><span class="glyphicon glyphicon-cog"></span> Group Settings</a></li>';
	settingsMenu.innerHTML+='<li><a href="notification_settings.html"><span class="glyphicon glyphicon-bell"></span> Notifications</a></li>';
	settingsMenu.innerHTML+='<li><a href="error_settings.html"><span class="glyphicon glyphicon-wrench"></span> Report Error</a></li>';
	settingsMenu.innerHTML+='<li><a href="contact.html"><span class="glyphicon glyphicon-question-sign"></span> Help</a></li>';
}

function addMode(){
	if(GR_DIR=="/dev"){
		document.getElementById("addMode").innerHTML="<span class='label label-danger'>Dev Mode</span>";
	}
}
//============================================================
// LOGOUT

function logoutAndRedirect(){
	
	var _cookies = genCookieDictionary();

	if(_cookies.accesscode && _cookies.user){
	
		var obj = {
			"code":_cookies.accesscode,
			"email":_cookies.user,
			"function":"logout_user"
		};
	
		// Contact Server
		$.ajax("https://www.groupright.net"+GR_DIR+"/groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
						eatCookies();
						window.location = "./index.html"; /* presumed redirect */
					},
				211: function(data, status, jqXHR){
						eatCookies();
						window.location = "./index.html"; //redirect, but be kind of misleading when doing it
					}
			}
		
		});
	}
	//For Safety Do it here too
	/*eatCookies();
	window.location = "./index.html"; //redirect, but be really misleading when doing it
	*/
}
