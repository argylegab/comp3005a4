// client side script
const headings = ["student ID", "first name", "last name", "email", "enrollment date"];
const localDBRows = [];
const displayTableDomElt = document.getElementById("display_div");


// function to create divs for dom to display table; makes indiv values
function createRowOfDivs(arrayOfValues){
	const row_div = document.createElement('div');
	row_div.className = 'value_row';

	for(const val of arrayOfValues){
		const thisCol = document.createElement('div');
		if(headings.indexOf(val) > -1){
			thisCol.innerHTML = "<b>" + val + "</b>";
		}
		else{
			thisCol.innerHTML = "|  " + val + "  |";
		}
		thisCol.className = 'value_col'
		row_div.appendChild(thisCol);
	}

	return row_div;
}

// function to create divs for dom to display table; makes rows
function createTableInnerHTMLText(arrayOfTuples){

	const table_anchor = document.createElement('div');
	table_anchor.appendChild(createRowOfDivs(headings));

	for(const tup of arrayOfTuples){
		const thisTupArr = [];
		thisTupArr.push("  " + tup.student_id);
		thisTupArr.push(tup.first_name);
		thisTupArr.push(tup.last_name);
		thisTupArr.push(tup.email);
		thisTupArr.push((tup.enrollment_date).slice(0,10));
		table_anchor.appendChild(createRowOfDivs(thisTupArr));
	}

	if(displayTableDomElt.hasChildNodes()){
		displayTableDomElt.innerHTML = "";
	}

	displayTableDomElt.appendChild(table_anchor);
}

// function to getAllStudents
function getAllStudents() {
  let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){
			response_text = JSON.parse(req.responseText);
			createTableInnerHTMLText(response_text);
		}
	}

	req.open("GET", `/allStudents`);
	req.setRequestHeader("Content-Type", "application/json");
	req.send();
}

//function to add students
function addStudent(first_name, last_name, email, enrollment_date) { // function that gets called whrn adding new student
	let reqObj = {};
	reqObj.fname = first_name;
	reqObj.lname = last_name;
	reqObj.email = email;
	reqObj.enrollDate = enrollment_date;

	
	let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){ // what gets called if adding student is successful
			getAllStudents(); // if successful repopulate the table
		}else{ //what gets called if adding student is UNsuccessful
			response_text = JSON.parse(req.responseText);
			console.log(this.responseText);
			console.log("failed");
			document.getElementById("display_div").innerHTML = "Error Message: " + this.responseText;
		}
	}
	req.open("POST", `/addStudent`);
	req.setRequestHeader("Content-Type", "application/json");
	console.log(reqObj);
	req.send(JSON.stringify(reqObj));


}

// function to update student email given student id
function updateStudentEmail(student_id, new_email) {
	let reqObj = {};
	reqObj.student_id = student_id;
	reqObj.updatedEmail = new_email;

	let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){ // what gets called if adding student is successful
			getAllStudents(); // if successful repopulate the table
		}else{ //what gets called if adding student is UNsuccessful
			response_text = JSON.parse(req.responseText);
			console.log(this.responseText);
			console.log("failed");
			document.getElementById("display_div").innerHTML = "Error Message: " + this.responseText;
		}
	}
	
	req.open("PUT", `/updateStudentEmail`);
	req.setRequestHeader("Content-Type", "application/json");
	console.log(reqObj);
	req.send(JSON.stringify(reqObj));
}

// function to delete student record from student table given student id
function deleteStudent(student_id) {
	let reqObj = {};
	reqObj.student_id = student_id;

	let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200){ // what gets called if adding student is successful
			getAllStudents(); // if successful repopulate the table
		}else{ //what gets called if adding student is UNsuccessful
			response_text = JSON.parse(req.responseText);
			console.log(this.responseText);
			console.log("failed");
			document.getElementById("display_div").innerHTML = "Error Message: " + this.responseText;
		}
	}
	
	req.open("DELETE", `/deleteStudent`);
	req.setRequestHeader("Content-Type", "application/json");
	console.log(reqObj);
	req.send(JSON.stringify(reqObj));
}

function initEventListeners(){
	const getAllStudentsBtn = document.getElementById("getAllStudentsBtn");
	getAllStudentsBtn.addEventListener("click", getAllStudents);

	const addStudentBtn = document.getElementById("addStudentBtn");
	addStudentBtn.addEventListener("click", function() {
		addStudent(document.getElementById("fname").value,
		document.getElementById("lname").value,
		document.getElementById("email").value,
		document.getElementById("enrollmentdate").value);
	});

	const updateStudentEmailBtn = document.getElementById("updateStudentEmailBtn");
	updateStudentEmailBtn.addEventListener("click", function(){
		updateStudentEmail(document.getElementById("st_id").value,
		document.getElementById("updatedEmail").value);
	});

	const deleteStudentBtn = document.getElementById("deleteStudentBtn");
	deleteStudentBtn.addEventListener("click", function(){
		deleteStudent(document.getElementById("st_idDelete").value);
	});
	
}

initEventListeners();