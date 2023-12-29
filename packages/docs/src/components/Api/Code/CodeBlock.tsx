import styles from '@docusaurus/theme-classic/lib/theme/CodeBlock/Content/styles.module.css';
import {useCodeWordWrap} from '@docusaurus/theme-common/internal';
import IconExternalLink from '@site/src/Icon/ExternalLink';
import customStyles from '@site/src/components/Api/Code/styles.module.css';
import {useTokenStyle} from '@site/src/contexts/codeTheme';
import clsx from 'clsx';
import React, {ReactNode} from 'react';

export default function CodeBlock({
  children,
  highlight,
  onClick,
  link,
}: {
  children: ReactNode | ReactNode[];
  highlight?: boolean;
  onClick?: () => void;
  link?: string;
}) {
  const wordWrap = useCodeWordWrap();
  const plainStyle = useTokenStyle();

  return (
    <div
      className={clsx(
        styles.codeBlockContent,
        customStyles.codeBlock,
        highlight && customStyles.highlight,
        onClick && customStyles.pointer,
      )}
    >
      <pre
        onClick={onClick}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            onClick?.();
          }
        }}
        tabIndex={0}
        ref={wordWrap.codeBlockRef}
        className={clsx(styles.codeBlock, 'thin-scrollbar')}
      >
        <code className={styles.codeBlockLines} style={plainStyle}>
          {children}
        </code>
      </pre>
      {link && (
        <div className={styles.buttonGroup}>
          <button
            title="Go to source"
            className="clean-btn"
            onClick={e => {
              e.preventDefault();
              window.open(link, '_blank');
            }}
          >
            <IconExternalLink width={18} height={18} />
          </button>
        </div>
      )}
    </div>
  );
}
