import styles from './Subpages.module.css';

import { faFilePen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DividerHorizontal } from "../components/divider/Divider";
import { useAppSelector } from "../hooks/Hooks";
import EditTemplateForm from '../components/edit-template-form/EditTemplateForm';

function TemplatesEdit() {
    const DrawerHeight = useAppSelector((state) => state.Measurements.AddMailsDrawerHeight);
    
    return (
        <div style={{paddingTop: `${DrawerHeight}px`}}>
            <div className="SubPageContent">
                <h1 className="primaryHeader">
                    <FontAwesomeIcon icon={faFilePen} />
                    Modyfikacja Szablonu
                </h1>
                <p className="paragraphText">
                    Tutaj możesz wprowadzić zmiany w istniejącym szablonie wiadomości e-mail i następnie nadpisać jego nową wersję w miejsce starej. Dzięki temu uzyskasz dostęp do nowego, lepszego wzorca. Pamiętaj, że nazwa szablonu jest wymagana do jego pomyślnego zmodyfikowania.
                </p>
                <DividerHorizontal />
                <EditTemplateForm />
            </div>
        </div>
    )
};

export default TemplatesEdit;