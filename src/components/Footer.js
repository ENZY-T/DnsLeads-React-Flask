import React from 'react';
import { Link } from 'react-router-dom';
import { GlobalData } from '../GlobalData';
import { ThemeColors } from '../Styling/Colors';

function Footer() {
	return (
		<div>
			<hr className='solid' />
			<section className='my-5 container footer-container'>
				<div className='row'>
					<div className='footer-logo-moto'>
						<div className='logo-moto'>
							<img src={GlobalData.CompanyDetails.logo} className='size-full-width' alt='Logo' />
						</div>
						<div>
							<h6 className='fw-bold mb-4'>We provide cleaning services for the help and growth of your business.</h6>
							<h6 style={{ color: ThemeColors.textColor_fade }}>08 Brett Street,</h6>
							<h6 style={{ color: ThemeColors.textColor_fade }}>Melrose Park,</h6>
							<h6 style={{ color: ThemeColors.textColor_fade }}>Adelaide,</h6>
							<h6 style={{ color: ThemeColors.textColor_fade }}>SA 5039</h6>
							<h6 style={{ color: ThemeColors.textColor_fade }}>+61 8 7225 9002</h6>
							<h6 style={{ color: ThemeColors.textColor_fade }}>info@dnsleads.com.au</h6>
						</div>
					</div>
				</div>
				<div className='footer-details'>
					<Link to='/' className='footer-link'>
						HOME
					</Link>
					<Link to='#' className='footer-link'>
						CLIENTS
					</Link>
					<Link to='/services' className='footer-link'>
						SERVICES
					</Link>
					<Link to='/about-us' className='footer-link'>
						ABOUT US
					</Link>
					<Link to='/contact-us' className='footer-link'>
						CONTACT US
					</Link>
					<Link to='/products-and-equipments' className='footer-link'>
						PRODUCTS & EQUIPMENT
					</Link>
				</div>
			</section>
			<div className='bottom-line'>
				<div>
					<span style={{ fontSize: '20px' }}>&copy;</span> Copyright 2023 DNS Leads. All rights reserved.
				</div>
				<div>
					Developed By <Link to='#'>ENZY Technologies</Link>
				</div>
			</div>
		</div>
	);
}

export default Footer;

{
	/* <div className="col-4">
    <p className="fw-normal" style={{ color: ThemeColors.textColor_fade }}>
        08 Brett Street,
        <br /> Melrose Park,
        <br /> Adelaide,
        <br /> SA 5039
        <br /> +61 8 7225 9002
        <br /> info@dnsleads.com.au
    </p>
</div>
<div className="col-4 offset-2">
    <div className=" row row-cols-md-1 row-cols-md-2 g-0">
        <div className="col">
            <div className="btn rounded-0" style={{ color: ThemeColors.textColor_fade }}>
                HOME
            </div>
        </div>
        <div className="col">
            <div className="btn rounded-0" style={{ color: ThemeColors.textColor_fade }}>
                CLIENTS
            </div>
        </div>
        <div className="col">
            <div className="btn rounded-0" style={{ color: ThemeColors.textColor_fade }}>
                SERVICES
            </div>
        </div>
        <div className="col">
            <div className="btn rounded-0" style={{ color: ThemeColors.textColor_fade }}>
                ABOUT US
            </div>
        </div>
        <div className="col">
            <div className="btn rounded-0" style={{ color: ThemeColors.textColor_fade }}>
                CONTACT US
            </div>
        </div>
        <div className="col">
            <div className="btn rounded-0" style={{ color: ThemeColors.textColor_fade }}>
                PRODUCTS & EQUIPMENT
            </div>
        </div>
    </div>
</div> */
}
