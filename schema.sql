DROP TABLE IF EXISTS movies;

CREATE TABLE IF NOT EXISTS movies(
    id SERIAL PRIMARY KEY,
    title VARCHAR(2550),
    poster_path VARCHAR(2550),
    overview VARCHAR(2550),
    textUser VARCHAR(2550) 
)