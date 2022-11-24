import React, { useEffect, useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AuthContext from '../../context-store/auth-context';
import Config from '../../config/config';

function UpdateTokenModal() {
    const Ctx = useContext(AuthContext);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    useEffect(() => {
        if (Ctx?.millisecondsToUpdateAccessToken != undefined && 
            Ctx?.millisecondsToUpdateAccessToken > 0) 
        {
            const TokenExpiredWarningShow = setTimeout(() => {
                setShow(true);

                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        AccessToken: Ctx.accessToken.token,
                        RefreshToken: Ctx.refreshToken
                    })
                };

                fetch(`${Config.sourceURL}/Token/refreshtoken`, requestOptions)
                    .then(response => response.json())
                    .then(data => { 
                        Ctx?.setLoggedStatus(true);
                        Ctx?.setAccessToken({
                            token: data.accessToken, 
                            expirationDate: new Date(data.expirationTime)
                        });
                        const ExpirationDate: Date = new Date(data.expirationTime);
                        const CurrentDate: Date = new Date();
                        const TimeTillUpdate: number = Math.round(ExpirationDate.getTime() - CurrentDate.getTime());
                        Ctx?.setTimeToUpdateAccessToken(TimeTillUpdate);
                    });
            }, Ctx?.millisecondsToUpdateAccessToken)

            return () => {
                clearTimeout(TokenExpiredWarningShow);
            }
        }
    }, [Ctx?.millisecondsToUpdateAccessToken]);

    return (
        <Modal show={show} onHide={handleClose} className="site-modal" centered>
            <Modal.Header closeButton>
                <Modal.Title>Sesja Wygasła</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                    Z powodów bezpieczeństwa twoja obecna sesja wygasła. 
                    Aby kontynuować swoją pracę musisz rozpocząć nową.
                </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose} className="site-button">
                    Rozpocznij nową sesję
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default UpdateTokenModal;