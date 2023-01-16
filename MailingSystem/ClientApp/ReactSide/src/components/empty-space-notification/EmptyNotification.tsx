import styles from './EmptyNotification.module.css';

function EmptyNotification(props: any) {
    return (
        <div className={props.IsSmallerVersion == true ? `${styles.EmptyNotification} ${styles.EmptyNotificationSmall}` : 
            `${styles.EmptyNotification}`} style={{marginTop: props.MarginTop}}>
            <img src='/images/empty-folder.png' alt='Empty folder icon'/>
            <span>Narazie świeci tu pustką...</span>
        </div>
    )
};

export default EmptyNotification;