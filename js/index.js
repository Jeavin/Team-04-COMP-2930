import { Navbar } from 'react-bootstrap';

class App extends React.Component{
    render(){
        return(
            // <>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="#home">
                    <img
                         alt=""
                        src="../images/logo.png"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                    />
                    {'Emissions Planner'}
                </Navbar.Brand>
            </Navbar>
            // </>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));