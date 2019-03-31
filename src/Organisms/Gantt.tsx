import React, { useContext, useEffect, useState } from 'react';
// Comonents
import GanttRow from '../Molecules/GanttRow';
import GanttBlock from '../Molecules/GanttBlock';
import GanttTimeline from '../Molecules/GanttTimeline';
// Gantt Context
import { GanttContext } from '../Reducers/GanntReducer';
// Event Listeners
import GanttMouseTouchEventHandler from '../Events/GanttMouseTouchEventHandler';

/**
 * Gantt
 * @returns {JSX.Element}
 */
function Gantt(): JSX.Element
{
    const { ganttState, ganttDispatch } = useContext(GanttContext);

    GanttMouseTouchEventHandler();

    return (
        <div>
            <GanttTimeline />
            {
                ganttState.rows.map((row, i) => {
                    return (
                        <GanttRow key={i}>
                            {
                                row.blocks.map((block, j) => {
                                    const left = (block.start.getTime() - ganttState.dateCursor.getTime()) / 1000 / 60 * ganttState.pixelsPerMinute;
                                    const width = (block.end.getTime() - block.start.getTime()) / 1000 / 60 * ganttState.pixelsPerMinute;
                                    return (
                                        <GanttBlock key={j} left={left} width={width} text={block.text} isEditable={true} isOverlay={block.overlay}/>
                                    );
                                })
                            }
                        </GanttRow>
                    );
                })
            }
        </div>
    );
}

export default Gantt;

