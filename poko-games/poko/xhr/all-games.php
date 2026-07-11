<?php
require_once '../config.php';
require_once '../app/includes/constant.php';
require_once '../app/includes/app_start.php';

$page = $_POST['page'] ?? 1;
$limit = 30;
$row = ($page - 1) * $limit;

$query = "SELECT * from zon_games order by id asc limit $row,$limit";
$run = mysqli_query($con, $query);
// $game = mysqli_fetch_all($run);

while ($game = mysqli_fetch_assoc($run)) {
    if ($zon['config']['theme'] === 'garud') { ?>
        <div class="game new__badges wow <?php echo $zon['config']['animate_class'] ?> ">
            <a href="<?= $site_url . 'game/' . makeSlug($game['game_name']) . '/' . $game['id'] ?>" class="game__thumb">
                <img src="<?= $game['game_image_url'] ?>" alt="<?= $game['game_name'] ?>" />
            </a>
            <a href="<?= $site_url . 'game/' . makeSlug($game['game_name']) . '/' . $game['id'] ?>" class="game_name">
                <?= $game['game_name'] ?>
            </a>
        </div>
    <?php } else { ?>
        <div class="rounded-lg wow <?php echo $zon['config']['animate_class'] ?> ">
            <div class="game-card w-full">
                <a href="<?php echo $site_url . 'game/' . makeSlug($game['game_name']) . '/' . $game['id'] ?>">
                    <img
                        src="<?php echo $game['game_banner_url'] == '' ? $game['game_image_url'] : $game['game_banner_url'] ?>" />
                </a>
                <div class="game-details gap-4">
                    <a href="<?php echo $site_url . 'game/' . makeSlug($game['game_name']) . '/' . $game['id'] ?>"
                        class="text-md line-clamp-2 font-semibold">
                        <?= $game['game_name'] ?>
                    </a>
                    <a style="color: var(--zon-muted-color);" class="text-sm"
                        href="<?php echo $site_url ?>category/?n=<?= urlencode($game['game_category']) ?>">
                        <?= $game['game_category'] ?>
                    </a>

                    <div
                        class="game-meta rounded-lg mt-3 w-fit bg-[var(--zon-gmeta-bg-color)] px-2 py-0.5 flex items-center gap-2">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="19px" height="19px" fill="none" stroke-width="1.1"
                                viewBox="0 0 24 24" color="#000000">
                                <path stroke="#000000" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"
                                    d="M17.5 17.5c2.5 3.5 6.449.915 5.5-2.5-1.425-5.129-2.2-7.984-2.603-9.492A2.032 2.032 0 0 0 18.438 4H5.562c-.918 0-1.718.625-1.941 1.515C2.78 8.863 2.033 11.802 1.144 15c-.948 3.415 3 6 5.5 2.5">
                                </path>
                                <path stroke="#000000" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"
                                    d="M16 4v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V4M8 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM16 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z">
                                </path>
                            </svg>
                        </span>
                        <span class="text-xs">
                            <?= $game['game_played'] ?> Plays
                        </span>
                    </div>
                </div>
            </div>
        </div>
    <?php } ?>
<?php } ?>