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

function _dropMember($group_uid,$email)
{
	$dbh = ConnectToDB();
	
	$sql = "
		DELETE FROM memberships
		WHERE group_uid = ?
		AND email = ?
	";
	
	$stmt = $dbh->prepare($sql);
	
	$stmt->execute(array($group_uid,$email));
	
	return;
}

function dropMember()
{
	$email = sanitizeEmail( $_POST['email'] );
	$cookie = grHash($_POST['ac'],$email);
	$group_uid = $_POST['group_uid'];
	$dropped = $_POST['dropped_member'];
	
	if(!isset($group_uid)){ http_response_code(290); return; }
	if(!isset($dropped)){ http_response_code(290); return; }

	if(filter_var($email, FILTER_VALIDATE_EMAIL)){
		if(!verifyUserGroup($email,$cookie,$group_uid)){ http_response_code(230); return; }
		if(_getRole($email,$group_uid) != "leader"){ http_response_code(240); return; }
		_dropMember($group_uid,$dropped);
	}else{
		http_response_code(206);
		return;
	}		
}

//----------------------------------------------------------------------------


function addMember()
{
	$email = sanitizeEmail( $_POST['email'] );
	$cookie = grHash($_POST['ac'],$email);
	$group_uid = $_POST['group_uid'];
	$added = $_POST['added_member'];
	
	if(!isset($group_uid)){ http_response_code(290); return; }
	if(!isset($added)){ http_response_code(290); return; }

	if(filter_var($email, FILTER_VALIDATE_EMAIL)){
		if(!verifyUserGroup($email,$cookie,$group_uid)){ http_response_code(230); return; }
		if(_getRole($email,$group_uid) != "leader"){ http_response_code(240); return; }
		_addMember($added,$group_uid,"member");
	}else{
		http_response_code(206);
		return;
	}	
}

//----------------------------------------------------------------------------

function _makeLeader($group_uid,$email)
{
	$dbh = ConnectToDB();
	
	$sql = "
		UPDATE memberships
		SET role = 'leader'
		WHERE group_uid = ?
		AND email = ?
		;
		UPDATE groups
		SET group_leader = ?
		WHERE group_uid = ?
	";
	
	$stmt = $dbh->prepare($sql);
	
	$stmt->execute(array($group_uid,$email,$email,$group_uid));
	
	return;	
}

function _makeMember($group_uid,$email)
{
	$dbh = ConnectToDB();
	
	$sql = "
		UPDATE memberships
		SET role = 'member'
		WHERE group_uid = ?
		AND email = ?
	";
	
	$stmt = $dbh->prepare($sql);
	
	$stmt->execute(array($group_uid,$email));
	
	return;	
}

function makeLeader()
{
	$email = sanitizeEmail( $_POST['email'] );
	$cookie = grHash($_POST['ac'],$email);
	$group_uid = $_POST['group_uid'];
	$newleader = $_POST['new_leader'];
	
	if(!isset($group_uid)){ http_response_code(290); return; }
	if(!isset($newleader)){ http_response_code(290); return; }

	if(filter_var($email, FILTER_VALIDATE_EMAIL)){
		if(!verifyUserGroup($email,$cookie,$group_uid)){ http_response_code(230); return; }
		if(_getRole($email,$group_uid) != "leader"){ http_response_code(240); return; }
		if(_getRole($newleader,$group_uid) == false){ http_response_code(250); return; }
		_makeLeader($group_uid,$newleader);
		_makeMember($group_uid,$email);
	}else{
		http_response_code(206);
		return;
	}	
}

?>