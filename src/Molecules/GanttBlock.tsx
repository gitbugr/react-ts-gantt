import React, { useState } from 'react';
// Styles
import './GanttBlock.scss';

interface GanttBlockProps {
    text?: string;
    left: number;
    width: number;
    isOverlay?: boolean;
    isEditable?: boolean;
}

/**
 * GanttBlock
 * @param {GanttBlockProps} props
 * @returns {JSX.Element}
 */
function GanttBlock(props: GanttBlockProps): JSX.Element
{
    // classes
    let classArr = [];
        classArr.push('gantt__block');
    if (props.isOverlay) {
        classArr.push('gantt__block--overlay');
    }
    if (props.isEditable && !props.isOverlay) {
        classArr.push('gantt__block--editable');
    }
    // inline styles
    const style = {
        left: props.left,
        width: props.width,
    };

    return (
        <div className={classArr.join(' ')} style={style}>
            <div className="gantt__block-anchor gantt__block-anchor--left"></div>
            <div className="gantt__block-content">
                { props.text }
            </div>
            <div className="gantt__block-anchor gantt__block-anchor--right"></div>
        </div>
    );
}

export default GanttBlock;

