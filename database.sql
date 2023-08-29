\echo 'Delete and recreate movies database?'
\prompt 'Return for yes or control+C to cancel > ' yes

DROP DATABASE movies;
CREATE DATABASE movies;
\connect movies

\i database-schema.sql

\echo 'Delete and recreate movies_test database?'
\prompt 'Return for yes or control+C to cancel > ' yes

DROP DATABASE movies_test;
CREATE DATABASE movies_test;
\connect movies_test

\i database-schema.sql