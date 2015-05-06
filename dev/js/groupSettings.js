/* groupSettings.js */

// ==========================================================
// GLOBALS

// ==========================================================
// UTILITY

function employBackupProfile(elm){
	elm.src = "images/orange.jpg";
}

// ==========================================================
// SERVER COMM.

function manageGroup(groupID,groupName,role){
	//AJAX Member Load
	var _cookies = genCookieDictionary();
	if(_cookies.accesscode && _cookies.user){
	
		var obj = {
			"ac":_cookies.accesscode,
			"email":_cookies.user,
			"group_uid":groupID,
			"function":"get_group_members"
		};
		// Contact Server
		$.ajax("https://www.groupright.net"+GR_DIR+"/groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
					var data=JSON.parse(data);
					console.log(data);
					addMembersToModal(data,groupName,role);
				},
				220: function(data, status, jqXHR){
					//they don't have the necessary access to see this page have them login again
					window.location="https://www.groupright.net"+GR_DIR+"/login.html";
				}
			}
		
		});
	}
	else{
		console.warn("You are currently an Unauthenticated User accessing this page...This type of user Will Be Forced to Redirect in Final Version");
		//window.location="https://www.groupright.net"+GR_DIR+"/login.html";
		var data=[{
			"email":"zwilson7@gmail.com",
			"first_name":"Zachary",
			"last_name":"Wilson"
			},
			{
			"email":"scomatbarsar@gmail.com",
			"first_name":"Scott",
			"last_name":"Sarsfield"
			}]
		console.log(data);
		addMembersToModal(data,groupName,role);
	}
	//Load Members, Drop functionality, Change Leader Functionality
	$('#myModal').modal('toggle');
}

function makeMemberLeader(groupID,email){}

function dropMember(groupID,email){}

function _leaveGroup(groupID){
	var _cookies = genCookieDictionary();
	if(_cookies.accesscode && _cookies.user){
	
		var obj = {
			"ac":_cookies.accesscode,
			"email":_cookies.user,
			"group_uid":groupID,
			"function":"leave_group"
		};
		// Contact Server
		$.ajax("https://www.groupright.net"+GR_DIR+"/groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
					window.location = ""; /* reload */
				},
				220: function(data, status, jqXHR){
					//they don't have the necessary access to see this page have them login again
					window.location="https://www.groupright.net"+GR_DIR+"/login.html";
				}
			}
		
		});
	}
	else{
		console.warn("You are currently an Unauthenticated User accessing this page...This type of user Will Be Forced to Redirect in Final Version");
		
	}
	//Load Members, Drop functionality, Change Leader Functionality
	
}

function disbandGroup(groupID){
	
	confirm("Warning! This action cannot be undone. Do you wish to continue?");
	
	var _cookies = genCookieDictionary();
	if(_cookies.accesscode && _cookies.user){
	
		var obj = {
			"ac":_cookies.accesscode,
			"email":_cookies.user,
			"group_uid":groupID,
			"function":"disband_group"
		};
		// Contact Server
		$.ajax("https://www.groupright.net"+GR_DIR+"/groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
					window.location = ""; /* reload */
				},
				220: function(data, status, jqXHR){
					//they don't have the necessary access to see this page have them login again
					window.location="https://www.groupright.net"+GR_DIR+"/login.html";
				}
			}
		
		});
	}
	else{
		console.warn("You are currently an Unauthenticated User accessing this page...This type of user Will Be Forced to Redirect in Final Version");
		
	}
	//Load Members, Drop functionality, Change Leader Functionality
	
}

function _addGroupMembers(groupID,members){}

// ==========================================================
// LOAD / INIT

