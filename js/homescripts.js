window.onload = function(){
	//check for IE7 or lower
	if (document.all && !document.querySelector) {
		document.getElementById('hidethis').style.display='none';
		document.getElementById('mywarning').style.display='block';
		document.body.style.backgroundColor = "#04518C";
	}

	//check for IE8
	if (document.all && document.querySelector && !document.addEventListener) {
		document.getElementById('hidethis').style.display='none';
		document.getElementById('mywarning').style.display='block';
		document.body.style.backgroundColor = "#04518C";
	}
}
function addEmail(){
	var email=document.getElementById("inputEmail").value;
	/*****************************************************
	//Validate Email Address Before Continuing
	*****************************************************/
    if (email == null || email == "") {
        alert("You must enter an email address");
        return false;
    }
    else{
	    var atpos = email.indexOf("@");
	    var dotpos = email.lastIndexOf(".");
	    if (atpos< 1 || dotpos<atpos+2 || dotpos+2>=email.length) {
	        alert("Not a valid e-mail address");
	        return false;
	    }
	}
	/*****************************************************
	//Send AJAX Request to Server
	*****************************************************/
	var xhr;  
	if (window.XMLHttpRequest) { // Mozilla, Safari, ...  
	    xhr = new XMLHttpRequest();  
	} else if (window.ActiveXObject) { // IE 8 and older  
	    xhr = new ActiveXObject("Microsoft.XMLHTTP");  
	} 
	xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200){
            //alert(xhr.responseText); // Here is the response
        }
    }
	var data="email_address="+email;
	//alert(data);
	xhr.open("POST", "mailing-list.php", true); 
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");                    
    xhr.send(data);
 }

