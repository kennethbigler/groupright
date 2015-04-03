<?php

function getAllTasks($email){
	$dbh = ConnectToDB();
	
	$stmt = $dbh->prepare(
		"SELECT * FROM tasks_assignments JOIN tasks USING (task_uid) WHERE email = ?"
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
		//echo $obj;
		$arr[] = $obj;
	}
	return $arr;
}

function addTask($email,$title,$description,$group_uid,$event_uid,$is_personal,$deadline){
			
	$dbh = ConnectToDB();
	
	$sql = "INSERT INTO tasks(creator_email,title,description,group_uid,event_uid,is_personal,deadline)
			VALUES(?,?,?,"
			.((isset($group_uid))? "?" : "NULL").","
			.((isset($event_uid))? "?" : "NULL").","
			."?,"
			.((isset($deadline))? "?" : "NULL").")";
	
	$arr = array($email,$title,$description);
	if(isset($group_uid)) $arr[] = $group_uid;
	if(isset($event_uid)) $arr[] = $event_uid;
	$arr[] = $is_personal;
	if(isset($deadline)) $arr[] = $deadline;
	
	
	$stmt = $dbh->prepare($sql);
	$stmt->execute($arr);
	return $dbh->lastInsertId();
}

function addTaskAssignment($task_uid,$group_uid,$email){
	$dbh = ConnectToDB();
	
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

function createTask(){
	
		// Get information.
		$email = sanitizeEmail( $_POST['email'] );
		$cookie = grHash($_POST['cookie'],$email);
		$group_uid = $_POST['group_uid'];
		$event_uid = $_POST['event_uid'];
		
		$task_title = $_POST['task_title'];
		$task_descr = $_POST['task_description'];
		$is_personal = $_POST['is_personal'];
		$deadline = $_POST['deadline'];
		
		
		if(!isset($task_title)){ http_response_code(299); return; }
		if(!isset($task_descr)){ $task_descr = ""; }
		if(!isset($is_personal)){ $is_personal = false; }
		
		// IF valid, continue.
		if(filter_var($email, FILTER_VALIDATE_EMAIL)){
			if(!verifyUserGroup($email,$cookie,$group_uid)) return;
			$task_uid = addTask($email,$task_title,$task_descr,$group_uid,$event_uid,$is_personal,$deadline);
			
			if($task_uid < 1){ http_response_code(299); return; } // failed task creation
			
			// Assign Task
			if($is_personal){ addTaskAssignment($task_uid,$group_uid,$email); }
			else{ _assignToGroup($task_uid,$group_uid); }
			
			// output task
			print_r($task_uid);
		}else{
			http_response_code(206);
			return;
		}
}

function assignTask(){
		$email = sanitizeEmail( $_POST['email'] );
		$cookie = grHash($_POST['cookie'],$email);
		$group_uid = $_POST['group_uid'];
		$task_uid = $_POST['task_uid'];
		
		if(!isset($task_uid)){ http_reponse_code(299); return; }
		if(!isset($group_uid)){ http_reponse_code(299); return; }
		
		if(filter_var($email, FILTER_VALIDATE_EMAIL)){
			if(!verifyUserGroup($email,$cookie,$group_uid)) return;
			addTaskAssignment($task_uid,$group_uid,$email);
			addTaskUpdate($email,$group_uid," was assigned a task.",$task_uid);
		}else{
			http_response_code(206);
			return;
		}
	
}


?>