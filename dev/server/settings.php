<?php
// settings.php
//
// Handles settings dealing with user settings screens.


	function _changeName($email,$fname,$lname,$cookie){
		// Pre-check.
		if(!checkHashedCookie($email,$cookie)){http_response_code(211); return;}
		
		// Get members.
		$dbh = ConnectToDB();
		
		$stmt = $dbh->prepare(
			"UPDATE active_users SET first_name = ?, last_name = ? WHERE email = ?"
		);
		$stmt->execute(array($fname,$lname,$email));
		
		$stmt = $dbh->prepare(
			"SELECT * FROM active_users WHERE email = ?"
		);
		$stmt->execute(array($email));
		
		while($row = $stmt->fetch()){
			$obj = array();
			$obj["first_name"] = $row["first_name"];
			$obj["last_name"] = $row["last_name"];
			$obj["email"] = $row["email"];
			echo json_encode($obj);
			return;
		}
		http_response_code(280);
	}

	function changeName(){
		$email = sanitizeEmail( $_POST['email'] );
		$cookie = grHash($_POST['ac'],$email);
		$fname = $_POST['first_name'];
		$lname = $_POST['last_name'];
		
		if(!isset($fname)){ http_response_code(295); return; }
		if(!isset($lname)){ http_response_code(295); return; }
		
		if(filter_var($email, FILTER_VALIDATE_EMAIL)){
			_changeName($email,$fname,$lname,$cookie);
		}else{
			http_response_code(206);
			return;
		}
	}
	
	//=================================================================
	
	function _changePassword($email,$cookie,$old,$new){
		// Pre-check.
		if(!checkHashedCookie($email,$cookie)){http_response_code(211); return;}
		
		// Get members.
		$dbh = ConnectToDB();
		
		$old = grHash($old,$email);
		$new = grHash($new,$email);
		
		$stmt = $dbh->prepare(
			"UPDATE active_users SET password = ? WHERE email = ? AND password = ?"
		);
		$stmt->execute(array($new,$email,$old));
		
		$stmt = $dbh->prepare(
			"SELECT password FROM active_users WHERE email = ? AND password = ?"
		);
		$stmt->execute(array($email,$new));
		
		while($row = $stmt->fetch()){
			//echo $row['password'];
			return;
		}
		http_response_code(206);
	}
	
	function changePassword(){
		$email = sanitizeEmail( $_POST['email'] );
		$cookie = grHash($_POST['ac'],$email);
		$old = $_POST['old_password'];
		$new = $_POST['new_password'];
		
		if(!isset($old)){ http_response_code(295); return; }
		if(!isset($new)){ http_response_code(295); return; }
		
		if(filter_var($email, FILTER_VALIDATE_EMAIL)){
			_changePassword($email,$cookie,$old,$new);
		}else{
			http_response_code(206);
			return;
		}		
	}
	
	//=================================================================
	
	function _changePhoneNumber($email,$cookie,$pn){
		// Pre-check.
		if(!checkHashedCookie($email,$cookie)){http_response_code(211); return;}
		
		// Get members.
		$dbh = ConnectToDB();
		
		$stmt = $dbh->prepare(
			"UPDATE active_users SET phone_number = ? WHERE email = ?"
		);
		$stmt->execute(array($pn,$email));
		
		$stmt = $dbh->prepare(
			"SELECT phone_number FROM active_users WHERE email = ?"
		);
		$stmt->execute(array($email));
		
		while($row = $stmt->fetch()){
			echo $row['phone_number'];
			return;
		}
		http_response_code(280);
		
	}
	
	function changePhoneNumber(){
		$email = sanitizeEmail( $_POST['email'] );
		$cookie = grHash($_POST['ac'],$email);
		$pn = $_POST['phone_number'];
		
		if(!isset($pn)){ http_response_code(295); return; }
		
		if(filter_var($email, FILTER_VALIDATE_EMAIL)){
			_changePhoneNumber($email,$cookie,$pn);
		}else{
			http_response_code(206);
			return;
		}			
	}
?>