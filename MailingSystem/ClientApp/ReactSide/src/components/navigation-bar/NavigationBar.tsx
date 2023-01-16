import styles from './NavigationBar.module.css';
import React, { useEffect, useRef } from 'react';
import { useAppDispatch } from '../../hooks/Hooks';
import { MeasurementsActions } from '../../redux-store/html-measurements';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faChartSimple, faEnvelopesBulk, faGear } from "@fortawesome/free-solid-svg-icons";
import UserAvatar from '../user-avatar/UserAvatar';
import { useContext } from "react";
import AuthContext from "../../context-store/auth-context";
import { useNavigate } from 'react-router-dom';
import UtilityLoad from '../utility-components/UtilityLoad';

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

    const ActivityHistoryClickHandler = () => {
        Navigate("/activity/history");
    };

    const OptionsClickHandler = () => {
        Navigate("/settings");
    };

    const StatisticsClickHandler = () => {
        Navigate("/activity/statistics");
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
                <span className={styles.NavBarLink} onClick={StatisticsClickHandler}>
                    Statystyki Zespołu <FontAwesomeIcon icon={faChartSimple} />
                </span>
                {Ctx?.isLoggedIn == true ? 
                    <React.Fragment>
                        <FontAwesomeIcon icon={faBell} className={styles.NavBarIcon} 
                            onClick={ActivityHistoryClickHandler} />
                        <FontAwesomeIcon icon={faGear} className={styles.NavBarIcon} 
                            onClick={OptionsClickHandler} />
                        <UserAvatar isLandingScreenVisible={props.isLandingScreenVisible} />                       
                    </React.Fragment>
                    : 
                    <></>
                }
            </div>
            {props.isLandingScreenVisible == false ? <UtilityLoad /> : <></>}
        </div>
    )
}

export default NavigationBar;