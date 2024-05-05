import { backendAPI } from '../index';
import HouseRow  from './HouseRow';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button } from "reactstrap";
import ModalHouse from './ModalHouse';
import HouseSearch from './HouseSearch';

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

const ListHouses = () => {
    const [houses, setHouses] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const toggle = () => {
        setModalVisible(!modalVisible);
    }

    useEffect(() => {
        getAllHouses();
    }, []);

    const getAllHouses = () => axios.get(backendAPI).then(res => { setHouses(res.data.data) })
        .catch(err => console.log(err));

    const getSearchedHouses = ({ city, street}) => {
        if ((!city || city === '' || city === '-') && (!street || street === '' || street === '-')) {
            getAllHouses();
        }
        city = sanitize(city);
        street = sanitize(street);
        axios.get(backendAPI + 'search/' + city + '/' + street + '/').then(res => { console.log(res.data); setHouses(res.data.data) })
            .catch(err => console.log(err));
    }

    return (
        <div style={{ backgroundColor: "black", width: "100vw", height: "100vh" }}>
            <h1 style={{color: "white", textAlign: "center", padding: "20px"} }>Houses</h1>
            <Container style={{ marginTop: "20px" }} dark>
                <HouseSearch update={getSearchedHouses}  />
                <Row style={{ marginTop: "40px" }}>
                    <Col>
                        <Table dark style={{ borderRadius: "10px" }}>
                            <thead>
                                <tr>
                                    <th>City</th>
                                    <th>Street address</th>
                                    <th>Link</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    (houses && houses.length > 0) ? houses.map(house => (<HouseRow key={"house" + house.id} house={house} />))
                                        : (<tr><td colspan="3">No data yet...</td></tr>)
                                }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Button primary onClick={() => toggle()}>Add House</Button>
                <ModalHouse visible={modalVisible} toggle={toggle} update={getSearchedHouses} />
            </Container>
        </div>
        
    );
}

export default ListHouses;
