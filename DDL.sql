CREATE TABLE students( 
student_id SERIAL PRIMARY KEY,
first_name text NOT NULL,
last_name text NOT NULL,
email text NOT NULL UNIQUE,
enrollment_date date
);