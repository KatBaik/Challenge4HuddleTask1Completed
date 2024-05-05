import { Form, FormGroup, Input, Label, Button, Row, Col } from "reactstrap";
import { useState } from "react";

function sanitize(string) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match) => (map[match]));
}

const blankSearch = { city: '-', street: '-' };

const HouseSearch = ({update }) => {
    const [search, setSearch] = useState(blankSearch);

    const onChange = (e) => {
        const newState = search;
        newState[e.target.name] = e.target.value;
        setSearch(newState);
    }

    const submitData = async (e) => {
        e.preventDefault();
        const body = {
            "city": sanitize(search['city']),
            "street": sanitize(search['street'])
        }
        update(body);
    }

    return (
        
        <Form onSubmit={submitData}>
            <Row className="justify-content-between g-3 align-items-start">
        <Col className="col-5"> <FormGroup>
                <Label className="visually-hidden" for="city">City</Label>
            <Input
                type="text"
                    name="city"
                        placeholder="City"
                        default={blankSearch.city}
                onChange={onChange}
            />
                </FormGroup></Col>
                <Col className="col-5"> <FormGroup>
                <Label className="visually-hidden" for="street">Street</Label>
            <Input
                type="text"
                    name="street"
                        placeholder="Street"
                        default={blankSearch.street}
                onChange={onChange}
            />
            </FormGroup></Col>
                <Col className="col-1"><Button className="float-end">Search</Button></Col>
            </Row>
            </Form>
        
    );
}

export default HouseSearch;