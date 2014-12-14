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

	//all other browsers
	else {
		alert("#420YOLOSWAG4Jesus");
	}
}