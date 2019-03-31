import React, { useState, useReducer, useEffect } from 'react';
import Gantt from '../Organisms/Gantt';
import { GanttContext, defaultGanttState, ganttReducer } from '../Reducers/GanntReducer';

function Demo(): JSX.Element
{
    const [ganttState, ganttDispatch] = useReducer(ganttReducer, defaultGanttState);
    return (
        <GanttContext.Provider value={{ganttState, ganttDispatch}}>
            <Gantt />
        </GanttContext.Provider>
    );
}

export default Demo;

