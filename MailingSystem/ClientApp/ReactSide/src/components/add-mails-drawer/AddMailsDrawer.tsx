import styles from './AddMailsDrawer.module.css';
import { MeasurementsActions } from '../../redux-store/html-measurements';

import Button from 'react-bootstrap/Button';
import AdditionInput from '../addition-input/AdditionInput';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsSpin} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/Hooks';

function AddMailsDrawer() {
    const MailsDrawerRef = useRef<HTMLDivElement | null>(null);
    const MailsDrawerContentRef = useRef<HTMLDivElement | null>(null);
    const Dispatch = useAppDispatch();
    const NavigationBarHeight = useAppSelector((state) => state.Measurements.NavigationBarHeight);

    useEffect(() => {
        let isApplied: boolean = false;

        if (MailsDrawerRef.current && !isApplied) {
            const Height = MailsDrawerRef.current.offsetHeight;
            Dispatch(MeasurementsActions.setAddMailsDrawerHeight(Height));
        };

        return () => {
            isApplied = true;
        }
    }, []);

    const HandleScroll: (event: any) => void = (event) => {
        if (MailsDrawerContentRef.current) {
            const ContentHeight = MailsDrawerContentRef.current.offsetHeight;       
            const CurrentPosition = window.scrollY;

            if (CurrentPosition <= ContentHeight) {
                MailsDrawerRef.current.style.marginTop = `-${CurrentPosition}px`;
            }
            else {
                MailsDrawerRef.current.style.marginTop = `-${ContentHeight}px`;
            }
        };
    };

    useEffect(() => {
        window.addEventListener('scroll', HandleScroll);

        return () => {
            window.removeEventListener('scroll', HandleScroll);
        }
    }, []);

    return (
        <div className={styles.Drawer} ref={MailsDrawerRef} style={{top: `${NavigationBarHeight}px`}}>
            <div ref={MailsDrawerContentRef}>
                <h2 className={styles.DrawerHeader}>Dodaj Maile</h2>
                <p className={styles.DrawerSubHeader}>
                    Wszystkie zebrane przes siebie maile wklej poniżej, aby zsynchronizować je z istniejącą listą i otrzymać nowy zestaw maili sprawdzony pod kątem powtórzeń. 
                    <span style={{color: '#2563eb', fontWeight: '800'}}>Zbiór maili powinien powielać poniższy schemat: aczarnocki@caritasaw.pl, rebecca.thomlinson@sddirect.org.uk, acted.polska@acted.org.</span>
                </p>
            </div>
            <div className='flexHorizontal'>
                <AdditionInput />
                <Button variant="primary" className={`site-button ${styles.DrawerSyncButton}`}>
                    Synchronizuj <FontAwesomeIcon icon={faArrowsSpin} />
                </Button>
            </div>
        </div>
    )
}

export default AddMailsDrawer;