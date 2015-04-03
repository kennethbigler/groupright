// grtopbar.js
//
//		Scripts To Populate / Initialize the [Shared] Top Bar.


function initTopBar(){
	addUsersName();			// set name
	dealwithProfilePic();	// set profile picture
	addUsersGroups();		// add groups to drop down	
}


function addUsersName(){
	document.getElementById("profileName").innerHTML=GRMAIN.first_name+'<span class="caret"></span>';
}

function dealwithProfilePic(){
	var url = GRMAIN.photo;
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
	var allGroups = GRMAIN.groups();
	
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
