import styles from './Subpages.module.css';

import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DividerHorizontal } from "../components/divider/Divider";
import { useAppSelector } from "../hooks/Hooks";
import AddTemplateForm from '../components/add-template-form/AddTemplateForm';

function TemplatesAdd() {
    const DrawerHeight = useAppSelector((state) => state.Measurements.AddMailsDrawerHeight);
    
    return (
        <div style={{paddingTop: `${DrawerHeight}px`}}>
            <div className="SubPageContent">
                <h1 className="primaryHeader">
                    <FontAwesomeIcon icon={faCirclePlus} />
                    Dodaj Nowy Szablon
                </h1>
                <p className="paragraphText">
                    Dodaj nowy szablon aby nie tracić czasu na pisanie lub kopiowanie i wklejanie treści maila oraz tytułu. Twój wzorzec będzie dostępny zawsze w momencie tworzenia nowej wiadomości e-mail. Pamiętaj, że nazwa szablonu oraz jego rodzaj są wymagane do jego pomyślnego utworzenia.
                </p>
                <DividerHorizontal />
                <AddTemplateForm />
            </div>
        </div>
    )
};

export default TemplatesAdd;