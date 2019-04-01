import React, { useState, useContext, useEffect } from 'react';
import { throttle } from 'throttle-debounce';
import { GanttContext } from '../Reducers/GanntReducer';

/**
 * GanttMouseTouchEventHandler
 * @returns {void}
 */
export default function GanttMouseTouchEventHandler(): void
{
    const { ganttState, ganttDispatch } = useContext(GanttContext);
    // State
    const [ cursorTarget, setCursorTarget ] = useState(false as any);
    const [ dateAtMouseDown, setDateAtMouseDown ] = useState(ganttState.dateCursor);
    const [ cursorPositionAtMouseDown, setCursorPositionAtMouseDown ] = useState({x: 0, y: 0});

    const getPositions = (event: any) => {
        try {
            const clientX = event.clientX || event.changedTouches[0].clientX;
            const clientY = event.clientY || event.changedTouches[0].clientY;
            return { clientX, clientY };
        } catch(e) {
            return { clientX: 0, clientY: 0 };
        }
    };

    const handleMouseMove = throttle(15, (event: any) => {
        // get mouse position, or touch position
        const {clientX, clientY} = getPositions(event);
        if (cursorTarget) {
            const classList = cursorTarget.classList;
            if (classList.contains('gantt__row') || (classList.contains('gantt__block') && !classList.contains('gantt_block--editable'))) {
                let offsetInMs = cursorPositionAtMouseDown.x - clientX;
                    offsetInMs = offsetInMs / ganttState.pixelsPerMinute * 60 * 1000;
                let newPosition = new Date(dateAtMouseDown.getTime());
                    newPosition.setTime(newPosition.getTime() + offsetInMs);
                ganttDispatch({
                    type: 'UPDATE_GANTT_POSITION',
                    value: newPosition,
                });
            }
        } else {
            setCursorPositionAtMouseDown({x: clientX, y: clientY});
        }
    });

    // handle mouse down
    const handleMouseDown = (event: any) => {
        const target = event.target || event.changedTouches[0].target;
        const {clientX, clientY} = getPositions(event);
        setCursorPositionAtMouseDown({x: clientX, y: clientY});
        setDateAtMouseDown(ganttState.dateCursor);
        setCursorTarget(target.closest('.gantt__block-anchor')
            || target.closest('.gantt__block')
            || target.closest('.gantt__row'));
    };

    // handle mouse up
    const handleMouseUp = (event: any) => {
        const {clientX, clientY} = getPositions(event);
        setDateAtMouseDown(ganttState.dateCursor);
        setCursorPositionAtMouseDown({x: clientX, y: clientY});
        setCursorTarget(false);
    };

    // initialise / teardown event listeners
    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleMouseMove);
        document.addEventListener('mousedown', handleMouseDown, {passive: true});
        document.addEventListener('touchstart', handleMouseDown, {passive: true});
        document.addEventListener('mouseup', handleMouseUp, {passive: true});
        document.addEventListener('touchend', handleMouseUp, {passive: true});
        document.addEventListener('touchcancel', handleMouseUp, {passive: true});
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleMouseMove);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('touchstart', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchend', handleMouseUp);
            document.removeEventListener('touchcancel', handleMouseUp);
        };
    }, [cursorTarget]);
}
