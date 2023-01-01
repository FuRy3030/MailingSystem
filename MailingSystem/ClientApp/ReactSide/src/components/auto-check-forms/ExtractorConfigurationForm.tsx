import styles from './ExtractorConfigurationForm.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlassChart } from '@fortawesome/free-solid-svg-icons';

import { Form, Field } from 'react-final-form';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { MailExtractorConfigurationForm, MailExtractorConfigurationFormErrors, SettingsMailsForm, SettingsMailsFormErrors } from '../../redux-store/redux-entities/types';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import Config from '../../config/config';
import { UIActions } from '../../redux-store/ui';
import { Dropdown } from 'primereact/dropdown';
import { useParams } from 'react-router-dom';
import { AvaliableExtractionOptions, SourceOption } from '../autocompletes/BigAutoCompleteExtractor';

function ExtractorConfigurationForm() {
    const [EmploymentType, setEmploymentType] = useState<number>(0);
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

    const onSubmit = (FormData: MailExtractorConfigurationForm, Form: any) => {
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
        </div>
    );
};

export default ExtractorConfigurationForm;