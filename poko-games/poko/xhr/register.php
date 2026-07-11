<?php
require_once '../config.php';
require_once '../app/includes/constant.php';
require_once '../app/includes/app_start.php';
// require_once '../app/includes/genera.php';

// print_r($_POST);

if (isset($_POST['signup']) && isset($_POST)) {


    $name = mysqli_real_escape_string($con, $_POST['name']);
    $email = mysqli_real_escape_string($con, $_POST['email']);
    $username = mysqli_real_escape_string($con, $_POST['username']);
    $password = mysqli_real_escape_string($con, $_POST['password']);


    $message = "All Input Field are required";
    
    if (!empty($name) && !empty($email) && !empty($username) && !empty($password)) {
        if (num_rows(T_ZON_USERS, "email='$email'") > 0) {
            echo "Email Already Exist";
        } else if (num_rows(T_ZON_USERS, "username='$username'") > 0) {
            echo "Username Already Exist";
        } else {
            $user_pic = "user_pic.png";
            $query = "INSERT INTO zon_users (`name`, `email`, `username`, `password`, `user_pic`, `status`, `is_admin`) VALUES ('$name', '$email', '$username', '$password', '$user_pic', 0, 0) ";
            if (mysqli_query($con, $query)) {
                $_SESSION['Loggedin'] = true;
                $_SESSION['Loggedin_user'] = $username;
                echo "You registered successfully.";
            }
        }
    } else {
        echo $message;
    }
}