<?php

function getMessages(){
	
}

function addMessage($email,$content,$group_uid){
				
	$dbh = ConnectToDB();
	
	$sql = "INSERT INTO messages(email,content,group_uid)
			VALUES(?,?,?)";
	
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
		
		
		if(!isset($content)){ http_response_code(299); return; }
		if(!isset($group_uid)){ http_response_code(299); return; }
		if(!isset($task_descr)){ $task_descr = ""; }
		
		// IF valid, continue.
		if(filter_var($email, FILTER_VALIDATE_EMAIL)){
			if(!verifyUserGroup($email,$cookie,$group_uid)) return;
			$message_uid = addMessage($email,$content,$group_uid);
		}else{
			http_response_code(206);
			return;
		}
}


?>