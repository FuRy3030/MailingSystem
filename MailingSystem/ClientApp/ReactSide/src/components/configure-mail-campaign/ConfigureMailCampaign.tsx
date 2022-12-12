import styles from './ConfigureMailCampaign.module.css';

import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { faSpellCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from '../../hooks/Hooks';
import { MailsActions } from '../../redux-store/mail-data';

function ConfigureMailCampaign() {
    const Dispatch = useAppDispatch();

    const CampaignName = useAppSelector(state => state.Mails.CurrentCampaignConiguration.Name);
    const CampaignFollowUps = useAppSelector(state => state.Mails.CurrentCampaignConiguration.FollowUps);

    const Types = [
        { name: `Brak Follow-up'ów`, value: 0 },
        { name: '1 Follow-up', value: 1 },
        { name: `2 Follow-up'y`, value: 2 }
    ];

    const HandleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        Dispatch(MailsActions.UpdateCampaignName(event.currentTarget.value));
    };

    return (
        <div className={styles.ConfigurationForm}>
            <span className="p-float-label p-input-icon-right defaultSiteInputField">
                <FontAwesomeIcon icon={faSpellCheck} />
                <InputText id="name" value={CampaignName} onChange={HandleNameChange} />
                <label htmlFor="name">Nazwa Kampanii*</label>
            </span>
            <span className="p-float-label defaultSiteSelectField" style={{marginLeft: '2.5vw'}}>
                <Dropdown inputId="followups" value={CampaignFollowUps} options={Types} optionLabel="name" 
                    onChange={(e) => Dispatch(MailsActions.UpdateCampaignFollowUpsNumber(e.value))}/>
                <label htmlFor="followups">Ilość FollowUp'ów*</label>
            </span>
        </div>
    );
};

export default ConfigureMailCampaign;