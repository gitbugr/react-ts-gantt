import React, { useContext, useState, useEffect } from 'react';
// Comonents
import GanttMarker from '../Atoms/GanttMarker';
import GanttRow from '../Molecules/GanttRow';
import GanttBlock from '../Molecules/GanttBlock';
import GanttTimeline from './GanttTimeline';
// Gantt Context
import { GanttContext } from '../Reducers/GanntReducer';
// Event Listeners
import GanttMouseTouchEventHandler from '../Events/GanttMouseTouchEventHandler';
// Styles
import './Gantt.scss';

/**
 * Gantt
 * @returns {JSX.Element}
 */
function Gantt(): JSX.Element
{
    const { ganttState } = useContext(GanttContext);

    GanttMouseTouchEventHandler();

    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        const currentTimeInterval = setInterval(() => {
            setCurrentTime(new Date());
        }, 5000);
        return () => {
            clearInterval(currentTimeInterval);
        };
    }, []);

    return (
        <div className="gantt__container">
            { ganttState.segment }
            <GanttTimeline />
            <GanttMarker date={currentTime} styles={{top: 50}} />
            {
                ganttState.rows.map((row, i) => {
                    return (
                        <GanttRow key={i} uuid={row.uuid}>
                            {
                                row.blocks.map((block, j) => {
                                    const left = (block.start.getTime() - ganttState.dateCursor.getTime()) / 1000 / 60 * ganttState.pixelsPerMinute;
                                    const width = (block.end.getTime() - block.start.getTime()) / 1000 / 60 * ganttState.pixelsPerMinute;
                                    return (
                                        <GanttBlock key={j} left={left} width={width} text={block.text} isEditable={true} isOverlay={block.overlay} uuid={block.uuid}/>
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

