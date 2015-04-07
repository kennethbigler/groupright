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
	
	include './server/updates.php';
	
	include './server/events.php';
	include './server/tasks.php';
	include './server/messages.php';
	
	include './server/availability.php';
	include './server/settings.php';

	
	
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
	if($function == 'get_user_info') getUserInfo(true);
	if($function == 'get_user_groups') getUserInfo(false);
	if($function == 'get_group_members') getGroupMembers();
	if($function == 'create_group') makeGroup();
	if($function == 'create_fixed_event') createFixedEvent();
	if($function == 'create_votable_event') createVotableEvent();
	if($function == 'get_event_settings') getEventSettings();
	if($function == 'create_task') createTask();
	if($function == 'assign_task') assignTask();
	if($function == 'mark_task_complete') completeTask();
	if($function == 'send_message') sendMessage();
	if($function == 'get_messages') getMessages();
	if($function == 'submit_availability') submitAvailability();
	if($function == 'reset_membership_colors') resetMembershipColors();
	
?> 
