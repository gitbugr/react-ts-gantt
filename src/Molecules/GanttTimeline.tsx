import React, { useEffect, useRef, useContext, useState } from 'react';
import { throttle } from 'throttle-debounce';

import { GanttContext } from '../Reducers/GanntReducer';

import GanttTime from './GanttTime';

import './GanttTimeline.scss';

type TimeAndPosition = {
    date: Date;
    leftPos: number;
}

/**
 * GanttTimeline
 * @param {GanttTimelineProps} props
 * @returns {JSX.Element}
 */
function GanttTimeline(): JSX.Element
{
    const { ganttState } = useContext(GanttContext);
    const timelineEl = useRef(null);
    const [timePositions, setTimePositions] = useState([] as TimeAndPosition[]);

    // high-performance rounding
    function roundToQuarter(date: Date): Date
    {
        const minutes = date.getMinutes();
        if (minutes <= 7 || minutes >= 53) {
            date.setMinutes(0);
        } else if (minutes <= 22) {
            date.setMinutes(15);
        } else if (minutes <= 37) {
            date.setMinutes(30);
        } else {
            date.setMinutes(45);
        }
        return date;
    }

    const updateViewableTimes = throttle(15, () => {
        const newTimePositions:TimeAndPosition[] = [];
        const currentTimeline: any = timelineEl.current;
        const pixelsPerSecond = 60000 / ganttState.pixelsPerMinute;
        if (currentTimeline) {
            const minutesInView = currentTimeline.clientWidth / ganttState.pixelsPerMinute;
            const maxDate = new Date(ganttState.position.getTime() + (minutesInView * 60000));
            let dateCursor = new Date(ganttState.position.getTime() - 1800000);
                dateCursor.setTime(roundToQuarter(dateCursor).getTime());
                dateCursor.setSeconds(0);
                dateCursor.setMilliseconds(0);
            while (dateCursor.getTime() < maxDate.getTime()) {
                let leftPos = dateCursor.getTime() - ganttState.position.getTime();
                    leftPos = leftPos / pixelsPerSecond;
                newTimePositions.push({
                    date: new Date(dateCursor.getTime()),
                    leftPos: leftPos,
                });
                dateCursor.setTime(dateCursor.getTime() + 900000);
            }
            setTimePositions(newTimePositions);
        }

    });

    // lifecycle hook to check for window resizing
    useEffect(()=>{
        updateViewableTimes();
        window.addEventListener('resize', updateViewableTimes);
        // teardown
        return () => {
            window.removeEventListener('resize', updateViewableTimes);
        };
    }, [ganttState.position]);

    return (
        <div>
            <div ref={timelineEl} className="gantt__timeline">
                {
                    timePositions.filter(({date}) => {
                        return date.getHours() + date.getMinutes() === 0;
                    }).map(({date, leftPos}, i) => {
                        <GanttTime key={i} date={date} leftPos={leftPos} format="MMMM Do YYYY"/>
                    })
                }
            </div>
            <div ref={timelineEl} className="gantt__timeline">
                {
                    timePositions.map(({date, leftPos}, i) => {
                        return <GanttTime key={i} date={date} leftPos={leftPos} />
                    })
                }
            </div>
        </div>
    );
}

export default GanttTimeline;
