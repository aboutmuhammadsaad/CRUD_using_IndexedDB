const subBtn = document.getElementById("subbtn");
const subUpdateBtn= document.getElementById("subUpdateBtn");
let itmTable=document.getElementById("itemsTable");
let key="";
let objtoupdate="";
let obj="";
// creating a new database
const request = window.indexedDB.open("CRM", 1);
console.log("Database created");

request.onerror = (event) => {
  console.error(`Database error: ${event.target.errorCode}`);
};

request.onupgradeneeded = (event) => {
  let db = event.target.result;

  // create the Contacts object store
  // with auto-increment id
  let store = db.createObjectStore("Contacts", {
    keyPath: "id",
    autoIncrement: true,
  });

  // create an index on the email property
  store.createIndex("firstname", "firstname", { unique: false });
  store.createIndex("lastname", "lastname", { unique: false });
  store.createIndex("email", "email", { unique: true });
  store.createIndex("phone", "phone", { unique: false });
  store.createIndex("date", "date", { unique: false });
  store.createIndex("gender", "gender", { unique: false });
  store.createIndex("vehicle", "vehicle", { unique: false });
};

request.onsuccess = (event) => {
  // add implementation here
  const db = event.target.result;
  subBtn.addEventListener("click", function () {

    // console.log('first');
    
    // console.log('Second');

    // setTimeout(() => {
    //   console.log('third');
    // }, 5000);
    
    // console.log('fifth');

    createitem(db);
    setTimeout(() => {
      if (obj=="" || obj==undefined){
        getAllContacts(db);
      }else {
        insertContact(db, obj);
        document.getElementById("res").innerHTML=" SuRegisteredccessfully";
        getAllContacts(db);
      }
    },1500)

    setTimeout(() => {
      document.getElementById("res").innerHTML="";
      
    }, 4000);
  });

  // To Update data from database 
  // Listen for clicks on the delete button within the table opens modal and show info in input field
  itmTable.addEventListener('click', function(event) {
    if (event.target && event.target.nodeName === 'BUTTON' && event.target.classList.contains('update-btn')) {
      let updateButton = event.target;

      let emailToUpdate = updateButton.getAttribute('data-id'); // Assuming the ID is stored in a data attribute    
      getKeyByEmail(db, emailToUpdate);
      getContactByEmail(db, emailToUpdate)
      
      setTimeout(function () {
        editItem(objtoupdate);
        var myModal = new bootstrap.Modal(
          document.getElementById("updateModal")
        );
        myModal.show();
          
      },500)
    }
  });
  // on click save button after update 
  subUpdateBtn.addEventListener("click", function () {
    let updateobj = updateItem();
    getUpdateContactsByKey(db,updateobj);
    document.getElementById("ress").innerHTML="Updated Successfully";
    getAllContacts(db);
    setTimeout(() => {
      document.getElementById("ress").innerHTML="";
      
    }, 4000);
  });

  // Listen for clicks on the delete button within the table
  itmTable.addEventListener('click', function(event) {
    if (event.target && event.target.nodeName === 'BUTTON' && event.target.classList.contains('delete-btn')) {
      if (confirm('Are you sure you want to delete')){
        let deleteButton = event.target;
  
        let emailToDelete = deleteButton.getAttribute('data-id'); // Assuming the ID is stored in a data attribute
        getKeyByEmail(db, emailToDelete);
        setTimeout(function () {
          deleteContact(db, key);
          getAllContacts(db);    
        },500)
      }
    }
  });
  getAllContacts(db);
};

function getKeyByEmail(db, email) {
  const txn = db.transaction('Contacts', 'readonly');
  const store = txn.objectStore('Contacts');

  let emailIndex = store.index('email');
  let getRequest = emailIndex.getKey(email);
  
  getRequest.onsuccess=(event) => {
    if (event.target.result){
      key = event.target.result;
    }
    else {
      key="";
    }
  };
  
  getRequest.onerror = (event) => {
    console.log(event.target.errorCode);
  };
}

function getAllContacts(db) {
  const txn = db.transaction("Contacts", "readonly");
  const objectStore = txn.objectStore("Contacts");

  let getDataRequest = objectStore.getAll();

  getDataRequest.onsuccess = function (event) {
    // Retrieve the data
    let tableData = event.target.result;
    // Display data as a table
    if (tableData && tableData.length > 0) {
      let table = "";
      let s = 1;
      tableData.forEach(function (item) {
        table += `<tr><td>${s++}</td><td>${item.firstname}</td><td>${item.lastname}</td><td>${item.email}</td>
          <td>${item.phone}</td><td>${item.date}</td><td>${item.gender}</td><td>${item.vehicle}</td>
          <td>
            <button type="button" class="btn btn-primary bg-primary update-btn " data-id="${item.email}">Edit</button>
            <button type"button" class="btn btn-info bg-info delete-btn" data-id="${item.email}">Del</button>
          </td>
        </tr>`;
      });

      // Assuming there's an element with the id 'itemsTable' to display the table
      document.getElementById("itemsTable").innerHTML = table;
    } else {
      // Handle case where there's no data
      document.getElementById("itemsTable").innerHTML = "No data available";
    }
  };
}

