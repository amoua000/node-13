// This is the medium challenge and Hard challenge for the node week 2 challenge

const express = require("express");
// require("dotenv").config();
const app = express();
const bodyParser = require('body-parser');

const data = require('./public/database.json')
const fs = require('fs')

app.use(bodyParser.json())
// app.get('/workers',(req,res)=> {
//           res.send('Hello World')

// use this http method to get the information and data for employees

app.get("/employees", (req, res) => {
  if (!data) {
    res.status(404).send("Could not find information");
  }
  //  send everybody that you want with data
  res.send(data);
});

app.get("/employees/:id", (req, res) => {
  // make a function to grab id. find is a method that finds the person were looking for
  const findEmployee = data.workers.find(function (employee) {
    // parseInt because it returns a string. req paramas id is what the person fills in
    return parseInt(req.params.id) === employee.id;
  });

  if (!findEmployee) {
    res.status(404).send("Could not find information");
  }
  //  send everybody that you want with data
  res.send(findEmployee);
});

// adds an employee 
app.post('/employees',(req,res) => {
  const { name, salary, department, id } = req.body;
  if (name && salary && department && id) {
    const newEmployee = {
      name,
      salary,
      department,
      id
    };
    data.workers.push(newEmployee);
    fs.writeFileSync("./public/database.json", JSON.stringify(data));
    res.send(newEmployee);
  } else {
    res.status(400).send({error:"One of the fields is missing from the body"})
  } 
})

// use this http method to update a new employee
app.put('/employees/:id',(req,res) => {
          const employeeId = parseInt(req.params.id)
          console.log(req.params)
          const { name, salary, department, id } = req.body;
          const newEmployee = {
              name,
              salary,
              department,
              id
            };
      
          for(let i = 0; i < data.workers.length; i++) {
              if(data.workers[i].id === employeeId) {
                if (name && salary && department && id) {
                  data.workers[i] = newEmployee
                  // FileSync updates the local file with the new changes
                  fs.writeFileSync('./public/database.json', JSON.stringify(data))
                  return res.send(data.workers[i])
                } else {
                  res.status(400).send({error:"couldnt update the user"})
                }
              } 
          }   
          res.status(400).send({error:"Employee with this ID does not exist"})
      })

      // use this http method to delete a employee

app.delete('/employees/:id',(req,res) => {
    const employeeId = parseInt(req.params.id)

    for(let i = 0; i < data.workers.length; i++) {
        if(data.workers[i].id === employeeId) {
            const employeeData = data.workers[i]
            data.workers.splice(i,1)
            fs.writeFileSync("./public/database.json", JSON.stringify(data));
            res.send(employeeData)
        } 
    } 
    res.status(400).send({error:"Employee with this ID does not exist"})
})  

const port = process.env.PORT || 4500;

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

// highest server port is 8080
// app.listen(3000);
