<?php
	include_once "include.php";
	$host = $_GET['host'];
	$sql = "SELECT * FROM `observations` WHERE `host` = \'$host\'";
	$result = mysqli_query($conn, $sql);
	if($result == true){
		$resultArray = array();
		$tempArray = array();
		while($row = $result->fetch_object()){
			$tempArray = $row;
			array_push($resultArray, $tempArray);
		}
	}
?>
