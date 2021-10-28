import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Home, List, Edit } from "./pages";

function App() {

    return (
        <Router>
            <header className="App-header">
            </header>
            <main className="App-main">
                    <Route exact path="/" component={Home}/>
                    <Switch>
                        <Route path="/list/:name" component={List}/>
                        <Route path="/edit/:name" component={Edit}/>
                    </Switch>
            </main>
            <footer></footer>
        </Router>
    );
    
}

export default App;
