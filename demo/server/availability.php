<?php
// availability.php
//
// Handles event availability input.

function addEventAvailability($email,$group_uid,$event_uid,$avail){
	$dbh = ConnectToDB();
	if(!isset($group_uid)){http_response_code(299); return;}
	if(!isset($event_uid)){http_response_code(299); return;}
	if(!is_array($avail)){ $avail = json_decode($avail,false); }
	//print_r($avail);
	if(!is_array($avail)){http_response_code(299); return;}
	//echo "test";

	$sql = "REPLACE INTO availability(
				event_uid,
				email,
				start_time,
				end_time,
				score) VALUES (?,?,?,?,?)";
	$stmt = $dbh->prepare( $sql );
	
	$scores = array(0=>0,1=>10,2=>30,3=>50);
	
	for($i = 0; $i < sizeof($avail); $i++){
		if(!isset($avail[$i]["start_time"])){ http_response_code(298); return; }
		if(!isset($avail[$i]["end_time"])){ http_response_code(298); return; }
		if(!isset($avail[$i]["score"])){ http_response_code(298); return; }
		$score = $scores[$avail[$i]["score"]];
		if(!isset($score)){ http_response_code(298); return; }
		
		$arr = array($event_uid,$email,
						$avail[$i]["start_time"],
						$avail[$i]["end_time"],
						$score);
		
		$stmt->execute($arr);		
	}
	
	return;
}

function _markERTaskComplete($email,$group_id,$event_id)
{
	$dbh = ConnectToDB();
	
	$sql = "
		UPDATE tasks_assignments
		SET is_completed = 1
		WHERE task_uid in (
			SELECT task_uid
			FROM tasks as t
			JOIN task_link as tl using (task_uid)
			WHERE tl.link_type = 'event'
			AND tl.link_id = ?
			AND t.group_uid = ?
		)
		AND email = ?
	";

	$stmt = $dbh->prepare($sql);
	
	$stmt->execute(array($event_id,$group_id,$email));
	
	return;
}

function submitAvailability(){
	
	// Get information.
	$email = sanitizeEmail( $_POST['email'] );
	$cookie = grHash($_POST['ac'],$email);
	$group_uid = $_POST['group_uid'];
	$event_uid = $_POST['event_uid'];
	$avail = $_POST['availability'];
	//echo $avail;
	
	// If valid, continue.
	if(filter_var($email, FILTER_VALIDATE_EMAIL)) {
		if(!verifyUserGroup($email,$cookie,$group_uid)){
			http_response_code(206);
			return;
		}
		addEventAvailability($email,$group_uid,$event_uid,$avail);
		_markERTaskComplete($email,$group_uid,$event_uid);
		http_response_code(200);
	}else{
		http_response_code(206);
		return;
	}
	
}

function _getAvailabilityDump($group_id,$event_id)
{
	$dbh = ConnectToDB();
	
	$sql = "
			SELECT availability.* 
			FROM 
			(
				SELECT event_uid
				FROM events 
				WHERE group_uid = ? 
				AND event_uid = ?
			) AS x
			JOIN availability USING (event_uid)
	";

	$stmt = $dbh->prepare($sql);
	
	$stmt->execute(array($group_id,$event_id));
	
	$arr = array();
	while($row = $stmt->fetch())
	{
		$obj = array();
		$obj['email'] = $row['email'];
		$obj['start_time'] = $row['start_time']." UTC";
		$obj['end_time'] = $row['end_time']." UTC";
		$obj['score'] = $row['score'];
		$arr[] = $obj;
	}
	return $arr;
	
}

function getAvailabilityDump()
{
	// Get information.
	$email = sanitizeEmail( $_POST['email'] );
	$cookie = grHash($_POST['ac'],$email);
	$group_uid = $_POST['group_uid'];
	$event_uid = $_POST['event_uid'];
	
	
	// IF valid, continue.
	if(filter_var($email, FILTER_VALIDATE_EMAIL)){
		if(!verifyUserGroup($email,$cookie,$group_uid)) return;
		
		$settings = getEventVoteSettings($group_uid,$event_uid);
		$creator = _getUser($settings["creator"]);
		$dump = _getAvailabilityDump($group_uid,$event_uid);
		
		$obj = array();
		$obj["event_name"] = $settings["name"];
		$obj["start_time"] = $settings["start_time"];
		$obj["end_time"] = $settings["end_time"];
		$obj["creator"] = $creator["first_name"]." ".$creator["last_name"];
		$obj["dump"] = $dump;
		echo json_encode($obj);
		
	}else{
		http_response_code(206);
		return;
	}
}





?>