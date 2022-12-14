import styles from './Input.module.css';
import React, { useState } from 'react';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Divider from '../divider/Divider';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch } from '../../hooks/Hooks';
import { MailsActions } from '../../redux-store/mail-data';

const MailTitleInput = React.forwardRef<HTMLInputElement, {}>(({}, inputRef) => {
    const [isInputGroupFocused, setIsInputGroupFocused] = useState<boolean>(false);
    const Dispatch = useAppDispatch();

    const InputFocusHandler = (event: React.FocusEvent<HTMLInputElement>) => {
        setIsInputGroupFocused(true);
    };

    const InputLostFocusHandler = (event: any) => {
        setIsInputGroupFocused(false);
    };

    const UpdateMailTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        Dispatch(MailsActions.UpdateMailTitle(event.currentTarget.value));
    };

    return (
        <InputGroup className={isInputGroupFocused == true ? 
            `${styles.additionInput} ${styles.focusedInput}` : styles.additionInput}>
            <InputGroup.Text className={styles.addon}>
                <FontAwesomeIcon icon={faAt} className={styles.addonIcon} />
            </InputGroup.Text>
            <Divider />
            <Form.Control onFocus={InputFocusHandler} className={styles.input} ref={inputRef}
                placeholder="Temat maila" onBlur={InputLostFocusHandler} onChange={UpdateMailTitle} />
            <Divider />
            <InputGroup.Text className={styles.addon}>
                <FontAwesomeIcon icon={faEnvelope} className={styles.addonIcon} />
            </InputGroup.Text>
        </InputGroup>
    )
});

export default MailTitleInput;