window.onload = function() {

	var _GET =getSearchParameters();

	if (_GET["update"] == null || _GET["update"] == "") {
		document.getElementById("successBanner").style.display="none";
	}
	else{
		document.getElementById("successBanner").style.display="block";
		if(_GET["update"]==0){
			//name
			document.getElementById("successBanner").innerHTML="Your name was successfully updated.";
		}
		else if(_GET["update"]==1){
			//password
			document.getElementById("successBanner").innerHTML="Your password was successfully updated.";
		}
		else if(_GET["update"]==2){
			//phone
			document.getElementById("successBanner").innerHTML="Your phone number was successfully updated.";
		}
	}


	//get the cookies and get all of the data from the server
	var _cookies = genCookieDictionary();
	if(_cookies.accesscode && _cookies.user){
		
		$("#pp_cookie_email").val(_cookies.user);
		$("#pp_cookie_ac").val(_cookies.accesscode);
	
		var obj = {
			"ac":_cookies.accesscode,
			"email":_cookies.user,
			"function":"get_account_info"
		};
	
		// Contact Server
		$.ajax("https://www.groupright.net"+GR_DIR+"/groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
					loadAccountInfo(JSON.parse(data));
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

		var accountInfo={"first_name":"John","last_name":"Doe","date_joined":"2015-01-23 18:53:00","phone_number":"5556667777"};
		console.log(accountInfo);
		loadAccountInfo(accountInfo);
	}

};

function loadAccountInfo(accountInfo){
	console.log(accountInfo);
	var _cookies = genCookieDictionary();
	document.getElementById("firstName").innerHTML=accountInfo.first_name;
	document.getElementById("lastName").innerHTML=accountInfo.last_name;
	document.getElementById("email").innerHTML=_cookies.user;

	if(accountInfo.phone_number!=null){
		var areaCode=accountInfo.phone_number.substring(0, 3);
		var first_three=accountInfo.phone_number.substring(3, 6);
		var last_four=accountInfo.phone_number.substring(6, 10);
		document.getElementById("phoneNumber").innerHTML="("+areaCode+") "+first_three+"-"+last_four;
	}
	if(accountInfo.date_joined!=null){
		var dateStr = accountInfo.date_joined;
		var months=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		document.getElementById("dateJoined").innerHTML= months[parseInt(dateStr.substring(5,7))-1] +" "+parseInt(dateStr.substring(8,10))+", "+dateStr.substring(0,4);
	}
	
	if(accountInfo.photo_url!=null){
		$("#existing_pp")[0].src = accountInfo.photo_url;
	}
}

function changeName(){
	document.getElementById("nameError").innerHTML="";
	var firstName=document.getElementById("newFirstName").value;
	var lastName=document.getElementById("newLastName").value;
	if(firstName.length<2){
		document.getElementById("nameError").innerHTML="Please enter a valid first name.";
		return false;
	}
	if(lastName.length<2){
		document.getElementById("nameError").innerHTML="Please enter a valid last name.";
		return false;
	}

	//get the cookies and get all of the data from the server
	var _cookies = genCookieDictionary();
	if(_cookies.accesscode && _cookies.user){
	
		var obj = {
			"ac":_cookies.accesscode,
			"email":_cookies.user,
			"first_name":firstName,
			"last_name":lastName,
			"function":"change_name"
		};
	
		// Contact Server
		$.ajax("https://www.groupright.net"+GR_DIR+"/groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
					//Redirect for Confirmation
					window.location="https://www.groupright.net"+GR_DIR+"/account_settings.html?update=0";
				},
				220: function(data, status, jqXHR){
					//they don't have the necessary access to see this page have them login again
					window.location="https://www.groupright.net"+GR_DIR+"/login.html";
				}
			}
		
		});
	}
	else{
		console.warn("No Valid Cookies in current state. Force Redirect. fx: changeName");
		//window.location="https://www.groupright.net"+GR_DIR+"/login.html";

	}
}
function changeGRPassword(){
	document.getElementById("passwordError").innerHTML="";
	var oldPassword=document.getElementById("oldPassword").value;
	var newPassword1=document.getElementById("newPassword1").value;
	var newPassword2=document.getElementById("newPassword2").value;
	if(oldPassword.length<1){
		document.getElementById("passwordError").innerHTML="Your current password is required.";
		return false;
	}
	if(newPassword1.length<1){
		document.getElementById("passwordError").innerHTML="Please enter a new password.";
		return false;
	}
	if(newPassword2.length<1){
		document.getElementById("passwordError").innerHTML="Please confirm your new password.";
		return false;
	}
	if(newPassword2!=newPassword1){
		document.getElementById("passwordError").innerHTML="Your password confirmation does not match the original.";
		return false;
	}
	
	//get the cookies and get all of the data from the server
	var _cookies = genCookieDictionary();
	if(_cookies.accesscode && _cookies.user){
	
		var obj = {
			"ac":_cookies.accesscode,
			"email":_cookies.user,
			"old_password":oldPassword,
			"new_password":newPassword1,
			"function":"change_password"
		};
		// Contact Server
		$.ajax("https://www.groupright.net"+GR_DIR+"/groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
					//Redirect for Confirmation
					window.location="https://www.groupright.net"+GR_DIR+"/account_settings.html?update=1";
				},
				206: function(data, status, jqXHR){
					var errorField=document.getElementById("passwordError").innerHTML="Your old password was invalid. Password was not changed.";
				},
				220: function(data, status, jqXHR){
					//they don't have the necessary access to see this page have them login again
					window.location="https://www.groupright.net"+GR_DIR+"/login.html";
				}
			}
		
		});
	}
	else{
		console.warn("No Valid Cookies in current state. Force Redirect. fx: changePassword");
		//window.location="https://www.groupright.net"+GR_DIR+"/login.html";

	}
}
function changePhone(){
	document.getElementById("phoneNumberError").innerHTML="";
	var phoneNumber=document.getElementById("newPhoneNumber").value;
	if(phoneNumber.length<1){
		document.getElementById("phoneNumberError").innerHTML="Please enter a phone number.";
		return false;
	}
	var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
	if(!phoneNumber.match(phoneno)) {
	    document.getElementById("phoneNumberError").innerHTML="Please enter a valid phone number. Accepted format: (XXX) XXX-XXXX";
	    return false;
	}
	phoneNumber = phoneNumber.replace(/\D/g,'');
	//document.getElementById("phoneNumberError").innerHTML="Accepted Number"+phoneNumber;
	//get the cookies and get all of the data from the server
	var _cookies = genCookieDictionary();
	if(_cookies.accesscode && _cookies.user){
	
		var obj = {
			"ac":_cookies.accesscode,
			"email":_cookies.user,
			"phone_number":phoneNumber,
			"function":"change_phone_number"
		};
	
		// Contact Server
		$.ajax("https://www.groupright.net"+GR_DIR+"/groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
					//Redirect for Confirmation
					window.location="https://www.groupright.net"+GR_DIR+"/account_settings.html?update=2";
				},
				220: function(data, status, jqXHR){
					//they don't have the necessary access to see this page have them login again
					window.location="https://www.groupright.net"+GR_DIR+"/login.html";
				}
			}
		
		});
	}
	else{
		console.warn("No Valid Cookies in current state. Force Redirect. fx: changePhone");
		//window.location="https://www.groupright.net"+GR_DIR+"/login.html";

	}
}
//==================================================
// URL PARAMETER PARSING
//==================================================
function getSearchParameters(){
	var prmstr = window.location.search.substr(1);
	return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}
