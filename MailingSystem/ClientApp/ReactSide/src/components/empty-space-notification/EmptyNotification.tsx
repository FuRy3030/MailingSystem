import styles from './EmptyNotification.module.css';

function EmptyNotification() {
    return (
        <div className={styles.EmptyNotification}>
            <img src='/images/empty-folder.png' alt='Empty folder icon'/>
            <span>Narazie świeci tu pustką...</span>
        </div>
    )
};

export default EmptyNotification;