<?php

function getGroupMessages($group_uid){
	
	$dbh = ConnectToDB();
	
	$sql = "SELECT * FROM messages WHERE group_uid = ? ORDER BY timestamp DESC";
	
	$arr = array($group_uid);
	$stmt = $dbh->prepare($sql);
	$stmt->execute($arr);
	
	$msgs = array();
	while($row = $stmt->fetch()){
		$obj = array("email"=>$row["email"],
						"content"=>$row["content"],
						"timestamp"=>($row["timestamp"]." UTC"));
		$msgs[] = $obj;		
	}
	
	return $msgs;	
}

function _getNumberUnreadMsgs($email,$group_uid)
{
	$dbh = ConnectToDB();
	
	$sql = "
		SELECT COUNT(*) as num_unread
		FROM messages as msg
		LEFT JOIN memberships as mb
		ON msg.group_uid = mb.group_uid
		WHERE mb.email = ?
		AND msg.group_uid = ?
		AND msg.timestamp > mb.last_message_read
	";
	
	$arr = array($email,$group_uid);
	$stmt = $dbh->prepare($sql);
	$stmt->execute($arr);
	
	$msgs = array();
	while($row = $stmt->fetch()){
		return $row['num_unread'];	
	}
	
	return 0;	
}

function _getAllNumberUnreadMsgs($email)
{
	$dbh = ConnectToDB();
	
	$sql = "
		SELECT COUNT(*) as num_unread
		FROM messages as msg
		LEFT JOIN memberships as mb
		ON msg.group_uid = mb.group_uid
		WHERE mb.email = ?
		AND msg.timestamp > mb.last_message_read
	";
	
	$arr = array($email);
	$stmt = $dbh->prepare($sql);
	$stmt->execute($arr);
	
	$msgs = array();
	while($row = $stmt->fetch()){
		return $row['num_unread'];	
	}
	
	return 0;	
}

function getNumUnread(){
	// Get information.
	$email = sanitizeEmail( $_POST['email'] );
	$cookie = grHash($_POST['ac'],$email);
	//echo $content;
	
	// IF valid, continue.
	if(filter_var($email, FILTER_VALIDATE_EMAIL)){
		if(!checkHashedCookie($email,$cookie)) return;
		echo json_encode( _getAllNumberUnreadMsgs($email) );
	}else{
		http_response_code(206);
		return;
	}
	
}

function getMessages(){
	// Get information.
	$email = sanitizeEmail( $_POST['email'] );
	$cookie = grHash($_POST['ac'],$email);
	$group_uid = $_POST['group_uid'];
	//echo $content;
	
	if(!isset($group_uid)){ http_response_code(299); return; }
	
	// IF valid, continue.
	if(filter_var($email, FILTER_VALIDATE_EMAIL)){
		if(!verifyUserGroup($email,$cookie,$group_uid)) return;
		$msgObj = array();
		$msgs["messages"] = getGroupMessages($group_uid);
		$msgs["num_unread"] = _getNumberUnreadMsgs($email,$group_uid);
		echo json_encode($msgs);
	}else{
		http_response_code(206);
		return;
	}
	
}

function _markMessagesRead($email,$group_uid)
{
	$dbh = ConnectToDB();
	
	$sql = "
		UPDATE memberships SET last_message_read = NOW()
		WHERE email = ? AND group_uid = ?
	";
	
	$arr = array($email,$group_uid);
	$stmt = $dbh->prepare($sql);
	$stmt->execute($arr);
	
	return _getNumberUnreadMsgs($email,$group_uid);
}

function markMessagesRead(){
	// Get information.
	$email = sanitizeEmail( $_POST['email'] );
	$cookie = grHash($_POST['ac'],$email);
	$group_uid = $_POST['group_uid'];
	//echo $content;
	
	if(!isset($group_uid)){ http_response_code(299); return; }
	
	// IF valid, continue.
	if(filter_var($email, FILTER_VALIDATE_EMAIL)){
		echo _markMessagesRead($email,$group_uid);
	}else{
		http_response_code(206);
		return;
	}
	
}

function addMessage($email,$content,$group_uid){
				
	$dbh = ConnectToDB();
	
	$sql = "INSERT INTO messages(email,content,group_uid,timestamp)
			VALUES(?,?,?,UTC_TIMESTAMP())";
	
	
	$arr = array($email,$content,$group_uid);
	$stmt = $dbh->prepare($sql);
	$stmt->execute($arr);
	return;	
}

function sendMessage(){
	
	// Get information.
	$email = sanitizeEmail( $_POST['email'] );
	$cookie = grHash($_POST['ac'],$email);
	$group_uid = $_POST['group_uid'];
	$content = $_POST['message_content'];
	//echo $content;
	
	
	if(!isset($content)){ http_response_code(299); return; }
	if(!isset($group_uid)){ http_response_code(299); return; }
	
	// IF valid, continue.
	if(filter_var($email, FILTER_VALIDATE_EMAIL)){
		if(!verifyUserGroup($email,$cookie,$group_uid)) return;
		addMessage($email,$content,$group_uid);
	}else{
		http_response_code(206);
		return;
	}
}


?>