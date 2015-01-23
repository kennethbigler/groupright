function logoutAndRedirect(){
	
	var _cookies = genCookieDictionary();

	if(_cookies.accesscode && _cookies.user){
	
		var obj = {
			"code":_cookies.accesscode,
			"email":_cookies.user,
			"function":"logout_user"
		};
	
		// Contact Server
		$.ajax("https://www.groupright.net/dev/groupserve.php",{
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

function addUsersInfo(data){
	obj = JSON.parse(data);
	//console.log(obj);
	//console.log(obj.memberships);
	initials=obj.first_name[0] + obj.last_name[0];
	addUsersGroups(obj.memberships);
	dealwithProfilePic(obj.photo_url,initials);
	addUsersName(obj.first_name);
}
function addUsersName(firstName){
	document.getElementById("profileName").innerHTML=firstName+'<span class="caret"></span>';
}

function dealwithProfilePic(url, initials){
	//alert(initials);
	var profileImage=document.getElementById("profileImage");
	if(url==null){
		//alert("here");
		profileImage.src="images/black.png";
		profileImage.style.backgroundColor="orange";
		profileImage.style.border="2px solid #AF7817";
		//still have to do something with initials
		return;
	}
	profileImage.src=url;
}

/* Populate the groups field on the homepage with the "groups" json object */
function addUsersGroups(allGroups){
	
	var groupMenu = document.getElementById("myGroups");
	var numGroups = allGroups.length;
	var allMyGroups = '';

	for(var i = 0; i < numGroups; i ++) {
		allMyGroups += '<li><a href="#"><span class="glyphicon glyphicon-stop" style="color:' + 
			allGroups[i].groupColor +
			';"></span>&nbsp;' +
			allGroups[i].groupName +
			'</a></li>';
	}
	groupMenu.innerHTML = allMyGroups;
}
function showSelectionBox(number){
	if(number==1){
		document.getElementById("createGroupBox").style.display="block";
	}
	else if(number==2){

	}
	else if(number==3){

	}
	else if(number==4){

	}
}
window.onload = function() {
	//get the cookies and get all of the data from the server
	var _cookies = genCookieDictionary();

	if(_cookies.accesscode && _cookies.user){
	
		var obj = {
			"cookie":_cookies.accesscode,
			"email":_cookies.user,
			"function":"get_user_info"
		};
	
		// Contact Server
		$.ajax("https://www.groupright.net/dev/groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
					addUsersInfo(data);
				}
			}
		
		});
	}

	document.getElementById("member1").value=_cookies.user;
};
