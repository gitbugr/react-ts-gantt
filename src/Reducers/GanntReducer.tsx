import React from 'react';
import { findByUuid } from '../Utils/Arrays';
import uuidv4 from 'uuid/v4';

/// <reference path="../Namespaces/Gantt.ts" />
type State = {
    dateCursor: Date;
    pixelsPerMinute: number;
    segment: number;
    snapToSecond: number;
    rows: Gantt.Row[];
    animated: boolean;
}

type Action = {
    type: string;
    value?: any;
}

let rowUuid1 = uuidv4();
let rowUuid2 = uuidv4();
// default gantt state
export const defaultGanttState = {
    dateCursor: (new Date((new Date()).getTime() - (1000*60*60*2))), // now - 1hr
    pixelsPerMinute: 1,
    segment: 60,
    snapToSecond: 60 * 10,
    animated: true,
    rows: [
        {
            uuid: rowUuid1,
            blocks: [
                {
                    uuid: uuidv4(),
                    row: rowUuid1,
                    text: '[HERE]',
                    start: new Date(new Date().getTime() - (1000*60*60*6)),
                    end: new Date(new Date().getTime() - (1000*60*60*2)),
                },
                {
                    uuid: uuidv4(),
                    row: rowUuid1,
                    text: 'Parliament',
                    start: new Date(),
                    end: new Date(new Date().getTime() + (1000*60*60*3)),
                },
                {
                    uuid: uuidv4(),
                    row: rowUuid1,
                    overlay: true,
                    start: new Date(new Date().getTime() + (1000*60*60)),
                    end: new Date(new Date().getTime() + (1000*60*60*4)),
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
                    start: new Date(new Date().getTime() - (1000*60*60*3)),
                    end: new Date(new Date().getTime() - (1000*60*60)),
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
    let newSegmentValue;
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
            newState.dateCursor = action.value;
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
        case 'ZOOM_GANTT_IN':
            if (newState.segment > 5) {
                do {
                    newState.segment -= 5;
                    newSegmentValue = 60 % newState.segment;
                    newState.pixelsPerMinute = 60 / newState.segment;
                } while (!isNaN(newSegmentValue) && newSegmentValue !== 0 && newState.segment > 5);
            }
            break;
        case 'ZOOM_GANTT_OUT':
            do {
                newState.segment += newState.segment >= 60 ? 0 : 5;
                newSegmentValue = 60 % newState.segment;
                newState.pixelsPerMinute = 60 / newState.segment;
            } while (newSegmentValue !== 0 && newSegmentValue !== 60);
            break;
        case 'UPDATE_GANTT_ANIMATED':
            newState.animated = action.value;
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

