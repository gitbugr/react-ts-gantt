import React, { useState, useReducer, useEffect } from 'react';
import Gantt from '../Organisms/Gantt';
import { GanttContext, defaultGanttState, ganttReducer } from '../Reducers/GanntReducer';

/**
 * AwesomePage
 * @returns {JSX.Element}
 */
function AwesomePage(): JSX.Element
{
    const [ganttState, ganttDispatch] = useReducer(ganttReducer, defaultGanttState);
    return (
        <div>
            <button onClick={ganttDispatch.bind(null, {type:'ZOOM_GANTT_IN'})}>+</button>
            <button onClick={ganttDispatch.bind(null, {type:'ZOOM_GANTT_OUT'})}>-</button>
            <GanttContext.Provider value={{ganttState, ganttDispatch}}>
                <Gantt />
            </GanttContext.Provider>
        </div>
    );
}

export default AwesomePage;

