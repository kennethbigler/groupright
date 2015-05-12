<?php

// --------------------------------------------------------------
// UTIL -- VALIDITY CHECKS

function _checkGroupList($group_uid,$list_uid)
{
	$dbh = ConnectToDB();
	
	$sql = "
		SELECT list_uid FROM lists
		WHERE group_uid = ?
		AND list_uid = ?	
	";
	
	$stmt = $dbh->prepare($sql);
	
	$stmt->execute(array($group_uid,$list_uid));
	
	while($row = $stmt->fetch()){
		return true;
	}
	return false;
}


// --------------------------------------------------------------
// LIST CREATION

function _createList($email,$title,$description,$group_uid){
			
	$dbh = ConnectToDB();
	
	$sql = "INSERT INTO lists(email,title,description,group_uid)
			VALUES(?,?,?,?)";	
	$arr = array($email,$title,$description,$group_uid);
	
	$stmt = $dbh->prepare($sql);
	$stmt->execute($arr);
	return $dbh->lastInsertId();
}


function addListContribTask($creator,$group_uid,$title,$list_uid){
	
	$task_title = "Contribute to '".$title."'";
	
	
	$task_uid = addTask($creator,$task_title,"",$group_uid,null,true);
	
	// Get members.
	$dbh = ConnectToDB();
	
	$stmt = $dbh->prepare(
		"SELECT email FROM memberships WHERE group_uid = ?"
	);
	$stmt->execute(array($group_uid));
			
	while($row = $stmt->fetch()){
		$em = $row['email'];
		addTaskAssignment($task_uid,$group_uid,$em);
	}
	
	// Link task.
	_createTaskLink($task_uid,'list',$list_uid);

}

function createList(){
	
		// Get information.
		$email = sanitizeEmail( $_POST['email'] );
		$cookie = grHash($_POST['ac'],$email);
		$group_uid = $_POST['group_uid'];
		
		$list_title = $_POST['title'];
		$list_descr = $_POST['description'];
		
		//echo $list_title;
		if(!isset($list_title)){ http_response_code(299); return; }
		if(!isset($list_descr)){ $list_descr = ""; }
		
		// IF valid, continue.
		if(filter_var($email, FILTER_VALIDATE_EMAIL)){
			if(!verifyUserGroup($email,$cookie,$group_uid)) return;
			$list_uid = _createList($email,$list_title,$list_descr,$group_uid);
			//echo $list_uid;	
			if($list_uid < 1){ http_response_code(298); return; } // failed list  creation
			
			addListUpdate($email,$group_uid,"created list \"".$list_title."\"",$list_uid);
			
			addListContribTask($email,$group_uid,$list_title,$list_uid);
			
			// output list
			print_r($list_uid);
		}else{
			http_response_code(206);
			return;
		}
}

// --------------------------------------------------------------
// LIST RETREIVAL
function _getListItems($list_uid){
	$dbh = ConnectToDB();
	
	$sql = "
		SELECT item_uid,item_name,email,first_name,last_name
		FROM list_items
		NATURAL JOIN active_users
		WHERE list_uid = ?
		ORDER BY item_uid
	";
	
	$stmt = $dbh->prepare($sql);
	
	$stmt->execute(array($list_uid));
	
	$arr = array();
	while($row = $stmt->fetch()){
		$obj = array();
		$obj["item_uid"] = $row["item_uid"];
		$obj["item_name"] = $row["item_name"];
		//$obj["creator"] = $row["creator"];
		//$obj["item_creator"] = $row["first_name"]." ".$row["last_name"];
		$obj["item_creator"] = $row["email"];
		$arr[] = $obj;
	}
	return $arr;
}

function _getListInfo($list_uid,$group_uid){
	$dbh = ConnectToDB();
	
	$sql = "
		SELECT * FROM lists
		WHERE list_uid = ?
		AND group_uid = ?
	";
	
	$stmt = $dbh->prepare($sql);
	
	$stmt->execute(array($list_uid,$group_uid));
	
	while($row = $stmt->fetch())
	{
		$obj = array();
		$obj["title"] = $row["title"];
		$obj["description"] = $row["description"];
		
		$obj["creator"] = $row["email"];
		return $obj;
	}
	return null;
}

function _markListContribComplete($email,$group_id,$list_id)
{
	$dbh = ConnectToDB();
	
	$sql = "
		UPDATE tasks_assignments
		SET is_completed = 1
		WHERE task_uid in (
			SELECT task_uid
			FROM tasks as t
			JOIN task_link as tl using (task_uid)
			WHERE tl.link_type = 'list'
			AND tl.link_id = ?
			AND t.group_uid = ?
		)
		AND email = ?
	";

	$stmt = $dbh->prepare($sql);
	
	$stmt->execute(array($list_id,$group_id,$email));
	
	return;
}

