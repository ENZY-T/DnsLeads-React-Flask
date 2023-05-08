import React from 'react';
import PageHeader from '../components/PageHeader';
import ServiceCard from '../components/ServiceCard';
import { GlobalData, services } from '../GlobalData';
import { v4 as uuidv4 } from 'uuid';
import { ThemeColors } from '../Styling/Colors';

function Services() {
    return (
        <div className="service-page">
            <PageHeader headertxt="SERVICES" />
            <section className="container-fluid py-5" style={{ backgroundColor: ThemeColors.bg_grey }}>
                <div className="container">
                    <div className="d-flex flex-column flex-md-row flex-wrap justify-content-between align-items-center align-items-md-stretch">
                        {services.map((serviceItem, index) => (
                            <ServiceCard key={uuidv4()} serviceItem={serviceItem} dalayINDX={index} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Services;
