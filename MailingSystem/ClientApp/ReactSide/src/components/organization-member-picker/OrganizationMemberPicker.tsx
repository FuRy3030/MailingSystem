import styles from './OrganizationMemberPicker.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

function OrganizationMemberPicker() {
    return (
        <div className={styles.OrganizationMemberPickerWrapper}>
            <div className={styles.AllMembersChip}>
                <img alt="Logo" src='/Logo.svg' className={styles.Logo} />
                <span>Wszyscy</span>
                <FontAwesomeIcon icon={faCheck} className={styles.AllMembersChipIcon} />           
            </div>
        </div>
    );
};

export default OrganizationMemberPicker;