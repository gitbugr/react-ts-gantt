import React, { useState, useReducer } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
// Pages
import Demo from './Pages/Demo';
// Reducers
import { globalDefaultState, globalReducer } from './Reducers/GlobalReducer';

function App(): JSX.Element {
    const [globalState, globalDispatcher] = useReducer(globalReducer, globalDefaultState);
    return (
        <Router>
            <Route exact path="/" component={Demo} />
            <Route exact path="/demo" component={Demo} />
        </Router>
    );
}

export default App;
