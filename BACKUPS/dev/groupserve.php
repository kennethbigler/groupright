<?php

	function ConnectToDB(){
		$dbh = new PDO('mysql:host=localhost;dbname=GroupRight','pendingAdder','groupscoop10201');
		return $dbh;
	}
	
	include './server/system.php';
	include './server/login.php';
	include './server/signup.php';
	include './server/forgot.php';
	include './server/groups.php';
	include './server/user.php';
	
	include './server/events.php';
	include './server/tasks.php';

	
	
	header('Content-Type: text/plain; charset=utf-8');
	//---------------------------------------------------------------------------
	// INTERFACE (essentially)	
	
	$function = "";
	if(isset($_POST['function'])) $function = $_POST['function'];
	else{ http_response_code(299); }
	
	if($function == 'signup') 	signUp();
	if($function == 'login')	logIn();
	if($function == 'confirm_account') confirmAccount();
	if($function == 'remember_user') rememberUser();
	if($function == 'forgot') userForgotPassword();
	if($function == 'unlock_account') unlockAccount();
	if($function == 'reset_password') resetAccountPassword();
	if($function == 'logout_user') logoutUser();
	if($function == 'get_user_info') getUserInfo();
	if($function == 'create_group') makeGroup();
	if($function == 'create_fixed_event') createFixedEvent();
	if($function == 'create_votable_event') createVotableEvent();
	if($function == 'create_task') createTask();
	if($function == 'assign_task') assignTask();
	
?> 
