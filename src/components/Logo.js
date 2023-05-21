import React from 'react';
import { GlobalData } from '../GlobalData';

const Logo = ({ height, width }) => {
	return (
		<div className='logo'>
			<img height={height} width={width} src={GlobalData.CompanyDetails.logo} alt='Logo' />
		</div>
	);
};

export default Logo;
