<?php

/**
 *	GROUPS.PHP
 *
 *		Handles much of the logic pertaining to generic group tasks (creation, deletion, etc.)
 */
 
	function makeGroup_Helper($name,$members,$leader){
	
	/*
	INSERT INTO `groups`(`group_name`, `group_leader`, `properties`) VALUES ('My Family','zwilson7@gmail.com','{"color":"#990000"}')
	*/
	
		// Enter DB.
		$dbh = ConnectToDB();
	
		// Prevent duplicate.
		$stmt = $dbh->prepare(
			"SELECT * FROM `groups` where group_name=? AND group_leader=?"
		);				
		$stmt->execute(array($name,$leader));			
		while($row = $stmt->fetch()){ http_response_code(213); return; }
	
	
		// Make Group
		$stmt = $dbh->prepare(
			"INSERT IGNORE INTO groups(`group_name`, `group_leader`, `properties`) VALUES (?,?,'{}')"
		);				
		$stmt->execute(array($name,$leader));

		// Get group UID.
		$g_uid = 0;
		$stmt = $dbh->prepare(
			"SELECT * FROM `groups` where group_name=? AND group_leader=?"
		);				
		$stmt->execute(array($name,$leader));	
		
		while($row = $stmt->fetch()){ 
			$g_uid = $row['group_uid'];
		}
		
		// If valid id, add memberships.
		if($g_uid != 0){
		
			// add leader
			addMember($members[0],$g_uid,"leader","{\"color\":\"#900000\"}");
			
			// add other members
			for($i = 1; $i < count($members); $i++){
				addMember($members[$i],$g_uid,"member","{\"color\":\"#900000\"}");
			}
			
			http_response_code(200);
			return;
		}
		
		http_response_code(220);
		return;
	
	}
 
	function makeGroup(){
	
		// Get Data
		$email = $_POST['email'];
		$cookie = $_POST['ac'];
		
		$members = json_decode($_POST['member_array']);
		$gname = $_POST['group_name'];
		
		// Fix cookie.
		$cookie = grHash($cookie,$email);
		
		// Filter email address
		$email_address = htmlspecialchars($email);
		$email_address = trim($email_address);
		$email_address = stripslashes($email_address);
		
		// If valid, continue.
		if(filter_var($email_address, FILTER_VALIDATE_EMAIL)) {
		
			// Enter DB.
			$dbh = ConnectToDB();
		
			// Verify User.	
			$stmt = $dbh->prepare(
				"SELECT * FROM active_users
				WHERE email = ? AND last_session_code = ?"
			);				
			$stmt->execute(array($email_address,$cookie));	
			
			
			while($row = $stmt->fetch()){ 
				makeGroup_Helper($gname,$members,$email_address);
				return;
			}
			http_response_code(211);
			return;
			
		}
		else {
			// maybe do something
			http_response_code(206);
			return;
		}
	
	
	}
	
	function addMember($email,$group_uid,$role,$properties){
	/*
	INSERT INTO `memberships`(`email`, `group_uid`, `role`, `properties`) VALUES ('scomatbarsar@gmail.com', 2,'member', '{"color":"#990000"}')
	*/
	
		// Enter DB.
		$dbh = ConnectToDB();
		
		// Get Membership color
		$color = _nextGroupColor($email);
	
		// Prevent duplicate.
		$stmt = $dbh->prepare(
			"INSERT IGNORE INTO `memberships`(`email`, `group_uid`, `role`, `color`) VALUES (?, ?, ?, ?)"
		);				
		$stmt->execute(array($email,$group_uid,$role,$color));		
		return true;
		
	}
	
	
		/*
		// basic
		SELECT m.email, u.first_name, u.last_name, g.group_name, m.properties, u.last_session_code
		FROM memberships AS m 
		LEFT JOIN groups AS g ON m.group_uid = g.group_uid 
		LEFT JOIN active_users AS u ON m.email = u.email

		// refined
		SELECT g.group_name, m.properties
		FROM memberships AS m 
		LEFT JOIN groups AS g ON m.group_uid = g.group_uid 
		LEFT JOIN active_users AS u ON m.email = u.email
		WHERE m.email = 'scomatbarsar@gmail.com' AND u.last_session_code = 'dd4c3357c8d031bd8119a326c006a6fd66ed029a'
				
		*/

	function getMemberships($email_address,$cookie,$complete){
		
		
		// Enter DB.
		$dbh = ConnectToDB();

		// Run Query.			
		$stmt = $dbh->prepare(
			"SELECT g.group_name AS group_name, m.color AS color, g.group_uid AS group_uid, role
			FROM memberships AS m 
			LEFT JOIN groups AS g ON m.group_uid = g.group_uid 
			LEFT JOIN active_users AS u ON m.email = u.email
			WHERE m.email = ? AND u.last_session_code = ?"
		);				
		$stmt->execute(array($email_address,$cookie));	
		
		// Run through results
		$groups = array();
		while($row = $stmt->fetch()){
		
			// Parse rows.
			$name = $row['group_name'];
			$color = $row['color'];
			$uid = $row['group_uid'];
			$role = $row['role'];
			
			// Create membership object.
			$gr = array("group_name"=>$name,"group_color"=>"#".$color,"group_id"=>$uid,"role"=>$role);
			
			if($complete){
				$members = getMembers($uid);
				$gr["members"] = $members;
			}
			
			// Add to groups.
			$groups[] = $gr;
		}	
		http_response_code(200);
			
		
		return $groups;		
	}

