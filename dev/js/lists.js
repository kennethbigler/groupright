/* lists.js
*
*		JavaScript logic supporting the lists.html page.
*/

// ==========================================================
// GLOBALS

var items=["one","two","three","four","five"];
var listName="Discovering Numbers As Words";
var listCreator="Zachary Wilson";
var listDescription="Add any numbers expressed as words that you can invent."

var members = {};

// ==========================================================
// UTILITY FUNCTIONS

function getMember(email){
	return members[email];
}

// ==========================================================
// SERVER COMM.

function loadList(parseFn){
	if(!parseFn || !(parseFn instanceof Function)) parseFn = function(){};
	
	var _get = getGETArguments();
	var _cookie = genCookieDictionary();
	
	//console.log(_get);
	//console.log(_cookie);
	
	if(_get.guid && _get.list_id && _cookie.accesscode && _cookie.user){
		var obj = {
			"function":"get_list_info",
			email:_cookie.user,
			ac:_cookie.accesscode,
			list_uid:_get.list_id,
			group_uid:_get.guid			
		};
		
		// Contact Server
		$.ajax("groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
						//alert("Success");
						parseFn(data);
					}
			}
		});
		
	}else{
		if(GR_DIR == "/dev"){
			console.warn("Unauthorized.  Production will redirect.");
			parseFn("{}");
		}else{
			window.location = "home.html";
		}
	}
}


function getGroupMembers(){	
	// Get stored info.
	var _cookies = genCookieDictionary();
	var _get = getGETArguments();
	
	// Parse IDs
	var _group_uid = _get.guid;

	// Check if cookies exist.
	if(_cookies.accesscode && _cookies.user && _group_uid){
		
		var obj = {
			"ac":_cookies.accesscode,
			"email":_cookies.user,
			"function":"get_group_members",
			"group_uid":_group_uid
		};
	
		// Contact Server
		$.ajax("groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
						//alert("Success");
						var x = JSON.parse(data);
						initMembers(x);
						drawList();
						//console.log(groupMembers);
					}
			},
			
		});
	}else{
		if(GR_DIR=="/dev"){ console.warn("Forced Redirect to Login on Production"); }
		else{ window.location="login.html"; }
	}
}

function addItemToList(item,postFn){
	if(item.trim() == "") return;
	if(!postFn || !(postFn instanceof Function)) parseFn = function(){};
	
	var _get = getGETArguments();
	var _cookie = genCookieDictionary();
	
	console.log(_get);
	console.log(_cookie);
	
	if(_get.guid && _get.list_id && _cookie.accesscode && _cookie.user){
		var obj = {
			"function":"add_item_to_list",
			email:_cookie.user,
			ac:_cookie.accesscode,
			list_uid:_get.list_id,
			group_uid:_get.guid,
			item_name:item
		};
		
		// Contact Server
		$.ajax("groupserve.php",{
			type:"POST",
			data:obj,
			statusCode:{
				200: function(data, status, jqXHR){
						//alert("Success");
						postFn(data);
					}
			}
		});
		
	}else{
		if(GR_DIR == "/dev"){
			console.warn("Unauthorized.  Production will redirect.");
			postFn(0);
		}else{
			window.location = "home.html";
		}
	}
}


// ==========================================================
// LOAD / INIT

function initMembers(arr){
	for(var i = 0; i < arr.length; i++){
		members[ arr[i].email ] = arr[i];
	}
}

function _parseListData(data){
	try{
		var obj = JSON.parse(data);
		//console.log(obj);
		
		if(obj.title) listName = obj.title;
		if(obj.creator) listCreator = obj.creator;
		if(obj.description) listDescription = obj.description;
		if(obj.description == "") listDescription = "(None.)";
		if(obj.items) items = obj.items;
		
	}catch(e){
		console.warn("Parse failed... Go figure.");		
	}
}

var UPDATER = null;

window.onload = function() {
	
	getGroupMembers();
	
	// Load data...
	
	loadList(function(data){
		_parseListData(data);
		addHeading(listName,listCreator,listDescription);
		drawList();
		
	});
		
	UPDATER = window.setInterval(function(){
		loadList(function(data){
			_parseListData(data);
			addHeading(listName,listCreator,listDescription);
			drawList();
			
		});
	},5000);

}

// ==========================================================
// RENDERING

function addHeading(listName, listCreator, listDescription){
	document.getElementById("addListName").innerHTML="List: "+listName;
	document.getElementById("addListCreator").innerHTML="Creator: "+ listCreator;
	document.getElementById("addListDescription").innerHTML="Description: "+listDescription;
}


function drawList(){
	var list=document.getElementById("addListItems");
	$(".group-list-item").remove();
	//Add all of the items
	for(var i=0; i<items.length; i++){
		var li=document.createElement('li');
		li.className="list-group-item row group-list-item";
		
		// text
		var sp = $("<span />",{text:items[i].item_name,class:"col-sm-9"});
		$(li).append(sp);
		
		// person
		var mem = getMember(items[i].item_creator);
		if(!mem) continue;
		var per = $("<div />",{class:"list-item-person col-sm-3"});
			var name = $("<span />",{
				text:mem.first_name+" "+mem.last_name,
				style:"color:#999;letter-spacing:1px;float:right;"
			});
			per.append(name);
			var pic = $("<img />",{
				src:mem.photo_url,
				style:"height:2.0em;width:2.0em;border:1px solid #ccc;margin-right:1.0em;border-radius:50%;float:right;"
			});
			per.append(pic);
		
		$(li).append(per);
		$("#add-item-item").before($(li));
	}
	
	
	
	if(!INPUT_DRAWN){
		list.appendChild( drawAddItemInput() );
		INPUT_DRAWN = true;
	}
}

var INPUT_DRAWN = false;

function drawAddItemInput(){
	//Add the input section
	var li2=document.createElement('li');
	li2.className="list-group-item";
	li2.id = "add-item-item";
	li2.style.backgroundColor="rgba(91, 192, 222, 0.1)";
	var div=document.createElement('div');
	div.className="input-group";
	var input=document.createElement('input');
	input.type="text";
	input.className="form-control";
	input.placeholder="Enter an item";
	var span=document.createElement('span');
	span.className="input-group-btn";
	var button=document.createElement('button');
	button.className="btn btn-default";
	button.type="button";
	button.innerHTML="Add";
	$(button).click(function(){addItem();});
	$(input).keydown(function(){
		if(event.keyCode == 13)
			{addItem();
		}
	});
	$(input).attr( 'id', 'addItem' );
	span.appendChild(button);
	li2.appendChild(div);
	div.appendChild(input);
	div.appendChild(span);
	
	return li2;
}

function addItem(){
	var newItem=document.getElementById("addItem");
	
	var _cookie = genCookieDictionary();
	
	if (newItem == "" || newItem.length<=0) {
		document.getElementById('messageError').innerHTML="Please Enter an Item";
		return false;
	}

	addItemToList(newItem.value,function(){
		
		var value={item_name:newItem.value,item_uid:null,item_creator:_cookie.user};
		if(value!=""){
			items.push(value);
			drawList();
		}
		newItem.value = "";
	});
	
}