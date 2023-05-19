import {useEffect, useLayoutEffect, useRef, useState} from 'preact/hooks';
import styles from './Collapse.module.scss';
import {ComponentChildren, JSX} from 'preact';
import clsx from 'clsx';
import {useReducedMotion} from '../../hooks';

export interface CollapseProps extends JSX.HTMLAttributes<HTMLDivElement> {
  open: boolean;
  children: ComponentChildren;
}

export function Collapse(props: CollapseProps) {
  const reducedMotion = useReducedMotion();
  const Component = reducedMotion ? ReducedCollapse : AnimatedCollapse;
  return <Component {...props} />;
}

function ReducedCollapse({open, children, className, ...rest}: CollapseProps) {
  return (
    <div className={className} {...rest}>
      {open && children}
    </div>
  );
}

function AnimatedCollapse({open, children, className, ...rest}: CollapseProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>();

  useLayoutEffect(() => {
    if (open) {
      ref.current.dataset.open = open ? 'true' : 'false';
      ref.current.style.height = open ? 'auto' : '0px';
    }
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      const handle = () => {
        if (element.dataset.open === 'true') {
          element.style.height = 'auto';
        } else {
          setVisible(false);
        }
      };
      element.addEventListener('transitionend', handle);
      return () => element.removeEventListener('transitionend', handle);
    }
  }, [ref.current]);

  useLayoutEffect(() => {
    if (open) {
      setVisible(true);
    }
  }, [open]);

  useEffect(() => {
    if (!visible) return;

    ref.current.dataset.open = open ? 'true' : 'false';
    if (open) {
      if (ref.current.style.height !== 'auto') {
        ref.current.style.height = `${ref.current.scrollHeight}px`;
      }
    } else {
      if (ref.current.style.height === 'auto') {
        ref.current.style.height = `${ref.current.scrollHeight}px`;
        ref.current.scrollHeight;
      }
      ref.current.style.height = '0px';
    }
  }, [open, visible]);

  return (
    <div ref={ref} className={clsx(styles.root, className)} {...rest}>
      {visible && children}
    </div>
  );
}
