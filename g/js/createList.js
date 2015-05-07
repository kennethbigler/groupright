function createGRList(){
	document.getElementById('listError').innerHTML="";
	
	//get group
	if ($( "#listGroups" ).val()=="XXX") {
		document.getElementById('listError').innerHTML="Please select a group for the list.";
		return false;
	}
	var listGroup = $( "#listGroups option:selected" ).text();
	var listGroupID = $( "#listGroups" ).val();


	//get the list name
	var list_title = document.getElementById("listNameField").value;
	if (list_title == "" || list_title.length<=0) {
		document.getElementById('listError').innerHTML="Your list name is invalid";
		return false;
	}

	//get list description
	var list_description = document.getElementById("listDescription").value;
	if (list_description == undefined) {
		document.getElementById('listError').innerHTML="Your list description is invalid";
		return false;
	}

	//get user access code
	var _cookies = genCookieDictionary();
	var email = _cookies.user; 
	var ac = _cookies.accesscode;
	var obj = {
				"function":"create_list",
				"email":email,
				"ac":ac,
				"group_uid":listGroupID,
				"title":list_title,
				"description":list_description
	};
	//console.log(obj);

	// Contact Server
	$.ajax("https://www.groupright.net"+GR_DIR+"/groupserve.php",{
			type:'POST',
			data:obj,
			statusCode:{
				200:function(data,status,jqXHR) {
					//alert("list Created");
					$('#createListBox').modal('hide');
					//window.location = "./home.html";				
				},
				210:function() {
					//access denied, redirect to login
					alert("Access Denied");
					$('#createListBox').modal('hide');
					window.location = "./login.html";
				},
				220:function() {
					//something else happened
					alert("We have literally no idea what happened.")
				}
			}
	});
	return false;
}
