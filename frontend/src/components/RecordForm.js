import {  useState, useEffect } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import axios from "axios";
import { backendAPI } from "../index";

const RecordForm = ({ toggle, type, id, update}) => {
    const [record, setRecord] = useState({});
    const [errorText, setErrorText] = useState('');

    useEffect(() => { setErrorText(''); }, []);

    const onChange = (e) => {
        const newState = record;
        newState[e.target.name] = e.target.value;
        setRecord(newState);
    }

    const submitData = async (e) => {
        e.preventDefault();
        const body = {
            "value": record['value'],
            "date": record['date'] ? record['date'] : getCurrentDate(),
            "type": type,
            "id": id
        }
        if (!body.value || !body.value) {
            setErrorText('Please provide at least the measured value');
            return;
        }
        const res = await axios.post(backendAPI + 'add-utility-record/', body);
        if (res.status === 201) {
            setErrorText('');
            toggle();
            update();
        }
        else {
            setErrorText('Something went wrong...');
        }
    }

    const getCurrentDate = () => {
        let curr = new Date();
        curr.setDate(curr.getDate() + 3);
        return curr.toISOString().substring(0, 10);
    }

    return (
        <Form onSubmit={submitData}>
            <FormGroup>
                <Label for="value">Value:</Label>
                <Input
                    type="number"
                    name="value"
                    onChange={onChange}
                />
            </FormGroup>
            <FormGroup>
                <Label for="date">Date</Label>
                <Input
                    type="date"
                    name="date"
                    onChange={onChange}
                    defaultValue={getCurrentDate()}
                />
            </FormGroup>
            <div style={{ color: "red", margin: "10px" }}>{errorText}</div> 
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button>Send</Button> <Button onClick={toggle}>Cancel</Button>
            </div>
        </Form>
        )
}

export default RecordForm;