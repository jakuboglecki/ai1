<?php

/** @var \App\Model\Album $album */
/** @var \App\Service\Router $router */

$title = "Edit Album {$album->getTitle()} ({$album->getId()})";
$bodyClass = "edit";

ob_start(); ?>
    <h1><?= $title ?></h1>
    <form action="<?= $router->generatePath('album-edit') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="album-edit">
        <input type="hidden" name="id" value="<?= $album->getId() ?>">
    </form>

    <ul class="action-list">
        <li>
            <a href="<?= $router->generatePath('album-index') ?>">Back to list</a></li>
        <li>
            <form action="<?= $router->generatePath('album-delete') ?>" method="post">
                <input type="submit" value="Delete" onclick="return confirm('Are you sure?')">
                <input type="hidden" name="action" value="album-delete">
                <input type="hidden" name="id" value="<?= $album->getId() ?>">
            </form>
        </li>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
