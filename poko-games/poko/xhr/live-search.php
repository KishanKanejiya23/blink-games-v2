<?php
require_once '../config.php';
require_once '../app/includes/constant.php';
require_once '../app/includes/app_start.php';

$s = $_POST['query'] ?? '';
$limit = 20;
// $row = ($page - 1) * $limit;

// $query = "SELECT * from zon_games WHERE game_name LIKE '%$s%' limit $row,$limit";
// $run = mysqli_query($con, $query);

if (num_rows(T_ZON_GAMES, " game_name LIKE '%$s%' ") > 0) {
    foreach (getGamesByQuery($s, $limit) as $game) { ?>
        <div class="m-game-card">
            <a class="m-game-link" href="<?= $site_url ?>g/<?= makeSlug($game['game_name']) ?>">
                <picture style="background-image: url('<?= $game['game_image_url'] ?>')" class="m-game-thumbnail">
                    <div class="m-game-details">
                        <p>
                            <?= $game['game_name'] ?>
                        </p>
                    </div>
                </picture>
            </a>
        </div>
    <?php }
} else {
    echo 0;
} ?>