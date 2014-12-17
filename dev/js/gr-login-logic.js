
//==================================================
// ALERT BANNER CONTROLLERs
//==================================================
function alertBanner(text){
	document.getElementById("alertDangerBanner").innerHTML=text;
    document.getElementById("alertDangerBanner").style.display="block";
    document.getElementById("alertSuccessBanner").style.display="none";
}
function alertSuccessBanner(text){
	document.getElementById("alertSuccessBanner").innerHTML=text;
    document.getElementById("alertSuccessBanner").style.display="block";
    document.getElementById("alertDangerBanner").style.display="none";
}

//==================================================
// URL PARAMETER PARSING
//==================================================
function getSearchParameters(){
	var prmstr = window.location.search.substr(1);
	return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ){
	var params = {};
	var prmarr = prmstr.split("&");
	for (var i = 0; i < prmarr.length; i++){
		var tmparr = prmarr[i].split("=");
		params[tmparr[0]] = tmparr[1];
	}
	return params;
}

var _GET;



//==================================================
// FLIP FUNCTIONS
//==================================================
var LogInFront = true;

function flipToSignUp(){
	if(LogInFront) $(".flipper").css({"transform":"rotateY(180deg)","-webkit-transform":"rotateY(180deg)"});	
	else $(".flipper").css({"transform":"rotateY(0deg)","-webkit-transform":"rotateY(0deg)"});	
}

function flipToLogIn(){
	if(LogInFront) $(".flipper").css({"transform":"rotateY(0deg)","-webkit-transform":"rotateY(0deg)"});		
	else $(".flipper").css({"transform":"rotateY(180deg)","-webkit-transform":"rotateY(180deg)"});	
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
	if (email == ""   || email == null      ||
		fname==""     || fname ==null       ||
		lname==""     || lname ==null		||
		password==""  || password==null 	||
		password2=="" || password2==null 	||
		termsCond=="" || termsCond==null) {
       
        alertBanner("All Fields Are Required");
        return false;
    }
    // Validate Email Address
	var atpos = email.indexOf("@");
	var dotpos = email.lastIndexOf(".");
	if (atpos< 1 || dotpos<atpos+2 || dotpos+2>=email.length) {
	    alertBanner("Please enter a valid email address.");
	    return false;
	}
	
	if(password != password2){
		alertBanner("Your passwords do not match.");
		return false;
	}
	if(!termsCond){
		alertBanner("You must agree to the terms and conditions in order to use GroupRight.");
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
			statusCode:{
				200:function(data,status,jqXHR){
					alertSuccessBanner("Thanks for signing up for GroupRight. Please check your email and follow the instructions to verify your account.");				
				},
				208:function(data,status,jqXHR){
					alertBanner("You have already an account with GroupRight. <a href='forgot.html'>Did you forget your password?</a>")
				}
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


	_GET = getSearchParameters();
	
	if(parseInt(_GET['signup'])==1){
		$(".login-box").removeClass("front");
		$(".signup-box").removeClass("back");
		$(".login-box").addClass("back");
		$(".signup-box").addClass("front");
		LogInFront = false;
	}

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