window.onload = function() {

	//get the cookies and get all of the data from the server
	var _cookies = genCookieDictionary();
	if(_cookies.accesscode && _cookies.user){
	
		var obj = {
			"ac":_cookies.accesscode,
			"email":_cookies.user,
			"function":"get_user_groups"
		};
	
		// Contact Server
		$.ajax("https://www.groupright.net"+GR_DIR+"/groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
					addUserGroupInfo(data);
				},
				220: function(data, status, jqXHR){
					//they don't have the necessary access to see this page have them login again
					window.location="https://www.groupright.net"+GR_DIR+"/login.html";
				}
			}
		
		});
	}
	else{
		console.warn("You are currently an Unauthenticated User accessing this page...This type of user Will Be Forced to Redirect in Final Version");
		//window.location="https://www.groupright.net"+GR_DIR+"/login.html";
		var allGroups=[
				{"group_name":"Apple","group_color":"red","group_id":"77","role":"member"},
				{"group_name":"Orange","group_color":"orange","group_id":"78","role":"member"},
				{"group_name":"Banana","group_color":"yellow","group_id":"79","role":"member"},
				{"group_name":"Pear","group_color":"green","group_id":"80","role":"leader"},
				{"group_name":"Strawberry","group_color":"red","group_id":"81","role":"member"},
				{"group_name":"Tomato","group_color":"red","group_id":"82","role":"member"},
				{"group_name":"Lemon","group_color":"yellow","group_id":"83","role":"leader"},
				{"group_name":"Grape","group_color":"purple","group_id":"84","role":"member"}
		];

		console.log(allGroups);
		loadGroups(allGroups);
	}

};

function loadGroups(allGroups){
	var colorButtons="Hello";
	document.getElementById("addNumber").innerHTML=allGroups.length;
	var adder=document.getElementById("groupAdder");
	var row;
	for(var i=0; i<allGroups.length; i++){
		var column=document.createElement('div');
		$(column).attr( 'class', 'col-sm-4' );
		if(i%3==0){
			row=document.createElement('div');
			$(row).attr( 'class', 'row' );
		}
		var pannel=document.createElement('div');
		$(pannel).attr( 'class', 'panel panel-default' );
		
		var pannelHeading=document.createElement('div');
		$(pannelHeading).attr( 'class', 'panel-heading' );
		var span=document.createElement('span');
		
		$(span).attr( 'class', 'glyphicon glyphicon-stop pull-right' );
		var colorButton=document.createElement('button');
		$(colorButton).attr( 'class', 'btn btn-default pull-right' );
		$(colorButton).attr( 'type', 'button' );
		$(colorButton).attr('data-toggle','popover');
		$(colorButton).attr('data-container','body');
		$(colorButton).attr('data-placement','top');
		//$(colorButton).attr('onclick','alert("change color");');
		$(colorButton).attr('id','popover'+i);
		$(colorButton).attr('data-content','Hello World');
		$(colorButton).attr('onclick','alert("hello")');
		colorButton.style.padding="4px";
		colorButton.style.backgroundColor=allGroups[i].group_color;


		span.style.color=allGroups[i].group_color;

		var pannelBody=document.createElement('div');
		$(pannelBody).attr( 'class', 'panel-body' );
		
		var p=document.createElement('p');
		p.innerHTML="You are a group <b>"+allGroups[i].role+"</b>.";
		pannelBody.appendChild(p);

		var a1=document.createElement('a');
		p1=document.createElement('p');
		if(allGroups[i].role=="member"){
			$(a1).attr('onclick','leaveGroup('+allGroups[i].group_id+')');
			p1.innerHTML="Leave this group";
		}else{
			$(a1).attr('onclick','disbandGroup('+allGroups[i].group_id+')');
			p1.innerHTML="Disband this group";
		}
		a1.appendChild(p1);
		a1.style.cursor="pointer";	
		pannelBody.appendChild(a1);

		// View / Manage
		p2=document.createElement('p');
		var a2=document.createElement('a');
		$(a2).attr('onclick','manageGroup('+allGroups[i].group_id+',"'+allGroups[i].group_name+'","'+allGroups[i].role+'")');
		a2.style.cursor="pointer";
		if(allGroups[i].role=="member"){
			p2.innerHTML="View Members";
		}
		else{
			p2.innerHTML="Manage Membership";
		}
		a2.appendChild(p2);
		pannelBody.appendChild(a2);



		var h4=document.createElement('h4');
		h4.innerHTML=allGroups[i].group_name;
		colorButton.appendChild(span);
		h4.appendChild(colorButton);
		pannelHeading.appendChild(h4);
		pannel.appendChild(pannelHeading);
		pannel.appendChild(pannelBody);
		//adder.appendChild(pannel);
		column.appendChild(pannel)
		row.appendChild(column);
		if(i%3==0){
			adder.appendChild(row);
		}
	}
	for(var i=0; i<allGroups.length; i++){
		//$('#popover'+i).popover();
		$(function() {
		    $('#popover'+i).tooltip();
		});
		//alert("hi");
	}
}

