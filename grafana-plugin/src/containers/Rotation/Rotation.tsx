import React, { FC, useMemo, useState, useEffect, useRef, useCallback } from 'react';

import { HorizontalGroup, LoadingPlaceholder } from '@grafana/ui';
import cn from 'classnames/bind';
import dayjs from 'dayjs';
import { CSSTransitionGroup } from 'react-transition-group'; // ES6

import ScheduleSlot from 'components/ScheduleSlot/ScheduleSlot';
import { getFromString } from 'models/schedule/schedule.helpers';
import { Rotation as RotationType, Schedule, Event } from 'models/schedule/schedule.types';
import { Timezone } from 'models/timezone/timezone.types';
import { usePrevious } from 'utils/hooks';

import styles from './Rotation.module.css';

const cx = cn.bind(styles);

interface ScheduleSlotState {}

interface RotationProps {
  startMoment: dayjs.Dayjs;
  currentTimezone: Timezone;
  layerIndex?: number;
  rotationIndex?: number;
  color?: string;
  events: Event[];
  onClick: (moment: dayjs.Dayjs) => void;
  days?: number;
  transparent?: boolean;
}

const Rotation: FC<RotationProps> = (props) => {
  const {
    events,
    layerIndex,
    rotationIndex,
    startMoment,
    currentTimezone,
    color,
    onClick,
    days = 7,
    transparent = false,
  } = props;

  const [animate, setAnimate] = useState<boolean>(true);
  const [width, setWidth] = useState<number | undefined>();

  const startMomentString = useMemo(() => getFromString(startMoment), [startMoment]);

  const prevStartMomentString = usePrevious(startMomentString);

  // console.log(events);

  // const rotation = store.scheduleStore.rotations[id]?.[prevStartMomentString];

  /* useEffect(() => {
    setTransparent(false);
  }, [rotation]);

  useEffect(() => {
    setTransparent(true);
  }, [startMoment]);*/

  useEffect(() => {
    const startMomentString = startMoment.utc().format('YYYY-MM-DDTHH:mm:ss.000Z');

    // console.log('CHANGE START MOMENT', startMomentString);

    // store.scheduleStore.updateEvents(scheduleId, startMomentString, currentTimezone);
  }, [startMomentString]);

  const slots = useCallback((node) => {
    if (node) {
      setWidth(node.offsetWidth);
    }
  }, []);

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left; //x position within the element.
    const width = event.currentTarget.offsetWidth;

    const dayOffset = Math.floor((x / width) * 7);

    /* console.log('event.offsetX', event.offsetX);
    console.log('event.nativeEvent', event.nativeEvent);
    console.log('event.currentTarget', event.currentTarget);
    console.log('dayOffset', dayOffset);
*/
    onClick(startMoment.add(dayOffset, 'day'));
  };

  const x = useMemo(() => {
    if (!events || !events.length) {
      return 0;
    }

    const firstShift = events[0];

    const firstShiftOffset = dayjs(firstShift.start).diff(startMoment, 'seconds');

    const base = 60 * 60 * 24 * days;
    // const utcOffset = dayjs().tz(currentTimezone).utcOffset();

    return firstShiftOffset / base;
  }, [events]);

  return (
    <div className={cx('root')} onClick={handleClick}>
      <div className={cx('timeline')}>
        {events ? (
          events.length ? (
            <div
              className={cx('slots', { slots__animate: animate, slots__transparent: transparent })}
              style={{ transform: `translate(${x * 100}%, 0)` }}
            >
              {events.map((event, index) => {
                return (
                  <ScheduleSlot
                    index={index}
                    key={event.start}
                    event={event}
                    layerIndex={layerIndex}
                    rotationIndex={rotationIndex}
                    startMoment={startMoment}
                    currentTimezone={currentTimezone}
                    color={color}
                  />
                );
              })}
            </div>
          ) : (
            <Empty />
          )
        ) : (
          <HorizontalGroup align="center" justify="center">
            <LoadingPlaceholder text="Loading shifts..." />
          </HorizontalGroup>
        )}
      </div>
    </div>
  );
};

const Empty = () => {
  return <div className={cx('empty')} />;
};

export default Rotation;
