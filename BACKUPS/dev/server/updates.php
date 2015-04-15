<?php

// ADDING ERROR CODE 280 -- UPDATE NOT CREATED...(may be dangerous)

function getAllUpdates($email){
	
	// Open up connection
	$dbh = ConnectToDB();
	
	// Generate Query
	$sql = "
		SELECT updates.group_uid, users.email, users.first_name, users.last_name, 
			updates.description ,updates.timestamp, updates.update_uid
		FROM notifications,updates,active_users as users
		WHERE notifications.email = ?
			AND notifications.update_uid = updates.update_uid
			AND updates.email = users.email
			AND notifications.read = false
		ORDER BY updates.timestamp DESC
	";
	$stmt = $dbh->prepare($sql);
	$stmt->execute(array($email));
	
	// Set up return object.
	$updates = array();
	
	// Run and fill object.
	while($row = $stmt->fetch()){
		$obj = array(
			"update_uid"=>$row['update_uid'],
			"email"=>$row['email'],
			"description"=>$row['description'],
			"group_id"=>$row['group_uid'],
			"timestamp"=>$row['timestamp']
		);
		//echo $obj;
		$updates[] = $obj;
	}
	// Return object.
	return $updates;
}
function getAllUpdatesSince($email,$update_uid){
	
	// Open up connection
	$dbh = ConnectToDB();
	
	// Generate Query
	$sql = "
		SELECT updates.group_uid, users.email, users.first_name, users.last_name, 
			updates.description ,updates.timestamp, updates.update_uid
		FROM notifications,updates,active_users as users
		WHERE notifications.email = ?
			AND notifications.update_uid = updates.update_uid
			AND updates.email = users.email
			AND notifications.read = false
			AND updates.update_uid > ?
		ORDER BY updates.timestamp DESC
	";
	$stmt = $dbh->prepare($sql);
	$stmt->execute(array($email,$update_uid));
	
	// Set up return object.
	$updates = array();
	
	// Run and fill object.
	while($row = $stmt->fetch()){
		$obj = array(
			"update_uid"=>$row['update_uid'],
			"email"=>$row['email'],
			"description"=>$row['description'],
			"group_id"=>$row['group_uid'],
			"timestamp"=>$row['timestamp']
		);
		//echo $obj;
		$updates[] = $obj;
	}
	// Return object.
	return $updates;
}

function __addUpdate($email,$group_uid,$description,$event_id,$task_id,$message_id,$list_id){
	
	// Open up connection
	$dbh = ConnectToDB();
	
	// Make initial insertion into 'updates'
	$sql = "INSERT INTO updates(email,description,group_uid"; 
	
	$item = null;
	if($event_id != null){ $sql = $sql.",event_id)"; $item = $event_id; }
	else if($task_id != null){ $sql = $sql.",task_id)"; $item = $task_id; }
	else if($message_id != null){ $sql = $sql.",message_id)"; $item = $message_id; }
	else { $sql = $sql.")";}
	
	$sql = $sql." VALUES(?,?,?";
		
	$fillers = array($email,$description,$group_uid);
	if($item != null){ 
		$fillers[] = $item;
		$sql = $sql.",?";
	}
	$sql = $sql.")";
	
	if((!isset($email) || $email == "") || 
		(!isset($group_uid) || $group_uid == "") || 
		(!isset($description) || $description == "")){ 
			http_response_code(280); return; 
	}
	
	
	$stmt = $dbh->prepare($sql);
	$stmt->execute($fillers);
	
	// Get update_uid
	$update_uid = $dbh->lastInsertId();
	
	// Insert notifications for all members of the group.
	$sql = "INSERT INTO notifications SELECT ?,email,false FROM memberships WHERE group_uid = ?";
	$stmt = $dbh->prepare($sql);
	$stmt->execute(array($update_uid,$group_uid));
	
}

function addUpdate($email,$group_uid,$description){
	__addUpdate($email,$group_uid,$description,null,null,null,null);
}

function addEventUpdate($email,$group_uid,$description,$event_id){
	__addUpdate($email,$group_uid,$description,$event_id,null,null,null);
}
function addTaskUpdate($email,$group_uid,$description,$task_id){
	__addUpdate($email,$group_uid,$description,null,$task_id,null,null);
}
function addMessageUpdate($email,$group_uid,$description,$message_id){
	__addUpdate($email,$group_uid,$description,null,null,$message_id,null);
}
function addListUpdate($email,$group_uid,$description,$list_id){
	__addUpdate($email,$group_uid,$description,null,null,null,$list_id);
}



?>
