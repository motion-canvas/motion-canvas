import styles from './Viewport.module.scss';

import {PlaybackControls, PlaybackProgress} from '../playback';
import {useDocumentEvent, usePlayer, useStorage} from '../../hooks';
import {useCallback, useRef, useState} from 'preact/hooks';
import {View} from './View';

export function Viewport() {
  return (
    <div className={styles.root}>
      <View />
      <PlaybackProgress />
      <PlaybackControls className={styles.controls} />
    </div>
  );
}