function getListInfo(){
	$email = sanitizeEmail( $_POST['email'] );
	$cookie = grHash($_POST['ac'],$email);
	$group_uid = $_POST['group_uid'];
	$list_uid = $_POST['list_uid'];
	
	if(!isset($list_uid)){ http_response_code(290); return; }
	if(!isset($group_uid)){ http_response_code(290); return; }
	
	if(filter_var($email, FILTER_VALIDATE_EMAIL)){
		if(!verifyUserGroup($email,$cookie,$group_uid)) return;
		
		$info = _getListInfo($list_uid,$group_uid);
		if(!$info){ http_response_code(230); return; }
		
		$creator = _getUser($info["creator"]);
		$info["creator"] = $creator["first_name"]." ".$creator["last_name"];
		
		$info["items"] = _getListItems($list_uid);
		
		http_response_code(200);
		echo json_encode($info);
		
		
		_markListContribComplete($email,$group_uid,$list_uid);
		
	}else{
		http_response_code(206);
		return;
	}	
}


// --------------------------------------------------------------
// LIST MODIFICATION ( ADD / REMOVE )

function _addListItem($email,$list_uid,$item){
	$dbh = ConnectToDB();
	
	$sql = "
		INSERT INTO list_items(list_uid,item_name,email)
		VALUES(?,?,?)
	";
	
	$stmt = $dbh->prepare($sql);
	
	$stmt->execute(array($list_uid,$item,$email));
	
	return $dbh->lastInsertId();	
}

function addListItem(){
	$email = sanitizeEmail( $_POST['email'] );
	$cookie = grHash($_POST['ac'],$email);
	$group_uid = $_POST['group_uid'];
	$item = $_POST['item_name'];
	$list_uid = $_POST['list_uid'];
	
	if(!isset($list_uid)){ http_response_code(290); return; }
	if(!isset($group_uid)){ http_response_code(290); return; }
	if(!isset($item)){ http_response_code(290); return; }
	
	if(filter_var($email, FILTER_VALIDATE_EMAIL)){
		if(!verifyUserGroup($email,$cookie,$group_uid)) return;
		if(!_checkGroupList($group_uid,$list_uid)){ http_response_code(230); return; }
		$item = trim($item);
		if($item == "") return;
		$item_id = _addListItem($email,$list_uid,$item);
		echo $item_id;
		
		$x = _getListInfo($list_uid,$group_uid);
		$list_title = $x["title"];
		
		addListUpdate($email,$group_uid,"added an item to list \"".$list_title."\"",$list_uid);
		
	}else{
		http_response_code(206);
		return;
	}
}

function _checkListItemOwner($email,$list_uid,$item_uid)
{
	$dbh = ConnectToDB();
	
	$sql = "
		SELECT item_uid FROM list_items
		WHERE email = ?
		AND list_uid = ?
		AND item_uid = ?
	";
	
	$stmt = $dbh->prepare($sql);
	
	$stmt->execute(array($email,$list_uid,$item_uid));
	
	while($row = $stmt->fetch())
	{
		return true;
	}
	return false;
}

function _removeListItem($email,$list_uid,$item_uid){
	$dbh = ConnectToDB();
	
	$sql = "
		DELETE FROM list_items
		WHERE email = ?
		AND list_uid = ?
		AND item_uid = ?
	";
	
	$stmt = $dbh->prepare($sql);
	
	$stmt->execute(array($email,$list_uid,$item_uid));
	
	return;
}

function removeListItem(){
	$email = sanitizeEmail( $_POST['email'] );
	$cookie = grHash($_POST['ac'],$email);
	$group_uid = $_POST['group_uid'];
	$item_uid = $_POST['item_uid'];
	$list_uid = $_POST['list_uid'];
	
	if(!isset($list_uid)){ http_response_code(290); return; }
	if(!isset($group_uid)){ http_response_code(290); return; }
	if(!isset($item_uid)){ http_response_code(290); return; }
	
	if(filter_var($email, FILTER_VALIDATE_EMAIL)){
		if(!verifyUserGroup($email,$cookie,$group_uid)) return;
		if(!_checkGroupList($group_uid,$list_uid)){ http_response_code(230); return; }
		if(!_checkListItemOwner($email,$list_uid,$item_uid)){ http_response_code(240); return; }
		$item_id = _removeListItem($email,$list_uid,$item_uid);
		echo $item_id;
	}else{
		http_response_code(206);
		return;
	}
}



?>
