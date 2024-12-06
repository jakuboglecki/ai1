<?php

/** @var \App\Model\Album[] $albums */
/** @var \App\Service\Router $router */

$title = 'Album List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Albums List</h1>

    <a href="<?= $router->generatePath('album-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($albums as $album): ?>
            <li><h3><?= $album->getTitle() ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('album-show', ['id' => $album->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('album-edit', ['id' => $album->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
