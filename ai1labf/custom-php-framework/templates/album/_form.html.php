<?php
/** @var $album ?\App\Model\Album */
?>

<div class="form-group">
    <label for="title">Title</label>
    <input type="text" id="title" name="album[title]" value="<?= $album ? $album->getTitle() : '' ?>">
</div>

<div class="form-group">
    <label for="artist">Artist</label>
    <input type="text" id="artist" name="album[artist]" value="<?= $album ? $album->getArtist() : '' ?>">
</div>

<div class="form-group">
    <label for="release_date">Release Date</label>
    <input type="text" id="release_date" name="album[release_date]" value="<?= $album ? $album->getReleaseDate() : '' ?>">
</div>

<div class="form-group">
    <label for="genre">Genre</label>
    <input type="text" id="genre" name="album[genre]" value="<?= $album ? $album->getGenre() : '' ?>">
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
