<?php
/*
function getAllTasks($email){
	$dbh = ConnectToDB();
	
	$stmt = $dbh->prepare(
		"SELECT * FROM tasks_assignments JOIN tasks USING (task_uid) NATURAL LEFT JOIN task_link WHERE email = ?"
	);
	$stmt->execute(array($email));
	
	$arr = array();
	
	while($row = $stmt->fetch()){
		$obj = array(
			"task_uid"=>$row['task_uid'],
			"task_title"=>$row['title'],
			"task_description"=>$row['description'],
			"group_id"=>$row['group_uid'],
			"creator"=>$row['creator_email'],
			"is_completed"=>$row['is_completed'],
			"is_personal"=>$row['is_personal']
		);
		$obj["link_type"] = $row['link_type'];
		$obj["link_id"] = $row['link_id'];
		
		//echo $obj;
		$arr[] = $obj;
	}
	return $arr;
}

function getAllTasksSince($email,$task_uid){
	$dbh = ConnectToDB();
	
	$stmt = $dbh->prepare(
		"SELECT * FROM tasks_assignments JOIN tasks USING (task_uid) WHERE email = ? AND task_uid > ?"
	);
	$stmt->execute(array($email,$task_uid));
	
	$arr = array();
	
	while($row = $stmt->fetch()){
		$obj = array(
			"task_uid"=>$row['task_uid'],
			"task_title"=>$row['title'],
			"task_description"=>$row['description'],
			"group_id"=>$row['group_uid'],
			"creator"=>$row['creator_email'],
			"is_completed"=>$row['is_completed'],
			"is_personal"=>$row['is_personal']
		);
		//echo $obj;
		$arr[] = $obj;
	}
	return $arr;
}



function addTaskAssignment($task_uid,$group_uid,$email,$update){
	$dbh = ConnectToDB();
	
	if($update) addTaskUpdate($email,$group_uid," was assigned a task.",$task_uid);
	$stmt = $dbh->prepare(
		"INSERT INTO tasks_assignments(task_uid,group_uid,email) VALUES(?,?,?)"
	);
	$stmt->execute(array($task_uid,$group_uid,$email));
	
}

function _assignToGroup($task_uid,$group_uid)
{
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
	
}
*/
function addList($email,$title,$description,$group_uid){
			
	$dbh = ConnectToDB();
	
	$sql = "INSERT INTO lists(email,title,description,group_uid)
			VALUES(?,?,?,?)";	
	$arr = array($email,$title,$description,$group_uid);
	
	$stmt = $dbh->prepare($sql);
	$stmt->execute($arr);
	return $dbh->lastInsertId();
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
			$list_uid = addList($email,$list_title,$list_descr,$group_uid);
			//echo $list_uid;	
			if($list_uid < 1){ http_response_code(298); return; } // failed list  creation
			
			addListUpdate($email,$group_uid,"created list \"".$list_title."\"",$list_uid);
			
			// output list
			print_r($list_uid);
		}else{
			http_response_code(206);
			return;
		}
}

function addItemToList(){
	// Get information.
	$email = sanitizeEmail( $_POST['email'] );
	$cookie = grHash($_POST['ac'],$email);
	$group_uid = $_POST['group_uid'];
		
	$list_id = $_POST['list_id'];
	$item_name = $_POST['item_name'];

	if(!isset($item_name)){ http_response_code(299); return; }
	
	//IF valid contiue
	//*******************************************
	//Must Validate User <-> Group <-> List
	//*******************************************
	/*
	if(filter_var($email, FILTER_VALIDATE_EMAIL)){
		if(!verifyUserGroup($email,$cookie,$group_uid)) return;
		$list_uid = addList($email,$list_title,$list_descr,$group_uid);
		//echo $list_uid;	
		if($list_uid < 1){ http_response_code(298); return; } // failed list  creation
			
		addListUpdate($email,$group_uid,"added an item to list \"".$list_title."\"",$list_uid);
			
		// output list
		print_r($list_uid);
	}else{
		http_response_code(206);
		return;
	}*/
}
/*
function _createTaskLink($task_id,$type,$link_id)
{
	$dbh = ConnectToDB();
	
	$stmt = $dbh->prepare(
		"REPLACE INTO task_link(task_uid,link_type,link_id) VALUES(?,?,?)"
	);
	$stmt->execute(array($task_id,$type,$link_id));
	
}

function assignTask(){
		$email = sanitizeEmail( $_POST['email'] );
		$cookie = grHash($_POST['cookie'],$email);
		$group_uid = $_POST['group_uid'];
		$task_uid = $_POST['task_uid'];
		
		if(!isset($task_uid)){ http_response_code(297); return; }
		if(!isset($group_uid)){ http_response_code(296); return; }
		
		if(filter_var($email, FILTER_VALIDATE_EMAIL)){
			if(!verifyUserGroup($email,$cookie,$group_uid)) return;
			addTaskAssignment($task_uid,$group_uid,$email,true);
		}else{
			http_response_code(206);
			return;
		}
	
}

function _completeTask($email,$task_uid){
		// Get members.
	$dbh = ConnectToDB();
	
	$stmt = $dbh->prepare(
		"UPDATE tasks_assignments SET is_completed = 1
		WHERE email = ? AND task_uid = ?"
	);
	$stmt->execute(array($email,$task_uid));
	
	
	$stmt = $dbh->prepare(
		"SELECT t.group_uid, t.task_uid, t.title, ta.is_completed 
		FROM tasks_assignments AS ta
		LEFT JOIN tasks AS t
		ON ta.group_uid = t.group_uid
		AND ta.task_uid = t.task_uid
		INNER JOIN memberships AS m
		ON m.email = ta.email
		WHERE ta.email = ?
		AND ta.task_uid = ?"
	);
	$stmt->execute(array($email,$task_uid));
	while($row = $stmt->fetch()){
		$group_uid = $row['group_uid'];
		//echo $group_uid;
		echo $row['is_completed'];
		addTaskUpdate($email,$group_uid," completed \"".$row['title']."\"",$task_uid);
		return;
	}
	http_response_code(280);
}

function completeTask(){
		$email = sanitizeEmail( $_POST['email'] );
		$cookie = grHash($_POST['ac'],$email);
		$task_uid = $_POST['task_id'];
		
		if(!isset($task_uid)){ http_response_code(295); return; }
		
		if(filter_var($email, FILTER_VALIDATE_EMAIL)){
			_completeTask($email,$task_uid);
		}else{
			http_response_code(206);
			return;
		}
	
}
*/


?>
