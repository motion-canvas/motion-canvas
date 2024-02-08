import React from 'react';

import styles from './styles.module.css';

export interface YouTubeVideoProps {
  src: string;
  width?: number;
  height?: number;
  title?: string;
}

export default function YouTubeVideo({
  src,
  width,
  height,
  title,
}: YouTubeVideoProps): JSX.Element {
  return (
    <iframe
      className={styles.root}
      width={width ?? 560}
      height={height ?? 315}
      src={src}
      loading="lazy"
      title={title ?? 'YouTube video player'}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}
