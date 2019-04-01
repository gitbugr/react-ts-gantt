import React, { useState, useRef } from 'react';
import './GanttRow.scss';

interface GanttRowProps {
    uuid: string;
    children: any;
}

/**
 * GanttRow
 * @param {GanttRowProps} props
 * @returns {JSX.Element}
 */
function GanttRow(props: GanttRowProps): JSX.Element
{
    const rowEl = useRef(null);
    const currentRow: any = rowEl.current;
    if (currentRow) {
        currentRow.setAttribute('uuid', props.uuid);
    }

    return (
        <div ref={rowEl} className="gantt__row">
            { props.children }
        </div>
    );
}

export default GanttRow;

