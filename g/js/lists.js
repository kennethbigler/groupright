var items=["one","two","three","four","five"];



window.onload = function() {
	var listName="Discovering Numbers As Words";
	var listCreator="Zachary Wilson";
	var listDescription="Add any numbers expressed as words that you can invent."
	addHeading(listName,listCreator,listDescription);
	drawList();

}
function addHeading(listName, listCreator, listDescription){
	document.getElementById("addListName").innerHTML="List: "+listName;
	document.getElementById("addListCreator").innerHTML="Creator: "+ listCreator;
	document.getElementById("addListDescription").innerHTML="Description: "+listDescription;
}

function drawList(){
	var list=document.getElementById("addListItems");
	list.innerHTML="";
	//Add all of the items
	for(var i=0; i<items.length; i++){
		var li=document.createElement('li');
		li.className="list-group-item";
		li.innerText=items[i];
		list.appendChild(li);
	}
	//Add the input section
	var li2=document.createElement('li');
	li2.className="list-group-item";
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
	button.innerText="Add";
	$(button).attr( 'onclick', 'addItem()' );
	$(input).attr( 'id', 'addItem' );
	span.appendChild(button);
	li2.appendChild(div);
	div.appendChild(input);
	div.appendChild(span);
	list.appendChild(li2);
}

function addItem(){
	var newItem=document.getElementById("addItem");
	var value=newItem.value;
	if(value!=""){
		items.push(value);
		drawList();
	}
}