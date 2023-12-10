import IconDanger from '@site/src/theme/Icon/Danger';
import IconInfo from '@site/src/theme/Icon/Info';
import IconLightBulb from '@site/src/theme/Icon/LightBulb';
import IconWarning from '@site/src/theme/Icon/Warning';
import Admonition from '@theme-original/Admonition';
import React, {useMemo} from 'react';
import styles from './styles.module.css';

export default function AdmonitionWrapper(props) {
  const Icon = useMemo(() => {
    switch (props.type) {
      case 'tip':
        return IconLightBulb;
      case 'caution':
        return IconWarning;
      case 'danger':
        return IconDanger;
      default:
        return IconInfo;
    }
  }, [props.type]);

  return (
    <>
      <Admonition icon={<Icon className={styles.icon} />} {...props} />
    </>
  );
}
