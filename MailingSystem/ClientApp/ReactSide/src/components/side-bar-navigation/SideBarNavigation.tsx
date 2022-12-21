import styles from './SideBarNavigation.module.css';
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../../hooks/Hooks';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie, faChevronCircleRight, faCloudArrowDown, faEnvelopeOpenText, faGrip, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faBell, faEnvelope, faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { MailsActions } from '../../redux-store/mail-data';
import React, { useContext } from 'react';
import AuthContext from '../../context-store/auth-context';

function SideBarNavigation() {
    const Navigate = useNavigate();
    const Dispatch = useAppDispatch();
    const NavigationBarHeight = useAppSelector((state) => state.Measurements.NavigationBarHeight);
    const SideBarHeight = window.innerHeight - NavigationBarHeight;
    const Ctx = useContext(AuthContext);

    const LogoutClickHandler = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        Ctx?.Logout();
        Navigate("/home");
    };

    return (
        <div className={styles.SideBar} style={{
            top: `${NavigationBarHeight}px`, 
            height: `${SideBarHeight}px`,
            maxHeight: `${SideBarHeight}px`,
            minHeight: `${SideBarHeight}px`
        }}>
            <NavLink to={"/mails/home"}
                className={({ isActive }) => isActive ? 
                `${styles.SideBarLink} ${styles.SideBarLinkActive}` : 
                `${styles.SideBarLink}`} style={{marginTop: '0px'}}
            >
                <FontAwesomeIcon icon={faGrip} />
                <span>Przegląd</span>
                <FontAwesomeIcon icon={faChevronCircleRight} className={styles.PseudoElementIcon} />
            </NavLink>
            <NavLink to={"/mails/send"} onClick={() => Dispatch(MailsActions.ClearMailContent())}
                className={({ isActive }) => isActive ? 
                `${styles.SideBarLink} ${styles.SideBarLinkActive}` : 
                `${styles.SideBarLink}`}
            >
                <FontAwesomeIcon icon={faPaperPlane} />
                <span>Wyślij Maila</span>
                <FontAwesomeIcon icon={faChevronCircleRight} className={styles.PseudoElementIcon} />
            </NavLink>
            <NavLink to={"/mails/reminders"} onClick={() => Dispatch(MailsActions.ClearMailContent())}
                className={({ isActive }) => isActive ? 
                `${styles.SideBarLink} ${styles.SideBarLinkActive}` : 
                `${styles.SideBarLink}`}
            >
                <FontAwesomeIcon icon={faBell} />
                <span>Przypominajki</span>
                <FontAwesomeIcon icon={faChevronCircleRight} className={styles.PseudoElementIcon} />
            </NavLink>
            <NavLink to="/mails/recent" className={({ isActive }) => isActive ? 
                `${styles.SideBarLink} ${styles.SideBarLinkActive}` : 
                `${styles.SideBarLink}`}
            >
                <FontAwesomeIcon icon={faEnvelope} />
                <span>Ostatnie Maile</span>
                <FontAwesomeIcon icon={faChevronCircleRight} className={styles.PseudoElementIcon} />
            </NavLink>
            <NavLink to="/mails/templates" className={({ isActive }) => isActive ? 
                `${styles.SideBarLink} ${styles.SideBarLinkActive}` : 
                `${styles.SideBarLink}`}
            >
                <FontAwesomeIcon icon={faEnvelopeOpenText} />
                <span>Szablony</span>
                <FontAwesomeIcon icon={faChevronCircleRight} className={styles.PseudoElementIcon} />
            </NavLink>
            <a href="https://app.gmass.co/dashboard" target="_blank" className={styles.SideBarLink}>
                <FontAwesomeIcon icon={faChartPie} />
                <span>Statystyki</span>
                <FontAwesomeIcon icon={faChevronCircleRight} className={styles.PseudoElementIcon} />
            </a>
            <NavLink to="/mails/web-extractor" className={({ isActive }) => isActive ? 
                `${styles.SideBarLink} ${styles.SideBarLinkActive}` : 
                `${styles.SideBarLink}`}
            >
                <span className={styles.SideBarBadge}>Beta</span>
                <FontAwesomeIcon icon={faCloudArrowDown} />
                <span>Mail Extractor</span>
                <FontAwesomeIcon icon={faChevronCircleRight} className={styles.PseudoElementIcon} />
            </NavLink>
            <button className="LogoutButton" onClick={LogoutClickHandler}>
                <FontAwesomeIcon icon={faRightFromBracket} />
                Wyloguj
            </button>
        </div>
    )
};

export default SideBarNavigation;