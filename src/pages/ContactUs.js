import React from 'react';
import PageHeader from '../components/PageHeader';
import { ThemeColors } from '../Styling/Colors';
import { Button } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

const contactCards = [
    {
        topic: 'ADDRESS',
        icon: <MapIcon className="mb-3 txt-theme" style={{ fontSize: '10vh' }} />,
        data: (
            <p style={{ color: ThemeColors.textColor_fade }}>
                08 Brett Street
                <br />
                Melrose Park
                <br />
                SA 5039
            </p>
        ),
    },
    {
        topic: 'TELEPHONE',
        icon: <PhoneAndroidIcon className="mb-3 txt-theme" style={{ fontSize: '10vh' }} />,
        data: (
            <p style={{ color: ThemeColors.textColor_fade }}>
                +61 8 7225 9002
                <br />
                +61 4 5065 4356
            </p>
        ),
    },
    {
        topic: 'EMAIL',
        icon: <MailOutlineIcon className="mb-3 txt-theme" style={{ fontSize: '10vh' }} />,
        data: <p style={{ color: ThemeColors.textColor_fade }}>info@dnsleads.com.au</p>,
    },
];

function ContactCard({ data, indx }) {
    return (
        <div className="contact-card" data-aos="fade-up" data-aos-delay={`${indx * 200}`}>
            {data.icon}
            <h4 style={{ color: ThemeColors.black }}>{data.topic}</h4>
            {data.data}
        </div>
    );
}

function ContactUs() {
    return (
        <div className="contact-us">
            <PageHeader headertxt="CONTACT US" />
            <div className="container py-5">
                <div className="contacts-card-container">
                    {contactCards.map((crd, index) => (
                        <ContactCard data={crd} key={index} indx={index} />
                    ))}
                </div>
                <hr className="mt-5" />
                <div className="map-container my-5">
                    <iframe
                        title="gmap"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1101.4519406497188!2d138.5762098024612!3d-34.98155257813865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ab0d01e32d3a989%3A0xfa9f74f58cf2dcea!2s8%20Brett%20St%2C%20Melrose%20Park%20SA%205039!5e0!3m2!1sen!2sau!4v1669717728048!5m2!1sen!2sau"
                        width="100%"
                        height="500px"
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
                <hr />
                <div className="contact-us-form py-5 container">
                    <h1 className="text-center">SEND US YOUR FEEDBACK</h1>
                    <p style={{ color: ThemeColors.textColor_fade }} className="text-center">
                        Please contact us with any questions and inquiries, and we will be sure to get back to you as soon as possible.
                    </p>
                    <div className="contact-form py-5 mx-5 px-5">
                        <div className="name-email">
                            <input type="text" placeholder="NAME" />
                            <input type="email" placeholder="EMAIL" />
                        </div>
                        <input type="text" placeholder="SUBJECT" />
                        <textarea placeholder="MESSAGE"></textarea>
                        <Button className="send-btn">SEND</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactUs;
