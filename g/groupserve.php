<?php

	include 'connect.php';
	
	include './server/system.php';
	include './server/login.php';
	include './server/signup.php';
	include './server/forgot.php';
	include './server/groups.php';
	include './server/members.php';
	include './server/user.php';
	
	include './server/updates.php';
	
	include './server/events.php';
	include './server/tasks.php';
	include './server/messages.php';
	include './server/lists.php';
	
	include './server/availability.php';
	include './server/settings.php';

	
	header('Content-Type: text/plain; charset=utf-8');
	header('Cache-Control:no-cache');
	
	//---------------------------------------------------------------------------
	// INTERFACE (essentially)	

	$function = "";
	if(isset($_POST['function'])) $function = $_POST['function'];
	else{  
		echo "hello from groupright server.";
		flush();
		http_response_code(299); 
	}
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
	if($function == 'get_updated_info') getUpdatedInfo();
	if($function == 'create_group') makeGroup();
	if($function == 'create_fixed_event') createFixedEvent();
	if($function == 'create_votable_event') createVotableEvent();
	if($function == 'get_event_settings') getEventSettings();
	if($function == 'choose_event_time') chooseEventTime();
	if($function == 'create_task') createTask();
	if($function == 'assign_task') assignTask();
	if($function == 'mark_task_complete') completeTask();
	if($function == 'send_message') sendMessage();
	if($function == 'get_messages') getMessages();
	if($function == 'mark_messages_read') markMessagesRead();
	if($function == 'get_num_unread') getNumUnread();
	if($function == 'get_new_messages') getNewMessages();
	if($function == 'submit_availability') submitAvailability();
	if($function == 'get_availability_dump') getAvailabilityDump();
	
	if($function == 'reset_membership_colors') resetMembershipColors();
	if($function == 'change_name') changeName();
	if($function == 'change_password') changePassword();
	if($function == 'change_phone_number') changePhoneNumber();
	if($function == 'add_profile_pic') addProfilePic();
	if($function == 'get_account_info') getAccountInfo();
	if($function == 'create_list') createList();
	if($function == 'add_item_to_list') addListItem();
	if($function == 'remove_item') removeListItem();
	if($function == 'get_list_info') getListInfo();
	if($function == 'leave_group') leaveGroup();
	if($function == 'disband_group') disbandGroup();
	if($function == 'drop_member') dropMember();
	if($function == 'add_member') addMember();
	if($function == 'make_leader') makeLeader();
	
?> 
