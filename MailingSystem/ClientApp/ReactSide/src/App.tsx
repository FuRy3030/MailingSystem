import { useState, useRef } from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import LandingPage from './pages/landing-page/LandingPage';
import NavigationBar from './components/navigation-bar/NavigationBar';
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
import MailsExtractor from './subpages/MailsExtractor';
import MailsExtractorOption from './subpages/MailsExtractorOption';

function App() {
  const GoogleButtonRef = useRef<HTMLButtonElement | null>(null);

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
          <Route path="/mails/web-extractor" element={<MailsExtractor />} />
          <Route path="/mails/web-extractor/:OptionKey" element={<MailsExtractorOption />} />
        </Route>
      </Routes>
      <UpdateTokenModal />
    </div>
  );
}

export default App;