function addUserGroupInfo(data){
	var _cookies = genCookieDictionary();
	//What to do on the page load
	obj = JSON.parse(data);
	//Add their name
	addUsersName(obj.first_name);
	//Add their groups
	addUsersGroups(obj.memberships);
	//Deal with Profile Pick
	initials=obj.first_name[0] + obj.last_name[0];
	dealwithProfilePic(obj.photo_url,initials);
	//populate the page with the users groups
	loadGroups(obj.memberships);

}

function leaveGroup(groupID){
	confirm("Warning! This action cannot be undone. Do you wish to continue?");
	
	_leaveGroup(groupID);
}

// ==========================================================
// RENDER

function addMembersToModal(membersArray,groupName,role){
	
	var _cookie = genCookieDictionary();
	
	document.getElementById("modalGroupName").innerHTML=groupName;
	//clear out anything there already
	var addLocation=document.getElementById("addMembers");
	addLocation.innerHTML="";
	var headingRow=document.getElementById("addModalTableHeadings");
	headingRow.innerHTML="";
	if(role=="member"){
		var th=document.createElement('th');
		th.innerHTML="Member";
		th.colspan = 2;
		headingRow.appendChild(th);
		console.log("Here VVV");
		console.log(membersArray);
		for(var i=0; i<membersArray.length; i++){
		    var tr=document.createElement('tr');
			
			// pic
		    var td=document.createElement('td');
			var p_u = (membersArray[i].photo_url) ? membersArray[i].photo_url : "images/orange.jpg";
			td.appendChild( 
				$("<img />",{src:p_u,class:"member-profile-pic img-circle"}).error(function(){
					employBackupProfile(this);
				})[0]
			);
			//tr.appendChild(td);
			
			// name
			//td=document.createElement('td');
			var div = document.createElement('div');
		    div.innerHTML=membersArray[i].first_name+" "+membersArray[i].last_name;
			td.appendChild(div);
			tr.appendChild(td);
			
			// role
			td=document.createElement('td');
			div = document.createElement('div');
			div.className = "member-role-div";
		    div.innerHTML= (membersArray[i].role == 'leader') ? "Leader" : "Member";
			td.appendChild(div);
			tr.appendChild(td);
			
			addLocation.appendChild(tr);
		}
	}
	else if(role=="leader"){
		var th=document.createElement('th');
		th.innerHTML="Member";
		th.colspan = 4;
		headingRow.appendChild(th);
		console.log("Here VVV");
		console.log(membersArray);
		for(var i=0; i<membersArray.length; i++){
		    var tr=document.createElement('tr');
			
			// pic
		    var td=document.createElement('td');
			var p_u = (membersArray[i].photo_url) ? membersArray[i].photo_url : "images/orange.jpg";
			td.appendChild( 
				$("<img />",{src:p_u,class:"member-profile-pic img-circle"}).error(function(){
					employBackupProfile(this);
				})[0]
			);
			//tr.appendChild(td);
			
			// name
			//td=document.createElement('td');
			var div = document.createElement('div');
		    div.innerHTML=membersArray[i].first_name+" "+membersArray[i].last_name;
			td.appendChild(div);
			tr.appendChild(td);
			
			
			// role
			td=document.createElement('td');
			div = document.createElement('div');
			div.className = "member-role-div";
		    div.innerHTML= (membersArray[i].role == 'leader') ? "Leader" : "Member";
			td.appendChild(div);
			tr.appendChild(td);
			
			
			td=document.createElement('td');
			
			if(membersArray[i].email != _cookie.user){
				
				// make leader
				var button = document.createElement('a');
				button.href = "#";
				$(button).css({"float":"right","fontSize":"0.9em"});
				button.innerHTML= "Make Leader";
				td.appendChild(button);
				
				td.appendChild($("<br />")[0]);
				
				// drop member
				button = document.createElement('a');
				button.href = "#";
				$(button).css({"float":"right","fontSize":"0.9em"});
				button.innerHTML= "Drop Member";
				td.appendChild(button);
			}
				
			tr.appendChild(td);
			
			
			addLocation.appendChild(tr);
		}
	}
}
