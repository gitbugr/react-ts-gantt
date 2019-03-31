import React from 'react';
import moment from 'moment';
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
    return (
        <div className="gantt__timeline-time" style={{left: props.leftPos}}>{ moment(props.date).format(props.format || 'h:mm') }</div>
    );
}

export default GanttTime;
