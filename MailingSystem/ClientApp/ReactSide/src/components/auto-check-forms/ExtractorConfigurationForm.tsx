import styles from './ExtractorConfigurationForm.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlassChart } from '@fortawesome/free-solid-svg-icons';

import { Form, Field } from 'react-final-form';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { IExtractedMail, MailExtractorConfigurationForm, MailExtractorConfigurationFormErrors, SettingsMailsForm, SettingsMailsFormErrors } from '../../redux-store/redux-entities/types';
import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import Config from '../../config/config';
import { UIActions } from '../../redux-store/ui';
import { Dropdown } from 'primereact/dropdown';
import { useParams } from 'react-router-dom';
import { AvaliableExtractionOptions, SourceOption } from '../autocompletes/BigAutoCompleteExtractor';
import AuthContext from '../../context-store/auth-context';
import { useAppDispatch } from '../../hooks/Hooks';
import { MailsActions } from '../../redux-store/mail-data';
import LoadingScreen from '../loading-screen/LoadingScreen';

function ExtractorConfigurationForm() {
    const Ctx = useContext(AuthContext);
    const Dispatch = useAppDispatch();
    const [EmploymentType, setEmploymentType] = useState<number>(0);
    const [isLoadingPageShowed, setIsLoadingPageShowed] = useState<boolean>(false);
    const { OptionKey } = useParams();
    let ChosenOption: SourceOption | undefined;

    if (OptionKey) {
        ChosenOption = AvaliableExtractionOptions.find((Option: SourceOption) => {
            return Option.EnumValue == parseInt(OptionKey);
        });
    }
    
    const ValidateForm = (FormData: MailExtractorConfigurationForm) => {
        let Errors: MailExtractorConfigurationFormErrors = {
            PageNumber: ''
        };

        if (isNaN(parseInt(FormData.PageNumber))) {
            Errors.PageNumber = 'Pole musi być liczbą całkowitą!';
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

    const onSubmit = async (FormData: MailExtractorConfigurationForm, Form: any) => {
        try {
            setIsLoadingPageShowed(true);

            const requestOptions = {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${Ctx?.accessToken.token}` 
                },
                body: JSON.stringify({
                    ExtractorSource: OptionKey,
                    PageNumber: parseInt(FormData.PageNumber),
                    MailSource: EmploymentType
                })
            };

            const Response = await fetch(`${Config.sourceURL}/MailExtractor/scrapenewmails`, requestOptions);

            if (Response.ok) {
                const ParsedResponse = await Response.json();

                const ExtractedMails: IExtractedMail[] = ParsedResponse.map((Mail: any, index: number) => {
                    return { 
                        id: index,  
                        MailAddress: Mail.Email,
                        CompanyName: Mail.CompanyName,
                        DoesEmailExists: Mail.DoesEmailExists
                    } as IExtractedMail
                });

                ExtractedMails.forEach((Mail: IExtractedMail) => {
                    Dispatch(MailsActions.AddExtractedMail(Mail));
                });
            }
            else {
                Dispatch(UIActions.setDefaultSnackbarVisibility({
                    type: 'Error', 
                    isVisible: true
                }));
            }

            setIsLoadingPageShowed(false);
        }
        catch {
            setIsLoadingPageShowed(false);
            Dispatch(UIActions.setDefaultSnackbarVisibility({
                type: 'Error', 
                isVisible: true
            }));
        }
    };

    const isFormFieldValid = (meta: any) => { return !!(meta.touched && meta.error) };
    const getFormErrorMessage = (meta: any) => {
        return isFormFieldValid(meta) && <small className="p-error defaultInputError">{meta.error}</small>;
    };

    let SubmitFunction: any;
 
    return (
        <div className={styles.FormWrapper}>
            <Form onSubmit={onSubmit} initialValues={{ PageNumber: '' }}
                validate={ValidateForm} render={({ handleSubmit }) => {
                    SubmitFunction = handleSubmit;
                    return (
                    <form onSubmit={handleSubmit} className={styles.ConfigurationForm}>
                        <Field name="PageNumber" render={({ input, meta }) => (
                            <div className={`field ${styles.FlexField}`}>
                                <span className="p-float-label p-input-icon-right defaultSiteInputField"
                                    style={{borderColor: isFormFieldValid(meta) ? "#e24c4c" : "#183153" }}>
                                    <InputText id="PageNumber" {...input} autoFocus 
                                        className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                    <label htmlFor="PageNumber" 
                                        className={classNames({ 'p-error': isFormFieldValid(meta) })}>
                                        Numer Strony*
                                    </label>
                                </span>
                                {getFormErrorMessage(meta)}
                            </div>
                        )} />
                        <div className="field">
                            <span className="p-float-label defaultSiteSelectField" style={{marginLeft: '2.5vw'}}>
                                <Dropdown id="EmploymentType" defaultValue={0} value={EmploymentType} 
                                    options={ChosenOption?.EmploymentTypes} optionLabel="Name" 
                                    onChange={(e) => setEmploymentType(e.value)} />
                                <label htmlFor="EmploymentType">
                                    Źródło Maili*
                                </label>
                            </span>
                        </div>
                    </form>
                )}} />
            <Button variant="primary" className={`site-button ${styles.ExtractMailsButton}`} type="submit"
                onClick={(event: React.SyntheticEvent<HTMLButtonElement>) => {
                    SubmitFunction(event);
                }}>
                Znajdź Maile <FontAwesomeIcon icon={faMagnifyingGlassChart} />
            </Button>
            {isLoadingPageShowed && <LoadingScreen Text={'Zbieramy adresy e-mail z sieci. To może chwilę potrwać...'} />}
        </div>
    );
};

export default ExtractorConfigurationForm;