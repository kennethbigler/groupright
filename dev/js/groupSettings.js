
window.onload = function() {

	//get the cookies and get all of the data from the server
	var _cookies = genCookieDictionary();
	if(_cookies.accesscode && _cookies.user){
	
		var obj = {
			"cookie":_cookies.accesscode,
			"email":_cookies.user,
			"function":"get_user_info"
		};
	
		// Contact Server
		$.ajax("https://www.groupright.net/dev/groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
					addUsersInfo(data);
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
		var allGroups=[
				{"group_name":"Apple","group_color":"red","group_id":"77","role":"member"},
				{"group_name":"Orange","group_color":"orange","group_id":"78","role":"member"},
				{"group_name":"Banana","group_color":"yellow","group_id":"79","role":"member"},
				{"group_name":"Pear","group_color":"green","group_id":"80","role":"leader"},
				{"group_name":"Strawberry","group_color":"red","group_id":"81","role":"member"},
				{"group_name":"Tomato","group_color":"red","group_id":"82","role":"member"},
				{"group_name":"Lemon","group_color":"yellow","group_id":"83","role":"leader"},
				{"group_name":"Grape","group_color":"purple","group_id":"84","role":"member"}
		];

		console.log(allGroups);
		loadGroups(allGroups);
	}

};
function loadGroups(allGroups){
	var colorButtons="Hello";
	document.getElementById("addNumber").innerText=allGroups.length;
	var adder=document.getElementById("groupAdder");
	var row;
	for(var i=0; i<allGroups.length; i++){
		var column=document.createElement('div');
		$(column).attr( 'class', 'col-sm-4' );
		if(i%3==0){
			row=document.createElement('div');
			$(row).attr( 'class', 'row' );
		}
		var pannel=document.createElement('div');
		$(pannel).attr( 'class', 'panel panel-default' );
		
		var pannelHeading=document.createElement('div');
		$(pannelHeading).attr( 'class', 'panel-heading' );
		var span=document.createElement('span');
		
		$(span).attr( 'class', 'glyphicon glyphicon-stop pull-right' );
		var colorButton=document.createElement('button');
		$(colorButton).attr( 'class', 'btn btn-default pull-right' );
		$(colorButton).attr( 'type', 'button' );
		$(colorButton).attr('data-toggle','popover');
		$(colorButton).attr('data-placement','top');
		$(colorButton).attr('onclick','alert("change color");');
		$(colorButton).attr('id','popover'+i);
		$(colorButton).attr('data-content',colorButtons);
		colorButton.style.padding="4px";
		colorButton.style.backgroundColor=allGroups[i].group_color;


		span.style.color=allGroups[i].group_color;

		var pannelBody=document.createElement('div');
		$(pannelBody).attr( 'class', 'panel-body' );
		
		var p=document.createElement('p');
		p.innerHTML="You are a group <b>"+allGroups[i].role+"</b>.";
		pannelBody.appendChild(p);

		var a1=document.createElement('a');
		$(a1).attr('onclick','leaveGroup('+allGroups[i].group_id+')');
		p1=document.createElement('p');
		p1.innerText="Leave this group";
		a1.appendChild(p1);
		a1.style.cursor="pointer";
		pannelBody.appendChild(a1);

		p2=document.createElement('p');
		var a2=document.createElement('a');
		$(a2).attr('onclick','manageGroup('+allGroups[i].group_id+')');
		a2.style.cursor="pointer";
		if(allGroups[i].role=="member"){
			p2.innerText="View Members";
		}
		else{
			p2.innerText="Manage Membership";
		}
		a2.appendChild(p2);
		pannelBody.appendChild(a2);



		var h4=document.createElement('h4');
		h4.innerText=allGroups[i].group_name;
		colorButton.appendChild(span);
		h4.appendChild(colorButton);
		pannelHeading.appendChild(h4);
		pannel.appendChild(pannelHeading);
		pannel.appendChild(pannelBody);
		//adder.appendChild(pannel);
		column.appendChild(pannel)
		row.appendChild(column);
		if(i%3==0){
			adder.appendChild(row);
		}
	}
	for(var i=0; i<allGroups.size; i++){
		$('#popover'+i).popover();
	}
}
function leaveGroup(groupID){
	alert("Warning! This action cannot be undone. Do you wish to continue?");
}
function manageGroup(groupID){
	alert("You are managing a group");
}