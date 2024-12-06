<?php

/** @var \App\Model\Album $album */
/** @var \App\Service\Router $router */

$title = 'Create Album';
$bodyClass = "edit";

ob_start(); ?>
    <h1>Create Album</h1>
    <form action="<?= $router->generatePath('album-create') ?>" method="post" class="edit-form">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="album-create">
    </form>

    <a href="<?= $router->generatePath('album-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
