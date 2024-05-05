import { Modal, ModalHeader, ModalBody, Button, Form, FormGroup, Input, Label } from "reactstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { backendAPI } from "../index";

const ModalHouse = ({ visible, toggle, update }) => {
    const [house, setHouse] = useState({});
    const [errorText, setErrorText] = useState('');

    useEffect(() => { setErrorText(''); }, [visible]);

    const onChange = (e) => {
        const newState = house;
        newState[e.target.name] = e.target.value;
        setHouse(newState);
    }

    const submitData = async (e) => {
        e.preventDefault();
        const body = {
            "city": house['city'],
            "street": house['street']
        }
        if (!body.city || !body.street || body.city === '' || body.street === '') {
            setErrorText('Please provide both city and street address');
            return;
        }
        const res = await axios.post(backendAPI + 'add-house/', body);
        if (res.status === 201) {
            setErrorText('');
            toggle();
            update();
        }
        else {
            setErrorText('Something went wrong...');
        }
    }

    return (
        <Modal isOpen={visible} toggle={toggle} dark>
            <ModalHeader
                style={{ justifyContent: "center" }}>Add House</ModalHeader>
            <ModalBody>
                <Form onSubmit={submitData}>
                    <FormGroup>
                        <Label for="city">City</Label>
                        <Input
                            type="text"
                            name="city"
                            onChange={onChange}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="street">Street</Label>
                        <Input
                            type="text"
                            name="street"
                            onChange={onChange}
                        />
                    </FormGroup>
                    <div style={{ color: "red", margin: "10px" }}>{errorText}</div> 
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Button>Send</Button> <Button onClick={toggle}>Cancel</Button>
                    </div>
                </Form>
            </ModalBody>
        </Modal>
    )
}

export default ModalHouse;