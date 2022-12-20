import styles from './SettingsForms.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckDouble, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import { Form, Field } from 'react-final-form';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { SettingsMailsForm, SettingsMailsFormErrors } from '../../redux-store/redux-entities/types';
import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import AuthContext from '../../context-store/auth-context';
import Config from '../../config/config';
import { useAppDispatch, useAppSelector } from '../../hooks/Hooks';
import { UIActions } from '../../redux-store/ui';
import { GetSettings } from '../../redux-store/settings';

function MailsSettingsForm() {
    const MailSettings = useAppSelector((state) => state.UserConfig.UserConfiguration.UserMailsSettings);
    const Ctx = useContext(AuthContext);
    const Dispatch = useAppDispatch();
    console.log(MailSettings);

    useEffect(() => {
        if (MailSettings.GMassAPIKey == 'NotLoaded') {
            let isSend: boolean = false;
            if (Ctx?.accessToken.token != undefined && Ctx?.accessToken.token != '' && isSend == false) {
                Dispatch(GetSettings(Ctx?.accessToken.token));
            }      
            else if (isSend == false) {
                const TokenObject: string | null = sessionStorage.getItem('accessToken');
                if (TokenObject != null) {
                    Dispatch(GetSettings((JSON.parse(TokenObject)).token));
                }
            }
            
            return () => {
                isSend = true;
            }
        }
    }, []);
    
    const ValidateForm = (FormData: SettingsMailsForm) => {
        let Errors: SettingsMailsFormErrors = {
            GMassAPIKey: '',
            RecipientsSheetId: ''
        };

        if (!FormData.GMassAPIKey) {
            Errors.GMassAPIKey = 'Klucz do twojego API jest wymagany do korzystania z aplikacji';
        }

        type ObjectKey = keyof typeof Errors;
        const Keys: ObjectKey[] = [];

        Object.keys(Errors).forEach((key: string) => {
            Keys.push(key as ObjectKey);
        });

        let isFormValid: boolean = true;

        Keys.forEach((Key: ObjectKey) => {
            if (Errors[Key] != '') {
                isFormValid = false;
                return;
            }
        });

        if (isFormValid) {
            return {};
        }
        else {
            return Errors;
        }
    };

    const onSubmit = (FormData: SettingsMailsForm, Form: any) => {
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${Ctx?.accessToken.token}` 
                },
                body: JSON.stringify(FormData)
            };

            fetch(`${Config.sourceURL}/Configuration/updatemailssettings?Token=${Ctx?.accessToken.token}`, requestOptions)
                .then(ServerResponse => ServerResponse.text())
                .then(TextResponse => {
                    Dispatch(UIActions.setConfigSnackbarVisibility({
                        type: 'Error', 
                        isVisible: false
                    }));

                    Dispatch(UIActions.setConfigSnackbarVisibility({
                        type: 'Success', 
                        isVisible: false
                    }));

                    if (TextResponse == 'Success') {
                        Dispatch(UIActions.setConfigSnackbarVisibility({
                            type: 'Success', 
                            isVisible: true
                        }));
                    }
                    else {
                        Dispatch(UIActions.setConfigSnackbarVisibility({
                            type: 'Error', 
                            isVisible: true
                        }));
                    }
                })
                .catch(() => {
                    Dispatch(UIActions.setConfigSnackbarVisibility({
                        type: 'Error', 
                        isVisible: true
                    }));
                });
        }
        catch {
            Dispatch(UIActions.setConfigSnackbarVisibility({
                type: 'Error', 
                isVisible: true
            }));
        }
    };

    const isFormFieldValid = (meta: any) => { return !!(meta.touched && meta.error) };
    const getFormErrorMessage = (meta: any) => {
        return isFormFieldValid(meta) && <small className="p-error defaultInputError">{meta.error}</small>;
    };
 
    return (
        <div className={styles.FormWrapper}>
            <div className={styles.FormIconIllustration}>
                <FontAwesomeIcon icon={faPaperPlane} className={styles.FormIconIllustrationSVG} />
                <span>Wysyłka Maili</span>
            </div>
            <div className={styles.FormBox}>
                <h2 className={styles.FormBoxHeader}>
                    Konfiguracja Bazy Mailingowej
                </h2>
                <span className={styles.FormBoxDescription}>
                    W tym miejscu znajdują się niezbędne dane umożliwiające korzystanie z narzędzia m.in. klucz API do twojego konta GMass jak i pozostałe pola wpływające na dostępne adresy e-mail w sugestiach i innych miejscach.
                </span>
                <Form onSubmit={onSubmit} initialValues={{ 
                        GMassAPIKey: MailSettings.GMassAPIKey,
                        RecipientsSheetId: MailSettings.RecipientsSheetId
                    }}
                    validate={ValidateForm} render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit} className="p-fluid">
                            <Field name="GMassAPIKey" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label p-input-icon-right defaultSiteInputField"
                                        style={{borderColor: isFormFieldValid(meta) ? "#e24c4c" : "#183153" }}>
                                        <InputText id="GMassAPIKey" {...input} autoFocus 
                                            className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                        <label htmlFor="GMassAPIKey" 
                                            className={classNames({ 'p-error': isFormFieldValid(meta) })}>
                                            Klucz GMassAPI*
                                        </label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />
                            <Field name="RecipientsSheetId" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label p-input-icon-right defaultSiteInputField"
                                        style={{borderColor: isFormFieldValid(meta) ? "#e24c4c" : "#183153" }}>
                                        <InputText id="RecipientsSheetId" {...input} autoFocus 
                                            className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                        <label htmlFor="RecipientsSheetId" 
                                            className={classNames({ 'p-error': isFormFieldValid(meta) })}>
                                            Google Sheet z odbiorcami kampani*
                                        </label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />
                            <Button variant="primary" className={`site-button ${styles.SettingsSaveButton}`}
                                onClick={(event: React.SyntheticEvent<HTMLButtonElement>) => {
                                    handleSubmit(event);
                                }}>
                                Zapisz Zmiany <FontAwesomeIcon icon={faCheckDouble} />
                            </Button>
                        </form>
                )} />
            </div>
        </div>
    );
};

export default MailsSettingsForm;