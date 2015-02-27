<?php

function getGroupMessages($group_uid){
	
	$dbh = ConnectToDB();
	
	$sql = "SELECT * FROM messages WHERE group_uid = ? ORDER BY timestamp DESC LIMIT 20";
	
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

function getMessages(){
	// Get information.
	$email = sanitizeEmail( $_POST['email'] );
	$cookie = grHash($_POST['cookie'],$email);
	$group_uid = $_POST['group_uid'];
	//echo $content;
	
	if(!isset($group_uid)){ http_response_code(299); return; }
	
	// IF valid, continue.
	if(filter_var($email, FILTER_VALIDATE_EMAIL)){
		if(!verifyUserGroup($email,$cookie,$group_uid)) return;
		$msgs = getGroupMessages($group_uid);
		echo json_encode($msgs);
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
	$cookie = grHash($_POST['cookie'],$email);
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