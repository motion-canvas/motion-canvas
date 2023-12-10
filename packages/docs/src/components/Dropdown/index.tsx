import clsx from 'clsx';
import React, {useEffect, useRef, useState} from 'react';

export interface DropdownProps {
  options: {
    value: number;
    name: string;
  }[];
  value: number;
  className?: string;
  onChange: (value: number) => void;
}

export default function Dropdown({
  options,
  value,
  className,
  onChange,
}: DropdownProps) {
  const ref = useRef<HTMLDivElement>();
  const linkRef = useRef<HTMLAnchorElement>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [ref]);

  return (
    <div
      ref={ref}
      className={clsx(
        'dropdown dropdown--right',
        open && 'dropdown--show',
        className,
      )}
    >
      <a
        ref={linkRef}
        className="navbar__link"
        href="#"
        onClick={event => {
          event.preventDefault();
          setOpen(!open);
        }}
      >
        {options.find(option => option.value === value)?.name ?? value}
      </a>
      <ul className="dropdown__menu">
        {options.map((option, index) => (
          <li key={option.value}>
            <a
              href="#"
              className={clsx(
                'dropdown__link',
                value === option.value && 'dropdown__link--active',
              )}
              onClick={event => {
                event.preventDefault();
                onChange(option.value);
                setOpen(false);
                linkRef.current.focus();
              }}
              onKeyDown={event => {
                if (
                  index === options.length - 1 &&
                  event.key === 'Tab' &&
                  !event.shiftKey
                ) {
                  event.preventDefault();
                  setOpen(false);
                  linkRef.current.focus();
                }
              }}
            >
              {option.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
