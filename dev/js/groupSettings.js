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
				{"group_name":"Apple","group_color":"red","group_id":"77"},
				{"group_name":"Orange","group_color":"orange","group_id":"78"},
				{"group_name":"Banana","group_color":"yellow","group_id":"79"},
				{"group_name":"Pear","group_color":"green","group_id":"80"},
				{"group_name":"Strawberry","group_color":"red","group_id":"81"},
				{"group_name":"Tomato","group_color":"red","group_id":"82"},
				{"group_name":"Lemon","group_color":"yellow","group_id":"83"},
				{"group_name":"Grape","group_color":"purple","group_id":"84"}
		];

		console.log(allGroups);
		loadGroups(allGroups);
	}

};
function loadGroups(allGroups){
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
		var pannelBody=document.createElement('div');
		
		$(pannelBody).attr( 'class', 'panel-body' );
		
		var p=document.createElement('p');
		p.innerText="You are a member/leader";
		pannelBody.appendChild(p);

		p1=document.createElement('p');
		p1.innerText="Leave this group";
		pannelBody.appendChild(p1);

		p2=document.createElement('p');
		p2.innerText="Manage Membership";
		pannelBody.appendChild(p2);



		var h4=document.createElement('h4');
		h4.innerText=allGroups[i].group_name;
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
}