function insertContact(db, contact) {
  // create a new transaction
  const txn = db.transaction(["Contacts"], "readwrite");

  // get the Contacts object store
  const store = txn.objectStore("Contacts");
  //
  let query = store.put(contact);

  // handle success case
  query.onsuccess = function () {
    console.log("Added successfully");
  };

  // handle the error case
  query.onerror = function (event) {
    console.log(event.target.errorCode);
  };
  
}

function createitem(db) {
  const firstName = document.getElementById("firstname").value.trim();
  const lastName = document.getElementById("lastname").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const date = document.getElementById("date").value;
  const vehicle = checkbox();
  const gender = radio();

  let status = true;
  getKeyByEmail(db, email);
  setTimeout(() => {
    if (email == "" && isNumeric(email) == false) {
        document.getElementById("erroremail").innerHTML =
          "Please enter valid email address";
        status = false;
    }
    else if (key != ""){
      console.log("Saad");
      document.getElementById("erroremail").innerHTML =
      "Email address already exist";
      status = false;
      key="";
    }
    else {
      document.getElementById("erroremail").innerHTML = " ";
    }
    
    if (firstName == "" && isNumeric(firstName) == false) {
        document.getElementById("errorfirstname").innerHTML =
          "Please enter first name";
        status = false;
    } else {
        document.getElementById("errorfirstname").innerHTML = " ";
    }
    
    if (lastName == "" && isNumeric(lastName) == false) {
        document.getElementById("errorlastname").innerHTML =
          "Please enter Last name";
        status = false;
    } else {
        document.getElementById("errorlastname").innerHTML = " ";
    }
    
    if (phone == "" && isNumeric(phone) == false) {
        document.getElementById("errorphone").innerHTML =
          "Please enter Valid phone number";
        status = false;
    } else {
        document.getElementById("errorphone").innerHTML = " ";
    }
    
    if (gender == "") {
        document.getElementById("errorgender").innerHTML = "Please select gender.";
        status = false;
    } else {
        document.getElementById("errorgender").innerHTML = " ";
    }
    
    if (date == "") {
        document.getElementById("errordate").innerHTML = "Please select Date.";
        status = false;
    } else {
        document.getElementById("errordate").innerHTML = " ";
    }
    
    if (vehicle == "") {
        document.getElementById("errorvehicle").innerHTML =
          "Please select vehicle.";
        status = false;
    } else {
        document.getElementById("errorvehicle").innerHTML = " ";
    }
    
    if (status == true) {
      const newItem = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        phone: phone,
        date: date,
        gender: gender,
        vehicle: vehicle,
      };
      document.getElementById("modalform").reset();
      obj= newItem;
    }
    else {
      obj= "";
    }
  },500)
}

function editItem(items) {
  document.getElementById("idd").value = key;
  document.getElementById("fname").value = items.firstname;
  document.getElementById("lname").value = items.lastname;
  document.getElementById("em").value = items.email;
  document.getElementById("ph").value = items.phone;
  document.getElementById("dte").value = items.date;
  cbvalue();
  rdvalue();
  function cbvalue() {
    let valuee = items.vehicle;
    if (valuee == "bike") {
      document.getElementById("chk1").checked = true;
      document.getElementById("chk2").checked = false;
      document.getElementById("chk3").checked = false;
    }
    if (valuee == "car") {
      document.getElementById("chk2").checked = true;
      document.getElementById("chk1").checked = false;
      document.getElementById("chk3").checked = false;
    }
    if (valuee == "bike&car") {
      document.getElementById("chk3").checked = true;
      document.getElementById("chk1").checked = false;
      document.getElementById("chk2").checked = false;
    }
  }
  function rdvalue() {
    let valuee = items.gender;
    if (valuee == "female") {
      document.getElementById("radiof").checked = true;
    }
    if (valuee == "male") {
      document.getElementById("radiom").checked = true;
    }
  }
}

