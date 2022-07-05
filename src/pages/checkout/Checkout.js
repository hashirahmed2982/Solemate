import "./checkout.css";
import "../../template/Template";
import Template from "../../template/Template";
import CheckoutItem from "../../components/CheckoutItem";
import { BsCreditCard } from "react-icons/bs";
import { db, storage } from '../../firebase';
import firebase from "firebase";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import emailjs from '@emailjs/browser';
import TextField from "@mui/material/TextField";
import PDFFile from "./PDFFile";
import { PDFDownloadLink } from "@react-pdf/renderer";

var count = 0;

const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  country: "",
  city: "",
  zip: "",
  ccName: "",
  ccNumber: "",
  ccExpiration: "",
  ccCVV: "",
};

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [sum, setSum] = useState(0);
  const [orderID, setOrderID] = useState('');

  const form = useRef();
  const [pdf, setPDF] = useState('');
  const [blob, setBlob] = useState();

  const sendEmail = () => {
      //e.preventDefault();

      //console.log(form.current);

      emailjs.sendForm('service_fcmm6jk', 'template_c0xhpoq', form.current, 'vlie2ce-istjxqz9i')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
  };

  const [formValues, setFormValues] = useState(defaultValues);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
      setOpen(true);
  };

  const handleClose = () => {
      setOpen(false);
  };

  
  useEffect(() => {
    var tempID = '';
    const min = 0;
    const max = 9;
    for (var i = 0; i < 6; i++) {
      tempID += (Math.floor(min + Math.random() * (max - min))).toString();
    }
    if (orderID == "") {
      setOrderID(tempID);
    }
    if (firebase.auth().currentUser != null) {
      var uid = firebase.auth().currentUser.uid;
      db.collection('users').doc(`${uid}`).get().then((snapshot) => {
        var values = snapshot.data();
        setCart(values.cart);
      })
    }
  }, []);

  useEffect(() => {
    total();
  }, [cart])

  function total(){
    if (cart.length == 0){
      setSum(0);
    }
    else {
      var temp = 0;
      cart.map(val =>{
        temp += parseInt(val.price, 10) * val.quantity;
      })
      setSum(temp);
    }
  }

  async function addPDFToStorage(blobFile) {
    var timeStamp = firebase.firestore.Timestamp.now().toMillis().toString();
    const uploadTask = storage.ref(`/invoices/${timeStamp}_${orderID}`).put(blobFile);
    uploadTask.on(
      "state_changed",
      snapshot => {},
      error => {
          console.log(error);
      },
      async () => {
        await storage.ref(`/invoices/${timeStamp}_${orderID}`).getDownloadURL().then((url) => {
        console.log("URL", url);
        setPDF(url);
      });
      }
    );
  }

  useEffect(() => {
    console.log(blob);
  }, [blob])

  async function placeOrder(){
    const customerDetails = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      address: formValues.address,
      country: formValues.country,
      city: formValues.city,
      zip: formValues.zip,
      uid: firebase.auth().currentUser.uid,
    }

    const paymentDetails = {
      ccName: formValues.ccName,
      ccNumber: formValues.ccNumber,
      ccExpiration: formValues.ccExpiration,
      ccCVV: formValues.ccCVV
    }

    cart.map(async (cartItem) => {
      var sizesStocks = [];
      await db.collection('products').doc(cartItem.ID).get().then((snapshot) => {
        var values = snapshot.data();
        sizesStocks = values.sizesStocks;
      }).then(async () => {
        var index = 0;
        var found = false;
        sizesStocks.map((entry, idx) => {
          if (entry.size == cartItem.size){
            index = idx;
            found = true;
          }
        })
        if (found) {
          var tempArray = [...sizesStocks];
          tempArray[index].stock = (parseInt(tempArray[index].stock, 10) - cartItem.quantity).toString();
          sizesStocks = tempArray;
        }
        await db.collection('products').doc(cartItem.ID).update({
          sizesStocks: sizesStocks,
        })
      })
    })

    await db.collection('orders').doc(`${orderID}-${firebase.auth().currentUser.uid}`).set({
      cart: cart,
      customerDetails: customerDetails,
      paymentDetails: paymentDetails,
      timeStamp: firebase.firestore.Timestamp.now(),
      total: sum,
      status: 'confirmed',
      orderID: orderID,
      cancelReason: "",
    }).then(async () => {
      await db.collection('users').doc(firebase.auth().currentUser.uid).update({
        cart: []
      })
    }).then(() => {
      handleClickOpen();
    })
  }

  return (
    <Template>
      <div>
        <div class="container">
          <div class="py-5 text-center">
            <h2 style={{ marginTop: "50px" }}>Checkout Information</h2>
            <hr style={{ width: "50%", margin: "auto" }} />
          </div>

          <div class="row">
            <div class="col-md-4 order-md-2 mb-4">
              <h4 class="d-flex justify-content-between align-items-center mb-3">
                <span class="text-muted">Your cart</span>
                <span class="badge badge-secondary badge-pill">3</span>
              </h4>
              <ul
                class="list-group mb-3"
                style={{ height: "325px", overflowY: "scroll" }}
              >
                {cart.length > 0 && 
                  <div className="list-group mb-3" style={{ height: "325px", overflowY: "scroll" }}>
                    {cart.map(val => (  
                      <CheckoutItem title={val.name} price={val.price} desc={'x'+val.quantity+' Amount'} />
                    ))}
                  </div>
                }
                
                <li class="list-group-item d-flex justify-content-between" style= {{fontSize:"22px", padding:"15px"}}>
                  <span>Total (TL)</span>
                  <strong>{sum}</strong>

                </li>
              </ul>
              {formValues.firstName !== "" && formValues.lastName !== "" && formValues.email !== ""
               && formValues.address !== "" && formValues.country !== "" && formValues.city !== ""
               && formValues.zip !== "" && formValues.ccName !== "" && formValues.ccNumber !== ""
               && formValues.ccExpiration !== "" && formValues.ccCVV !== "" && cart.length != 0 ? 
              <button
                class="btn btn-primary btn-lg btn-block orderButton productCard-btn"
                type="submit"
                onClick={placeOrder}
              >
                Place Order!
              </button> : 
              <button
                class="btn btn-primary btn-lg btn-block orderButton productCard-btn"
                type="submit"
                disabled
              >
                Place Order!
              </button>
              }
            </div>
            <div class="col-md-8 order-md-1">
              <h4 class="mb-3">Billing address</h4>
              <form class="needs-validation" novalidate style={{marginBottom:"20px"}}>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="firstName">First name (*)</label>
                    <input
                      type="text"
                      class="form-control"
                      id="firstName"
                      placeholder=""
                      required
                      name="firstName"
                      onChange={handleInputChange}
                    />
                    <div class="invalid-feedback">
                      Valid first name is required.
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="lastName">Last name (*)</label>
                    <input
                      type="text"
                      class="form-control"
                      id="lastName"
                      placeholder=""
                      required
                      name="lastName"
                      onChange={handleInputChange}
                    />
                    <div class="invalid-feedback">
                      Valid last name is required.
                    </div>
                  </div>
                </div>
                <div class="mb-3">
                  <label for="email">
                    Email (*)
                  </label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    placeholder="you@example.com"
                    required
                    name="email"
                    onChange={handleInputChange}
                  />
                  <div class="invalid-feedback" style={{ width: "100%" }}>
                    Your email is required.
                  </div>
                </div>
                <div class="mb-3">
                  <label for="address">Address (*)</label>
                  <input
                    type="text"
                    class="form-control"
                    id="address"
                    placeholder="1234 Main St"
                    required
                    name="address"
                    onChange={handleInputChange}
                  />
                  <div class="invalid-feedback">
                    Please enter your shipping address.
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-5 mb-3">
                    <label for="country">Country (*)</label>
                    <input
                      type="text"
                      class="form-control"
                      id="country"
                      placeholder=""
                      required
                      name="country"
                      onChange={handleInputChange}
                    />
                    <div class="invalid-feedback">
                      Please select a valid country.
                    </div>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="city">City/ State/ Province (*)</label>
                    <input
                      type="text"
                      class="form-control"
                      id="city"
                      placeholder=""
                      required
                      name="city"
                      onChange={handleInputChange}
                    />
                    <div class="invalid-feedback">
                      Please provide a valid city/ state/ province.
                    </div>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="zip">Zip Code (*)</label>
                    <input
                      type="text"
                      class="form-control"
                      id="zip"
                      placeholder=""
                      required
                      name="zip"
                      onChange={handleInputChange}
                    />
                    <div class="invalid-feedback">Zip code required.</div>
                  </div>
                </div>
                <hr class="mb-4" />
                <h4 class="mb-3">
                  Payment <BsCreditCard size={30} style={{marginLeft: '5px'}}/>
                </h4>

                <div class="d-block my-3">
                  <div class="custom-control custom-radio">
                    <input
                      id="credit"
                      name="paymentMethod"
                      type="radio"
                      class="custom-control-input"
                      checked
                      required
                    />
                    <label class="custom-control-label" for="credit">
                      Credit card
                    </label>
                  </div>
                  <div class="custom-control custom-radio">
                    <input
                      id="debit"
                      name="paymentMethod"
                      type="radio"
                      class="custom-control-input"
                      required
                    />
                    <label class="custom-control-label" for="debit">
                      Debit card
                    </label>
                  </div>
                  <div class="custom-control custom-radio">
                    <input
                      id="paypal"
                      name="paymentMethod"
                      type="radio"
                      class="custom-control-input"
                      required
                    />
                    <label class="custom-control-label" for="paypal">
                      PayPal
                    </label>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="ccName">Full Name (as shown on card) (*)</label>
                    <input
                      type="text"
                      class="form-control"
                      id="ccName"
                      placeholder=""
                      required
                      name="ccName"
                      onChange={handleInputChange}
                    />
                    <small class="text-muted">
                      Full name as displayed on card
                    </small>
                    <div class="invalid-feedback">Name on card is required</div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="ccNumber">Credit Card Number (*)</label>
                    <input
                      type="text"
                      class="form-control"
                      id="ccNumber"
                      placeholder=""
                      required
                      name="ccNumber"
                      onChange={handleInputChange}
                    />
                    <div class="invalid-feedback">
                      Credit card number is required
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-3 mb-3">
                    <label for="ccExpiration">Expiration Date (*)</label>
                    <input
                      type="text"
                      class="form-control"
                      id="ccExpiration"
                      placeholder=""
                      required
                      name="ccExpiration"
                      onChange={handleInputChange}
                    />
                    <div class="invalid-feedback">Expiration date required</div>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="ccCVV">CVV (*)</label>
                    <input
                      type="text"
                      class="form-control"
                      id="ccCVV"
                      placeholder=""
                      required
                      name="ccCVV"
                      onChange={handleInputChange}
                    />
                    <div class="invalid-feedback">Security code required</div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Dialog
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          
      >
        <DialogTitle sx={{backgroundColor: 'primary.main'}} id="alert-dialog-title">
            <Typography variant='h6' sx={{color: '#ffffff'}}>Order placed</Typography>
        </DialogTitle>
        <DialogContent>
            <DialogContentText paddingTop='20px' id="alert-dialog-description">
                Your order <strong>#{orderID}</strong> has been placed successfully! The invoice will be emailed to you shortly,
                according to the following details. Thank you for shopping with us, solemate!
            </DialogContentText>
              <form ref={form}>
                <div style={{padding: '20px'}}>
                  <TextField
                      id="to_firstName"
                      name="to_firstName"
                      label="First Name"
                      type="text"
                      variant="outlined"
                      value={formValues.firstName}
                      fullWidth
                  />
                </div>
                <div style={{padding: '20px'}}>
                  <TextField
                      id="to_lastName"
                      name="to_lastName"
                      label="Last Name"
                      type="text"
                      variant="outlined"
                      value={formValues.lastName}
                      fullWidth
                  />
                </div>
                <div style={{padding: '20px'}}>
                  <TextField
                      id="to_email"
                      name="to_email"
                      label="Email Address"
                      type="email"
                      variant="outlined"
                      value={formValues.email}
                      fullWidth
                  />
                </div>
                <div style={{padding: '20px'}}>
                  <TextField
                      id="order_ID"
                      name="order_ID"
                      label="Order ID"
                      type="text"
                      variant="outlined"
                      value={orderID}
                      fullWidth
                  />
                </div>
                <div style={{padding: '20px'}}>
                  <TextField
                      id="download_link"
                      name="download_link"
                      label="Download Link"
                      type="text"
                      variant="outlined"
                      value={pdf}
                      fullWidth
                  />
                </div>
              </form>
              <div style={{padding: '20px'}}>
              <PDFDownloadLink
                document={<PDFFile 
                  orderID={orderID}
                  firstName={formValues.firstName}
                  lastName={formValues.lastName}
                  email={formValues.email}
                  address={formValues.address}
                  country={formValues.country}
                  city={formValues.city}
                  zip={formValues.zip}
                  cart={cart}
                  total={sum}
                />}
                fileName={"invoice_" + orderID.toString()}
              >
                {({loading, url, blob}) => {
                  if (loading) {
                    return(
                      <Button variant='outlined' fullWidth>Loading Invoice...</Button>  
                    )
                  }
                  else {
                    if (blob != null){
                        count++;
                        //console.log("BLOB", blob);
                        if (count == 1) {
                            addPDFToStorage(blob);
                        }
                    }
                    return (
                        <Button variant ='outlined' fullWidth>Download Invoice</Button>
                    )
                  }
                  }}
              </PDFDownloadLink>
              </div>
              
        </DialogContent>
        <DialogActions>
          {pdf !== '' ? 
            <Button variant='contained' sx={{backgroundColor: "#f77d0b", color: '#ffffff'}} onClick={() => {
                sendEmail();
                setFormValues(defaultValues);
                handleClose();
                navigate('/');
              }}
            >
                Continue Shopping
            </Button> :
            <Button variant='contained' sx={{backgroundColor: "#f77d0b", color: '#ffffff'}} disabled onClick={() => {
                sendEmail();
                setFormValues(defaultValues);
                handleClose();
                navigate('/');
              }}
            >
              Continue Shopping
            </Button>
          }
        </DialogActions>
      </Dialog>
    </Template>
  );
};

export default Checkout;
