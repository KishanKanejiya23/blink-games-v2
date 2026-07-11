<?php
require_once '../config.php';
require_once '../app/includes/constant.php';
require_once '../app/includes/app_start.php';

$email_username = mysqli_real_escape_string($con, $_POST['usernameEmail']);
$password = mysqli_real_escape_string($con, $_POST['password']);
// $user_id = mysqli_real_escape_string($con, $_POST['id']);

$query = "select * from zon_users where (email='$email_username' || username='$email_username') && password='$password'";
$row = mysqli_fetch_assoc(mysqli_query($con, $query));
if (mysqli_num_rows(mysqli_query($con, $query)) !== 0) {

    if ($row['status'] == 0) {
        $_SESSION['Loggedin'] = true;
        $_SESSION['Loggedin_user'] = $email_username;

        if ($row['is_admin'] == 1) {
            $_SESSION['is_admin_Loggedin'] = true;
        }

        $user_data = mysqli_fetch_assoc(mysqli_query($con, "select * from zon_users where username='$email_username' || email='$email_username'"));

        $_SESSION['Loggedin_user_id'] = $user_data['id'];

        // @header("Location: ../");
        echo "You loggedin successfully.";

    } else {
        echo "Your account is closed.";
        // @header("Location: ../login?error=Your account is closed");
    }
} else {
    echo "Wrong username or email and password";
    // @header("Location: ../login?error=Wrong username or email and password");
}
?>