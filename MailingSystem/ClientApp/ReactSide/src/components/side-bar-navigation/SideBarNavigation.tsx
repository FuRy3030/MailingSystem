import styles from './SideBarNavigation.module.css';
import { NavLink } from "react-router-dom";
import { useAppSelector } from '../../hooks/Hooks';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelopeOpenText, faGrip, faReplyAll, faSync } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope, faPaperPlane } from "@fortawesome/free-regular-svg-icons";

function SideBarNavigation() {
    const NavigationBarHeight = useAppSelector((state) => state.Measurements.NavigationBarHeight);
    const SideBarHeight = window.innerHeight - NavigationBarHeight;

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
            </NavLink>
            <NavLink to={"/mails/send"}
                className={({ isActive }) => isActive ? 
                `${styles.SideBarLink} ${styles.SideBarLinkActive}` : 
                `${styles.SideBarLink}`}
            >
                <FontAwesomeIcon icon={faPaperPlane} />
                <span>Wyślij Maila</span>
            </NavLink>
            <NavLink to={"/mails/followups"}
                className={({ isActive }) => isActive ? 
                `${styles.SideBarLink} ${styles.SideBarLinkActive}` : 
                `${styles.SideBarLink}`}
            >
                <FontAwesomeIcon icon={faReplyAll} />
                <span>Follow-Upy</span>
            </NavLink>
            <NavLink to="/mails/recent" className={({ isActive }) => isActive ? 
                `${styles.SideBarLink} ${styles.SideBarLinkActive}` : 
                `${styles.SideBarLink}`}
            >
                <FontAwesomeIcon icon={faEnvelope} />
                <span>Ostatnie Maile</span>
            </NavLink>
            <NavLink to="/mails/templates" className={({ isActive }) => isActive ? 
                `${styles.SideBarLink} ${styles.SideBarLinkActive}` : 
                `${styles.SideBarLink}`}
            >
                <FontAwesomeIcon icon={faEnvelopeOpenText} />
                <span>Szablony</span>
            </NavLink>
            <NavLink to="/mails/change-log" className={({ isActive }) => isActive ? 
                `${styles.SideBarLink} ${styles.SideBarLinkActive}` : 
                `${styles.SideBarLink}`}
            >
                <FontAwesomeIcon icon={faSync} />
                <span>Lista Zmian</span>
            </NavLink>
        </div>
    )
};

export default SideBarNavigation;