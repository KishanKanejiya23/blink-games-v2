<?php
require_once '../config.php';
require_once '../app/includes/constant.php';
require_once '../app/includes/app_start.php';
require_once '../app/includes/function_general.php';

// change profile setting action 
if (isset($_POST['change_settings'])) {

    // $url = Secure_DATA($_GET['url']);
    $name = Secure_DATA($_POST['name']);
    $id = Secure_DATA($_POST['change_settings']);
    $username = Secure_DATA($_POST['username']);
    $email = Secure_DATA($_POST['email']);
    $password = Secure_DATA($_POST['new_password']);

    $user_pic = '';

    $query = "UPDATE zon_users set `name`='$name', `email`='$email', `username`='$username' where id=$id";

    if ($_FILES['avatar_img']) {
        $user_pic = rand(111111111, 999999999) . $_FILES['avatar_img']['name'];
        if (move_uploaded_file($_FILES['avatar_img']['tmp_name'], "../static/img/" . $user_pic)) {

        }
    }

    if (!empty($password)) {
        $query = "UPDATE zon_users set `name`='$name', `email`='$email', `username`='$username', `password`='$password' where id=$id";
    } else {
        if ($_FILES['avatar_img']['error'] == 0) {
            $query = "UPDATE zon_users set `name`='$name', `email`='$email', `username`='$username', `user_pic`='$user_pic' where id=$id";
        }
    }

    if ($_FILES['avatar_img']['error'] == 0 && !empty($password)) {
        $query = "UPDATE zon_users set `name`='$name', `email`='$email', `username`='$username', `password`='$password', `user_pic`='$user_pic' where id=$id";
    }

    if ($username !== $zon['user']['username']) {
        if (num_rows(T_ZON_USERS, "username='$username'") > 0) {
            echo "Username is a Exist.";
        } else {
            if (mysqli_query($con, $query)) {
                // @header("location: $url");
                echo "Profile updated successfully";
            }
        }
    } else {
        if (mysqli_query($con, $query)) {
            // @header("location: $url");
            echo "Profile updated successfully";
        }
    }

}
