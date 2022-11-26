import { configureStore } from '@reduxjs/toolkit';

import MeasurementsReducer from './html-measurements';
import MailsReducer from './mail-data';
import UIReducer from './ui';

const ReduxStore = configureStore({
  reducer: { 
    Measurements: MeasurementsReducer,
    Mails: MailsReducer,
    UI: UIReducer
  },
});

export type RootState = ReturnType<typeof ReduxStore.getState>;
export type AppDispatch = typeof ReduxStore.dispatch;

export default ReduxStore;