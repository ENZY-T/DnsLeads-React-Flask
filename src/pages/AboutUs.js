import React from 'react';
import PageHeader from '../components/PageHeader';
import mainImage from '../img/about_us1_new.jpg';

export function AboutPageLine() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="about-line" viewBox="0 0 1000 84.94" preserveAspectRatio="none">
            <path
                d="M0,0V72.94c14.46,5.89,32.38,10.5,54.52.26,110.25-51,120.51,23.71,192.6-4.3,144.73-56.23,154.37,49.44,246.71,4.64C637,4.05,622.19,124.16,757.29,66.21c93-39.91,108.38,54.92,242.71-8.25V0Z"
                style={{ fillRule: 'evenodd', opacity: '0.33' }}
                fill="#c35050"
            ></path>
            <path
                d="M0,0V52.83c131.11,59.9,147-32.91,239.24,6.65,135.09,58,120.24-62.16,263.46,7.34,92.33,44.8,102-60.88,246.71-4.64,72.1,28,82.35-46.71,192.6,4.3,23.95,11.08,43,4.78,58-1.72V0Z"
                style={{ fillRule: 'evenodd', opacity: '0.66' }}
                fill="#c35050"
            ></path>
            <path
                d="M0,0V24.26c15.6,6.95,35.77,15.41,61.78,3.38,110.25-51,120.51,23.71,192.6-4.3C399.11-32.89,408.75,72.79,501.08,28,644.3-41.51,629.45,78.6,764.54,20.65,855.87-18.53,872.34,72.12,1000,15.7V0Z"
                style={{ fillRule: 'evenodd' }}
                fill="#c35050"
            ></path>
        </svg>
    );
}

const AboutUs = () => {
    return (
        <div className="about-page">
            <PageHeader headertxt="ABOUT US" />
            <div className="container">
                <div className="our-story">
                    <img src={mainImage} />
                    <div className="story">
                        <h2>OUR STORY</h2>
                        <p>
                            DNS Leads services private limited is a fast-growing company which provides commercial cleaning with a wide
                            range of support services. Since the start of the business in 2015, DNS has always been driven by the pursuit of
                            excellence of its service for a healthy and consistent customer base.
                        </p>
                        <p>
                            Due to the consistent growth that DNS has enjoyed over the past few years, it has extended its services outside
                            Australia and has invested in commercial cleaning industry in Sri Lanka too.
                        </p>
                    </div>
                </div>
                <AboutPageLine />
                <div className="our-focus">
                    <div className="left">
                        <h3>OUR FOCUS</h3>
                        <p>
                            Through a consistent process for improvement in diverse range of facility services, DNS continuously refine its
                            approaches to service delivery focusing on adding more value to comprehensive solutions for customer needs.
                        </p>
                        <div className="focus-line">
                            <div className="number">1</div>
                            <div className="focus-data">
                                <h4>PROFESSIONAL STAFF</h4>
                                <p>
                                    The personnel that DNS employs are professionally trained to work and meet the highest quality
                                    standards.
                                </p>
                            </div>
                        </div>
                        <div className="focus-line">
                            <div className="number">2</div>
                            <div className="focus-data">
                                <h4>MODERN TOOLS AND MACHINERY</h4>
                                <p>
                                    The use of modern tools and machinery is essentially aimed at maintaining cost-effective, hazard free,
                                    environment-friendly services for its clients.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <h3>CAPACITY TO PROVIDE A 24 x 365 SERVICE</h3>
                        <p>
                            DNS has got the expertise and capacity to provide a 24/365 service with an excellent degree of agility and
                            flexibility to provide services in several areas.
                        </p>
                        <div className="icons-line">
                            <div className="icon-block">
                                <i className="far fa-clock"></i>
                                <h4>HAZARD</h4>
                                <h4>FREE</h4>
                            </div>
                            <div className="icon-block">
                                <i className="fas fa-dollar-sign"></i>
                                <h4>COST</h4>
                                <h4>EFFECTIVE</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
