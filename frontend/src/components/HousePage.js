import { backendAPI } from '../index';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import UtilityTable from './UtilityTable';

const HousePage = () => {
    const { id } = useParams();
    const [gas, setGas] = useState([]);
    const [electricity, setElectricity] = useState([]);

    useEffect(() => {
        setGasRecords();
        setElectricityRecords();        
    }, []);

    const setGasRecords = () => {
        axios.get(backendAPI + "gas/" + id).then(res => { setGas(res.data.data) })
            .catch(err => console.log(err));
    }

    const setElectricityRecords = () => {
        axios.get(backendAPI + "electricity/" + id).then(res => { setElectricity(res.data.data) })
            .catch(err => console.log(err))
    }

    return (
        <div style={{ backgroundColor: "black", width: "100vw", height: "100vh" }}>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
                <UtilityTable utilities={gas} title="Gas" id={id} update={setGasRecords} />
                <UtilityTable utilities={electricity} title="Electricity" id={id} update={setElectricityRecords} />
            </div>
        </div>);
}

export default HousePage;