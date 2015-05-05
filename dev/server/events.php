<?php
function getAllEvents($email){
	$dbh = ConnectToDB();
	
	$stmt = $dbh->prepare(
		"SELECT name,description,group_uid,
		events.email as creator_email, event_uid,
		start_time,end_time FROM events 
		JOIN groups USING (group_uid) 
		JOIN memberships USING(group_uid)
		WHERE memberships.email = ?"
	);
	$stmt->execute(array($email));
	
	$arr = array();
	
	while($row = $stmt->fetch()){
		$obj = array(
			"event_uid"=>$row['event_uid'],
			"name"=>$row['name'],
			"description"=>$row['description'],
			"group_id"=>$row['group_uid'],
			"creator"=>$row['creator_email'],
			"start_time"=>$row['start_time'],
			"end_time"=>$row['end_time']
		);
		//echo $obj;
		$arr[] = $obj;
	}
	return $arr;
}

function getAllEventsSince($email,$event_uid){
	$dbh = ConnectToDB();
	
	$stmt = $dbh->prepare(
		"SELECT name,description,group_uid,
		events.email as creator_email, event_uid,
		start_time,end_time FROM events 
		JOIN groups USING (group_uid) 
		JOIN memberships USING(group_uid)
		WHERE memberships.email = ?
		AND event_uid > ?"
	);
	$stmt->execute(array($email,$event_uid));
	
	$arr = array();
	
	while($row = $stmt->fetch()){
		$obj = array(
			"event_uid"=>$row['event_uid'],
			"name"=>$row['name'],
			"description"=>$row['description'],
			"group_id"=>$row['group_uid'],
			"creator"=>$row['creator_email'],
			"start_time"=>$row['start_time'],
			"end_time"=>$row['end_time']
		);
		//echo $obj;
		$arr[] = $obj;
	}
	return $arr;
}

function verifyUserGroup($email,$cookie,$group_uid){
	$dbh = ConnectToDB();
	
	$stmt = $dbh->prepare(
		"SELECT * FROM active_users JOIN memberships USING (email)
		NATURAL JOIN sessions WHERE email = ?
		AND sc = ?
		AND group_uid = ?"		
	);
	$stmt->execute(array($email,$cookie,$group_uid));
	
	while($row = $stmt->fetch()){
		return true;
	}
	http_response_code(299);
	return false;
}

function _appendQS(&$sql,&$arr,$var,$backup){
	if(isset($var) && $var != ""){
		$sql = $sql."?";
		$arr[] = $var;
	}else{
		$sql = $sql.$backup;
	}
}

function addEvent($email,$group_uid,$name,$description,$start_time,$end_time,$location){
			
	$dbh = ConnectToDB();
	
	// Name
	$arr = array($name);		
	$sql = "INSERT INTO events(name,description,group_uid,email,start_time,end_time,location)";
	$sql = $sql." VALUES(?,";
	
	// Description (can be empty)
	_appendQS($sql,$arr,$description,"''");
	$sql .= ",";
	
	// Group_UID, email, 
	$sql = $sql."?,"; $arr[] = $group_uid;
	$sql = $sql."?,"; $arr[] = $email;
	
	// Start time (def. NULL)		
	_appendQS($sql,$arr,$start_time,"NULL");
	$sql .= ",";
	_appendQS($sql,$arr,$end_time,"NULL");
	$sql .= ",";
	
	// Location
	_appendQS($sql,$arr,$location,"''");
	$sql .= ")";
	
	$stmt = $dbh->prepare( $sql );
	$stmt->execute($arr);		
	return $dbh->lastInsertId();
}

function addEventVoteSettings($event_uid,$start_time,$end_time,$duration){
			
	$dbh = ConnectToDB();
	
	$stmt = $dbh->prepare(
		"INSERT INTO events_vote_settings(event_uid,start_time,end_time,duration)
		VALUES(?,?,?,?);"
	);
	$stmt->execute(array($event_uid,$start_time,$end_time,$duration));
}

