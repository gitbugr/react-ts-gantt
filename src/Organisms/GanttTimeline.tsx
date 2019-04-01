import React, { useEffect, useRef, useContext, useState } from 'react';
import { throttle } from 'throttle-debounce';
// Contexts
import { GanttContext } from '../Reducers/GanntReducer';
// Components
import GanttTime from '../Atoms/GanttTime';
// Styles
import './GanttTimeline.scss';

type TimeAndPosition = {
    date: Date;
    leftPos: number;
}

/**
 * GanttTimeline
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
            const maxDate = new Date(ganttState.dateCursor.getTime() + (minutesInView * 60000));
            let dateCursor = new Date(ganttState.dateCursor.getTime());
                dateCursor.setMinutes(ganttState.segment * Math.round(dateCursor.getMinutes() / ganttState.segment));
                dateCursor.setSeconds(0);
                dateCursor.setMilliseconds(0);
            while (dateCursor.getTime() < maxDate.getTime()) {
                let leftPos = dateCursor.getTime() - ganttState.dateCursor.getTime();
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
    }, [ganttState.dateCursor, ganttState.segment, ganttState.pixelsPerMinute]);

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
        <div className="gantt__timeline-container">
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
