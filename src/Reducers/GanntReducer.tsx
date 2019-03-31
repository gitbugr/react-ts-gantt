import React from 'react';
import { findByUuid } from '../Utils/Arrays';
import uuidv4 from 'uuid/v4';

/// <reference path="../Namespaces/Gantt.ts" />
type State = {
    position: Date;
    pixelsPerMinute: number;
    snapToSecond: number;
    rows: Gantt.Row[];
}

type Action = {
    type: string;
    value?: any;
}

let rowUuid1 = uuidv4();
let rowUuid2 = uuidv4();
// default gantt state
export const defaultGanttState = {
    position: (new Date((new Date()).getTime() - (1000*60*60*2))), // now - 1hr
    pixelsPerMinute: 5,
    snapToSecond: 60,
    rows: [
        {
            uuid: rowUuid1,
            blocks: [
                {
                    uuid: uuidv4(),
                    row: rowUuid1,
                    text: '[HERE]',
                    start: new Date(new Date().getTime() - (1000*60*30)),
                    end: new Date(new Date().getTime() - (1000*60*10)),
                },
                {
                    uuid: uuidv4(),
                    row: rowUuid1,
                    text: 'Parliament',
                    start: new Date(),
                    end: new Date(new Date().getTime() + (1000*60*40)),
                },
                {
                    uuid: uuidv4(),
                    row: rowUuid1,
                    overlay: true,
                    start: new Date(new Date().getTime() + (1000*60*3)),
                    end: new Date(new Date().getTime() + (1000*60*30)),
                },
            ],
        },
        {
            uuid: rowUuid2,
            blocks: [
                {
                    uuid: uuidv4(),
                    row: rowUuid2,
                    text: 'Starbucks',
                    start: new Date(new Date().getTime() - (1000*60*60)),
                    end: new Date(new Date().getTime() - (1000*60*20)),
                },
            ],
        },
    ],
};

// reducer
export const ganttReducer = (state: State, action: Action) => {
    const newState: State = {...state};

    let row;
    let block;
    switch(action.type) {
        case 'ADD_GANTT_ROW':
            newState.rows.push(action.value);
            break;
        case 'ADD_GANTT_BLOCK':
            findByUuid(state.rows, action.value.uuid).blocks.push(action.value.block);
            break;
        case 'UPDATE_GANTT_ROW':
            newState.rows[findByUuid(state.rows, action.value.uuid, true)] = action.value
            break;
        case 'UPDATE_GANTT_BLOCK':
            row = findByUuid(state.rows, action.value.row, true);
            block = findByUuid(state.rows[row].blocks, action.value.uuid, true);
            newState.rows[row].blocks[block] = action.value;
            break;
        case 'UPDATE_GANTT_POSITION':
            newState.position = action.value;
            break;
        case 'DELETE_GANTT_ROW':
            row = findByUuid(state.rows, action.value.uuid, true);
            delete newState.rows[row];
            break;
        case 'DELETE_GANTT_BLOCK':
            row = findByUuid(state.rows, action.value.row, true);
            block = findByUuid(state.rows[row].blocks, action.value.uuid, true);
            delete newState.rows[row].blocks[block];
            break;
        default:
            throw new Error();
    }
    return newState;
}

interface IContextProps {
  ganttState: State;
  ganttDispatch: ({type}:{type:any, value:any}) => void;
}
export const GanttContext = React.createContext({} as IContextProps);

export default ganttReducer;

