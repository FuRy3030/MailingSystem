import styles from './AdditionInput.module.css';
import React, { useState } from 'react';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Divider from '../divider/Divider';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faEnvelope } from "@fortawesome/free-solid-svg-icons";

type AdditionInputProps = {
    updateEmailsString: (EmailsString: string) => void
};

const AdditionInput = React.forwardRef<HTMLInputElement, AdditionInputProps>(({updateEmailsString}, inputRef) => {
    const [isInputGroupFocused, setIsInputGroupFocused] = useState(false);
    const InputValueChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateEmailsString(event.currentTarget.value);
    };

    const InputFocusHandler = (event: React.FocusEvent<HTMLInputElement>) => {
        setIsInputGroupFocused(true);
    };

    const InputLostFocusHandler = (event: any) => {
        setIsInputGroupFocused(false);
    };

    return (
        <InputGroup className={isInputGroupFocused == true ? 
            `${styles.additionInput} ${styles.focusedInput}` : styles.additionInput}>
            <InputGroup.Text className={styles.addon}>
                <FontAwesomeIcon icon={faAt} className={styles.addonIcon} />
            </InputGroup.Text>
            <Divider />
            <Form.Control onChange={InputValueChangeHandler} ref={inputRef} onFocus={InputFocusHandler}
                className={styles.input} placeholder="Wklej wszystkie maile, które chcesz wysłać do firm" 
                onBlur={InputLostFocusHandler} />
            <Divider />
            <InputGroup.Text className={styles.addon}>
                <FontAwesomeIcon icon={faEnvelope} className={styles.addonIcon} />
            </InputGroup.Text>
        </InputGroup>
    )
});

export default AdditionInput;