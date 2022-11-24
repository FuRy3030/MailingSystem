import styles from './SearchBar.module.css';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Divider from '@mui/material/Divider';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function SearchBar() {
    return (
        <InputGroup className={styles.searchbar}>
            <Form.Control className={styles.input} placeholder="Dotknij aby zacząć szukać" />
            <Divider sx={{borderColor: '#dddddd'}} variant="middle" flexItem orientation="vertical" />
            <InputGroup.Text className={styles.addon}>
                <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.addonIcon} />
            </InputGroup.Text>
        </InputGroup>
    )
}

export default SearchBar;