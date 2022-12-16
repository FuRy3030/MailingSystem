import styles from './NavigationBar.module.css';
import React, { useRef, useEffect } from 'react';
import { useAppDispatch } from '../../hooks/Hooks';
import { MeasurementsActions } from '../../redux-store/html-measurements';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faEnvelopesBulk, faGear } from "@fortawesome/free-solid-svg-icons";
import UserAvatar from '../user-avatar/UserAvatar';
import { useContext } from "react";
import AuthContext from "../../context-store/auth-context";
import { useNavigate } from 'react-router-dom';

function NavigationBar(props: any) {
    const NavigationBarRef = useRef<HTMLDivElement | null>(null);
    const Ctx = useContext(AuthContext);
    const Dispatch = useAppDispatch();
    const Navigate = useNavigate();

    const NavBarHeightHandler: () => void = () => {
        if (NavigationBarRef.current) {
            const Height = NavigationBarRef.current.offsetHeight;
            Dispatch(MeasurementsActions.setNavigationBarHeight(Height));
        };
    };

    const OptionsClickHandler = () => {
        Navigate("/settings");
    };

    const MailsClickHandler = () => {
        Navigate("/mails/home");
    };

    const HomeClickHandler = () => {
        Navigate("/home");
    };

    return (
        <div className={props.isLandingScreenVisible == false ? 
        `${styles.NavBar}` : `${styles.NavBar} ${styles.NavBarTransparent}`} ref={NavigationBarRef}>
            {
                props.isLandingScreenVisible == false ? 
                <img src='/Logo.svg' alt='logo' className={styles.IMGNavbar} onLoad={NavBarHeightHandler} 
                    onClick={HomeClickHandler} /> 
                :
                <img src='/LogoWhite.svg' alt='logo' className={styles.IMGNavbar} 
                    onClick={HomeClickHandler} />
            }
            <div className={styles.NavBarContent}>
                <span className={styles.NavBarLink} onClick={MailsClickHandler}>
                    Baza Maili <FontAwesomeIcon icon={faEnvelopesBulk} />
                </span>
                {Ctx?.isLoggedIn == true ? 
                    <React.Fragment>
                        <FontAwesomeIcon icon={faGear} className={styles.NavBarIcon} 
                            style={{marginRight: '1vw'}} onClick={OptionsClickHandler} />
                        <UserAvatar isLandingScreenVisible={props.isLandingScreenVisible} />                       
                    </React.Fragment>
                    : 
                    <></>
                }
            </div>
        </div>
    )
}

export default NavigationBar;