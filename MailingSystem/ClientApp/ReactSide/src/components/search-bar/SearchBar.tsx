import styles from './SearchBar.module.css';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { DividerExtended } from '../divider/Divider';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faHandPointRight } from '@fortawesome/free-regular-svg-icons';
import { useState } from 'react';

function SearchBar(props: any) {
    const [isInputGroupFocused, setIsInputGroupFocused] = useState<boolean>(false);

    const InputFocusHandler = (event: React.FocusEvent<HTMLInputElement>) => {
        setIsInputGroupFocused(true);
    };

    const InputLostFocusHandler = (event: any) => {
        setIsInputGroupFocused(false);
    };

    const OnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onChangeFunction(event.currentTarget.value);
    };

    return (
        <InputGroup className={isInputGroupFocused == true ? 
        `${styles.searchbar} ${styles.focusedInput}` : styles.searchbar}>
            <InputGroup.Text className={styles.addon}>
                <FontAwesomeIcon icon={faHandPointRight} className={styles.addonIcon} />
            </InputGroup.Text>
            <DividerExtended />
            <Form.Control className={styles.input} placeholder="Dotknij aby zacząć szukać" 
                onBlur={InputLostFocusHandler} onFocus={InputFocusHandler} onChange={OnChangeHandler} />
            <DividerExtended />
            <InputGroup.Text className={styles.addon}>
                <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.addonIcon} />
            </InputGroup.Text>
        </InputGroup>
    )
}

export default SearchBar;