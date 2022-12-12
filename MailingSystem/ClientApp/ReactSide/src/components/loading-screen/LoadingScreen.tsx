import styles from './LoadingScreen.module.css';

import { useAppSelector } from '../../hooks/Hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelopeCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';

function LoadingScreen(props: any) {
    const [ProgressVal, setProgressVal] = useState<number>(0);
    const [BufferVal, setBufferVal] = useState<number>(10);

    const NavigationBarHeight = useAppSelector((state) => state.Measurements.NavigationBarHeight);
    const ViewportHeight = window.innerHeight;
    const LoadingScreenHeight = ViewportHeight - NavigationBarHeight;

    useEffect(() => {
        const ProgressBarUpdateInterval = setInterval(() => {
            if (ProgressVal > 100) {
                setProgressVal(0);
                setBufferVal(10);
            } 
            else {
                const FirstNumber = Math.random() * 10;
                const SecondNumber = Math.random() * 10;
                setProgressVal(ProgressVal + FirstNumber);
                setBufferVal(ProgressVal + FirstNumber + SecondNumber);
            }
        }, 500);
    
        return () => {
            clearInterval(ProgressBarUpdateInterval);
        };
    }, [ProgressVal]);
    
    return (
        <div className={styles.LoadingScreen} style={{
            top: `${NavigationBarHeight}px`, 
            height: `${LoadingScreenHeight}px`
        }}>
            <FontAwesomeIcon className={styles.LoadingIcon} icon={faEnvelopeCircleCheck} />
            <LinearProgress className={styles.LoadingBar} variant="buffer" 
                value={ProgressVal} valueBuffer={BufferVal} />
            <span className={styles.LoadingText}>{props.Text}</span>
        </div>
    );
};

export default LoadingScreen;