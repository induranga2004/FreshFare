const express = require("express");
const router = express.Router();
const Employee = require("../Models/Employee");
const bcrypt = require("bcrypt")
// Add Employee
router.post("/add", async (req, res) => {
    try {
        const {firstName, lastName, age, gender, dob, address, mobile, email ,role,password} = req.body;
           // Validation
           if (!firstName || !lastName || !age || !gender || !dob || !address || !mobile || !email || !role || !password ) 
            {
                return res.status(400).json({ message: "All fields are required!" });
            }
        // Ensure age and mobile are numbers
        const ageNumber = Number(age);
        const mobileNumber = mobile;
        const hashedPassword = await bcrypt.hash(password,10)
        if (isNaN(ageNumber) || isNaN(mobileNumber)) {
            return res.status(400).json({ message: "age and Mobile Number must be valid numbers." });
        }

        // Create new employee
        const newEmployee = new Employee({
            
            firstName,
            lastName,
            age: ageNumber,
            gender,
            dob,
            address,
            mobile: mobileNumber,
            email,
            role,
            password:hashedPassword
        });

        await newEmployee.save();
        res.status(201).json({ message: "Employee Added Successfully", employee: newEmployee });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// Get only cashiers and managers
router.get("/", async (req, res) => {
    try {
        const employees = await Employee.find();
        var array1 = [];
        for(var i=0;i<employees.length;i++)
        {
            if(employees[i].role=="Cashier" || employees[i].role=="Manager")
            {
                    array1.push(employees[i])
            }
        }
        res.json(array1);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});
//Get only cashiers
router.get("/cashiers",async(req,res)=>{
    try{
        const employees = await Employee.find({role:"Cashier"})
        res.json(employees)
    }catch(err)
    {
        res.status(500).json({message:"Server Error",error:err.message})
    }
})
// Update Employee
router.put("/update/:id", async (req, res) => {
    try {
        const body = req.body;
        const password = body.password
        const hashedPassword = await bcrypt.hash(password,10)
        body.password = hashedPassword
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, body, { new: true });

        if (!updatedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json({ message: "Employee Updated Successfully", updatedEmployee });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// Delete Employee
router.delete("/delete/:id", async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);

        if (!deletedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json({ message: "Employee Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// Get Single Employee
router.get("/get/:id", async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json(employee);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

module.exports = router; 