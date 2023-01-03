import styles from './LandingPage.module.css';
import React, { useContext } from 'react';
import { useEffect, useRef } from 'react';
import jwt_decode from 'jwt-decode';

import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import AuthContext from '../../context-store/auth-context';
import { useNavigate } from 'react-router-dom';
import Config from '../../config/config';

type LandingPageProps = {
    updateNavBarStyle: (isCurrentlyIntersecting: boolean) => void
};

interface IGoogleUser {
    aud: string;
    azp: string;
    email: string;
    email_verified: boolean;
    exp: number;
    family_name: string;
    given_name: string;
    hd: string;
    iat: number;
    iss: string;
    jti: string;
    name: string;
    nbf: number;
    picture: string;
    sub: string;
};

const LandingPage = React.forwardRef<HTMLButtonElement, LandingPageProps>(({updateNavBarStyle}, buttonRef) => {
    const LandingPageBackgroundElement: any = useRef(null);
    const Ctx = useContext(AuthContext);
    const navigate = useNavigate();

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

    const OnLoginSuccess = (CredentialResponse: CredentialResponse) => {
        if (CredentialResponse.credential) {
            const GoogleUser: IGoogleUser = jwt_decode(CredentialResponse.credential);
            const PictureSource: string = GoogleUser.picture;
            Ctx?.setPictureSource(PictureSource);

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            };

            fetch(`${Config.sourceURL}/Auth/googleverification?Token=` + CredentialResponse.credential, requestOptions)
                .then(response => response.json())
                .then(data => {
                    Ctx?.setLoggedStatus(true);
                    Ctx?.setRefreshToken(data.refreshToken);
                    Ctx?.setAccessToken({
                        token: data.accessToken, 
                        expirationDate: new Date(data.accessTokenExpirationTime)
                    });
                    const ExpirationDate: Date = new Date(data.accessTokenExpirationTime);
                    const CurrentDate: Date = new Date();
                    console.log(Math.round(ExpirationDate.getTime() - CurrentDate.getTime()));
                    Ctx?.setTimeToUpdateAccessToken(Math.round(ExpirationDate.getTime() - CurrentDate.getTime()));

                    return navigate("/mails/home");
                });
        }
    }

    return (
        <div className={styles.LandingPage} ref={LandingPageBackgroundElement}>
            <video autoPlay muted loop>
                <source src="/videos/landing-page-background-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className={styles.LandingPageContent}>
                <h1 className={styles.Header}>Narzędzia do zarządzania organizacją</h1>
                <GoogleLogin
                    onSuccess={OnLoginSuccess}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                />
                <img src='/ShortWhiteLogo.svg' alt='logo' className={styles.IMGLogo} />
                <h6 className={styles.SubHeader}>Zaloguj się aby uzyskać dostęp</h6>
            </div>
        </div>
    )
});

export default LandingPage;