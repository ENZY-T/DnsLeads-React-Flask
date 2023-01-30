import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { ThemeColors } from '../Styling/Colors';

export default function ServiceCard({ serviceItem, dalayINDX }) {
    const history = useHistory();
    const readMore = () => {
        history.push(`/services/details#${serviceItem.id}`);
    };
    return (
        <div
            data-aos="fade-up"
            data-aos-delay={`${(dalayINDX % 3) * 250}`}
            className="mx-3 my-3 card rounded-0 p-4 d-flex flex-column align-items-center justify-content-between service-card-width"
        >
            <div className="mb-3 d-flex flex-column align-items-center">
                <div className="my-3">{serviceItem.icon}</div>
                <p className="my-3 fs-3 text-center">{serviceItem.title}</p>
                <p className="text-justify text-center" style={{ color: ThemeColors.textColor_fade }}>
                    {serviceItem.description}
                </p>
            </div>
            <div>
                <button className="btn btn-sm btn-outline-secondary rounded-0 mx-auto px-3 py-1" onClick={() => readMore()}>
                    Read More
                </button>
            </div>
        </div>
    );
}