function getEventVoteSettings($group_uid,$event_uid){
	$dbh = ConnectToDB();
	
	$sql = "SELECT name,description,email,location,ev.* 
				FROM events as e 
				RIGHT JOIN events_vote_settings as ev 
				ON e.event_uid = ev.event_uid 
				WHERE e.event_uid = ?
				AND e.group_uid = ?";
			
	$stmt = $dbh->prepare($sql);
	$stmt->execute(array($event_uid,$group_uid));
	
	while($row = $stmt->fetch()){
		$obj = array();
		$obj["name"] = $row["name"];
		$obj["description"] = $row["description"];
		$obj["creator"] = $row["email"];
		$obj["start_time"] = $row["start_time"]." UTC";
		$obj["end_time"] = $row["end_time"]." UTC";
		$obj["duration"] = $row["duration"];
		
		return $obj;
	}
	http_response_code(299);
	return;
}


function createFixedEvent(){

	// Get information.
	$email = sanitizeEmail( $_POST['email'] );
	$cookie = grHash($_POST['cookie'],$email);
	$group_uid = $_POST['group_uid'];
	$event_title = $_POST['event_title'];
	$event_descr = $_POST['event_description'];
	$start_time = $_POST['start_time'];
	$end_time = $_POST['end_time'];
	$location = $_POST['location'];
	
	// If valid, continue.
	if(filter_var($email, FILTER_VALIDATE_EMAIL)) {
		if(!verifyUserGroup($email,$cookie,$group_uid)){
			http_response_code(206);
			return;
		}
		$event_uid = addEvent($email,$group_uid,$event_title,$event_descr,$start_time,$end_time,$location);
		echo $event_uid;
		
		addEventUpdate($email,$group_uid,"created event \"".$event_title."\"",$event_uid);
		
		http_response_code(200);
	}else{
		http_response_code(206);
		return;
	}

}

function createVotableEvent(){
	
	// Get information.
	$email = sanitizeEmail( $_POST['email'] );
	$cookie = grHash($_POST['cookie'],$email);
	$group_uid = $_POST['group_uid'];
	$event_title = $_POST['event_title'];
	$event_descr = $_POST['event_description'];
	
	$start_time = $_POST['start_time'];
	$end_time = $_POST['end_time'];
	$duration = $_POST['duration'];
	$location = $_POST['location'];
	
	// IF valid, continue.
	if(filter_var($email, FILTER_VALIDATE_EMAIL)){
		if(!verifyUserGroup($email,$cookie,$group_uid)) return;
		$event_uid = addEvent($email,$group_uid,$event_title,$event_descr,NULL,NULL,$location);
		addEventVoteSettings($event_uid,$start_time,$end_time,$duration);
		addEventVotingTask($email,$group_uid,$event_title,$event_uid);
		addEventTimePickTask($email,$group_uid,$event_title,$event_uid);
		
		
		addEventUpdate($email,$group_uid,"created event \"".$event_title."\"",$event_uid);
		
	}else{
		http_response_code(206);
		return;
	}
}


function getEventSettings(){
	
	// Get information.
	$email = sanitizeEmail( $_POST['email'] );
	$cookie = grHash($_POST['ac'],$email);
	$group_uid = $_POST['group_uid'];
	$event_uid = $_POST['event_uid'];
	
	
	// IF valid, continue.
	if(filter_var($email, FILTER_VALIDATE_EMAIL)){
		if(!verifyUserGroup($email,$cookie,$group_uid)) return;
		$obj = getEventVoteSettings($group_uid,$event_uid);
		if($obj){
			$json = json_encode($obj);
			echo $json;
		}
	}else{
		http_response_code(206);
		return;
	}
}

