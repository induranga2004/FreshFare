import React, { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import axios from "axios"
import styles from './Cashierdashboard.module.css'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { useNavigate } from "react-router-dom"
import Table from 'react-bootstrap/Table';
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaCheckCircle, FaShoppingCart, FaCreditCard, FaBarcode, FaEnvelope, FaUser, FaPlus, FaMinus } from "react-icons/fa";
import { useSocket } from '../../context/SocketContext';

const CashierDashboard = () => {
  const APIKEY = "d97daff437071769fb004de9";
  const BASE_URL = `https://v6.exchangerate-api.com/v6/${APIKEY}/latest/`
  const convertCurrency = async(from,to,amount) =>
    {
        try{
        const response  = await axios.get(`${BASE_URL}${from}`);
        const rate = response.data.conversion_rates[to];
        if (!rate) {
            console.log(`Exchange rate for ${to} not found.`);
            return;
        }
        var convertedAmount = parseFloat((amount * rate).toFixed(2));
        return convertedAmount;
            }catch(error){
                console.error("Error fetching exchange rate:",error.message);
            }
    }
  const [email,setemail] = useState();
  const navigate = useNavigate();
  const [cartitems,setcartitems] = useState([]);
  const URL = "http://localhost:5000/product/search-product"
  const [paymenttype,setpaymenttype] = useState('Choose Payment type');
  const [barcode,setbarcode] = useState('');
  const [pname,setpname] = useState('');
  const [priceinusd,setpriceinUSd] = useState();
  const [imageURL,setimageURL] = useState('');
  const [price,setprice] = useState('');
  const [availablequantity,setavailablequantity] = useState('');
  const [quantity,setquantity] = useState(1);
  var total = quantity*price;
  const [barcodes,setbarcodes] = useState('');
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [pointsDiscount, setPointsDiscount] = useState(0);
  const totalprice = parseFloat((cartitems.reduce((acc, item) => acc + item.price, 0) - pointsDiscount).toFixed(2));
  const [customerInfo, setCustomerInfo] = useState({ 
    name: 'Guest', 
    mobile: '', 
    email: '',
    _id: null,
    totalPoints: 0,
    totalSpent: 0,
    registeredDate: null,
    lastTransactionDate: null
  });
  const { socketService } = useSocket();
  const cashierId = 'cashier-1'; // This should come from your auth system

  useEffect(() => {
    if (!socketService) {
      console.error('Socket service not available in CashierDashboard');
      return;
    }

    const initializeSocket = async () => {
      try {
        await socketService.joinCashierRoom(cashierId);
        
        const handleCustomerDetails = (data) => {
          if (data.success) {
            setCustomerInfo({
              name: data.customer.name,
              mobile: data.customer.mobile,
              email: data.customer.email,
              _id: data.customer._id,
              totalPoints: data.customer.totalPoints || 0,
              totalSpent: data.customer.totalSpent || 0,
              registeredDate: data.customer.registeredDate,
              lastTransactionDate: data.customer.lastTransactionDate
            });
            
            toast.success(`Customer ${data.customer.name} details received`, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          } else {
            setCustomerInfo({ 
              name: 'Guest', 
              mobile: '', 
              email: '',
              _id: null,
              totalPoints: 0,
              totalSpent: 0,
              registeredDate: null,
              lastTransactionDate: null
            });
            
            toast.error(data.message, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          }
        };

        await socketService.onCustomerDetails(handleCustomerDetails);

        return () => {
          socketService.offCustomerDetails(handleCustomerDetails).catch(console.error);
        };
      } catch (error) {
        console.error('Socket initialization error:', error);
      }
    };

    initializeSocket();
  }, [socketService, cashierId]);

  useEffect(() => {
    if (customerInfo.email) {
      setemail(customerInfo.email);
    }
  }, [customerInfo.email]);

  const handleSubmit = async(e) =>{
   
    e.preventDefault();
    if(!barcode)
      {
        toast.error('Your barcode is empty', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          })
      }
      else if(isNaN(barcode))
      {
        toast.error('Your barcode is not valid - only numbers are allowed', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          })
      }
      else if(barcode.length < 8 || barcode.length > 13)
      {
        toast.error('Your barcode must be between 8 and 13 digits', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          })
      }
    else
      {
      const token = localStorage.getItem("token");
      await axios.post(URL,{
        Barcode:barcode
      },{
        headers:{
            "Authorization":`Bearer ${token}`
        }
      }).then((res)=>{
          setbarcodes(res.data.P_Code);
          setpname(res.data.P_Name)
          setprice(res.data.Selling_Price)
          setavailablequantity(res.data.Quantity)
          setimageURL(res.data.image)
          async function convertprice ()
          {
            const priceUSD = await convertCurrency("LKR","USD",res.data.Selling_Price)
            setpriceinUSd(priceUSD);
          }
          convertprice();
          setquantity(1);
          total = 0;
          setbarcode('');
      }).catch(error=>{
        toast.error("The barcode is not valid", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          })
      })
    }
  }
  function addproduct()
  {
      for(var i=0;i<cartitems.length;i++)
      {
        if(cartitems[i].barcode==barcodes)
        {
          toast.error("You cannot add a same barcode two times", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
            })
          return;
        }
      }
      if(quantity>availablequantity)
      {
        toast.error('not enough stock', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          })
        return;
      }
      if(quantity<=0)
      {
        toast.error('Invalid quantity', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          })
        return;
      }
      if(quantity<=availablequantity)
      {
        const newProduct = {
          productname:pname,
          barcode:barcodes,
          quantity:quantity,
          price:total,
          image:imageURL,
          priceUSD:priceinusd,
          email:email
        }
        setcartitems([...cartitems,newProduct]);
      }
      else
      {
        toast.error('Out of stock', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          })
      }
  }
  function deleteitems(deleteindex)
  {
    setcartitems(cartitems.filter((_,index)=>index!==deleteindex));
  }
  const handlesubmitemail = (e) => {
    e.preventDefault();
    const emailValue = document.getElementById("emailip").value;
    
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailValue)) {
      toast.error('Please enter a valid email address', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    
    setemail(emailValue);
    toast.success('Customer email connected successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
  const updateCustomerPoints = async (amount) => {
    if (!customerInfo._id) {
      console.log('No customer ID available');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post('http://localhost:5000/LCs/calculate-points', 
        { 
          customerId: customerInfo._id, 
          amount: amount 
        },
        { 
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          } 
        }
      );

      if (response.data) {
        // Update local state with new points
        setCustomerInfo(prev => ({
          ...prev,
          totalPoints: response.data.totalPoints,
          totalSpent: prev.totalSpent + amount,
          lastTransactionDate: new Date()
        }));

        toast.success(`Points updated! Earned ${response.data.pointsEarned} points`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      console.error('Error updating points:', error);
      toast.error('Error updating loyalty points', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };
  const makepayment = async () => {
    if (totalprice <= 0) {
      alert("total price must be greater than zero");
      return;
    }

    if (paymenttype === "Cash") {
      // Update points before navigation
      if (customerInfo._id) {
        await updateCustomerPoints(totalprice);
      }
      
      navigate('/payment-cash', {
        state: {
          total: totalprice,
          items: cartitems,
          emails: email
        }
      });
      // Reset customer info after payment
      setCustomerInfo({ 
        name: 'Guest', 
        mobile: '', 
        email: '',
        _id: null,
        totalPoints: 0,
        totalSpent: 0,
        registeredDate: null,
        lastTransactionDate: null
      });
    } else if (paymenttype === "Card") {
      try {
        // Update points before card payment
        if (customerInfo._id) {
          await updateCustomerPoints(totalprice);
        }
        
        const stripe = await loadStripe("pk_test_51RHiHqQjJP5XVkIa1F8KlW7NWgHBrEhw3RDc9Sr1HexVJfhNxUmAjHKiYQvb1hNmNdXXg4pJZAuMXQbUcNdLg4Pz00XzSWpfMW");
        const token = localStorage.getItem("token");
        
        // Add error handling for the Stripe API call
        try {
          const res = await axios.post(`http://localhost:5000/stripes/create-checkout-session`, {
            items: cartitems
          }, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          
          const session = await res.data;
          const result = await stripe.redirectToCheckout({
            sessionId: session.id
          });
          
          if (result.error) {
            console.log(result.error);
            toast.error(result.error.message);
          }
        } catch (error) {
          console.error("Stripe API Error:", error);
          
          // Check if it's a 404 error (endpoint not found)
          if (error.response && error.response.status === 404) {
            toast.error("Payment service is unavailable. Please try the cash payment option or contact support.");
          } else {
            toast.error(`Payment processing error: ${error.message}`);
          }
        }
        
      } catch (error) {
        console.error("Payment processing error:", error);
        toast.error(`Error processing payment: ${error.message}`);
      }
      
      // Reset customer info after payment attempt regardless of success
      setCustomerInfo({ 
        name: 'Guest', 
        mobile: '', 
        email: '',
        _id: null,
        totalPoints: 0,
        totalSpent: 0,
        registeredDate: null,
        lastTransactionDate: null
      });
    }
    setpaymenttype("Choose Payment type");
  };

  // Function to handle points redemption
  const handlePointsRedemption = (e) => {
    e.preventDefault();
    const points = parseInt(pointsToRedeem);
    
    // Validate points input
    if (isNaN(points) || points <= 0) {
      toast.error('Please enter a valid number of points', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    if (points > customerInfo.totalPoints) {
      toast.error('Not enough points available', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    // Validate if points exceed bill amount
    if (points > cartitems.reduce((acc, item) => acc + item.price, 0)) {
      toast.error('Points cannot exceed the bill amount', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    const discount = points; // 1 point = Rs. 1
    setPointsDiscount(discount);
    toast.success(`Applied ${points} points discount (Rs. ${discount})`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebar}>
        <div className={styles.customerInfo}>
          <div className={styles.customerHeader}>
            <FaUser className={styles.customerIcon} />
            <h3>Customer Information</h3>
          </div>
          <div className={styles.customerDetails}>
            <p>
              <strong>Name:</strong>
              <span>{customerInfo.name}</span>
            </p>
            {customerInfo.mobile && (
              <p>
                <strong>Mobile:</strong>
                <span>{customerInfo.mobile}</span>
              </p>
            )}
            {customerInfo.email && (
              <p className={styles.emailRow}>
                <strong>Email:</strong>
                <span>{customerInfo.email}</span>
              </p>
            )}
            {customerInfo.mobile && (
              <>
                <p>
                  <strong>Total Points:</strong>
                  <span>{customerInfo.totalPoints}</span>
                </p>
                <p>
                  <strong>Total Spent:</strong>
                  <span>Rs. {customerInfo.totalSpent.toFixed(2)}</span>
                </p>
                {customerInfo.registeredDate && (
                  <p>
                    <strong>Member Since:</strong>
                    <span>{new Date(customerInfo.registeredDate).toLocaleDateString()}</span>
                  </p>
                )}
                {customerInfo.lastTransactionDate && (
                  <p>
                    <strong>Last Transaction:</strong>
                    <span>{new Date(customerInfo.lastTransactionDate).toLocaleDateString()}</span>
                  </p>
                )}
                <div className={styles.pointsRedemption}>
                  <form onSubmit={handlePointsRedemption}>
                    <div className={styles.pointsInputGroup}>
                      <input
                        type="number"
                        value={pointsToRedeem}
                        onChange={(e) => setPointsToRedeem(e.target.value)}
                        placeholder="Enter points to redeem"
                        min="0"
                        max={customerInfo.totalPoints}
                        className={styles.pointsInput}
                      />
                      <button type="submit" className={styles.redeemButton}>
                        Redeem Points
                      </button>
                    </div>
                  </form>
                  {pointsDiscount > 0 && (
                    <p className={styles.discountInfo}>
                      <strong>Points Discount:</strong>
                      <span>Rs. {pointsDiscount.toFixed(2)}</span>
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
      <div className={styles.topSection}>
        <div className={styles.inputForms}>
          <div className={styles.emailForm}>
            <div className={styles.formHeader}>
              <FaEnvelope className={styles.formIcon} />
              <label>Customer Email</label>
            </div>
            <form className={styles.formEmail} onSubmit={handlesubmitemail}>
              <input
                type="email"
                id="emailip"
                className={styles.emailInput}
                placeholder="Enter customer email"
                required
                  value={email || ''}
                  onChange={e => setemail(e.target.value)}
              />
              <button type="submit" className={styles.emailSubmit}>
                  <FaCheckCircle /> Connect Email
              </button>
            </form>
          </div>

          <div className={styles.barcodeForm}>
            <div className={styles.formHeader}>
              <FaBarcode className={styles.formIcon} />
              <label>Scan Product</label>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={barcode}
                onChange={(e) => setbarcode(e.target.value)}
                className={styles.barcodeInput}
                placeholder="Enter barcode"
              />
              <button type="submit" className={styles.barcodeButton}>
                  <FaBarcode /> Scan
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className={styles.mainSection}>
        <div className={styles.leftSection}>
          <div className={styles.addProductForm}>
              <h1 className={styles.header}>Product Details</h1>
            <div className={styles.formGroup}>
              <p>Barcode</p>
                <div>{barcodes || '-'}</div>
            </div>
            <div className={styles.formGroup}>
              <p>Name</p>
                <div>{pname || '-'}</div>
            </div>
            <div className={styles.formGroup}>
              <p>Price</p>
                <div>Rs. {price || '0.00'}</div>
            </div>
            <div className={styles.formGroup}>
              <p>Available Quantity</p>
                <div>{availablequantity || '0'}</div>
            </div>
            <div className={styles.formGroup}>
              <p>Quantity</p>
                <div className={styles.quantityControls}>
                  <button 
                    onClick={() => setquantity(Math.max(1, quantity - 1))}
                    className={styles.quantityButton}
                  >
                    <FaMinus />
                  </button>
              <input 
                type="number" 
                value={quantity} 
                    onChange={(e) => setquantity(Math.max(1, parseInt(e.target.value) || 1))}
                className={styles.quantitys}
                min="1"
              />
                  <button 
                    onClick={() => setquantity(quantity + 1)}
                    className={styles.quantityButton}
                  >
                    <FaPlus />
                  </button>
                </div>
            </div>
            <div className={styles.formGroup}>
              <p>Total</p>
                <div>Rs. {total.toFixed(2)}</div>
            </div>
              <button className={styles.addbtn} onClick={addproduct}>
                <FaPlus /> Add to Cart
              </button>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.cartSection}>
            <div className={styles.cartHeader}>
              <h1 className={styles.storeName}>Freshfare</h1>
              <div className={styles.cartSummary}>
                <div className={styles.cartItemsCount}>
                  {cartitems.length} {cartitems.length === 1 ? 'Item' : 'Items'}
                </div>
                <div className={styles.cartTotalAmount}>
                  Total: Rs. {totalprice.toFixed(2)}
                </div>
              </div>
            </div>

              <Table hover responsive>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartitems.length === 0 ? (
                  <tr>
                    <td colSpan={4}>
                      <div className={styles.cartEmpty}>
                        <FaShoppingCart className={styles.cartEmptyIcon} />
                        <p>Your cart is empty</p>
                        <p>Add products to start shopping</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  cartitems.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className={styles.cartItem}>
                          <span className={styles.itemName}>{item.productname}</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.itemQuantity}>
                          {item.quantity}
                        </div>
                      </td>
                      <td>
                        <span className={styles.itemPrice}>Rs. {item.price.toFixed(2)}</span>
                      </td>
                      <td>
                        <MdOutlineDeleteOutline 
                          className={styles.deleteIcon}
                            onClick={() => deleteitems(index)}
                            title="Remove item"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            <div className={styles.paymentSection}>
              <div className={styles.paymentRow}>
                <div className={styles.paymentLabel}>Payment Method</div>
                <select 
                    value={paymenttype}
                    onChange={(e) => setpaymenttype(e.target.value)}
                  className={styles.paymentSelect}
                >
                    <option value="">Choose Payment type</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Credit/Debit card</option>
                </select>
              </div>
              <div className={styles.paymentRow}>
                <button 
                  onClick={makepayment} 
                  className={styles.paybtn}
                    disabled={cartitems.length === 0 || !paymenttype}
                >
                  <FaCreditCard />
                  Pay Rs. {totalprice.toFixed(2)}
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default CashierDashboard
