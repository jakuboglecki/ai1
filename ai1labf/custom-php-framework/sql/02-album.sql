create table album
(
    id          integer not null
        constraint album_pk
            primary key autoincrement,
    title       text not null,
    artist      text not null,
    release_date text,
    genre       text
);
