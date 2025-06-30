import { Link } from "react-router-dom";

function Dashboard(){
    return(
        <div className="dPage">
            <div className="heading">
                <h1>Dashboard</h1>

                    <div className="supButton">
                        <Link to="/supplier">
                            <button>Suppliers</button>
                        </Link>

                        <Link>
                            <button>Inventory</button>
                        </Link>

                        <Link>
                            <button>Employee</button>
                        </Link>

                    </div>
            </div>

        </div>
        
    );
}

export default Dashboard