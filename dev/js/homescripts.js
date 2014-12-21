var visibleDropdown=false;
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
function showDropdown(){
	if(visibleDropdown){
		document.getElementById('dropdown').style.display='none';
		document.getElementById('arrow').className="glyphicon glyphicon-chevron-down";
	}else{
		document.getElementById('dropdown').style.display='block';
		document.getElementById('arrow').className="glyphicon glyphicon-chevron-up";
	}
	visibleDropdown=!visibleDropdown;
}
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
						window.location = "./index.html"; /* presumed redirect */
					},
				211: function(data, status, jqXHR){
						/* do nothing */
					}
			}
		
		});
	}
	
}