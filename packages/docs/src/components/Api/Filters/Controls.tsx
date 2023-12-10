import IconFilters from '@site/src/Icon/Filters';
import {useFilters} from '@site/src/contexts/filters';
import clsx from 'clsx';
import React, {useEffect, useRef, useState} from 'react';
import styles from './index.module.css';

export default function Controls() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filter, setFilter] = useFilters();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        !dropdownRef.current ||
        dropdownRef.current.contains(event.target as Node)
      ) {
        return;
      }
      setShowDropdown(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <>
      <div
        ref={dropdownRef}
        className={clsx(
          'dropdown dropdown--right margin-bottom--md',
          showDropdown && 'dropdown--show',
        )}
      >
        <a
          href="#"
          aria-haspopup="true"
          aria-expanded={false}
          role="button"
          onClick={e => {
            e.preventDefault();
            setShowDropdown(!showDropdown);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              setShowDropdown(!showDropdown);
            }
          }}
        >
          Filters
          <IconFilters className={styles.icon} />
        </a>
        <ul className="dropdown__menu">
          <li>
            <label
              htmlFor="private"
              className={clsx(
                'dropdown__link',
                filter.private && 'dropdown__link--active',
              )}
            >
              <input
                id="private"
                type="checkbox"
                className="margin-right--md"
                checked={filter.private}
                onChange={e => {
                  setFilter({
                    ...filter,
                    private: e.target.checked,
                  });
                }}
              />
              Protected members
            </label>
          </li>
          <li
            onKeyDown={e => {
              if (e.key === 'Tab') {
                setShowDropdown(false);
              }
            }}
          >
            <label
              htmlFor="inherited"
              className={clsx(
                'dropdown__link',
                filter.inherited && 'dropdown__link--active',
              )}
            >
              <input
                id="inherited"
                type="checkbox"
                className="margin-right--md"
                checked={filter.inherited}
                onChange={e => {
                  setFilter({
                    ...filter,
                    inherited: e.target.checked,
                  });
                }}
              />
              Inherited members
            </label>
          </li>
        </ul>
      </div>
    </>
  );
}
