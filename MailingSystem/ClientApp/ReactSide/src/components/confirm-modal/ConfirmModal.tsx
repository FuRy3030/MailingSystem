import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";


function ConfirmModal(props: any) {
    const [show, setShow] = useState<boolean>(false);

    const HandleClose = () => {
        setShow(false);
        props.CloseModal();
    }

    const HandleConfirm = () => {
        setShow(false);
        props.ConfirmFunction();
    };

    useEffect(() => {
        setShow(props.isShowed);
    }, [props.isShowed]);

    return (
        <Modal show={show} onHide={HandleClose} className="site-modal" centered>
            <Modal.Header closeButton>
                <Modal.Title>{props.Title}</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                    {props.Content}
                </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={HandleConfirm} className="site-button">
                    {props.ButtonText}
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default ConfirmModal;