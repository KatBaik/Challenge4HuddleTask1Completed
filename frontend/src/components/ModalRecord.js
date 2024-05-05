import { Modal, ModalHeader, ModalBody } from "reactstrap";
import RecordForm from './RecordForm';

const ModalRecord = ({ toggle, visible, title, id, update }) => {
    return (
            <Modal isOpen={visible} toggle={toggle} dark>
                <ModalHeader
                style={{ justifyContent: "center" }}>Add {title} Record</ModalHeader>
                <ModalBody>
                    <RecordForm
                    toggle={toggle}
                    type={title}
                    id={id}
                    update={update }
                    />
                </ModalBody>
            </Modal>
    )
}
export default ModalRecord;