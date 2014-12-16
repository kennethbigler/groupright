/* This is to display the IE8 or less version of the page */
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

	/* When window too small, this will remove the buttons*/
	var w = window.innerWidth;
	if (w < 768) {
		var bottom = document.getElementsByClassName('bottom'), i;

		for (var i = 0; i < bottom.length; i ++) {
			bottom[i].style.display = 'none';
		}
		document.getElementsByClassName('top')[0].style.display='none';
	}
};

window.onresize = function() {
	/* When window too small, this will remove the buttons*/
	var w = window.innerWidth;
	if (w < 768) {
		var bottom = document.getElementsByClassName('bottom'), i;

		for (var i = 0; i < bottom.length; i ++) {
			bottom[i].style.display = 'none';
		}
		document.getElementsByClassName('top')[0].style.display='none';
	}
	else {
		var bottom = document.getElementsByClassName('bottom'), i;

		for (var i = 0; i < bottom.length; i ++) {
			bottom[i].style.display = 'block';
		}
		document.getElementsByClassName('top')[0].style.display='block';
	}
};

function addEmail(){
	var email=document.getElementById("inputEmail").value;
	/*****************************************************
	//Validate Email Address Before Continuing
	*****************************************************/
    if (email == null || email == "") {
        //alert("You must enter an email address");
        document.getElementById("inputEmail").value="Please enter an email address.";
        document.getElementById("inputEmail").style.color="Red";
        return false;
    }
    else{
	    var atpos = email.indexOf("@");
	    var dotpos = email.lastIndexOf(".");
	    if (atpos< 1 || dotpos<atpos+2 || dotpos+2>=email.length) {
	        document.getElementById("inputEmail").value="Please enter a valid email address.";
        	document.getElementById("inputEmail").style.color="Red";
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
    document.getElementById("inputEmail").value="Thank You!";
    document.getElementById("inputEmail").style.color="Green";
 };