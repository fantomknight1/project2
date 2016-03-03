DROP TABLE IF EXISTS users;

CREATE TABLE users (
  user_id SERIAL UNIQUE PRIMARY KEY,
  codename VARCHAR(255),
  email VARCHAR(255),
  password_digest TEXT
);

CREATE TABLE events (
  event_id SERIAL UNIQUE PRIMARY KEY,
  type_id integer,
  threat_event_id integer REFERENCES threat_level (threat_level_id),
  event_date date,
  user_id integer REFERENCES users (user_id),
);
CREATE TABLE event_type(
  event_type_id SERIAL UNIQUE PRIMARY KEY,
  event_type_name VARCHAR(25)
)
CREATE TABLE threat_level(
  threat_level_id SERIAL UNIQUE PRIMARY KEY,
  threat_level_value integer,
);

CREATE TABLE event_type_join(
  event_id integer REFERENCES events,
  event_type_id integer REFERENCES event_type,
  PRIMARY KEY(event_id, event_type_id)
)
-- CREATE TABLE threat_event_join (
--   event_id integer REFERENCES events,
--   threat_level_id integer REFERENCES threat_level
--   PRIMARY KEY(event_id, threat_level_id)
-- )
