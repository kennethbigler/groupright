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
		$monthLater = time() + (30*24*60*60);
		
		$dbh = ConnectToDB();
		
		$stmt = $dbh->prepare("UPDATE active_users SET last_session_code=?,session_expiration=? WHERE email=?");
		$stmt->execute(array($code2,date("Y-m-d H:i:s",$monthLater),$user));
		
		return $code;	
		
	}
	// Check cookie.
	function checkCookie($user,$cookie){
	
		$cookie = grHash($cookie,$user);
	
		$today = new DateTime("now");
		//echo $cookie;
	
		$dbh = ConnectToDB();
		
		$stmt = $dbh->prepare("SELECT * FROM active_users WHERE email=?");
		if($stmt->execute(array($user))){
			while($row = $stmt->fetch()){
				$expDate = new DateTime($row['session_expiration']);
				if($expDate < $today) return false;
				return ($row['last_session_code'] == $cookie);
			
			}
		}
		
	
		return false;
	}
	
	// Check cookie.
	function removeCookie($user,$cookie){
	
		$cookie = grHash($cookie,$user);
	
		$today = new DateTime("now");
		//echo $cookie;
	
		$dbh = ConnectToDB();
		
		$stmt = $dbh->prepare("UPDATE active_users SET session_expiration=? WHERE email=? AND last_session_code=?");
		$stmt->execute(array(date("Y-m-d H:i:s",$today),$user,$cookie));
		
		echo $user;
		echo $cookie;
			
		return;
	}
	
	function sanitizeEmail($email){
		
		$email_address = htmlspecialchars($email);
		$email_address = trim($email_address);
		$email_address = stripslashes($email_address);
		
		return $email_address;
		
	}
	
	function isEmptyString($str){
		print_r($str);
		if($str == null) return false;
		if(!isset($str)) return false;
		if($str == "") return false;
		return true;
	}

?>