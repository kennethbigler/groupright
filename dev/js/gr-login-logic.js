
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
	
	// Check for incomplete information.
	if(email == ""){alert("enter email"); return false;}
	if(password == ""){alert("enter password"); return false;}
	
	var obj = {
				"email":email,
				"password":password
			  };
	
	// Contact Server
	$.ajax("#",{
		
		data:obj
	
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