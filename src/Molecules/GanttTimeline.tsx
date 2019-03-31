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

    const updateViewableTimes = throttle(15, () => {
        const newTimePositions:TimeAndPosition[] = [];
        const currentTimeline: any = timelineEl.current;
        const pixelsPerSecond = 60000 / ganttState.pixelsPerMinute;
        if (currentTimeline) {
            const minutesInView = currentTimeline.clientWidth / ganttState.pixelsPerMinute;
            const maxDate = new Date(ganttState.position.getTime() + (minutesInView * 60000));
            let dateCursor = new Date(ganttState.position.getTime());
                dateCursor.setMinutes(ganttState.segment * Math.round(dateCursor.getMinutes() / ganttState.segment));
                dateCursor.setSeconds(0);
                dateCursor.setMilliseconds(0);
            while (dateCursor.getTime() < maxDate.getTime()) {
                let leftPos = dateCursor.getTime() - ganttState.position.getTime();
                    leftPos = leftPos / pixelsPerSecond;
                newTimePositions.push({
                    date: new Date(dateCursor.getTime()),
                    leftPos: leftPos,
                });
                dateCursor.setTime(dateCursor.getTime() + (ganttState.segment * 60 * 1000));
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
    }, [ganttState.position, ganttState.segment, ganttState.pixelsPerMinute]);

    /**
     * filterGanttDates
     * @param {TimeAndPosition[]} array
     * @returns {TimeAndPosition[]}
     */
    function filterGanttDates(array: TimeAndPosition[]): TimeAndPosition[]
    {
        let lastDate: any = null;
        return array.filter(({date, leftPos}) => {
            if (
                (!lastDate || !(
                    date.getDate() == lastDate.getDate() &&
                    date.getMonth() == lastDate.getMonth() &&
                    date.getFullYear() == lastDate.getFullYear()
                )) && leftPos > 50
            ) {
                lastDate = new Date(date.getTime());
                return true;
            }
        });
    }

    return (
        <div>
            <div ref={timelineEl} className="gantt__timeline gantt__timeline--dates">
                {
                    filterGanttDates(timePositions).map(({date, leftPos}, i) => {
                        return <GanttTime key={i} date={date} leftPos={leftPos} format="MMMM Do YYYY" />
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
