<?php

	function _getUserInfo($email_address,$cookie,$complete){
		// Enter DB.
		$dbh = ConnectToDB();
		
		// Get user info.
		$stmt = $dbh->prepare(
			"SELECT * FROM active_users NATURAL JOIN sessions WHERE email=? and sc=?"
		);
		$stmt->execute(array($email_address,$cookie));
		
		while($row = $stmt->fetch()){
		
			// Get namesl
			$user_info['first_name'] = $row['first_name'];
			$user_info['last_name'] = $row['last_name'];
			$user_info['photo_url'] = $row['photo_url'];
		
			// Set memberships.
			$user_info["memberships"] = getMemberships($email_address,$cookie,$complete);
			if($complete){
				$user_info["tasks"] = getAllTasks($email_address);
				$user_info["events"] = getAllEvents($email_address);
				$user_info["updates"] = getAllUpdates($email_address);
			}
			
			http_response_code(200);
			return $user_info;
			
		}
		http_response_code(211);
		return null;
		
	}

	function getUserInfo($complete){


		// Get Data
		$email = $_POST['email'];
		$cookie = $_POST['ac'];
		
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
			$user_info = _getUserInfo($email_address,$cookie,$complete);
			if($user_info) echo json_encode($user_info);
			return;
		}
		else {
			// maybe do something
			http_response_code(206);
			return;
		}
		
	}








?>