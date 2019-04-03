import React, { useContext } from 'react';
import moment from 'moment';
import { GanttContext } from '../Reducers/GanntReducer';
// Styles
import './GanttTime.scss';

interface GanttTimeProps {
    date: Date;
    format?: string;
    leftPos: number;
}

/**
 * GanttTime
 * @param {GanttTimeProps} props
 * @returns {JSX.Element}
 */
function GanttTime(props: GanttTimeProps): JSX.Element
{
    const { ganttState } = useContext(GanttContext);
    //const isAnimated = ganttState.animated ? { transition : '0.25s left'} : {};
    const styles = {
        left: props.leftPos,
        //...isAnimated,
    };
    return (
        <div className="gantt__timeline-time" style={styles}>{ moment(props.date).format(props.format || 'h:mma') }</div>
    );
}

export default GanttTime;
