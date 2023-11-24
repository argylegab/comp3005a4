COMP3005 A4:  Database Interaction with PostgreSQL and Application Programming
Name: Argyle Tad-y
Student No. 101145909

How to Run:
Prerequisites: 
PostgreSQL installed on system: https://www.postgresql.org/download/
Node and NPM: https://nodejs.org/en/download

(1) Create the 'A4' database in PostgreSQL
    Run the DDL.sql File
    Run the insertInitData.sql File

(2) In the 'postgres-node' folder, within a terminal, type the command 'npm ci'. Then after, run the command 'node server.js'.
Then open http://127.0.0.1:3000/ on any browser.

Important Files / Directory:
- DDL.sql: creates table based on given schema
- insertInitData.sql: inserts initial data into students table
- server.js: the serverside code; this is what actually connects to the PostgreSQL database and queries it 
- resources:
-- app.js: client side code that sends requests to server and displays results onto DOM
-- app.css: client side styling
-- app.html: client side html page

Functions ():
- (app.js) getAllStudents(): sends a GET request to the server to query database to retrieve students table
- (app.js) addStudent(first_name, last_name, email, enrollment_date) sends a POST request to the server to add new student to database using INSERT
- (app.js) updateStudentEmail(student_id, new_email) sends a PUT request to the server to update a students email in the db given their student id
- (app.js) deleteStudent(student_id) sends a DELETE request to the server to delete a student fromt the databse given their id
- (app.js) initEventListeners() initializes the event listeners for the buttons
- (server.js) validateReqData() makes sure none of the inputs are empty from client

Video:
Google Drive URL: https://drive.google.com/file/d/1mq5EEYGYHWBQeCOBGsxQF-RW5OQSHGS1/view?usp=drive_link
Vimeo URL: https://vimeo.com/887844766?share=copy
- timestamps:
-- @ 0:03: Creating 'A4' db / Creating students table
-- @ 0:43: Initial data insertion
-- @ 1:20 Running the app and getAllStudents() functionality 
-- @ 2:35 Add student functionality
-- @ 3:52: updateStudentEmail() functionality
-- @ 4:50 deleteStudent() functionality
-- @ 5:34: Error Handling: Empty Fields & Non-existant Student IDs

Resources Used / Citations:
Youtube Video: https://www.youtube.com/watch?v=O4bNwkC1ZxA
Node article: https://node-postgres.com/features/queries
