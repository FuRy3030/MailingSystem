import styles from './UserAvatar.module.css';
import jwt_decode from 'jwt-decode';

import Avatar from '@mui/material/Avatar';
import AuthContext from '../../context-store/auth-context';
import { useContext } from 'react';

interface IWebsiteUser {
    aud: string;
    Id: string;
    email: string;
    exp: number;
    given_name: string;
    iat: number;
    iss: string;
    jti: string;
    nbf: number;
    unique_name: string;
};

function UserAvatar() {
    const Ctx = useContext(AuthContext);
    let Name: string = '';

    if (Ctx?.accessToken.token != undefined) {
        const WebsiteUser: IWebsiteUser = jwt_decode(Ctx?.accessToken.token);
        console.log(WebsiteUser);
        var { given_name } = WebsiteUser;
        Name = given_name;
    }

    return (
        <div className={styles.userAvatarWrapper}>
            <Avatar alt="Zdjęcie" src={`${Ctx?.pictureSource}`} className={styles.avatar} />
            <div className={styles.textWrapper}>
                <span className={styles.name}>{Name}</span>
                <span className={styles.organization}>Szkolna Giełda Pracy</span>
            </div>
        </div>
    )
};

export default UserAvatar;