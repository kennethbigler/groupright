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
				date,
				start_time,
				end_time,
				score) VALUES (?,?,?,?,?,?)";
	$stmt = $dbh->prepare( $sql );
	
	$scores = array(0=>0,1=>5,2=>20,3=>50);
	
	for($i = 0; $i < sizeof($avail); $i++){
		if(!isset($avail[$i]["date"])){ http_response_code(298); return; }
		if(!isset($avail[$i]["start_time"])){ http_response_code(298); return; }
		if(!isset($avail[$i]["end_time"])){ http_response_code(298); return; }
		if(!isset($avail[$i]["score"])){ http_response_code(298); return; }
		$score = $scores[$avail[$i]["score"]];
		if(!isset($score)){ http_response_code(298); return; }
		
		$arr = array($event_uid,$email,
						$avail[$i]["date"],
						$avail[$i]["start_time"],
						$avail[$i]["end_time"],
						$score);
		
		$stmt->execute($arr);		
	}
	return;
}

function submitAvailability(){
	
	// Get information.
	$email = sanitizeEmail( $_POST['email'] );
	$cookie = grHash($_POST['cookie'],$email);
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
		//http_response_code(200);
	}else{
		http_response_code(206);
		return;
	}
	
}





?>