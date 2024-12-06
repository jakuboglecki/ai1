<?php

/** @var \App\Model\Album $album */
/** @var \App\Service\Router $router */

$title = "{$album->getTitle()} ({$album->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $album->getTitle() ?></h1>
    <p><strong>Artist:</strong> <?= $album->getArtist(); ?></p>
    <p><strong>Release Date:</strong> <?= $album->getReleaseDate(); ?></p>
    <p><strong>Genre:</strong> <?= $album->getGenre(); ?></p>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('album-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('album-edit', ['id'=> $album->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
