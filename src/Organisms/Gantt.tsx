import React, { useContext, useEffect, useState } from 'react';
import GanttRow from '../Molecules/GanttRow';
import GanttBlock from '../Molecules/GanttBlock';
import GanttTimeline from '../Molecules/GanttTimeline';
import uuidv4 from 'uuid/v4';
import { throttle } from 'throttle-debounce';
import { GanttContext } from '../Reducers/GanntReducer';

type Cursor = {
    x: number,
    y: number,
    target: any,
    xAtMouseDown: number,
}

/**
 * Gantt
 * @returns {JSX.Element}
 */
function Gantt(): JSX.Element
{
    const { ganttState, ganttDispatch } = useContext(GanttContext);

    const [ cursorClickPosX, setCursorClickPosX ] = useState(0);
    const [ cursorClickPosDate, setCursorClickPosDate ] = useState(ganttState.position);
    const [ cursorTarget, setCursorTarget ] = useState(false as any);

    // handle mouse move
    const handleMouseMove = throttle(15, (event: any) => {
        if (cursorTarget) {
            const classList = cursorTarget.classList;
            if (classList.contains('gantt__row') || (classList.contains('gantt__block') && !classList.contains('gantt_block--editable'))) {
                let offsetInMs = cursorClickPosX - event.clientX;
                    offsetInMs = offsetInMs / ganttState.pixelsPerMinute * 60 * 1000;

                let newPosition = new Date(cursorClickPosDate.getTime());
                    newPosition.setTime(newPosition.getTime() + offsetInMs);

                ganttDispatch({
                    type: 'UPDATE_GANTT_POSITION',
                    value: newPosition,
                });
            }
        } else {
            setCursorClickPosX(event.clientX);
        }
    });

    // handle mouse down
    const handleMouseDown = (event: any) => {
        setCursorClickPosDate(ganttState.position);
        setCursorTarget(event.target.closest('.gantt__block-anchor')
            || event.target.closest('.gantt__block')
            || event.target.closest('.gantt__row'));
    };

    // handle mouse up
    const handleMouseUp = (event: any) => {
        setCursorClickPosDate(ganttState.position);
        setCursorClickPosX(event.clientX);
        setCursorTarget(false);
    };

    // initialise / teardown event listeners
    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleMouseDown, {passive: true});
        document.addEventListener('mouseup', handleMouseUp, {passive: true});
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [cursorTarget]);

    return (
        <div>
            <GanttTimeline />
            {
                ganttState.rows.map((row, i) => {
                    return (
                        <GanttRow key={i}>
                            {
                                row.blocks.map((block, j) => {
                                    const left = (block.start.getTime() - ganttState.position.getTime()) / 1000 / 60 * ganttState.pixelsPerMinute;
                                    const width = (block.end.getTime() - block.start.getTime()) / 1000 / 60 * ganttState.pixelsPerMinute;
                                    return (
                                        <GanttBlock key={j} left={left} width={width} text={block.text} isEditable={false} isOverlay={block.overlay}/>
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