function updateItem() {
  const firstName = document.getElementById("fname").value.trim();
  const lastName = document.getElementById("lname").value.trim();
  const email = document.getElementById("em").value.trim();
  const phone = document.getElementById("ph").value.trim();
  const date = document.getElementById("dte").value;
  const vehicle = checkboxup();
  const gender = radioup();

  let status = true;
  if (firstName == "" && isNumeric(firstName) == false) {
    document.getElementById("errorfname").innerHTML = "Please enter first name";
    status = false;
  } else {
    document.getElementById("errorfname").innerHTML = " ";
  }

  if (lastName == "" && isNumeric(lastName) == false) {
    document.getElementById("errorlname").innerHTML = "Please enter last name ";
    status = false;
  } else {
    document.getElementById("errorlname").innerHTML = " ";
  }

  if (email == "") {
    document.getElementById("errorem").innerHTML ="Please enter valid email address";
    status = false;
  } else {
    document.getElementById("errorem").innerHTML = " ";
  }

  if (phone == "" && isNumeric(phone) == true) {
    document.getElementById("errorph").innerHTML ="Please enter a valid phone number";
    status = false;
  } else {
    document.getElementById("errorph").innerHTML = " ";
  }

  if (gender == "") {
    document.getElementById("egender").innerHTML = "Please select gender.";
    status = false;
  } else {
    document.getElementById("egender").innerHTML = " ";
  }

  if (date == "") {
    document.getElementById("edate").innerHTML = "Please select Date.";
    status = false;
  } else {
    document.getElementById("edate").innerHTML = " ";
  }

  if (vehicle == "") {
    document.getElementById("evehicle").innerHTML = "Please select vehicle.";
    status = false;
  } else {
    document.getElementById("evehicle").innerHTML = " ";
  }

  if (status == true) {
    const newItem = {
      firstname: firstName,
      lastname: lastName,
      email: email,
      phone: phone,
      date: date,
      gender: gender,
      vehicle: vehicle,
    };   
    return newItem;
  }
}

function getUpdateContactsByKey(db,objj){
  let transaction = db.transaction(['Contacts'], 'readwrite');
  let store = transaction.objectStore('Contacts');
  
  let getRequest = store.get(key);

  getRequest.onsuccess = function() {
    let existingData = getRequest.result;

    if (existingData) {
      // Update the existing data with new values
      Object.assign(existingData, objj);

      let updateRequest = store.put(existingData, key);

      updateRequest.onsuccess = function() {
        console.log('Object updated successfully');
        key="";
      };

      updateRequest.onerror = function(event) {
        console.log("Error getting updating contact",event);
      };
    } else {
      console.log('Object with the provided key does not exist');
    }
  };

  getRequest.onerror = function(event) {
    // Handle errors during retrieval
    console.log("Error updating", event);
  };
}

function getContactByEmail(db, email) {
  const txn = db.transaction('Contacts', 'readonly');
  const store = txn.objectStore('Contacts');

  // get the index from the Object Store
  const index = store.index('email');
  // query by indexes
  let query = index.get(email);

  // return the result object on success
  query.onsuccess = () => {
    objtoupdate=query.result;
  };

  query.onerror = (event) => {
    console.log(event.target.errorCode);
  }

}

function deleteContact(db, key) {
  // create a new transaction
  const txn = db.transaction(['Contacts'], 'readwrite');
  
  // get the Contacts object store
  const store = txn.objectStore('Contacts');
  //
  let query = store.delete(key);
  
  // handle the success case
  query.onsuccess = function () {
    console.log("deleted successfully");
    key="";
  };
  
  // handle the error case
  query.onerror = function (event) {
    console.log(event.target.errorCode);
  }  
}


function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
function checkbox() {
  const checkbox1 = document.getElementById("check1");
  const checkbox2 = document.getElementById("check2");
  const checkbox3 = document.getElementById("check3");
  let ans = "";
  if (checkbox1.checked) {
    ans = checkbox1.value;
  } else if (checkbox2.checked) {
    ans = checkbox2.value;
  } else if (checkbox3.checked) {
    ans = checkbox3.value;
  } else {
    ans = "";
  }
  return ans;
}
function radio() {
  const radio1 = document.getElementById("radio1");
  const radio2 = document.getElementById("radio2");
  let ans = "";
  if (radio1.checked) {
    ans = radio1.value;
  } else if (radio2.checked) {
    ans = radio2.value;
  } else {
    ans = "";
  }
  return ans;
}
function checkboxup() {
  const checkbox1 = document.getElementById("chk1");
  const checkbox2 = document.getElementById("chk2");
  const checkbox3 = document.getElementById("chk3");
  let ans = "";
  if (checkbox1.checked) {
    ans = checkbox1.value;
  } else if (checkbox2.checked) {
    ans = checkbox2.value;
  } else if (checkbox3.checked) {
    ans = checkbox3.value;
  } else {
    ans = "";
  }
  return ans;
}
function radioup() {
  const radio1 = document.getElementById("radiof");
  const radio2 = document.getElementById("radiom");
  let ans = "";
  if (radio1.checked) {
    ans = radio1.value;
  } else if (radio2.checked) {
    ans = radio2.value;
  }
  return ans;
}
