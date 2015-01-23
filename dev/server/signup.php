<?php
	
	//--------------------------------------------------------
	// ACCOUNT VERIFICATION EMAIL GENERATION
	
	function sendVerifEmail($email, $fname, $lname, $vc){
		$url = "https://www.groupright.net/dev/confirm.html?vc=".$vc;
		$wrongURL = "https://www.groupright.net/dev/wrong_email.html?vc=".$vc;
	
		$to = $email;
		$subject = 'Account Verification';
		
		$headers = "From: " . "no-reply@groupright.net" . "\r\n";
		$headers .= "Reply-To: " . "no-reply@groupright.net" . "\r\n";
		$headers .= "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
		
		$message = '<html><body>';
		$message .= '<img src="https://www.groupright.net/dev/images/emailLogo.png" alt="GroupRight" />';
		$message .= '<p><strong>'.$fname." ".$lname."</strong>,</p>";
		$message .= "<p>Thanks for signing up for GroupRight!  Click on the link below to confirm your email.</p>";
		$message .= "<p><a href='".$url."'>".$url."</a></p>";
		$message .= "<p>If this isn't you, click <a href='".$wrongUrl."'>here</a>.</p>";
		$message .= "</body></html>";
		
		//echo $message;
	
		mail($to,$subject,$message,$headers);
	}
	
	
	
	function saveUserToPendingAccounts($email_address,$password,$fname,$lname,$vc){
	
		$dbh = ConnectToDB();
				
		$stmt = $dbh->prepare("INSERT INTO pending_users(email,password,first_name,last_name,timestamp,vercode) VALUES (:email,:password,:first,:last,:date,:vc)");
		$stmt->bindParam(":email",$sql_email_address);
		$stmt->bindParam(":password",$sql_password);
		$stmt->bindParam(":first",$sql_fname);
		$stmt->bindParam(":last",$sql_lname);
		$stmt->bindParam(":date",$sql_date);
		$stmt->bindParam(":vc",$sql_vc);
		
		$sql_email_address = $email_address;
		$sql_password = $password;
		$sql_fname = $fname;
		$sql_lname = $lname;
		$sql_date = date("Y-m-d H:i:s",time());
		$sql_vc = $vc;
				
		$stmt->execute();		
	}
	
	
	function checkExistingAccount($email_address){
		
		// PENDING
		$dbh = ConnectToDB();
		$stmt = $dbh->prepare("SELECT COUNT(*) FROM pending_users WHERE email=?");				
		$stmt->execute(array($email_address));
		
		while($row = $stmt->fetch()){
			if($row[0] > 0) return true;
		}	
		
		// ACTIVE
		$dbh = ConnectToDB();
		
		$stmt = $dbh->prepare("SELECT COUNT(*) FROM active_users WHERE email=?");
		
		$stmt->execute(array($email_address));
		
		while($row = $stmt->fetch()){
			if($row[0] > 0) return true;
		}	
	
		return false;
	}
	
	function signUp(){
	
		// Get Data
		$fname = $_POST['first_name'];
		$lname = $_POST['last_name'];
		$email = $_POST['email'];
		$password = $_POST['password'];
		
		// Process password.
		$password = grHash($password,$email);
		
		// Filter email address
		$email_address = htmlspecialchars($email);
		$email_address = trim($email_address);
		$email_address = stripslashes($email_address);
		
		// If valid, continue.
		if(filter_var($email_address, FILTER_VALIDATE_EMAIL)) {
		
			// Generate verification code.
			$vc = generateCode(32,$email_address);
			
			
			// Check for Existing Account
			if(checkExistingAccount($email_address)){
				http_response_code(208);
				return;
			}
			
			// Save Pending Account
			saveUserToPendingAccounts($email_address,$password,$fname,$lname,$vc);
			
			// Send Confirmation Email
			sendVerifEmail($email_address,$fname,$lname,$vc);
		}
		else {
			// maybe do something
		}
	}

	//======================================================================
	// CONFIRMATION FUNCTIONS
	
	function movePendingUserToActive($vc,$password){
	
		$dbh = ConnectToDB();
		
		// Clean house.
		$stmt = $dbh->prepare("DELETE FROM pending_users WHERE timestamp<?");
		$stmt->execute(array(date("Y-m-d H:i:s",(time() - (24*60*60)))));
		
		$stmt = $dbh->prepare("SELECT * FROM pending_users WHERE vercode=?");				
		$stmt->execute(array($vc));	

		while($row = $stmt->fetch()){
			print_r($row);
			$password = grHash($password,$row['email']);
			if($row['password'] == $password){
			
				$stmt2 = $dbh->prepare("INSERT INTO active_users(email,password,login_attempts,first_name,last_name) VALUES (?,?,?,?,?)");				
				$stmt2->execute(array($row['email'],$password,0,$row['first_name'],$row['last_name']));
				
				$stmt3 = $dbh->prepare("DELETE FROM pending_users WHERE vercode=?");				
				$stmt3->execute(array($vc));
				
				
				return array(200,$row['email']);			
			}
			if($row['vc'] != '') return array(206,"");
		}		
		return array(210,""); // no code seen.
	}
	
	
	function confirmAccount(){
	
		$password = $_POST['password'];
		$vc = $_POST['vc'];
				
		$ret = movePendingUserToActive($vc,$password);
		$code = $ret[0];
		$user = $ret[1];
		
		if($code == 200){
			// Generate and print cookie.
			$cookieCode = generateCookie($user,true);
			echo $cookieCode;
		}
		
		// Send success code.
		http_response_code($code);
	
	}
	
	

?>