import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GlobalData, pagesData } from '../GlobalData';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function NewNavBar() {
    const [isBuggerClicked, setIsBuggerClicked] = useState(true);
    const [isNavProfileClicked, setIsNavProfileClicked] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const [loginStatus, setLoginStatus] = useState(false);
    const [profileLogo, setProfileLogo] = useState('?');

    useEffect(() => {
        window.addEventListener('resize', () => {
            setWindowWidth(window.innerWidth);
        });
    }, []);

    useEffect(() => {
        if (windowWidth <= 800) {
            setIsBuggerClicked(false);
        } else {
            setIsBuggerClicked(true);
        }
    }, [windowWidth]);

    const profileMenuHAndle = () => {
        setIsNavProfileClicked(!isNavProfileClicked);
        if (windowWidth <= 800 && isBuggerClicked === true) {
            setIsBuggerClicked(!isBuggerClicked);
        }
    };

    const burgerClickHandle = () => {
        setIsBuggerClicked(!isBuggerClicked);
        if (windowWidth <= 800) {
            setIsNavProfileClicked(false);
        }
    };

    return (
        <div className="new-nav-bar">
            <div className="container">
                <div className="nav-item-container">
                    <div className={isBuggerClicked ? 'burger bugger-clicked' : 'burger'} onClick={() => burgerClickHandle()}>
                        <div className="bar b1"></div>
                        <div className="bar b2"></div>
                        <div className="bar b3"></div>
                    </div>
                    <div className="logo">
                        <img src={GlobalData.media.logo} alt="Logo" />
                    </div>
                    <ul className="all-nav-items" style={{ display: isBuggerClicked ? 'flex' : 'none' }}>
                        {pagesData.map((pagedt, index) => (
                            <Link className="nav-item" to={pagedt.link} key={index}>
                                <li>{pagedt.name}</li>
                            </Link>
                        ))}
                    </ul>
                </div>
                <div className="nav-profile-container">
                    <div className="profile-icon" onClick={() => profileMenuHAndle()}>
                        {!loginStatus ? '?' : 'M'}
                    </div>
                    <div className="profile-popup" style={{ display: isNavProfileClicked ? 'block' : 'none' }}>
                        <ul className="profile-popup-container">
                            {!loginStatus ? (
                                <>
                                    <Link className="profile-popup-link" to="/login">
                                        <li>Login</li>
                                    </Link>
                                    <Link className="profile-popup-link" to="/register">
                                        <li>Register</li>
                                    </Link>
                                </>
                            ) : (
                                settings.map((setting, index) => (
                                    <Link className="profile-popup-link" to="#" key={index}>
                                        <li>{setting}</li>
                                    </Link>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewNavBar;
