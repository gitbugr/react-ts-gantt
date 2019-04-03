import React, { useState, useRef, useEffect, useContext } from 'react';
import { GanttContext } from '../Reducers/GanntReducer';
// Styles
import './GanttBlock.scss';

interface GanttBlockProps {
    text?: string;
    uuid: string;
    left: number;
    right: number|string;
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

    const blockEl = useRef(null);
    const currentBlock: any = blockEl.current;
    if (currentBlock) {
        currentBlock.setAttribute('uuid', props.uuid);
    }
    const { ganttState } = useContext(GanttContext);
    const isAnimated = ganttState.animated ? { transition : 'all 0.25s'} : {};

    // inline styles
    const style = {
        left: props.left,
        right: props.right,
        ...isAnimated,
    };

    return (
        <div ref={blockEl} className={classArr.join(' ')} style={style}>
            <div className="gantt__block-anchor gantt__block-anchor--left"></div>
            <div className="gantt__block-content">
                { props.text }
            </div>
            <div className="gantt__block-anchor gantt__block-anchor--right"></div>
        </div>
    );
}

export default GanttBlock;

