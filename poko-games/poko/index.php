<?php
// +------------------------------------------------------------------------+
// | @author: 
// | @name: The Arcade Online HTML5 Game Playing Platform
// | @author_email: 
// | @version: 1.0v
// +------------------------------------------------------------------------+
// | The Arcade Online HTML5 Game Playing Platform
// | Copyright (c) 2024 . All rights reserved.
// +------------------------------------------------------------------------+

require_once 'app/init.php';

$poko['content'] = LoadFile('home/content');

if ($zon['page'][0] === '') {
    $poko['content'] = LoadFile('home/content');
    if (isset($zon['page'][1])) {
    $game_name = str_replace("-", " ", $zon['page'][1]);
    $poki['game_data'] = dataBy("SELECT * FROM zon_games WHERE game_name='$game_name'")[0];
    }
} else if ($zon['page'][0] === 'g') {
    $poko['content'] = LoadFile('game/content');
} else if ($zon['page'][0] === 'c') {
    $poko['content'] = LoadFile('page/content');
} else if (count($zon['page']) == 1 && isCategory($zon['page'][0])) {
    $poko['content'] = LoadFile('category/content');
} else if ($zon['page'][0] === 'login') {
    $poko['content'] = LoadFile('login/content');
} else if ($zon['page'][0] === 'sitemap.xml') {
    $poko['content'] = LoadFile('sitemap/content');
}else if ($zon['page'][0] === '404') {
    $poko['content'] = LoadFile('404/content');
} else {
    $poko['content'] = LoadFile('404/content');
    echo "<script>window.location.href = '/404'</script>";
    // header("Location: " . url() . "/404");
}

echo LoadFile('container');