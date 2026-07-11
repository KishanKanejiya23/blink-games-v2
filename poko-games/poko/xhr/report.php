<?php
require_once '../config.php';
require_once '../app/includes/constant.php';
require_once '../app/includes/app_start.php';

if (isset($_POST) && !empty($_POST)) {
    if (isset($_POST['problem']) && !empty($_POST['problem'])) {
        $game_name = $_POST['game_name'];
        $report_sub = mysqli_real_escape_string($socket, htmlspecialchars($_POST['problem']));
        $game_id = $_POST['game_id'];
        if (mysqli_query($socket, "INSERT INTO " . T_ZON_REPORTS . " (game_name, report_subject, game_id) VALUES ('$game_name', '$report_sub', $game_id) ")) {
            echo 1;
        }
    }
} else {
    echo "error";
}