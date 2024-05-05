import { Link } from "react-router-dom";

const HouseRow = ({ house }) => {
    return (
        <tr>
            <td>{house.city}</td>
            <td>{house.street}</td>
            <td><Link to={"/"+house.id} style={{ color: "inherit" }} relative="path">See details...</Link></td>
        </tr>
    )
}

export default HouseRow;