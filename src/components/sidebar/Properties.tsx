import type {Node} from 'konva/lib/Node';
import {parseColor} from 'mix-color';
import {useContext, useState} from 'preact/hooks';
import {AppContext} from '../../AppContext';

import {usePlayerTime} from '../../hooks';
import {classes} from '../../utils';
import {Group, Label} from '../controls';
import {Value} from '../controls/Value';
import styles from './Sidebar.module.scss';

export function Properties() {
  const {selectedNode} = useContext(AppContext);

  return (
    <div className={styles.pane}>
      <div className={styles.header}>Properties</div>
      {selectedNode ? (
        <YesNodeSelected node={selectedNode} />
      ) : (
        <NoNodeSelected />
      )}
    </div>
  );
}

const ALWAYS_HAVE_KEYS = ['x', 'y', 'width', 'height'];
const REMOVE_KEYS = ['dirty', 'wasDirty'];
function YesNodeSelected({node}: {node: Node}) {
  // Force rerender every frame when playing
  usePlayerTime();

  const attrKeys = Object.keys(node.attrs)
    .filter(
      key =>
        // Filter out keys that we're displaying at the top no matter what
        !ALWAYS_HAVE_KEYS.includes(key) &&
        // These keys are used internally and should not be displayed
        !REMOVE_KEYS.includes(key),
    )
    .sort();

  const [copied, setCopied] = useState(false);

  return (
    <div>
      {ALWAYS_HAVE_KEYS.concat(attrKeys).map((key, keyIndex) => {
        let value =
          // If value is undefined but it's x/y/width/height,
          // then it's a 0.
          node.attrs[key] === undefined && keyIndex < ALWAYS_HAVE_KEYS.length
            ? 0
            : node.attrs[key];
        const isColor =
          typeof value === 'string' &&
          /^(#[0-9a-f]{3,4}|#[0-9a-f]{6}|#[0-9a-f]{8}|rgba?(\d,\d,\d(,\d)?))$/i.test(
            value,
          );

        if (isColor) {
          const parsedColor = parseColor(value);
          const alpha = parsedColor.a;
          value = `rgba(${parsedColor.r},${parsedColor.g},${parsedColor.b},${
            alpha.toString().split('.')[1]?.length > 2
              ? alpha.toFixed(2)
              : alpha.toString()
          })`;
        }

        // Temporary padding and margin support
        if (typeof value === 'object' && 'left' in value) {
          value = `${value.top}, ${value.right}, ${value.bottom}, ${value.left}`;
        }

        return (
          <Group>
            <Label>{key}</Label>

            <Value
              readOnly
              pointerCursor
              previewColor={isColor && value}
              onClick={() => {
                navigator.clipboard
                  .writeText(value.toString())
                  .then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 750);
                  })
                  .catch(console.error);
              }}
              data-value={
                typeof value === 'number'
                  ? // If value has more than 2 decimal places and we're not hovering,
                    // truncate it to 2 decimal places
                    value.toString().split('.')[1]?.length > 2
                    ? value.toFixed(2)
                    : value.toString()
                  : value.toString()
              }
              data-full={value}
            />
          </Group>
        );
      })}
      <CopiedText visible={copied} />
    </div>
  );
}

function NoNodeSelected() {
  return <div>No node selected.</div>;
}

function CopiedText({visible}: {visible: boolean}) {
  return (
    <div className={classes(styles.copied, [styles.visible, visible])}>
      Copied
    </div>
  );
}
