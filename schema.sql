CREATE TABLE IF NOT EXISTS city(
id SERIAL PRIMARY KEY,
search_query VARCHAR(255),
formatted_query VARCHAR (255),
latitude BIGINT,
longitude BIGINT
);

-- CREATE TABLE IF NOT EXISTS weather(
-- id SERIAL PRIMARY KEY,
-- forcast VARCHAR (255),
-- time VARCHAR(255),
-- created_at BIGINT,
-- location_id NOT NULL,
-- );


-- CREATE TABLE IF NOT EXISTS events(
-- id SERIAL PRIMARY KEY,
-- link TEXT,
-- event_name VARCHAR(255),
-- event_date VARCHAR(255),
-- event_summary TEXT,
-- );