function addEventVotingTask($creator,$group_uid,$title,$event_uid){
	
	$task_title = "Provide Availability for '".$title."'";
	
	
	$task_uid = addTask($creator,$task_title,"",$group_uid,$event_uid,true);
	
	// Get members.
	$dbh = ConnectToDB();
	
	$stmt = $dbh->prepare(
		"SELECT email FROM memberships WHERE group_uid = ?"
	);
	$stmt->execute(array($group_uid));
			
	while($row = $stmt->fetch()){
		$em = $row['email'];
		addTaskAssignment($task_uid,$group_uid,$em);
	}
	
	// Link task.
	_createTaskLink($task_uid,'event',$event_uid);

}

function addEventTimePickTask($creator,$group_uid,$title,$event_uid){
	
	$task_title = "Pick Time for '".$title."'";
	
	
	$task_uid = addTask($creator,$task_title,"",$group_uid,$event_uid,true);
	
	addTaskAssignment($task_uid,$gropu_uid,$creator);
	
	// Link task.
	_createTaskLink($task_uid,'event_report',$event_uid);

}

function _checkEventCreator($email,$event_uid)
{
	$dbh = ConnectToDB();
	
	$sql = "
		SELECT event_uid FROM events
		WHERE email = ?
		AND event_uid = ?
	";
	
	$stmt = $dbh->prepare($sql);
	
	$stmt->execute(array($email,$event_uid));
	
	while($row = $stmt->fetch()){
		return true;
	}
	
	return false;	
}
	
function _chooseEventTime($group_uid, $event_uid, $start_time, $end_time)
{
	$dbh = ConnectToDB();
	
	$sql = "
		UPDATE events
		SET start_time = ?, end_time = ?
		WHERE group_uid = ?
		AND event_uid = ?
	";
	
	$stmt = $dbh->prepare($sql);
	
	$stmt->execute(array($start_time,$end_time,$group_uid,$event_uid));
	
	return;	
}


function _markPickTimeTaskComplete($email,$group_id,$event_id){
	
	$dbh = ConnectToDB();
	
	$sql = "
		UPDATE tasks_assignments
		SET is_completed = 1
		WHERE task_uid in (
			SELECT task_uid
			FROM tasks as t
			JOIN task_link as tl using (task_uid)
			WHERE tl.link_type = 'event_report'
			AND tl.link_id = ?
			AND t.group_uid = ?
		)
		AND email = ?
	";

	$stmt = $dbh->prepare($sql);
	
	$stmt->execute(array($event_id,$group_id,$email));
	
	return;
}

function _getEventTitleByID($event_uid){

	$dbh = ConnectToDB();
	
	$sql = "
		SELECT name FROM events
		WHERE event_uid = ?
	";
	
	$stmt = $dbh->prepare($sql);
	
	$stmt->execute(array($event_uid));
	
	while($row = $stmt->fetch()){
		return $row["name"];
	}
	
	return null;	
}


function chooseEventTime()
{
	// Get information.
	$email = sanitizeEmail( $_POST['email'] );
	$cookie = grHash($_POST['ac'],$email);
	$group_uid = $_POST['group_uid'];
	$event_uid = $_POST['event_uid'];
	$start_time = $_POST['start_time'];
	$end_time = $_POST['end_time'];
	
	if(!isset($group_uid)){ http_response_code(290); return; }
	if(!isset($event_uid)){ http_response_code(290); return; }
	if(!isset($start_time)){ http_response_code(290); return; }
	if(!isset($end_time)){ http_response_code(290); return; }
	
	
	// IF valid, continue.
	if(filter_var($email, FILTER_VALIDATE_EMAIL)){
		if(!verifyUserGroup($email,$cookie,$group_uid)) return;
		if(!_checkEventCreator($email,$event_uid)){ http_response(230); return; }
		
		// Choose Time
		_chooseEventTime($group_uid,$event_uid,$start_time,$end_time);
		_markPickTimeTaskComplete($email,$group_uid,$event_uid);
		
		// Notify.
		$event_title = _getEventTitleByID($event_uid);
		addEventUpdate($email,$group_uid,"chose a time for \"".$event_title."\"",$event_uid);
	}else{
		http_response_code(206);
		return;
	}	
}



?>