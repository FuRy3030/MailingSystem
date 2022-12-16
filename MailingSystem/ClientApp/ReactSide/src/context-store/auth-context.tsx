import React, { useState, useEffect } from 'react';

interface AuthCtx {
    isLoggedIn: boolean;
    accessToken: {
        token: string;
        expirationDate: Date;
    }
    refreshToken: string;
    millisecondsToUpdateAccessToken: number;
    pictureSource: string;
    setRefreshToken: (refreshToken: string) => void;
    setAccessToken: (accessToken: { token: string; expirationDate: Date; }) => void;
    setLoggedStatus: (isLoggedIn: boolean) => void;
    setTimeToUpdateAccessToken: (time: number) => void;
    setPictureSource: (pictureSource: string) => void;
    Logout: () => void;
}

const AuthContext = React.createContext<AuthCtx | null>(null);

export const AuthContextProvider = (props: any) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [refreshToken, setRefreshToken] = useState('');
    const [accessToken, setAccessToken] = useState({token: '', expirationDate: new Date()});
    const [millisecondsToUpdateAccessToken, setMillisecondsToUpdateAccessToken] = useState(0);
    const [pictureSource, setPictureSource] = useState('');

    useEffect(() => {
        let isApplied: Boolean = false;

        if (isApplied == false) {
            const LoggedStatus: string | null = sessionStorage.getItem('isLoggedIn');
            const RefreshToken: string | null = sessionStorage.getItem('refreshToken');
            const AccessToken: string | null = sessionStorage.getItem('accessToken');
            const TimeToUpdateToken: string | null = sessionStorage.getItem('timeToTokenRefresh');
            const PictureSource: string | null = sessionStorage.getItem('pictureSource');
        
            if (LoggedStatus === 'true') {
                setIsLoggedIn(true);
            }
            if (RefreshToken != null) {
                setRefreshToken(RefreshToken);
            }
            if (AccessToken != null) {
                setAccessToken(JSON.parse(AccessToken));
            }
            if (TimeToUpdateToken != null && AccessToken != null) {
                const AccessTokenObj = JSON.parse(AccessToken);
                const ExpirationDate: Date = new Date(AccessTokenObj.expirationDate);
                const CurrentDate: Date = new Date();
                const DifferenceInMillisec: number = Math.round(ExpirationDate.getTime() - CurrentDate.getTime());

                if (DifferenceInMillisec > 0) {
                    setMillisecondsToUpdateAccessToken(DifferenceInMillisec);
                }
            }
            if (PictureSource != null) {
                setPictureSource(PictureSource);
            }
        }

        return () => {
            isApplied = true;
        }
    }, []);

    const LoggedStatusHandler = (isLoggedIn: boolean) => {
        sessionStorage.setItem('isLoggedIn', `${isLoggedIn}`);
        setIsLoggedIn(isLoggedIn);
    };

    const RefreshTokenHandler = (refreshToken: string) => {
        sessionStorage.setItem('refreshToken', refreshToken);
        setRefreshToken(refreshToken);
    };

    const AccessTokenHandler = (accessToken: { token: string; expirationDate: Date; }) => {
        sessionStorage.setItem('accessToken', JSON.stringify(accessToken));
        setAccessToken(accessToken);
    };

    const MillisecondsToUpdateHandler = (milliseconds: number) => {
        sessionStorage.setItem('timeToTokenRefresh', milliseconds.toString());
        setMillisecondsToUpdateAccessToken(milliseconds);
    };

    const PictureSourceHandler = (userPictureSource: string) => {
        sessionStorage.setItem('pictureSource', userPictureSource);
        setPictureSource(userPictureSource);
    };

    const LogoutHandler = () => {
        setIsLoggedIn(false);
        setRefreshToken('');
        setAccessToken({
            token: '',
            expirationDate: new Date()
        });
        setMillisecondsToUpdateAccessToken(0);
        setPictureSource('');
        sessionStorage.setItem('isLoggedIn', `${false}`);
        sessionStorage.setItem('refreshToken', '');
        sessionStorage.setItem('accessToken', '');
        sessionStorage.setItem('timeToTokenRefresh', '');
        sessionStorage.setItem('pictureSource', '');
    };

    const InitialAuthContext: AuthCtx = {
        isLoggedIn: isLoggedIn,
        accessToken: accessToken,
        refreshToken: refreshToken,
        millisecondsToUpdateAccessToken: millisecondsToUpdateAccessToken,
        pictureSource: pictureSource,
        setLoggedStatus: LoggedStatusHandler,
        setRefreshToken: RefreshTokenHandler,
        setAccessToken: AccessTokenHandler,
        setTimeToUpdateAccessToken: MillisecondsToUpdateHandler,
        setPictureSource: PictureSourceHandler,
        Logout: LogoutHandler
    };

    return (
        <AuthContext.Provider value={InitialAuthContext}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContext;