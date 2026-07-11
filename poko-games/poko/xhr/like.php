<?php
require_once '../config.php';
require_once '../app/includes/constant.php';
require_once '../app/includes/app_start.php';

$game_id = mysqli_real_escape_string($socket, $_POST['gi']);
$ui = $_SERVER['REMOTE_ADDR'];

if (num_rows(T_ZON_LIKES, "game_id=$game_id && user_ip='$ui'") > 0) {
    if (mysqli_query($socket, "DELETE FROM " . T_ZON_LIKES . " WHERE game_id=$game_id && user_ip='$ui' ")) {
        echo json_encode(["like" => formatNumber(num_rows(T_ZON_LIKES, "game_id=$game_id")), "dislike" => formatNumber(num_rows(T_ZON_DISLIKES, "game_id=$game_id"))]);
    }
} else {
    if (mysqli_query($socket, "INSERT INTO " . T_ZON_LIKES . " (user_ip, game_id) VALUES ('$ui', $game_id) ")) {
        mysqli_query($socket, "DELETE FROM " . T_ZON_DISLIKES . " WHERE game_id=$game_id && user_ip='$ui' ");
        echo json_encode(["like" => formatNumber(num_rows(T_ZON_LIKES, "game_id=$game_id")), "dislike" => formatNumber(num_rows(T_ZON_DISLIKES, "game_id=$game_id"))]);
    }
}