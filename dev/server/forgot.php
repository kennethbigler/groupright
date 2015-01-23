<?php


	function sendForgotEmail($email, $fname, $lname, $vc){
		$hackedUrl = "https://www.groupright.net/dev/reset.html?vc=".$vc;
	
		$to = $email;
		$subject = 'Link to Reset Password';
		
		$headers = "From: " . "no-reply@groupright.net" . "\r\n";
		$headers .= "Reply-To: " . "no-reply@groupright.net" . "\r\n";
		$headers .= "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
		
		$message = '<html><body>';
		$message .= '<img src="https://www.groupright.net/dev/images/emailLogo.png" alt="GroupRight" />';
		$message .= '<p><strong>'.$fname." ".$lname."</strong>,</p>";
		$message .= "<p>Here is the link to reset your password:</p>";
		$message .= "<p><a href='".$hackedUrl."'>".$hackedUrl."</a></p>";
		$message .= "</body></html>";
		
		//echo $message;
	
		mail($to,$subject,$message,$headers);
	}
	
	
	
	function saveUserToForgetfulAccounts($email_address,$vc){
	
		$dbh = ConnectToDB();
		
		// Remove old entries.
		$stmt = $dbh->prepare("DELETE FROM forgetful_users where email=?");
		$stmt->execute(array($email_address));
		
		$stmt2 = $dbh->prepare("INSERT INTO forgetful_users(email,vc,exp_date) VALUES (:email,:vc,:date)");
		$stmt2->bindParam(":email",$sql_email_address);
		$stmt2->bindParam(":date",$sql_date);
		$stmt2->bindParam(":vc",$sql_vc);
		
		$sql_email_address = $email_address;
		$sql_date = date("Y-m-d H:i:s");
		$sql_vc = $vc;
				
		$stmt2->execute();		
	}
	
	function updateForgottenPassword($vc,$password){
	
		$dbh = ConnectToDB();
		
		// Remove old entries.
		$stmt = $dbh->prepare("SELECT * FROM forgetful_users where vc=?");
		
		if($stmt->execute(array($vc))){
			while($row = $stmt->fetch()){
				$email = $row['email'];
				$password = grHash($password,$email);
				$stmt2 = $dbh->prepare("UPDATE active_users SET password=? WHERE email=?");
				$stmt2->execute(array($password,$email));
				
				$stmt2 = $dbh->prepare("DELETE FROM forgetful_users where email=?");
				$stmt2->execute(array($email));
				
				http_response_code(200);
				return;
				
			}
		}
		http_response_code(210); // bad code
		return;
	}
	
	function userForgotPassword(){
	
		// Get username and password.
		$email = $_POST['email'];
		
		// Filter email address
		$email_address = htmlspecialchars($email);
		$email_address = trim($email_address);
		$email_address = stripslashes($email_address);
		
		// If valid, continue.
		if(filter_var($email_address, FILTER_VALIDATE_EMAIL)) {
		
			// Generate verification code.
			$vc = generateCode(32,$email_address);
			
			// Get name from account.
			$arr = getNameFromAccount($email_address);
			if(count($arr) < 2){ http_response_code(212); return;}
			else{http_response_code(200);}
			$fname = $arr[0];
			$lname = $arr[1];
			
			// Mark account in DB.
			saveUserToForgetfulAccounts($email,$vc);
			
			// Send Confirmation Email
			sendForgotEmail($email_address,$fname,$lname,$vc);
		}
	}
	
	function resetAccountPassword(){
		// Get username and password.
		$vc = $_POST['vc'];
		$password = $_POST['password'];
				
		updateForgottenPassword($vc,$password);
	}
	
?>