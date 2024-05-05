import { Container, Row, Col, Table, Button } from "reactstrap";
import ModalRecord from './ModalRecord';
import { useState  } from 'react';

const UtilityTable = ({ utilities, title, id, update }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const toggle = () => {
        setModalVisible(!modalVisible);
    }

    return (
        <Container style={{ marginTop: "20px", width: "40%" }} dark>
            <h1 style={{ color: "white", textAlign: "center", padding: "20px" }}>{title}</h1>
            <Row>
                <Col>
                    <Table dark style={{ borderRadius: "10px" }}>
                        <thead>
                            <tr>
                                <th>Value</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(utilities && utilities.length>0) ? (utilities.map(utility => (
                                <tr key={"utility" + utility.id}>
                                    <td>{utility.readingValue}</td>
                                    <td>{utility.date.substring(0,10)}</td>
                                </tr>
                            ))) : (<tr><td colspan="2">No data yet...</td></tr>)}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Button primary onClick={() => toggle()}>Add {title} record</Button>
            <ModalRecord visible={modalVisible} toggle={toggle} title={title} id={id} update={update} />
        </Container>
    )
}

export default UtilityTable;