function getMembers($group_uid){
		
		
		// Enter DB.
		$dbh = ConnectToDB();

		// Run Query.			
		$stmt = $dbh->prepare(
			"SELECT u.email,u.first_name,u.last_name
			FROM active_users AS u
			INNER JOIN memberships AS m
			ON u.email = m.email
			WHERE m.group_uid = ?"
		);				
		$stmt->execute(array($group_uid));	
		
		// Run through results
		$members = array();
		while($row = $stmt->fetch()){
		
			// Parse rows.
			$email = $row['email'];
			$fname = $row['first_name'];
			$lname = $row['last_name'];
			
			// Create membership object.
			$m = array("email"=>$email,"first_name"=>$fname,"last_name"=>$lname);
			
			// Add to groups.
			$members[] = $m;
		}	
		http_response_code(200);
			
		
		return $members;		
	}
	
	
// COLOR MANAGEMENT
//========================================================================

function _getNullColoredGroups($email)
{
	$dbh = ConnectToDB();
	
	$sql = "
		SELECT group_uid
		FROM memberships
		WHERE color IS NULL
		AND email = ?
	";
	
	$stmt = $dbh->prepare($sql);
	
	$stmt->execute(array($email));
	
	$arr = array();
	while($row = $stmt->fetch()){
		$arr[] = $row['group_uid'];
	}
	
	return $arr;
	
}

function _nextGroupColor($email)
{
	$dbh = ConnectToDB();
	
	$sql = "
		SELECT 
			rgb, 
			IFNULL(freq,0) as freq
		FROM gr_colors
		NATURAL LEFT JOIN 
		(
			SELECT 
				color as rgb, 
				count(*) as freq
			FROM memberships
			WHERE email = ?
			AND color IS NOT NULL
			GROUP BY color
		) as freqs
		ORDER BY 
			IFNULL(freq,0) ASC,
			id ASC
	";
	
	$stmt = $dbh->prepare($sql);
	
	$stmt->execute(array($email));
	
	while($row = $stmt->fetch()){
		return $row['rgb'];
	}
	
	return NULL;
}

function _updateMembershipColor($email,$group_uid,$color)
{
	$dbh = ConnectToDB();
	
	$sql = "
		UPDATE memberships
		SET color = ?
		WHERE email = ?
		AND group_uid = ?
	";
	
	$stmt = $dbh->prepare($sql);
	
	$stmt->execute(array($color,$email,$group_uid));
	
	return;
}

function _resetColors($email)
{
	$dbh = ConnectToDB();
	
	$sql = "
		UPDATE memberships
		SET color = NULL
		WHERE email = ?
	";
	
	$stmt = $dbh->prepare($sql);
	
	$stmt->execute(array($email));
	
	return;
}

function _fixMembershipColors($email)
{
	$groups = _getNullColoredGroups($email);
	
	for($i = 0; $i < sizeof($groups); $i++)
	{
		$color = _nextGroupColor($email);
		_updateMembershipColor($email,$groups[$i],$color);
	}
	return;
}


function resetMembershipColors()
{
// Get Data
		$email = $_POST['email'];
		$cookie = $_POST['ac'];
		
		// Fix cookie.
		$cookie = grHash($cookie,$email);
		
		// Filter email address
		$email_address = htmlspecialchars($email);
		$email_address = trim($email_address);
		$email_address = stripslashes($email_address);
		
		// If valid, continue.
		if(filter_var($email_address, FILTER_VALIDATE_EMAIL)) {
		
			_resetColors($email_address);
			_fixMembershipColors($email_address);
			return;
			
		}
		else {
			// maybe do something
			http_response_code(206);
			return;
		}
		
}

?>