import "./App.css";
import Login from "./login";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import Dashboard from "./dashboard";
import Register from "./register";

function App() {
    return (
        <div className="App">
            <Router>
                <Route path="/" exact component={Dashboard} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <button>
                    <Link to="/">Dashboard</Link>
                </button>
                <button>
                    <Link to="/login">Login</Link>
                </button>
                <button>
                    <Link to="/register">Register</Link>
                </button>
                <button>
                    <Link to="/update">Update Available</Link>
                </button>
            </Router>
        </div>
    );
}

export default App;
