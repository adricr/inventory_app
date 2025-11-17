DROP TABLE IF EXISTS property;
DROP TABLE IF EXISTS room;
DROP TABLE IF EXISTS item;
DROP TABLE IF EXISTS report;
DROP TABLE IF EXISTS user;

CREATE TABLE property (
  id INTEGER PRIMARY KEY,
  number INTEGER NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  postcode TEXT NOT NULL,
  image_url TEXT,
  tenant_name TEXT NOT NULL,
  landlord_name TEXT NOT NULL
);

CREATE TABLE room (
  id INTEGER PRIMARY KEY,
  property_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  descr TEXT,
  FOREIGN KEY(property_id) REFERENCES property (id)
);

CREATE TABLE item (
  id INTEGER PRIMARY KEY,
  room_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  FOREIGN KEY(room_id) REFERENCES room (id)
);

CREATE TABLE report (
  id INTEGER PRIMARY KEY,
  property_id INTEGER NOT NULL,
  data BLOB,
  FOREIGN KEY(property_id) REFERENCES property (id)
);

CREATE TABLE user(
  id INTEGER PRIMARY KEY,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL
);