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
						//eatCookies();
						window.location = "./index.html"; /* presumed redirect */
					},
				211: function(data, status, jqXHR){
						//eatCookies();
						window.location = "./index.html"; //redirect, but be kind of misleading when doing it
					}
			}
		
		});
	}
	//For Safety Do it here too
	/*eatCookies();
	window.location = "./index.html"; //redirect, but be really misleading when doing it
	*/
}

var text = '{"groups":[' +
	'{"groupName":"Senior Design","groupColor":"red"},' +
	'{"groupName":"Web Dev","groupColor":"orange"},' +
	'{"groupName":"Family","groupColor":"yellow"},' +
	'{"groupName":"Fake Madrid","groupColor":"green"},' +
	'{"groupName":"Spiked Punch","groupColor":"blue"},' +
	'{"groupName":"My Villa","groupColor":"purple"}]}';

obj = JSON.parse(text);

alert(obj);
console.log(obj);
console.log(obj.groups);

/* Populate the groups field on the homepage with the "groups" json object */
window.onload = function() {
	var groupMenu = document.getElementById("myGroups");
	var numGroups = obj.groups.length;
	alert(numGroups);
	var allMyGroups = '';

	for(var i = 0; i < numGroups; i ++) {
		allMyGroups += '<li><a href="#"><span class="glyphicon glyphicon-stop" style="color:' + 
			obj.groups[i].groupColor +
			';"></span>&nbsp;' +
			obj.groups[i].groupName +
			'</a></li>';
	}
	groupMenu.innerHTML = allMyGroups;
};