import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';

const NavMenu = () => {
	const [isOpen, setIsOpen] = useState(null);
	const handleClose = () => {
		setIsOpen(false);
	};
	if (!isOpen) {
		return <div>{/* <Avatar src='/broken-image.jpg' /> */}</div>;
	}
	return (
		<Menu
			id='basic-menu'
			open={isOpen}
			onClose={handleClose}
			MenuListProps={{
				'aria-labelledby': 'basic-button',
			}}
		>
			<MenuItem onClick={handleClose}>Profile</MenuItem>
			<MenuItem onClick={handleClose}>My account</MenuItem>
			<MenuItem onClick={handleClose}>Logout</MenuItem>
		</Menu>
	);
};

export default NavMenu;
