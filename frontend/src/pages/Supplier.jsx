import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { FaSearch, FaPlus, FaFileAlt, FaChartPie } from 'react-icons/fa';
import SuppliersDetails from "../Components/SuppliersDetails"
import "../Components/Supplier/SupplierForm/SupplierForm.css";


function Supplier(){

    const [suppliers, setSuppliers] = useState([])
    const [searchBar, setSearchBar] = useState("")

    useEffect(() =>{
        const fetchSuppliers = async() =>{
            const response = await fetch('http://localhost:5000/api/suppliers/')
            const json = await response.json()

            if(response.ok){
                setSuppliers(json)
            }
        }

        fetchSuppliers()
    }, [])

    // Suppliers report
    const handleGenerateReport = async () => {

        try {

          const response = await fetch("http://localhost:5000/api/suppliers/generate-report/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ filter: searchBar }), // ✅ Send only the search value
          });
      
          if (!response.ok) throw new Error("Report generation failed");
      
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          window.open(url, "_blank");
          
        } catch (err) {
          console.error(err);
          alert("Failed to generate report");
        }
      };
      

    
    // After delete show remain suppliers
    const deleteSupplier = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/suppliers/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Update local state
                setSuppliers(suppliers.filter(supplier => supplier._id !== id));
                // Refresh the page to update the pie chart
                window.location.reload();
            } else {
                console.error('Failed to delete supplier');
            }
        } catch (error) {
            console.error('Error deleting supplier:', error);
        }
    }

    // Function to update supplier in state after editing
    const handleUpdateSupplier = (updatedSupplier) => {
        setSuppliers(suppliers.map(supplier => 
            supplier._id === updatedSupplier._id ? updatedSupplier : supplier
        ));
    }

    // Search Bar
    const filteredSuppliers = suppliers.filter((supplier) => 
        supplier.supplierName && supplier.supplierName.toLowerCase().includes(searchBar.toLowerCase()
        ));


    return(
        <div className="supplier-form">
            <div className="supplier-form__container">
                <div className="supplier-form__header">
                    <div className="supplier-form__header-content">
                        <h1 className="supplier-form__title">Supplier Management</h1>
                        <div className="supplier-form__search">
                            <div className="supplier-form__search-container">
                                <FaSearch className="supplier-form__search-icon" />
                                <input
                                    className="supplier-form__input"
                                    type="text"
                                    placeholder="Search by supplier name..."
                                    value={searchBar}
                                    onChange={(e)=> setSearchBar(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="supplier-form__actions">
                        <Link to="/supplierForm" className="supplier-form__button supplier-form__button--add">
                            <FaPlus className="supplier-form__button-icon" />
                            <span>Add Supplier</span>
                        </Link>
                        <button onClick={handleGenerateReport} className="supplier-form__button supplier-form__button--report">
                            <FaFileAlt className="supplier-form__button-icon" />
                            <span>Supplier Report</span>
                        </button>
                        <Link to="/pie-chart" className="supplier-form__button supplier-form__button--chart">
                            <FaChartPie className="supplier-form__button-icon" />
                            <span>Payment Status</span>
                        </Link>
                    </div>
                </div>

                <div className="supplier-form__grid">
                    {filteredSuppliers.map((supplier)=>(
                        <SuppliersDetails 
                            key={supplier._id} 
                            supplier={supplier} 
                            onDelete={() => deleteSupplier(supplier._id)}
                            onUpdate={handleUpdateSupplier}
                        /> 
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Supplier