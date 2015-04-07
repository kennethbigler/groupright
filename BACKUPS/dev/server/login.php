<?php

	function incrementLoginAttempt($user){
		
		$dbh = ConnectToDB();
		
		$stmt = $dbh->prepare("SELECT * FROM active_users WHERE email=?");
		if($stmt->execute(array($user))){
			while($row = $stmt->fetch()){
				$count = $row['login_attempts'] + 1;
			}
		}
		
		$stmt = $dbh->prepare("UPDATE active_users SET login_attempts=? WHERE email=?");
		$stmt->execute(array($count,$user));
		
		return $count;	
	}
	
	
	function sendLockedEmail($email, $fname, $lname, $vc){
		$hackedUrl = "https://www.groupright.net/dev/unlock.html?vc=".$vc;
	
		$to = $email;
		$subject = 'Your Account Has Been Locked';
		
		$headers = "From: " . "no-reply@groupright.net" . "\r\n";
		$headers .= "Reply-To: " . "no-reply@groupright.net" . "\r\n";
		$headers .= "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
		
		$message = '<html><body>';
		$message .= '<img src="https://www.groupright.net/dev/images/emailLogo.png" alt="GroupRight" />';
		$message .= '<p><strong>'.$fname." ".$lname."</strong>,</p>";
		$message .= "<p>Someone has been trying to get into your account.  If this is not you, click the following link to unlock your account.</p>";
		$message .= "<p><a href='".$hackedUrl."'>".$hackedUrl."</a></p>";
		$message .= "</body></html>";
		
		//echo $message;
	
		mail($to,$subject,$message,$headers);
	}
	
	
	
	function lockAccount($user,$vc){
		
		$dbh = ConnectToDB();
		
		$stmt = $dbh->prepare("UPDATE active_users SET lockout_code=? WHERE email=?");
		
		$stmt->execute(array($vc,$user));
		
	}
	
	function checkEmailPassword($user,$password){
		
		$dbh = ConnectToDB();
		
		$stmt = $dbh->prepare("SELECT * FROM active_users WHERE email=?");
		if($stmt->execute(array($user))){
			while($row = $stmt->fetch()){
				if($row['login_attempts'] > 5) return false;
				if($row['password'] == $password){
					// Clear login attempts.
					$stmt2 = $dbh->prepare("UPDATE active_users SET login_attempts=0 WHERE email=?");
					$stmt2->execute(array($user));

					return true;
				}
			}
		}
		
		return false;	
	}
	
	
	function logIn(){
		
		// Get username and password.
		$email = $_POST['email'];
		$password = $_POST['password'];
		
		// Process password
		$password = grHash($password,$email);
		
		// Filter email address
		$email_address = htmlspecialchars($email);
		$email_address = trim($email_address);
		$email_address = stripslashes($email_address);
		
		// If valid, continue.
		if(filter_var($email_address, FILTER_VALIDATE_EMAIL)) {
			if(checkEmailPassword($email_address,$password)){
				// Send success code.
				http_response_code(200);
				
				// Generate and print cookie.
				$cookieCode = generateCookie($email_address,true);
				echo $cookieCode;
				return;
			
			}
			else{
				// Increment try count.
				http_response_code(206);
				$currLogCount = incrementLoginAttempt($email_address);				
				
				// Locked out.
				if($currLogCount > 5){
					http_response_code(209);
					
					if($currLogCount == 6){
					
						// Generate verification code.
						$vc = generateCode(32,$email_address);
						
						// Get name from account.
						$arr = getNameFromAccount($email_address);
						$fname = $arr[0];
						$lname = $arr[1];
						
						// Update table to reflect lock.
						//echo $vc; echo $email_address;
						lockAccount($email_address,$vc);
						
						// Send Confirmation Email
						sendLockedEmail($email_address,$fname,$lname,$vc);
					
					}
					
				}
			
			}
			
		}else{
			http_response_code(206);
			return;
		}
		
	}
	
	//----------------------------------------------------------------
	function rememberUser(){
	
		// Get username and password.
		$email = $_POST['email'];
		$code = $_POST['ac'];
		
		// Filter email address
		$email_address = htmlspecialchars($email);
		$email_address = trim($email_address);
		$email_address = stripslashes($email_address);
		
		// If valid, continue.
		if(filter_var($email_address, FILTER_VALIDATE_EMAIL)) {
			if(checkCookie($email_address,$code)){
				//echo "true";
				http_response_code(200); return;
			}else{
				//echo "false";
				http_response_code(211); return;
			}
			
		}else{
			http_response_code(206);
			return;
		}
	
	}
	
	//-----------------------------------------------------------------
	function unlockAccount(){
		// Get username and password.
		$vc = $_POST['vc'];
		
		$dbh = ConnectToDB();
		
		$stmt = $dbh->prepare("SELECT * FROM active_users WHERE lockout_code=?");
		
		if($stmt->execute(array($vc))){
			while($row = $stmt->fetch()){
				$repl = generateCode(32,0);
			
				$stmt2 = $dbh->prepare("UPDATE active_users SET login_attempts=0 WHERE lockout_code=?");
				$stmt2->execute(array($vc));	
				http_response_code(200);
				return;
			}
		}
		http_response_code(210);
		return;
		
	}
	
	
	//------------------------------------------------------------------
	function logoutUser(){
		
		// Get username and password.
		$cookie = $_POST['code'];
		$email = $_POST['email'];
		
		// Filter email address
		$email_address = htmlspecialchars($email);
		$email_address = trim($email_address);
		$email_address = stripslashes($email_address);
		
		// If valid, continue.
		if(filter_var($email_address, FILTER_VALIDATE_EMAIL)) {
			removeCookie($email_address,$cookie);
			http_response_code(200);
			return;
		}
		http_response_code(211);
		return;
	}
	
	?>