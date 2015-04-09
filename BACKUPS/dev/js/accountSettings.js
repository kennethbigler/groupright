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
		$.ajax("https://www.groupright.net/dev/groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
					loadAccountInfo(data);
				},
				220: function(data, status, jqXHR){
					//they don't have the necessary access to see this page have them login again
					window.location="https://www.groupright.net/dev/login.html";
				}
			}
		
		});
	}
	else{
		console.warn("You are currently an Unauthenticated User accessing this page...This type of user Will Be Forced to Redirect in Final Version");
		//window.location="https://www.groupright.net/dev/login.html";

		var accountInfo={"first_name":"John","last_name":"Doe","date_joined":"2015-01-23 18:53:00","phone_number":"5556667777"};
		console.log(accountInfo);
		loadAccountInfo(accountInfo);
	}

};

function loadAccountInfo(accountInfo){
	var _cookies = genCookieDictionary();
	document.getElementById("firstName").innerHTML=accountInfo.first_name;
	document.getElementById("lastName").innerHTML=accountInfo.last_name;
	document.getElementById("email").innerHTML=_cookies.user;

	if(phoneNumber!=null){
		var areaCode=accountInfo.phone_number.substring(0, 3);
		var first_three=accountInfo.phone_number.substring(3, 6);
		var last_four=accountInfo.phone_number.substring(6, 10);
		document.getElementById("phoneNumber").innerHTML="("+areaCode+") "+first_three+"-"+last_four;
	}
	var dateStr = accountInfo.date_joined;
	var months=['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	document.getElementById("dateJoined").innerHTML= months[parseInt(dateStr.substring(5,7))-1] +" "+parseInt(dateStr.substring(8,10))+", "+dateStr.substring(0,4);

}

function changeName(){
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
		$.ajax("https://www.groupright.net/dev/groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
					//Redirect for Confirmation
					window.location="";
				},
				220: function(data, status, jqXHR){
					//they don't have the necessary access to see this page have them login again
					window.location="https://www.groupright.net/dev/login.html";
				}
			}
		
		});
	}
	else{
		console.warn("No Valid Cookies in current state. Force Redirect. fx: changeName");
		//window.location="https://www.groupright.net/dev/login.html";

	}
}
function changePassword(){
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
			"first_name":firstName,
			"last_name":lastName,
			"function":"change_password"
		};
	
		// Contact Server
		$.ajax("https://www.groupright.net/dev/groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
					//Redirect for Confirmation
					window.location="";
				},
				206: function(data, status, jqXHR){
					document.getElementById("passwordError").innerHTML="Your old password was invalid. Password not changed.";
				},
				220: function(data, status, jqXHR){
					//they don't have the necessary access to see this page have them login again
					window.location="https://www.groupright.net/dev/login.html";
				}
			}
		
		});
	}
	else{
		console.warn("No Valid Cookies in current state. Force Redirect. fx: changePassword");
		//window.location="https://www.groupright.net/dev/login.html";

	}
}
function changePhone(){
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
		$.ajax("https://www.groupright.net/dev/groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
					//Redirect for Confirmation
					window.location="";
				},
				220: function(data, status, jqXHR){
					//they don't have the necessary access to see this page have them login again
					window.location="https://www.groupright.net/dev/login.html";
				}
			}
		
		});
	}
	else{
		console.warn("No Valid Cookies in current state. Force Redirect. fx: changePhone");
		//window.location="https://www.groupright.net/dev/login.html";

	}
}
