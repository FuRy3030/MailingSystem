import styles from './LandingPage.module.css';
import React from 'react';
import { useEffect, useRef } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuildingNgo } from "@fortawesome/free-solid-svg-icons";

type LandingPageProps = {
    updateNavBarStyle: (isCurrentlyIntersecting: boolean) => void
}

const LandingPage = React.forwardRef<HTMLButtonElement, LandingPageProps>(({updateNavBarStyle}, buttonRef) => {
    const LandingPageBackgroundElement: any = useRef(null);

    const updateHeaderStyle = (entries: any) => {
        const [ entry ] = entries;
        updateNavBarStyle(entry.isIntersecting);
    }

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    }
  
    useEffect(() => {
        const observer = new IntersectionObserver(updateHeaderStyle, options);
        observer.observe(LandingPageBackgroundElement.current);

        return () => {
            if (LandingPageBackgroundElement.current) {
                observer.unobserve(LandingPageBackgroundElement.current);
            }
        }
    }, []);

    return (
        <div className={styles.LandingPage} ref={LandingPageBackgroundElement}>
            <video autoPlay muted loop>
                <source src="/videos/landing-page-background-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className={styles.LandingPageContent}>
                <h1 className={styles.Header}>Narzędzia do zarządzania organizacją</h1>
                <button ref={buttonRef} id="SignUpButton"></button>
                <img src='/ShortWhiteLogo.svg' alt='logo' className={styles.IMGLogo} />
                <h6 className={styles.SubHeader}>Zaloguj się aby uzyskać dostęp</h6>
            </div>
        </div>
    )
})

export default LandingPage;