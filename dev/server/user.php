<?php

	function getUserInfo(){


		// Get Data
		$email = $_POST['email'];
		$cookie = $_POST['cookie'];
		
		// Initialize info obj.
		$user_info = array();
		
		// Fix cookie.
		$cookie = grHash($cookie,$email);
		
		// Filter email address
		$email_address = htmlspecialchars($email);
		$email_address = trim($email_address);
		$email_address = stripslashes($email_address);
		
		// If valid, continue.
		if(filter_var($email_address, FILTER_VALIDATE_EMAIL)) {
		
			// Enter DB.
			$dbh = ConnectToDB()
			
			// Get user info.
			$stmt = $dbh->prepare(
				"SELECT * FROM active_users WHERE email=? and last_session_code=?"
			);
			$stmt->execute(array($email_address,$cookie));
			
			while($row = $stmt->fetch()){
			
				// Get namesl
				$user_info['first_name'] = $row['first_name'];
				$user_info['last_name'] = $row['last_name'];
				$user_info['photo_url'] = $row['photo_url'];
			
				// Set memberships.
				$user_info["memberships"] = getMemberships($email_address,$cookie);
				
			
			
				echo json_encode($user_info);
				http_response_code(200);
				return;
			}
			
			
			http_response_code(211);
			return;
			
		}
		else {
			// maybe do something
		}
		/*
		
		// Safe code.
		$gr = array("groupName"=>"Senior Design","groupColor"=>"#990000");
		$groups[] = $gr;
		$gr = array("groupName"=>"Web Dev","groupColor"=>"#FF6A00");
		$groups[] = $gr;
		$gr = array("groupName"=>"Family","groupColor"=>"#FFD800");
		$groups[] = $gr;
		$gr = array("groupName"=>"Fake Madrid","groupColor"=>"#007F0E");
		$groups[] = $gr;
		$gr = array("groupName"=>"Spiked Punch","groupColor"=>"#000099");
		$groups[] = $gr;
		$gr = array("groupName"=>"My Villa","groupColor"=>"#7F006E");
		$groups[] = $gr;
		*/
		http_response_code(220);
		return;	
	}








?>