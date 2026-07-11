<?php
require_once '../config.php';
require_once '../app/includes/constant.php';
require_once '../app/includes/app_start.php';

function getMoreCategories($l)
{
    global $socket;
    $query = "SELECT * FROM zon_category ORDER BY id DESC LIMIT $l";
    $game_sql = $socket->query($query);
    $data = [];
    while ($row = $game_sql->fetch_assoc()) {
        $data[] = $row;
    }
    
    return $data;
    
}

$page = $_POST['page'] ?? 1;
$limit = 8;
$row = ($page - 1) * $limit - $limit;

// echo $row;

foreach (getMoreCategories(" $row, $limit ") as $category) {
    $total_games = num_rows(T_ZON_GAMES, "game_category='" . $category['name'] . "'");
    // if ($total_games > 0) {
        ?>
        <li>
            <a href="<?php echo $site_url . 'category/?n=' . urlencode($category['name']); ?>" class="flex items-center gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="19px" height="19px" fill="none" stroke-width="1.1"
                    viewBox="0 0 24 24" color="#000000">
                    <path style="stroke: var(--zon-common-text-color);" stroke="#000000" stroke-width="1.1"
                        d="M2 17V7a4 4 0 0 1 4-4h3.9a.6.6 0 0 1 .6.6v16.8a.6.6 0 0 1-.6.6H6a4 4 0 0 1-4-4Z"></path>
                    <path style="stroke: var(--zon-common-text-color);" fill="#000000" stroke="#000000" stroke-width="1.1"
                        stroke-linecap="round" stroke-linejoin="round"
                        d="M6.5 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM17.5 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
                    <path style="stroke: var(--zon-common-text-color);" stroke="#000000" stroke-width="1.1"
                        d="M22 17V7a4 4 0 0 0-4-4h-3.9a.6.6 0 0 0-.6.6v16.8a.6.6 0 0 0 .6.6H18a4 4 0 0 0 4-4Z"></path>
                </svg>
                <div class="text">
                    <span class="capitalize text-md">
                        <?= str_replace("-", " ", $category['name'])  ?>
                    </span>
                    <p style="color: var(--zon-muted-color)" class="text-xs">
                        <?php echo $total_games ?> Games
                    </p>
                </div>
            </a>
        </li>
    <?php // }
} ?>