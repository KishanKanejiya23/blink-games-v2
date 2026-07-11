<?php
header('Content-type: application/xml');
echo '<?xml version="1.0" encoding="UTF-8"?>
<urlset  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';
require_once("app/init.php");
$game_query = "select * from zon_games order by id desc limit 2000";
$blog_query = "select * from zon_blog order by id desc limit 2000";
$pages_query = "select * from zon_pages order by id desc limit 2000";
$run = mysqli_query($con, $game_query);
$bsql = mysqli_query($con, $blog_query);
$pages_sql = mysqli_query($con, $pages_query);
// while ($row = mysqli_fetch_assoc($run)) { 
?>
<?php 
while ($row = mysqli_fetch_assoc($bsql)) { 
?>
<url>
<loc><?= $site_url . 'blog/' . makeSlug($row['blog_title']) . '/' . $row['id'] ?></loc>
<lastmod><?php echo date('Y-m-d'); ?></lastmod>
<changefreq>daily</changefreq>
<priority>1.0</priority>
</url>
<?php } ?>

<?php while ($row = mysqli_fetch_assoc($run)) {  ?>
<url>
<loc><?= $site_url . 'g/' . makeSlug($row['game_name']) ?></loc>
<lastmod><?php echo date('Y-m-d'); ?></lastmod>
<changefreq>daily</changefreq>
<priority>1.0</priority>
</url>
<?php } ?>
<?php while ($row = mysqli_fetch_assoc($pages_sql)) {  ?>
<url>
<loc><?= $site_url . 'c/' . makeSlug($row['title']) ?></loc>
<lastmod><?php echo date('Y-m-d'); ?></lastmod>
<changefreq>daily</changefreq>
<priority>1.0</priority>
</url>
<?php } ?>
<?php  echo '</urlset>'; ?>