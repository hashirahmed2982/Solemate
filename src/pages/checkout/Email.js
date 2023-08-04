import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import TextField from "@mui/material/TextField";

const Email = (props) => {
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();

        //console.log(form.current);

        emailjs.sendForm('service_fcmm6jk', 'template_c0xhpoq', form.current, 'vlie2ce-istjxqz9i')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
    };

    return (
        <form ref={form} onSubmit={sendEmail}>
            <TextField
                id="to_firstName"
                name="to_firstName"
                label="First Name"
                type="text"
                variant="outlined"
                value="Muhammad"
            />
            <TextField
                id="to_lastName"
                name="to_lastName"
                label="Last Name"
                type="text"
                variant="outlined"
                value="Omer"
            />
            <TextField
                id="to_email"
                name="to_email"
                label="Email Address"
                type="email"
                variant="outlined"
                value="mohd2000omer@gmail.com"
            />
            <TextField
                id="order_ID"
                name="order_ID"
                label="Order ID"
                type="text"
                variant="outlined"
                value="1234567"
            />
            <input type="submit" value="Send" />
        </form>
    );
};

  export default Email