const { query } = require('express');
const path = require('path');
const http = require("http");
const fs = require("fs");

const resourcesPathString = "../postgres-node/resources/";

require('dotenv').config({
    override: true,
    path: path.join(__dirname, 'development.env')
});

const {Pool, Client} = require('pg');

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT
});

const error_mssgs = { // error mssgs to send back to client
	0: "Please ensure that there is a value for First Name, Last Name, Email, and Enrollment Date",
	1: "Could not find a student in database with that student ID.",
	2: "Something went wrong while inserting this into the database."
};


function validateReqData(reqDataObj){
	reqDataArr = [];
	for (const key of Object.keys(reqDataObj)){
		reqDataArr.push(reqDataObj[key]);
	}

	for(newDataItem of reqDataArr){
		if(newDataItem.length == 0){
			console.log("Some input has length of 0" + newDataItem);
			return false
		}
	}
	return true;
}


const server = http.createServer(function (request, response) {
	console.log(request.url);
	let receivedData = "";

	request.on("data", function(chunk) {
		receivedData += chunk
	});
	request.on("end", function() {

		if(request.method === "GET"){
			if(request.url === "/"){
				fs.readFile(resourcesPathString + "app.html", function(err, data){
					if(err){
						console.log(err);
						response.statusCode = 500;
						response.write("Server error.");
						response.end();
						return;
					}
					response.statusCode = 200;
					response.setHeader("Content-Type", "text/html");
					response.write(data);
					response.end();
				});

			// GET: ALL STUDENTS
			}else if(request.url === "/allStudents"){

				(async () => {
					const client = await pool.connect();
					try {
						const {rows} = await client.query('SELECT * FROM students');
						resultRows = rows;
						response.statusCode = 200;
						response.setHeader("Content-Type", "application/json");
						response.end(JSON.stringify(resultRows));
					return;
				
					} catch (err) {
						console.error(err);
					} finally {
						client.release();
					}
				})();
			// GET: app.js / script that powers client app
			}else if(request.url === "/app.js"){
				fs.readFile(resourcesPathString + "app.js", function(err, data){
					if(err){
						response.statusCode = 500;
						response.write("Server error.");
						response.end();
						return;
					}
					response.statusCode = 200;
					response.setHeader("Content-Type", "application/javascript");
					response.write(data);
					response.end();
				});

			// GET: styling
			}else if(request.url === "/app.css"){
				fs.readFile(resourcesPathString + "app.css", function(err, data){
					if(err){
						response.statusCode = 500;
						response.write("Server error.");
						response.end();
						return;
					}
					response.statusCode = 200;
					response.setHeader("Content-Type", "text/css");
					response.write(data);
					response.end();
				});
			// GET: unfound
			}else{
				response.statusCode = 404;
				response.write("Unknwn resource.");
				response.end();
			}

		} 
		// if it's not a get (ie POST, PUT, or DELETE)
		else{
			reqData = JSON.parse(receivedData);
			if(validateReqData(reqData)){
				if(request.method === "POST"){
					const newStudent = reqData;
					(async () => {
						const client = await pool.connect();
						try {
							qStr = "INSERT INTO students (first_name, last_name, email, enrollment_date) VALUES (" + "'" + [newStudent.fname, newStudent.lname, newStudent.email, newStudent.enrollDate].join("','") + "'" + ") RETURNING *";
							const {rows} = await client.query(qStr);
							response.statusCode = 200;
							response.end();
						return;
					
						} catch (err) {
							console.error(err);
						} finally {
							client.release();
						}
					})();
				}
				else if(request.method === "PUT"){
					const updateInfo = reqData;

					(async () => {
					const client = await pool.connect();
					try {
						const qStr = {
							text: 'SELECT * FROM students WHERE student_id = $1',
							values: [updateInfo.student_id],
							rowMode: 'array',
						  }	
						const {rows} = await client.query(qStr);
						if(rows.length > 0){ // if something comes from querying that ID
							(async () => {
								const client = await pool.connect();
								try {
									const qStr = {
										text: 'UPDATE students SET email = $1 WHERE student_id = $2',
										values: [updateInfo.updatedEmail, updateInfo.student_id],
										rowMode: 'array',
									  }	
									const {rows} = await client.query(qStr);
									return;
							
								} catch (err) {
									console.error(err);
									response.statusCode = 500;
									response.setHeader("Content-Type", "application/json");
									response.end(JSON.stringify(error_mssgs[2]));
								} finally {
									client.release();
									response.statusCode = 200;
									response.end();
								}
							})();
						}
						else {
							response.statusCode = 500;
							response.setHeader("Content-Type", "application/json");
							response.end(JSON.stringify(error_mssgs[1]));
						}
						return;
				
					} catch (err) {
						console.error(err);
					} finally {
						client.release();
					}
				})();
				}
				else if(request.method === "DELETE"){
					const reqData = JSON.parse(receivedData);
				console.log(reqData);

				(async () => {
					const client = await pool.connect();
					try {
						const qStr = {
							text: 'SELECT * FROM students WHERE student_id = $1',
							values: [reqData.student_id],
							rowMode: 'array',
						  }	
						const {rows} = await client.query(qStr);
						if(rows.length > 0){ // if something comes from querying that ID
							(async () => {
								const client = await pool.connect();
								try {
									const qStr = {
										text: 'DELETE FROM students WHERE student_id = $1',
										values: [reqData.student_id],
										rowMode: 'array',
									  }	
									const {rows} = await client.query(qStr);
									return;
							
								} catch (err) {
									console.error(err);
									response.statusCode = 500;
									response.setHeader("Content-Type", "application/json");
									response.end(JSON.stringify(error_mssgs[2]));
								} finally {
									client.release();
									response.statusCode = 200;
									response.end();
								}
							})();
						}
						else {
							response.statusCode = 500;
							response.setHeader("Content-Type", "application/json");
							response.end(JSON.stringify(error_mssgs[1]));
						}
						return;
				
					} catch (err) {
						console.error(err);
					} finally {
						client.release();
					}
				})();
				}
			}
			// if one of the input fields is empty or length of 0 then send back message
			else{
				response.statusCode = 500;
				response.setHeader("Content-Type", "application/json");
				response.end(JSON.stringify(error_mssgs[0]));
			}		
		``
		}

	});

});



//Server listens on port 3000
server.listen(3000);
console.log('Server running at http://127.0.0.1:3000/');


