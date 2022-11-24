import styles from './NavigationBar.module.css';
import { useRef, useEffect } from 'react';
import { useAppDispatch } from '../../hooks/Hooks';
import { MeasurementsActions } from '../../redux-store/html-measurements';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faEnvelopesBulk } from "@fortawesome/free-solid-svg-icons";
import UserAvatar from '../user-avatar/UserAvatar';
import { useContext } from "react";
import AuthContext from "../../context-store/auth-context";

function NavigationBar(props: any) {
    const NavigationBarRef = useRef<HTMLDivElement | null>(null);
    const Ctx = useContext(AuthContext);
    const Dispatch = useAppDispatch();

    const NavBarHeightHandler: () => void = () => {
        if (NavigationBarRef.current) {
            const Height = NavigationBarRef.current.offsetHeight;
            Dispatch(MeasurementsActions.setNavigationBarHeight(Height));
        };
    };

    return (
        <div className={props.isLandingScreenVisible == false ? 
        `${styles.NavBar}` : `${styles.NavBar} ${styles.NavBarTransparent}`} ref={NavigationBarRef}>
            {
                props.isLandingScreenVisible == false ? 
                <img src='/Logo.svg' alt='logo' className={styles.IMGNavbar} onLoad={NavBarHeightHandler} /> :
                <img src='/LogoWhite.svg' alt='logo' className={styles.IMGNavbar} />
            }
            <div className={styles.NavBarContent}>
                <span className={styles.NavBarLink}>
                    Baza Maili <FontAwesomeIcon icon={faEnvelopesBulk} />
                </span>
                {/* <div className={styles.NavBarIcon}>
                    <FontAwesomeIcon icon={faBars} />
                </div> */}
                {Ctx?.isLoggedIn == true ? <UserAvatar /> : <></>}
            </div>
        </div>
    )
}

export default NavigationBar;