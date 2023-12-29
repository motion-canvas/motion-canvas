import clsx from 'clsx';
import type {JSX} from 'preact';
import styles from './index.module.scss';

interface PreviewCanvasProps extends JSX.HTMLAttributes<HTMLDivElement> {}

/**
 * A wrapper for custom overlays.
 *
 * @remarks
 * Used to implement {@link PluginOverlayConfig.component}.
 *
 * @param className - The class name to apply to the overlay.
 * @param rest - Any other props to pass to the div. Can be used to hook up
 *               pointer events.
 */
export function OverlayWrapper({className, ...rest}: PreviewCanvasProps) {
  return <div className={clsx(className, styles.overlay)} {...rest}></div>;
}
