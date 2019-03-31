import React, { useState } from 'react';
import './GanttRow.scss';

interface GanttRowProps {
    children: any;
}

/**
 * GanttRow
 * @param {GanttRowProps} props
 * @returns {JSX.Element}
 */
function GanttRow(props: GanttRowProps): JSX.Element
{
    return (
        <div className="gantt__row">
            { props.children }
        </div>
    );
}

export default GanttRow;

