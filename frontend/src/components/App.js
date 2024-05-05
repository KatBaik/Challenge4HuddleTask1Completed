import ListHouses from './ListHouses';
import HousePage from './HousePage';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";

function App() {
    return (
        <Router>
            <Routes>
                <Route
                    path={":id"}
                    element={<HousePage />}
                />
                <Route
                    path={""}
                    element={<ListHouses />}
                />
            </Routes>
        </Router>
        
  );
}

export default App;
