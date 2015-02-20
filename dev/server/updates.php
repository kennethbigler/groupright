<?php

// ADDING ERROR CODE 280 -- UPDATE NOT CREATED...(may be dangerous)

function getAllUpdates($email){
	
	// Open up connection
	$dbh = ConnectToDB();
	
	// Generate Query
	$sql = "
		SELECT updates.group_uid, users.email, users.first_name, users.last_name, 
			updates.description 
		FROM notifications,updates,active_users as users
		WHERE notifications.email = ?
			AND notifications.update_uid = updates.update_uid
			AND updates.email = users.email
			AND notifications.read = false
	";
	$stmt = $dbh->prepare($sql);
	$stmt->execute(array($email));
	
	// Set up return object.
	$updates = array();
	
	// Run and fill object.
	while($row = $stmt->fetch()){
		$obj = array(
			"email"=>$row['email'],
			"description"=>$row['description'],
			"group_id"=>$row['group_uid']
		);
		//echo $obj;
		$updates[] = $obj;
	}
	// Return object.
	return $updates;
}

function addUpdate($email,$group_uid,$description){
	
	// Open up connection
	$dbh = ConnectToDB();
	
	// Make initial insertion into 'updates'
	$sql = "INSERT INTO updates(email,description,group_uid) VALUES(?,?,?)";
	if((!isset($email) || $email == "") || 
		(!isset($group_uid) || $group_uid == "") || 
		(!isset($description) || $description == "")){ 
			http_response_code(280); return; 
	}
	
	
	$stmt = $dbh->prepare($sql);
	$stmt->execute(array($email,$description,$group_uid));
	
	// Get update_uid
	$update_uid = $dbh->lastInsertId();
	
	// Insert notifications for all members of the group.
	$sql = "INSERT INTO notifications SELECT ?,email,false FROM memberships WHERE group_uid = ?";
	$stmt = $dbh->prepare($sql);
	$stmt->execute(array($update_uid,$group_uid));
	
}




?>