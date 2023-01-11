import styles from './OrganizationMemberPicker.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from '../../hooks/Hooks';
import { Avatar } from '@mui/material';
import React from 'react';
import { ActivityHistoryActions } from '../../redux-store/activity-log';

function OrganizationMemberPicker() {
    const Dispatch = useAppDispatch();
    const OrganizationMembers: object[] = useAppSelector((state) => {
        return state.ActivityHistory.TeamStatistics.map((TeamStatistic) => {
            return {
                Identifier: TeamStatistic.Identifier,
                PictureURL: TeamStatistic.PictureURL
            };
        });
    });

    OrganizationMembers.shift();

    const HandleActiveUserChange = (event: React.SyntheticEvent<HTMLDivElement>) => {
        if (event.currentTarget.dataset.username) {
            Dispatch(ActivityHistoryActions.UpdateActiveUser(event.currentTarget.dataset.username));
        }
    };

    const HandleActiveUserChangeToWholeTeam = () => {
        Dispatch(ActivityHistoryActions.UpdateActiveUser('Wszyscy'));
    };

    return (
        <div className={styles.OrganizationMemberPickerWrapper}>
            <div className={styles.AllMembersChip} onClick={HandleActiveUserChangeToWholeTeam}>
                <img alt="Logo" src='/Logo.svg' className={styles.Logo} />
                <span>Wszyscy</span>
                <FontAwesomeIcon icon={faCheck} className={styles.AllMembersChipIcon} />           
            </div>
            {OrganizationMembers.map((Member: any, index: number) => {
                return <div 
                    data-username={Member.Identifier} 
                    className={styles.AllMembersChip} 
                    key={index} 
                    onClick={HandleActiveUserChange}
                    >
                    <Avatar alt="Avatar" src={Member.PictureURL} className={styles.Avatar} />
                    <span>{Member.Identifier}</span>
                    <FontAwesomeIcon icon={faCheck} className={styles.AllMembersChipIcon} />           
                </div>
            })}
        </div>
    );
};

export default OrganizationMemberPicker;