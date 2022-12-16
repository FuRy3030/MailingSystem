import React, { useState, useEffect, useContext, useRef } from 'react';
import './App.css';
import jwt_decode from 'jwt-decode';
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LandingPage from './pages/landing-page/LandingPage';
import NavigationBar from './components/navigation-bar/NavigationBar';
import configData from './config/config';
import AuthContext from './context-store/auth-context';
import MailBasePage from './pages/mail-base-page/MailBasePage';
import Protected from './pages/protected-page-layer/ProtectedPage';
import UpdateTokenModal from './components/update-token-modal/UpdateTokenModal';
import Dashboard from './subpages/Dashboard';
import RecentMails from './subpages/RecentMails';
import SendMail from './subpages/SendMail';
import Templates from './subpages/Templates';
import TemplatesAdd from './subpages/TemplatesAdd';
import TemplatesEdit from './subpages/TemplatesEdit';
import Reminders from './subpages/Reminders';
import SettingsPage from './pages/settings/SettingsPage';

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

function App() {
  const Ctx = useContext(AuthContext);
  const navigate = useNavigate();
  const GoogleButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    let isFetched: boolean = false;

    if (GoogleButtonRef.current) {
      google.accounts.id.initialize({
        client_id: "104279093815-npg46ifu43hcogj2o1iovu4qbu1lph1t.apps.googleusercontent.com",
        callback: (Response: any) => {
          const GoogleUser: IGoogleUser = jwt_decode(Response.credential);
          const PictureSource: string = GoogleUser.picture;
          Ctx?.setPictureSource(PictureSource);

          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          };
          fetch(`${configData.sourceURL}/Auth/googleverification?Token=` + Response.credential, requestOptions)
            .then(response => response.json())
            .then(data => {
              if (isFetched == false) {
                console.log(jwt_decode(data.accessToken));
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
              }
            });
        }
      });

      google.accounts.id.renderButton(
        document.getElementById('SignUpButton'),
        { theme: "outline", size: "large"}
      );

      return () => {
        isFetched = true;
      }
    }
  }, [GoogleButtonRef.current]);

  const [ isIntersecting, setIsIntersecting ] = useState(false);

  const updateNavBarStyle = (isCurrentlyIntersecting: boolean) => {
    setIsIntersecting(isCurrentlyIntersecting);
  };

  return (
    <div className="App">
      <NavigationBar isLandingScreenVisible={isIntersecting} />
      <Routes>
        <Route path="/" element={<LandingPage ref={GoogleButtonRef} updateNavBarStyle={updateNavBarStyle} />}>
          <Route path="home" element={<LandingPage ref={GoogleButtonRef} updateNavBarStyle={updateNavBarStyle} />} />
        </Route>
        <Route path="/settings" element={<Protected> <SettingsPage /> </Protected>} />
        <Route path="/mails" element={<Protected> <MailBasePage /> </Protected>}>
          <Route path="/mails/" element={<Dashboard />} />
          <Route path="/mails/home" element={<Dashboard />} />
          <Route path="/mails/recent" element={<RecentMails />} />
          <Route path="/mails/send" element={<SendMail />} />
          <Route path="/mails/templates" element={<Templates />} />
          <Route path="/mails/templates/add" element={<TemplatesAdd />} />
          <Route path="/mails/templates/edit/:TemplateId" element={<TemplatesEdit />} />
          <Route path="/mails/reminders" element={<Reminders />} />
        </Route>
      </Routes>
      <UpdateTokenModal />
    </div>
  );
}

export default App;
