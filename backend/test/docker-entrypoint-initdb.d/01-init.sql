CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Таблицы создаются в существующей БД (prac)
CREATE TABLE public.films (
    id          uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    rating      double precision NOT NULL,
    director    varchar NOT NULL,
    tags        text[] NOT NULL,
    image       varchar NOT NULL,
    cover       varchar NOT NULL,
    title       varchar NOT NULL,
    about       varchar NOT NULL,
    description varchar NOT NULL
);

CREATE TABLE public.schedules (
    id       uuid DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
    daytime  varchar NOT NULL,
    hall     integer NOT NULL,
    rows     integer NOT NULL,
    seats    integer NOT NULL,
    price    double precision NOT NULL,
    taken    text NOT NULL,
    "filmId" uuid REFERENCES public.films
);