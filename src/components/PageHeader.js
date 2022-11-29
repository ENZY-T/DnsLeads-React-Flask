import React from 'react';
import headerImage from '../img/about-top-img.jpg';

function PageHeader({ headertxt }) {
    return (
        <div className="page-header" style={{ backgroundImage: `url(${headerImage})` }}>
            <div className="container flex-align-center">
                <h1>{headertxt}</h1>
            </div>
        </div>
    );
}

export default PageHeader;
