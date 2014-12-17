
//==================================================
// ALERT BANNER CONTROLLER
//==================================================
function alertBanner(text){
	document.getElementById("alertBanner").innerHTML=text;
    document.getElementById("alertBanner").style.display="block";
}

//==================================================
// FLIP FUNCTIONS
//==================================================
function flipToSignUp(){
	$(".flipper").css({"transform":"rotateY(180deg)","-webkit-transform":"rotateY(180deg)"});	
}

function flipToLogIn(){
	$(".flipper").css({"transform":"rotateY(0deg)","-webkit-transform":"rotateY(0deg)"});	
}

//==================================================
// LOGIN FUNCTIONS
//==================================================

function logIn(){
	
	// Get necessary information.
	var email = $("#loginInputEmail").val();
	var password = $("#loginInputPassword").val();
	var rememberMe = $("#loginInputPassword").val();

	if (email == null || email == "") {
        //alert("You must enter an email address");
        alertBanner("Please enter an email address.");
        return false;
    }
    else{
	    var atpos = email.indexOf("@");
	    var dotpos = email.lastIndexOf(".");
	    if (atpos< 1 || dotpos<atpos+2 || dotpos+2>=email.length) {
	        alertBanner("Please enter a valid email address.");
	        return false;
	    }
	}
	if (password == null || password == "") {
        //alert("You must enter an email address");
        alertBanner("Please enter your password or select forgot password.");
        return false;
    }
	
	var obj = {
				"function":"login",
				"email":email,
				"password":password
			  };
	
	// Contact Server
	$.ajax("https://www.groupright.net/dev/groupserve.php",{
		type:"POST",
		data:obj,
		statusCode:{
			200:function(data, status, jqXHR){
				alert("Validated User");
				//install cookie
				installCookieAndRedirect(data);
			},
			206:function(data, status, jqXHR){
				alert("Invalid Attempt");
				alertBanner("The username or password you entered is incorrect.")
			},
			207:function(data, status, jqXHR){
				alertBanner("Sorry, GroupRight is temporarily offline for Maintenance.");
			},
			209:function(data, status, jqXHR){
				alertBanner("Maximum number of Login Attempts exceeded. Your account has been locked for your protection. A reset email has been sent to the e-mail address on file.");
				$("#signInButton").prop("disabled",true);
			}
		}
	
	});
	
	
	return false;
}


//==================================================
// SIGN UP FUNCTIONS
//==================================================

function signUp(){

	// Get necessary information.
	var fname = $("#signupFirstName").val();
	var lname = $("#signupLastName").val();
	var email = $("#signupInputEmail").val();
	var password = $("#signupInputPassword").val();
	var password2 = $("#signupConfirmPassword").val();
	var termsCond = $("#termsAndConditionsAgreed").is(":checked");
	
	// Check for incomplete / inconsistent info.
	if(fname == ""){alert("enter first name"); return false;}
	if(lname == ""){alert("enter last name"); return false;}
	if(email == ""){alert("enter email"); return false;}
	if(password == ""){alert("enter password"); return false;}
	
	if(password != password2){
		alert("passwords do not match");
		return false;
	}
	if(!termsCond){
		alert("you must agree to the terms and conditions");
		return false;
	}
	
	var obj = {
				"function":"signup",
				"firstName":fname,
				"lastName":lname,
				"email":email,
				"password":password
			  };
	
	// Contact Server
	$.ajax("https://www.groupright.net/dev/groupserve.php",{
			type:'POST',
			data:obj,
			success:function(data,status,jqXHR){
				alert(data);				
			}
		});
	return false;
}
	
//==================================================
// INSTALL COOKIE AND REDIRECT
//==================================================
function installCookieAndRedirect(data){
	alert(data);
}

//==================================================
// SET UP FUNCTIONS
//==================================================
$(document).ready(function(){

	$("#signInButton").click(function(e){
		//e.preventDefault();
		logIn();
		return false;
	});
	$("#signUpButton").click(function(e){
		//e.preventDefault();
		signUp();
		return false;
	});

});