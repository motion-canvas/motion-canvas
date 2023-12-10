import styles from './Layout.module.scss';

import clsx from 'clsx';
import {ComponentChildren, JSX} from 'preact';
import {useRef, useState} from 'preact/hooks';
import {useFormattedNumber} from '../../hooks';
import {Toggle} from '../controls';
import {Collapse} from '../layout';

export interface FieldSetProps {
  children: ComponentChildren;
  header: ComponentChildren;
  nested?: boolean;
}

export function FieldSet({children, header, nested}: FieldSetProps) {
  const [open, setOpen] = useState(false);

  return (
    <FieldSurface open={open}>
      <div className={styles.header}>
        <Toggle open={open} onToggle={setOpen} />
        {header}
      </div>
      <Collapse open={open}>
        <div className={clsx(styles.fields, nested && styles.nested)}>
          {children}
        </div>
      </Collapse>
    </FieldSurface>
  );
}

export interface FieldValueProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: ComponentChildren;
  alignRight?: boolean;
  grow?: boolean;
}
export function FieldValue({
  children,
  alignRight,
  grow = true,
  ...props
}: FieldValueProps) {
  return (
    <div
      className={clsx(styles.value, {
        [styles.right]: alignRight,
        [styles.grow]: grow,
      })}
      {...props}
    >
      {children}
    </div>
  );
}

export interface FieldProps {
  label?: string;
  children: ComponentChildren;
  copy?: string;
}
export function Field({label, copy, children}: FieldProps) {
  const timeout = useRef<number | null>(null);
  const [copied, setCopied] = useState(false);

  return (
    <div
      className={clsx(styles.field, {
        [styles.copy]: !!copy,
        [styles.copied]: copied,
      })}
      onClick={() => {
        if (!copy) return;
        window.navigator.clipboard.writeText(copy);
        setCopied(true);
        if (timeout.current) {
          clearTimeout(timeout.current);
        }
        timeout.current = window.setTimeout(() => {
          setCopied(false);
          timeout.current = null;
        }, 1000);
      }}
      onMouseLeave={() => setCopied(false)}
    >
      {label && <div className={styles.label}>{label}</div>}
      {children}
    </div>
  );
}

export interface FieldSurfaceProps extends JSX.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  open?: boolean;
}
export function FieldSurface({
  disabled,
  open,
  className,
  ...props
}: FieldSurfaceProps) {
  return (
    <div
      className={clsx(styles.surface, className, {
        [styles.open]: open,
        [styles.disabled]: disabled,
      })}
      {...props}
    />
  );
}

export interface NumericFieldProps extends FieldProps {
  children: number;
  precision?: number;
}
export function NumericField({
  children,
  precision,
  ...props
}: NumericFieldProps) {
  const formatted = useFormattedNumber(children, precision);

  return (
    <Field copy={children.toString()} {...props}>
      <FieldValue alignRight>{formatted}</FieldValue>
    </Field>
  );
}
