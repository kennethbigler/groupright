<?php
$servername = "localhost";
$username = "groupstore";
$password = "grouptest10201";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
echo "Connected successfully";

?>

<html>
<head>
</head>

<body>
<p> This is a paragraph </p>
<body>
</html>
