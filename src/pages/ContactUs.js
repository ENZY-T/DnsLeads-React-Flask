import React from 'react';
import PageHeader from '../components/PageHeader';
import { ThemeColors } from '../Styling/Colors';
import { MapContainer, TileLayer } from 'react-leaflet';

const contactCards = [
    {
        topic: 'ADDRESS',
        icon: <i className="fas fa-map" />,
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
        icon: <i className="fas fa-mobile-alt" />,
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
        icon: <i className="fa fa-envelope" />,
        data: <p style={{ color: ThemeColors.textColor_fade }}>info@dnsleads.com.au</p>,
    },
];

function ContactCard({ data }) {
    return (
        <div className="contact-card">
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
                        <ContactCard data={crd} />
                    ))}
                </div>
                <div className="map-container my-5">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1101.4519406497188!2d138.5762098024612!3d-34.98155257813865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ab0d01e32d3a989%3A0xfa9f74f58cf2dcea!2s8%20Brett%20St%2C%20Melrose%20Park%20SA%205039!5e0!3m2!1sen!2sau!4v1669717728048!5m2!1sen!2sau"
                        width="100%"
                        height="500px"
                        allowfullscreen=""
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
                <div className="contact-us-form py-5">
                    <h1 className="text-center">SEND US YOUR FEEDBACK</h1>
                    <p style={{ color: ThemeColors.textColor_fade }} className="text-center">
                        Please contact us with any questions and inquiries, and we will be sure to get back to you as soon as possible.
                    </p>
                    <div className="contact-form py-5">
                        <div className="name-email">
                            <input type="text" placeholder="NAME" />
                            <input type="email" placeholder="EMAIL" />
                        </div>
                        <input type="text" placeholder="SUBJECT" />
                        <textarea placeholder="MESSAGE"></textarea>
                        <button>SEND</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactUs;
