import IconScience from '@site/src/Icon/Science';
import IconDanger from '@site/src/theme/Icon/Danger';
import IconInfo from '@site/src/theme/Icon/Info';
import IconLightBulb from '@site/src/theme/Icon/LightBulb';
import IconWarning from '@site/src/theme/Icon/Warning';
import Admonition from '@theme-original/Admonition';
import React, {useMemo} from 'react';
import styles from './styles.module.css';

export default function AdmonitionWrapper({title, type, ...props}) {
  const Icon = useMemo(() => {
    switch (type) {
      case 'tip':
        return IconLightBulb;
      case 'caution':
        return IconWarning;
      case 'danger':
        return IconDanger;
      case 'experimental':
        return IconScience;
      default:
        return IconInfo;
    }
  }, [type]);

  if (type === 'experimental') {
    title ??= 'Experimental';
    type = 'caution';
  }

  return (
    <>
      <Admonition
        icon={<Icon className={styles.icon} />}
        title={title}
        type={type}
        {...props}
      />
    </>
  );
}
