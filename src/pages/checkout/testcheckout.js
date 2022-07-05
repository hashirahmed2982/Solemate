import React, { useState } from 'react'
import PDFFile from "./PDFFile";
import { db, storage } from '../../firebase';
import { PDFDownloadLink, renderToString } from "@react-pdf/renderer";
import Button from '@mui/material/Button';

var count = 0;

function Testcheckout() {

    const [pdf, setPDF] = useState('');
    async function addToStorage(blobFile) {
        const uploadTask = storage.ref(`/invoices/${orderID}`).put(blobFile);
        uploadTask.on(
          "state_changed",
          snapshot => {
              const progress = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
              console.log(progress);
          },
          error => {
              console.log(error);
          },
          async () => {
              await storage.ref(`invoices/${orderID}`).getDownloadURL().then((url) => {
                  console.log("URL", url);
                  setPDF(url);
              });
          }
        );
      }

    const orderID = 23456;
    const formValues = {
        firstName: "Muhammad",
        lastName: "Omer",
        email: 'momer@sabanciuniv.edu',
        address: 'Sabanci University, Tuzla, Istanbul',
        country: 'Turkey',
        city: 'Istanbul',
        zip: '34956',    
    }

    const cart = [
        {
            ID: '12345678',
            brand: 'brand',
            name: 'Shoe Name',
            picture: 'https://firebasestorage.googleapis.com/v0/b/solemate-5534d.appspot.com/o/products%2F87031810%2Fair%20force%201%20-%202.JPG?alt=media&token=983969d6-de33-425a-b376-ccba66b0ead2',
            price: '9999999',
            quantity: 1,
            size: '40.5',
        },
        {
            ID: '12345678',
            brand: 'brand',
            name: 'Shoe Name',
            picture: 'https://firebasestorage.googleapis.com/v0/b/solemate-5534d.appspot.com/o/products%2F87031810%2Fair%20force%201%20-%202.JPG?alt=media&token=983969d6-de33-425a-b376-ccba66b0ead2',
            price: '9999999',
            quantity: 1,
            size: '40.5',
        },
        {
            ID: '12345678',
            brand: 'brand',
            name: 'Shoe Name',
            picture: 'https://firebasestorage.googleapis.com/v0/b/solemate-5534d.appspot.com/o/products%2F87031810%2Fair%20force%201%20-%202.JPG?alt=media&token=983969d6-de33-425a-b376-ccba66b0ead2',
            price: '9999999',
            quantity: 1,
            size: '40.5',
        },
        {
            ID: '12345678',
            brand: 'brand',
            name: 'Shoe Name',
            picture: 'https://firebasestorage.googleapis.com/v0/b/solemate-5534d.appspot.com/o/products%2F87031810%2Fair%20force%201%20-%202.JPG?alt=media&token=983969d6-de33-425a-b376-ccba66b0ead2',
            price: '9999999',
            quantity: 1,
            size: '40.5',
        },
        {
            ID: '12345678',
            brand: 'brand',
            name: 'Shoe Name',
            picture: 'https://firebasestorage.googleapis.com/v0/b/solemate-5534d.appspot.com/o/products%2F87031810%2Fair%20force%201%20-%202.JPG?alt=media&token=983969d6-de33-425a-b376-ccba66b0ead2',
            price: '9999999',
            quantity: 1,
            size: '40.5',
        },

    ]
    const sum = 99999;
    return (
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
        {({loading, url, blob, }) => {
            if (loading) {
            return(
                <Button variant='outlined' fullWidth>Loading Invoice...</Button>  
            )
            }
            else {
                if (blob != null){
                    count++;
                    console.log("BLOB", blob);
                    if (count == 1) {
                        addToStorage(blob);
                    }
                }
            return (
                <Button variant ='outlined' fullWidth>Download Invoice</Button>
            )
            }
        }}
        </PDFDownloadLink>
    )
}

export default Testcheckout