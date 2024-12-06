<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Album;
use App\Service\Router;
use App\Service\Templating;

class AlbumController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $albums = Album::findAll();
        $html = $templating->render('album/index.html.php', [
            'albums' => $albums,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestPost, Templating $templating, Router $router): ?string
    {
        if ($requestPost) {
            $album = Album::fromArray($requestPost);
            // @todo missing validation
            $album->save();

            $path = $router->generatePath('album-index');
            $router->redirect($path);
            return null;
        } else {
            $album = new Album();
        }

        $html = $templating->render('album/create.html.php', [
            'album' => $album,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $albumId, ?array $requestPost, Templating $templating, Router $router): ?string
    {
        $album = Album::find($albumId);
        if (! $album) {
            throw new NotFoundException("Missing album with id $albumId");
        }

        if ($requestPost) {
            $album->fill($requestPost);
            // @todo missing validation
            $album->save();

            $path = $router->generatePath('album-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('album/edit.html.php', [
            'album' => $album,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $albumId, Templating $templating, Router $router): ?string
    {
        $album = Album::find($albumId);
        if (! $album) {
            throw new NotFoundException("Missing album with id $albumId");
        }

        $html = $templating->render('album/show.html.php', [
            'album' => $album,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $albumId, Router $router): ?string
    {
        $album = Album::find($albumId);
        if (! $album) {
            throw new NotFoundException("Missing album with id $albumId");
        }

        $album->delete();
        $path = $router->generatePath('album-index');
        $router->redirect($path);
        return null;
    }
}
