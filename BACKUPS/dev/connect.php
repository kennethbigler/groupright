<?php
	function ConnectToDB(){
		$dbh = new PDO('mysql:host=localhost;dbname=GroupRight','groupstore','H3y45QD+8VOi');
		return $dbh;
	}
	
	$GR_DIR = "/dev";
?>