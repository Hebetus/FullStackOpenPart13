CREATE TABLE blogs (id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes integer DEFAULT 0);
insert into blogs (author, url, title) values ('Emil Hellberg', 'http://localhost:3000', 'My first blogpost');
insert into blogs (author, url, title) values ('Emil Hellberg', 'http://localhost:3000', 'My second blogpost');