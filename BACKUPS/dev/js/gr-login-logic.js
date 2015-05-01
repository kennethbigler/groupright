
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
function alertBannerSignup(text){
	document.getElementById("alertDangerBannerSignup").innerHTML=text;
    document.getElementById("alertDangerBannerSignup").style.display="block";
    document.getElementById("alertSuccessBannerSignup").style.display="none";
}
function alertSuccessBannerSignup(text){
	document.getElementById("alertSuccessBannerSignup").innerHTML=text;
    document.getElementById("alertSuccessBannerSignup").style.display="block";
    document.getElementById("alertDangerBannerSignup").style.display="none";
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
	if(!isMobile){
		if(LogInFront) $(".flipper").css({"transform":"rotateY(180deg)","-webkit-transform":"rotateY(180deg)"});	
		else $(".flipper").css({"transform":"rotateY(0deg)","-webkit-transform":"rotateY(0deg)"});	
	}else{
		$(".login-box").hide();
		$(".signup-box").show();
	}
}

function flipToLogIn(){
	if(!isMobile){
		if(LogInFront) $(".flipper").css({"transform":"rotateY(0deg)","-webkit-transform":"rotateY(0deg)"});		
		else $(".flipper").css({"transform":"rotateY(180deg)","-webkit-transform":"rotateY(180deg)"});	
	}else{
		$(".login-box").show();
		$(".signup-box").hide();
	}
}

//==================================================
// LOGIN FUNCTIONS
//==================================================

function logIn(){
	
	// Get necessary information.
	var email = $("#loginInputEmail").val();
	var password = $("#loginInputPassword").val();
	var rememberMe = $("#rememberMe")[0].checked;

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
	$.ajax("https://www.groupright.net"+GR_DIR+"/groupserve.php",{
		type:"POST",
		data:obj,
		statusCode:{
			200:function(data, status, jqXHR){
				//alert("Validated User");
				//install cookie
				installCookieAndRedirect(data,email,rememberMe);
			},
			206:function(data, status, jqXHR){
				//alert("Invalid Attempt");
				alertBanner("The username or password you entered is incorrect.");
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
       
        alertBannerSignup("All Fields Are Required");
        return false;
    }
    // Validate Email Address
	var atpos = email.indexOf("@");
	var dotpos = email.lastIndexOf(".");
	if (atpos< 1 || dotpos<atpos+2 || dotpos+2>=email.length) {
	    alertBannerSignup("Please enter a valid email address.");
	    return false;
	}
	
	if(password != password2){
		alertBannerSignup("Your passwords do not match.");
		return false;
	}
	if(!termsCond){
		alertBannerSignup("You must agree to the terms and conditions in order to use GroupRight.");
		return false;
	}
	
	var obj = {
				"function":"signup",
				"first_name":fname,
				"last_name":lname,
				"email":email,
				"password":password
	};
	
	// Contact Server
	$.ajax("https://www.groupright.net"+GR_DIR+"/groupserve.php",{
			type:'POST',
			data:obj,
			statusCode:{
				200:function(data,status,jqXHR){
					alertSuccessBannerSignup("Thanks for signing up for GroupRight. Please check your email and follow the instructions to verify your account.");				
				},
				208:function(data,status,jqXHR){
					alertBannerSignup("You have already an account with GroupRight. <a href='forgot.html'>Did you forget your password?</a>")
				}
			}
		});
	return false;
}
	
//==================================================
// INSTALL COOKIE AND REDIRECT
//==================================================
function installCookieAndRedirect(data,user,extended){
	installCookie( user, data, extended, function(){
		window.location = "./home.html"; /* presumed redirect */
	});
}

var isMobile = false;

//==================================================
// SET UP FUNCTIONS
//==================================================
$(document).ready(function(){

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		isMobile = true;
		$(".front").removeClass("front");
		$(".back").removeClass("back");
		$(".signup-box").hide();
	}

	_GET = getSearchParameters();
	
	if(parseInt(_GET['signup'])==1){
		if(!isMobile){
			$(".login-box").removeClass("front");
			$(".signup-box").removeClass("back");
			$(".login-box").addClass("back");
			$(".signup-box").addClass("front");
			LogInFront = false;
		}else{
			$(".signup-box").show();
			$(".login-box").hide();
		}
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