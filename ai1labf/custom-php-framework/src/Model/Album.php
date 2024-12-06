<?php
namespace App\Model;

use App\Service\Config;

class Album
{
    private ?int $id = null;
    private ?string $title = null;
    private ?string $artist = null;
    private ?string $releaseDate = null;
    private ?string $genre = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Album
    {
        $this->id = $id;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): Album
    {
        $this->title = $title;

        return $this;
    }

    public function getArtist(): ?string
    {
        return $this->artist;
    }

    public function setArtist(?string $artist): Album
    {
        $this->artist = $artist;

        return $this;
    }

    public function getReleaseDate(): ?string
    {
        return $this->releaseDate;
    }

    public function setReleaseDate(?string $releaseDate): Album
    {
        $this->releaseDate = $releaseDate;

        return $this;
    }

    public function getGenre(): ?string
    {
        return $this->genre;
    }

    public function setGenre(?string $genre): Album
    {
        $this->genre = $genre;

        return $this;
    }

    public static function fromArray($array): Album
    {
        $album = new self();
        $album->fill($array);

        return $album;
    }

    public function fill($array): Album
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['title'])) {
            $this->setTitle($array['title']);
        }
        if (isset($array['artist'])) {
            $this->setArtist($array['artist']);
        }
        if (isset($array['release_date'])) {
            $this->setReleaseDate($array['release_date']);
        }
        if (isset($array['genre'])) {
            $this->setGenre($array['genre']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM album';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $albums = [];
        $albumsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($albumsArray as $albumArray) {
            $albums[] = self::fromArray($albumArray);
        }

        return $albums;
    }

    public static function find($id): ?Album
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM album WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $albumArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (!$albumArray) {
            return null;
        }
        $album = Album::fromArray($albumArray);

        return $album;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (!$this->getId()) {
            $sql = "INSERT INTO album (title, artist, release_date, genre) VALUES (:title, :artist, :release_date, :genre)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':title' => $this->getTitle(),
                ':artist' => $this->getArtist(),
                ':release_date' => $this->getReleaseDate(),
                ':genre' => $this->getGenre(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE album SET title = :title, artist = :artist, release_date = :release_date, genre = :genre WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':title' => $this->getTitle(),
                ':artist' => $this->getArtist(),
                ':release_date' => $this->getReleaseDate(),
                ':genre' => $this->getGenre(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM album WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setTitle(null);
        $this->setArtist(null);
        $this->setReleaseDate(null);
        $this->setGenre(null);
    }
}
