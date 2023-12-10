import useIsBrowser from '@docusaurus/useIsBrowser';
import Comment from '@site/src/components/Api/Comment';
import {useUrlLookup} from '@site/src/contexts/api';
import clsx from 'clsx';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './styles.module.css';

const WIDTH = 480 + 16;

export default function Tooltip({children}: {children: ReactNode}) {
  const isBrowser = useIsBrowser();
  const urlLookup = useUrlLookup();

  const [show, setShow] = useState(false);
  const [comment, setComment] = useState(null);
  const containerRef = useRef<HTMLDivElement>();
  const linkRef = useRef<HTMLAnchorElement>();
  const tooltipRef = useRef<HTMLDivElement>();

  const updatePosition = useCallback(() => {
    if (!linkRef.current || !tooltipRef.current) return;

    const rect = linkRef.current.getBoundingClientRect();
    const width = window.innerWidth;
    let right = width - rect.left - WIDTH;
    if (right < 0) {
      right = 0;
    }

    tooltipRef.current.style.right = `${right}px`;
    tooltipRef.current.style.top = `${rect.bottom}px`;
  }, []);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    const onEnter = e => {
      if (
        !e.target.href ||
        !containerRef.current?.contains(e.target) ||
        tooltipRef.current?.contains(e.target)
      ) {
        return;
      }

      const url = new URL(e.target.href, document.baseURI);
      if (url.pathname === window.location.pathname) {
        return;
      }

      const reflection = urlLookup(url.pathname + url.hash);
      if (!reflection?.comment?.summary) {
        return;
      }

      linkRef.current = e.target;
      setShow(true);
      setComment(reflection.comment);
      updatePosition();
    };

    const onLeave = e => {
      if (e.target === linkRef.current) {
        setShow(false);
      }
    };

    document.addEventListener('mouseenter', onEnter, true);
    document.addEventListener('focus', onEnter, true);
    document.addEventListener('mouseleave', onLeave, true);
    document.addEventListener('blur', onLeave, true);
    document.addEventListener('scroll', updatePosition);
    return () => {
      document.removeEventListener('mouseenter', onEnter, true);
      document.removeEventListener('focus', onEnter, true);
      document.removeEventListener('mouseleave', onLeave, true);
      document.removeEventListener('blur', onLeave, true);
      document.removeEventListener('scroll', updatePosition);
    };
  }, [isBrowser]);

  useEffect(() => {
    updatePosition();
  });

  return (
    <div ref={containerRef}>
      {children}
      <div
        ref={tooltipRef}
        className={clsx(
          styles.tooltip,
          'padding--md margin-horiz--md',
          show && styles.active,
        )}
      >
        {comment && <Comment comment={comment} full={false} />}
      </div>
    </div>
  );
}
