<?php
/* members.php
*		Handles membership-related ordeals (extension of groups.php)...
*/

function _leaveGroup($email,$group_uid)
{
	$dbh = ConnectToDB();
	
	$sql = "
		DELETE FROM memberships
		WHERE email = ?
		AND group_uid = ?
	";
	
	$stmt = $dbh->prepare($sql);
	
	$stmt->execute(array($email,$group_uid));
	
	return;
}

function leaveGroup()
{
	$email = sanitizeEmail( $_POST['email'] );
	$cookie = grHash($_POST['ac'],$email);
	$group_uid = $_POST['group_uid'];
	
	if(!isset($group_uid)){ http_response_code(290); return; }
	
	if(filter_var($email, FILTER_VALIDATE_EMAIL)){
		if(!verifyUserGroup($email,$cookie,$group_uid)) return;
		if(_getRole($email,$group_uid) == "leader"){ http_response_code(240); return; }
		_leaveGroup($email,$group_uid);
	}else{
		http_response_code(206);
		return;
	}	
}

//----------------------------------------------------------------------------

function _disbandGroup($group_uid)
{
	$dbh = ConnectToDB();
	
	$sql = "
		DELETE FROM memberships
		WHERE group_uid = ?
	";
	
	$stmt = $dbh->prepare($sql);
	
	$stmt->execute(array($group_uid));
	
	return;
}

function disbandGroup()
{
	$email = sanitizeEmail( $_POST['email'] );
	$cookie = grHash($_POST['ac'],$email);
	$group_uid = $_POST['group_uid'];
	
	if(!isset($group_uid)){ http_response_code(290); return; }

	if(filter_var($email, FILTER_VALIDATE_EMAIL)){
		if(!verifyUserGroup($email,$cookie,$group_uid)){ http_response_code(230); return; }
		if(_getRole($email,$group_uid) != "leader"){ http_response_code(240); return; }
		_disbandGroup($group_uid);
	}else{
		http_response_code(206);
		return;
	}	
}

//----------------------------------------------------------------------------

?>