import React from 'react';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { ThemeColors } from '../Styling/Colors';

const BulletText = ({ className, children }) => {
	return (
		<div className={'d-flex align-items-center' + className}>
			<RadioButtonCheckedIcon style={{ color: ThemeColors.red }} className='me-3' />
			<span>{children}</span>
		</div>
	);
};

export default BulletText;
