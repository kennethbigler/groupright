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
	global $msg, $prof_filepath;
	
	// Get Data
	$email = sanitizeEmail($_POST['email']);
	$cookie = $_POST['ac'];
	
	// Initialize info obj.
	$user_info = array();
	
	// Fix cookie.
	$cookie = grHash($cookie,$email);
	
	// If valid, continue.
	if(filter_var($email, FILTER_VALIDATE_EMAIL)) {
		//echo $email;
		if(!checkHashedCookie($email,$cookie)){ 
			$msg = "Bad cookie.";
			return false;
		}
		$filename = grHash($email);
		$good = uploadPic($filename);
		if($good){
			_associatePic($email,$good);
			$prof_filepath = '../_profiles/'.$good;
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
		return null;
	}

	if(!getimagesize($_FILES['profile_pic']['tmp_name'])){
		$msg = ('Please ensure you are uploading an image.');
		return null;
	}
	
	$ftype = $_FILES['profile_pic']['type'];
	$ext = null;
	if($ftype == "image/png") $ext = ".png";
	if($ftype == "image/jpg" || $ftype == "image/jpeg") $ext = ".jpg";
	if($ftype == "image/bmp") $ext = ".bmp";


	if(!ext){
		$msg = ('Unsupported filetype uploaded.');
		return null;
	}

	if($_FILES['profile_pic']['size'] > 1000000){
		$msg = ('File uploaded exceeds maximum upload size.');
		return null;
	}

	if(!move_uploaded_file($_FILES['profile_pic']['tmp_name'],'../_profiles/'.$filename.$ext))
	{
		$msg = ('Error uploading file - check destination.');
		return null;
	}

	$msg = ('File uploaded successfully');
	return $filename.$ext;
}

$msg = "";
$prof_filepath = "";

associatePic();

?>

<!doctype html>
<html lang="en">
	<head>
	<link rel="stylesheet" href="css/bootstrap.min.css" />
	<style>
		body{
			background:#EEE;
		}
		#mydiv{
			width:340px;
			margin:auto; 
			background:#FFF;
			padding-bottom:20px;
		}
		h3{
			text-align:center;
			margin:0;
			padding:20px;
			background-color:#00A1D9;
		}
		#profile{
			height:200px;
			width:200px;
			margin:30px 70px;
			object-fit:cover;
			border-radius:50%;
		}
		
	</style>
	</head>
	
	<body>
		<div id="mydiv" class="container-fluid">
			<div class="row">
				<h3 style="color:white;"><?php echo $msg; ?></h3>
			</div>
			<div class="row">
			<img id="profile" src="<?php echo $prof_filepath ?>" />
			</div>
			<div class="row">
				<div class="col-sm-12">
					<button class="btn btn-block btn-info" onclick="window.close()" >Back</button>
				</div>
			</div>
		</div>
	</body>
	
</html>