import styles from './AdditionInput.module.css';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Divider from '@mui/material/Divider';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAt, faEnvelope } from "@fortawesome/free-solid-svg-icons";

function AdditionInput() {
    return (
        <InputGroup className={styles.additionInput}>
            <InputGroup.Text className={styles.addon}>
                <FontAwesomeIcon icon={faAt} className={styles.addonIcon} />
            </InputGroup.Text>
            <Form.Control className={styles.input} placeholder="Wklej wszystkie maile, które chcesz wysłać do firm" />
            <InputGroup.Text className={styles.addon}>
                <FontAwesomeIcon icon={faEnvelope} className={styles.addonIcon} />
            </InputGroup.Text>
        </InputGroup>
    )
}

export default AdditionInput;