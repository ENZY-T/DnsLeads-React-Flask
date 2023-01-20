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
            id="basic-menu"
            open={isOpen}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem key={0} onClick={handleClose}>
                Profile
            </MenuItem>
            <MenuItem key={1} onClick={handleClose}>
                My account
            </MenuItem>
            <MenuItem key={2} onClick={handleClose}>
                Logout
            </MenuItem>
        </Menu>
    );
};

export default NavMenu;
