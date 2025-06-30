import React from "react";
import Login from "./Components/Login/Login.jsx";
import EnterEmail from "./Components/EnterEmail/EnterEmail.jsx";
import EnterOtp from "./Components/EnterOtp/EnterOtp.jsx";
import ResetPassword from "./Components/ResetPassword/ResetPassword.jsx";
import EmployeeList from "./pages/displayEmployee/EmployeeList";
import AddEmployee from "./pages/AddEmloyee/addEmployee";
import ViewEmployee from "./pages/viewEmployee/ViewEmployee";
import AddItem from "./Components/AddItem/AddItem.jsx";
import DisplayItem from "./Components/DisplayItem/DisplayItem.jsx";
import UpdateItem from "./Components/UpdateItem/UpdateItem.jsx";
import EditEmployee from "./pages/editEmloyee/EditEmployee";
import AddEmployeemanager from "./pages/AddEmloyee/AddEmployeemanager"
import Emplistmanager from "./pages/displayEmployee/EmployeeListManager"
import EditEmployeeManager from "./pages/editEmloyee/EditEmployeeManager"
import ViewEmployeeManager from "./pages/viewEmployee/ViewEmployeeManager"
import {Routes, Route} from "react-router-dom"
import CashierDashboard from "./pages/Cashierdashboard/CashierDashboard"
import Paymentportal from "./pages/paymentportal/Paymentportal"
import Cash from "./pages/Cashierdashboard/Cash"
import SuccessfullPayment from "./pages/Cashierdashboard/SuccessfullPayment"
import Unsuccessfulpayment from "./pages/Cashierdashboard/Unsuccessfulpayment"
import "./App.css";
import Register from "./Components/Register/Register";
import OTP from "./Components/OTP/OTP";
import LoyalCustomers from "./Components/LoyalCustomers/LoyalCustomers";
import UpdateLC from "./Components/UpdateLC/UpdateLC";
import Layout from "./Components/Layout/Layout";
import SelfEnroll from "./pages/SelfEnroll/SelfEnroll";
import InventoryReport from "./Components/InventoryReport.jsx";
import { SocketProvider } from "./context/SocketContext";
import { ToastContainer} from 'react-toastify';


function App() {
  return (
    <SocketProvider>
      <ToastContainer/>
      <Routes>
        {/* Self-enroll route WITHOUT Layout */}
        
        <Route path="/self-enroll" element={<SelfEnroll />} />
        <Route path="/inventory-report" element={<InventoryReport />} />
        <Route path="/additem" element={<AddItem />} />
        <Route path="/displayitem" element={<DisplayItem />} />
        <Route path="/updateProduct/:P_Code" element={<UpdateItem />} />
        <Route path="/emplist" element={<EmployeeList />} />
        <Route path="/empadd" element={<AddEmployee />} />   
        <Route path ="/empview/:id" element={<ViewEmployee/>} />
        <Route path ="/empedit/:id" element={<EditEmployee/>}/>
        <Route path="/addempManager" element={<AddEmployeemanager/>}/>
        <Route path="/emplistManager" element={<Emplistmanager/>}/>
        <Route path="/editEmpManager/:id" element={<EditEmployeeManager/>}/>
        <Route path="/viewEmpManager/:id" element={<ViewEmployeeManager/>}/>
        <Route path="/email" element={<EnterEmail/>}/>
        <Route path="/otp/:email" element={<EnterOtp/>}/>
        <Route path="/password/:email" element={<ResetPassword/>}/>
        <Route path="/" element={<Login/>}/>
        {/* All other routes WITH Layout */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/Register" element={<Register />} />
                <Route path="/OTP" element={<OTP />} />
                <Route path="/LoyalCustomers" element={<LoyalCustomers />} />
                <Route path="/UpdateLC/:id" element={<UpdateLC />} />
                <Route path="/cashierdashboard" element={<CashierDashboard />} />
                <Route path="/payment-portal" element={<Paymentportal />} />
                <Route path="/payment-cash" element={<Cash />} />
                <Route path="/payment/successfull" element={<SuccessfullPayment />} />
                <Route path="/payment/unsuccessfull" element={<Unsuccessfulpayment />} />
              </Routes>
              </Layout>
          }
        />
      </Routes>
    </SocketProvider>
  );
}

export default App; 