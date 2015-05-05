<?php

	function getNameFromAccount($email){
		
		$dbh = ConnectToDB();
		
		$stmt = $dbh->prepare("SELECT * FROM active_users WHERE email=?");
		if($stmt->execute(array($email))){
			while($row = $stmt->fetch()){
				return array($row['first_name'],$row['last_name']);
			}
		}
		return [];
	}
	
	//-------------------------------------------------------------------
	
	function grHash($str,$salt){
		if(!isset($salt)) $salt = "pepperoni";
		return sha1($salt.$str);
	}
	
	//-------------------------------------------------------------------
	
	
	function generateCode($len,$offset){
		$vc = "";
		$chars = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		srand();
		for($i = 0; $i < $len; $i++){
			$vc .= $chars[rand(0,strlen($chars) - 1)];
		}
		return $vc;
	}
	
	// COOKIES
	// Create cookie.
	function generateCookie($user,$extended){
		$code = generateCode(32,$user);
		$code2 = grHash($code,$user);
		
		$dbh = ConnectToDB();
		
		$stmt = $dbh->prepare("
		INSERT INTO sessions(sc,expiration,email)
		VALUES(?,DATE_ADD(NOW(),INTERVAL 4 HOUR),?)
		");
		$stmt->execute(array($code2,$user));
		
		return $code;	
		
	}
	// Check cookie.
	function checkCookie($user,$cookie){
	
		$cookie = grHash($cookie,$user);
	
		return checkHashedCookie($user,$cookie);
	}
	
	function checkHashedCookie($user,$cookie){
		//echo $cookie;
	
		$dbh = ConnectToDB();
		
		$stmt = $dbh->prepare("
			DELETE FROM sessions 
			WHERE expiration < NOW();
		");
		$stmt->execute();
		
		$stmt = $dbh->prepare("
			SELECT * FROM sessions 
			WHERE email = ? 
			AND sc = ?
		");
		
		$stmt->execute(array($user,$cookie));
		while($row = $stmt->fetch()){
			echo 'hi';
			return true;			
		}
		
		http_response_code(211);
		return false;	
	}
	
	// Check cookie.
	function removeCookie($user,$cookie){
	
		$cookie = grHash($cookie,$user);
	
		$today = new DateTime("now");
		//echo $cookie;
	
		$dbh = ConnectToDB();
		
		$stmt = $dbh->prepare("DELETE FROM sessions WHERE sc=?");
		$stmt->execute(array($cookie));
		
		//echo $user;
		//echo $cookie;
			
		return;
	}
	
	function sanitizeEmail($email){
		
		$email_address = htmlspecialchars($email);
		$email_address = trim($email_address);
		$email_address = stripslashes($email_address);
		
		return $email_address;
		
	}
	
	function isEmptyString($str){
		//print_r($str);
		if($str == null) return false;
		if(!isset($str)) return false;
		if($str == "") return false;
		return true;
	}

?>