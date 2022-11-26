import styles from './Snackbars.module.css';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import { useState, useEffect } from 'react';

function AdjustableSnackbar(props: any) {
    const [isOpen, setIsOpen] = useState(props.isOpen);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setIsOpen(false);
        props.updateStateInStore(false);
    };

    useEffect(() => {
        setIsOpen(props.isOpen);
    }, [props.isOpen]);

    return (
        <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose} 
            anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
            <Alert severity={props.type} onClose={() => {handleClose()}} className={styles.CustomSnackbar}>
                <AlertTitle className={styles.CustomSnackbarTitle}>{props.title}</AlertTitle>
                {props.content}
            </Alert>
        </Snackbar>
    )
};

export default AdjustableSnackbar;