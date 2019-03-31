import React from 'react';

type State = {
}

type Action = {
    type: string;
    value: any;
}

export const globalDefaultState = {
}

export const globalReducer = (state: State, action: Action) => {
    const newState: State = {...state};
    //switch(action.type) {
        //default:
            //throw new Error();
    //}
    return newState;
}

export const GlobalContext = React.createContext({});

export default globalReducer;
