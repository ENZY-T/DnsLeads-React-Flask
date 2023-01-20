import React from 'react';
import PageHeader from '../components/PageHeader';
import { serviceDetails } from '../GlobalData';
import { AboutPageLine } from './AboutUs';
import { useEffect } from 'react';
import { useRef } from 'react';

const HalfElm = ({ obj }) => {
    return (
        <>
            {obj.type === 'img' ? (
                <div className="half">
                    <img src={obj.data} alt="" />
                </div>
            ) : (
                <div className="half">
                    <div className="icon">{obj.data.icon}</div>
                    <h3>{obj.data.topic}</h3>
                    <p>{obj.data.para}</p>
                </div>
            )}
        </>
    );
};

function HalfContainer({ leftRightData, indx, line, prp }) {
    const allLeftRight = [leftRightData.left, leftRightData.right];
    const objRef = useRef();
    useEffect(() => {
        if (prp.location.hash === `#${leftRightData.id}`) {
            objRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    return (
        <>
            <div className="two-side-container" ref={objRef} id={leftRightData.id}>
                <HalfElm obj={allLeftRight[indx % 2]} />
                <HalfElm obj={allLeftRight[(indx + 1) % 2]} />
            </div>
            {line ? <AboutPageLine /> : ''}
        </>
    );
}

function ServiceDetails(props) {
    return (
        <div className="service-details">
            <PageHeader headertxt="SERVICES DETAILS" />
            <div className="container">
                {serviceDetails.map((serviceDetail, index) => (
                    <HalfContainer
                        leftRightData={serviceDetail}
                        indx={index}
                        key={index}
                        line={index !== serviceDetails.length - 1 ? true : false}
                        prp={props}
                    />
                ))}
            </div>
        </div>
    );
}

export default ServiceDetails;
