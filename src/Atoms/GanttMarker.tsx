import React, { useContext } from 'react';
// Context
import { GanttContext } from '../Reducers/GanntReducer';
// Styles
import './GanttMarker.scss';

interface GanttMarkerProps {
    date: Date;
    styles?: any;
}

/**
 * GanttBlock
 * @param {GanttMarkerProps} props
 * @returns {JSX.Element}
 */
function GanttBlock(props: GanttMarkerProps): JSX.Element
{
    const { ganttState } = useContext(GanttContext);
    const timeDistance = (props.date.getTime() - ganttState.dateCursor.getTime()) / 1000 / 60;
    const leftPos = timeDistance * ganttState.pixelsPerMinute;
    const styles = props.styles || {};
    return (
        <div className='gantt__marker' style={{left: leftPos, ...styles}}></div>
    );
}

export default GanttBlock;

