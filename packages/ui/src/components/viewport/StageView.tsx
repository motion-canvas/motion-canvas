import type {Stage} from '@motion-canvas/core';
import clsx from 'clsx';
import {JSX} from 'preact';
import {MutableRef, useLayoutEffect, useRef} from 'preact/hooks';
import {useSharedSettings} from '../../hooks';
import styles from './Viewport.module.scss';

export interface StageViewProps extends JSX.HTMLAttributes<HTMLDivElement> {
  forwardRef?: MutableRef<HTMLDivElement>;
  stage: Stage;
}

export function StageView({
  stage,
  className,
  forwardRef,
  ...rest
}: StageViewProps) {
  const localRef = useRef<HTMLDivElement>();
  const {background} = useSharedSettings();
  const ref = forwardRef ?? localRef;

  useLayoutEffect(() => {
    ref.current.append(stage.finalBuffer);
    return () => stage.finalBuffer.remove();
  }, [stage, ref]);

  return (
    <div
      className={clsx(
        className,
        (background?.alpha() ?? 0) < 1 && styles.alphaBackground,
      )}
      ref={ref}
      {...rest}
    />
  );
}
