import MailsDataTableSuggestions from '../mails-data-table/MailsDataTableSuggestions';
import styles from './MailSuggestions.module.css';

function MailSuggestions() {
    return (
        <div className={styles.Suggestions}>
            <h2 className={styles.SuggestionsHeader}>
                Sugerowane adresy e-mail
            </h2>
            <MailsDataTableSuggestions />
        </div>
    );
};

export default MailSuggestions;