import styles from './AutoComplete.module.css';

import { AutoComplete } from 'primereact/autocomplete';
import React, { useState } from 'react';
import { faBriefcase, faDownload, faGraduationCap, faHandshakeAngle, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type SourceOption = {
    Name: string;
    LinkToImg: string;
    Details: {
        Icon: IconDefinition;
        Text: string;
    } [];
    EmploymentTypes: {
        Name: string;
        value: number;
    } [];
    EnumValue: number;
};

const Options: SourceOption[] = [
    {
        Name: 'NGO | Organizacje pozarządowe',
        LinkToImg: '/images/ngo-logo.png',
        Details: [
            {
                Icon: faHandshakeAngle,
                Text: 'Wolontariat'
            },
            {
                Icon: faGraduationCap,
                Text: 'Staż'
            },
            {
                Icon: faBriefcase,
                Text: 'Praca'
            }
        ],
        EmploymentTypes: [
            { Name: 'Praca', value: 0 },
            { Name: 'Staż / Praktyki', value: 1 },
            { Name: 'Wolontariat', value: 2 }
        ],
        EnumValue: 0
    },
    {
        Name: 'UJ | Akademickie Biuro Karier',
        LinkToImg: '/images/uj-logo.png',
        Details: [
            {
                Icon: faGraduationCap,
                Text: 'Staż'
            },
            {
                Icon: faBriefcase,
                Text: 'Praca'
            }
        ],
        EmploymentTypes: [
            { Name: 'Praca', value: 0 },
            { Name: 'Staż / Praktyki', value: 1 }
        ],
        EnumValue: 1
    }
];

const ListItem = (props: any) => {
    return (
        <div className={styles.ListItem}>
            <img alt={props.Name} src={props.LinkToImg} />
            <span>{props.Name}</span>
            <div style={{marginLeft: 'auto'}}>
                {props.Details.map((AdditionalInfo: any) => {
                    return <span className={styles.BlueSpan}>
                        <FontAwesomeIcon icon={AdditionalInfo.Icon} />
                        {AdditionalInfo.Text}
                    </span>
                })}
            </div>
        </div>
    );
}

function BigAutoCompleteExtractor(props: any) {
    const [SelectedOption, setSelectedOption] = useState<any>(null);
    const [FilteredOptions, setFilteredOptions] = useState<SourceOption[]>([]);

    const SearchExtractionMethod = (event: { query: string }) => {
        setTimeout(() => {
            let FilteredOptions: SourceOption[] = [];

            if (!event.query.trim().length) {
                FilteredOptions = [...Options];
            }
            else {
                FilteredOptions = Options.filter((Option) => {
                    return Option.Name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setFilteredOptions(FilteredOptions);
        }, 250);
    };

    const HandleChangeEvent = (event: any) => {
        setSelectedOption(event.value);
        props.HandleExternalChangeEvent(event.value);
    };

    return (
        <div className={styles.AutoCompleteWrapper}>
            <button>
                <FontAwesomeIcon icon={faDownload} />
            </button>
            <AutoComplete dropdown forceSelection
                className={styles.BigAutoComplete} 
                value={SelectedOption} 
                suggestions={FilteredOptions} 
                completeMethod={SearchExtractionMethod} 
                itemTemplate={ListItem} 
                onChange={HandleChangeEvent}
                field="Name"
                placeholder="Wpisz lub wybierz źródło, z którego będą pobierane adresy e-mail" 
                dropdownAriaLabel="Select Method"
                aria-label="Methods" 
            />
        </div>
    );
};

export default BigAutoCompleteExtractor;
export const AvaliableExtractionOptions = Options;
export type { SourceOption };