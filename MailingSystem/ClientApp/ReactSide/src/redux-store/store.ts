import { configureStore } from '@reduxjs/toolkit';

import ActivityHistoryReducer from './activity-log';
import MeasurementsReducer from './html-measurements';
import MailsReducer from './mail-data';
import UIReducer from './ui';
import TemplatesReducer from './templates-data';
import UserConfig from './settings';

const ReduxStore = configureStore({
  reducer: { 
    ActivityHistory: ActivityHistoryReducer,
    Measurements: MeasurementsReducer,
    Mails: MailsReducer,
    UI: UIReducer,
    Templates: TemplatesReducer,
    UserConfig: UserConfig
  }
});

export type RootState = ReturnType<typeof ReduxStore.getState>;
export type AppDispatch = typeof ReduxStore.dispatch;

export default ReduxStore;
