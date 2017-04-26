<?php

header('Content-Type: application/json');

$con = mysqli_connect("127.0.0.1","cpuproj","password","cpupassword");

// Check connection
if (mysqli_connect_errno($con))
{
    echo "Failed to connect to DataBase: " . mysqli_connect_error();
}else
{
    $data_points = array();
    
    $result = mysqli_query($con, "SELECT * FROM observations");
    
    while($row = mysqli_fetch_array($result))
    {        
        $point = array("hostname" => $row['hostname'] , "cpu0" => $row['cpu0'] , "cpu1" => $row['cpu1'] , "cpu2" => $row['cpu2'] , "cpu3" => $row['cpu3'] , "cpu4" => $row['cpu4'] , "cpu5" => $row['cpu5'] , "cpu6" => $row['cpu6'] , "cpu7" => $row['cpu7']);
        
        array_push($data_points, $point);        
    }
    
    echo json_encode($data_points, JSON_NUMERIC_CHECK);
}
mysqli_close($con);

?>