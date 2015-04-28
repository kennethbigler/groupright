<?php

include 'connect.php';
include 'server/system.php';

function _associatePic($email,$filename)
{
	$dbh = ConnectToDB();
	
	$sql = "
		UPDATE active_users
		SET photo_url = ?
		WHERE email = ?
	";
	
	$stmt = $dbh->prepare($sql);
	
	$full_filename = "https://www.groupright.net/_profiles/".$filename;
	$stmt->execute(array($full_filename,$email));
	
	return;
}

function associatePic(){
	global $prof_filepath;
	
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
		if(!checkHashedCookie($email,$cookie)){ return false; }
		$filename = grHash($email).".png";
		$good = uploadPic($filename);
		if($good){
			_associatePic($email,$filename);
			$prof_filepath = '_profiles/'.$filename;
		}
		return;
	}
	else {
		// maybe do something
		http_response_code(206);
		return;
	}		
}

function uploadPic($filename){
	
	global $msg;

	if($_FILES['profile_pic']['error'] > 0){
		$msg = ('An error occurred when uploading.');
		return false;
	}

	if(!getimagesize($_FILES['profile_pic']['tmp_name'])){
		$msg = ('Please ensure you are uploading an image.');
		return false;
	}

	if($_FILES['profile_pic']['type'] != "image/png"){
		$msg = ('Unsupported filetype uploaded.');
		return false;
	}

	if($_FILES['profile_pic']['size'] > 1000000){
		$msg = ('File uploaded exceeds maximum upload size.');
		return false;
	}

	if(!move_uploaded_file($_FILES['profile_pic']['tmp_name'],'_profiles/'.$filename))
	{
		$msg = ('Error uploading file - check destination.');
		return false;
	}

	$msg = ('File uploaded successfully');
	return true;
}

$msg = "";
$prof_filepath = "";

associatePic();

?>

<!doctype html>
<html lang="en">
	<head>
	<style>
		#profile{
			height:200px;
			width:200px;
			object-fit:cover;
			border-radius:50%;
		}
	</style>
	</head>
	
	<body>
		<h3><?php echo $msg; ?></h3>
		<img id="profile" src="<?php echo $prof_filepath ?>" />
	</body>
	
</html>