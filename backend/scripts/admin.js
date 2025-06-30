const employee = require("../Models/Employee")
const bcrypt = require("bcrypt")
const createAdmin = async() =>{
        const findadmin = await employee.findOne({email:"gayantha34@gmail.com"})
        if(findadmin)
        {
            console.log("Admin is already registered")
        }else
        {
            const admin = new employee(
                {
                    firstName:"gayantha",
                    lastName:"kavindu",
                    gender:"Male",
                    dob: "21/10/2003",
                    address:"126/2 pattivila",
                    email:"gayantha34@gmail.com",
                    age:22,
                    mobile:"0772678783",
                    role:"Owner",
                    password:await bcrypt.hash("gayantha12345",10)
                }
            )
            try
            {
                await admin.save()
            }catch(error)
            {
                console.log(error)
            }
        }
}
module.exports = {createAdmin}