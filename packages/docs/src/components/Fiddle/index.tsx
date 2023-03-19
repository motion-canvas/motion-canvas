import React, {useEffect, useRef, useState} from 'react';
import {basicSetup} from 'codemirror';
import {EditorView, keymap} from '@codemirror/view';
import {Text, EditorState} from '@codemirror/state';
import {javascript} from '@codemirror/lang-javascript';
import {syntaxHighlighting} from '@codemirror/language';
import {indentWithTab} from '@codemirror/commands';
import {Player} from '@motion-canvas/core';
import {
  EditorTheme,
  SyntaxHighlightStyle,
} from '@site/src/components/Fiddle/themes';
import CodeBlock from '@theme/CodeBlock';
import {useSubscribableValue} from '@site/src/utils/useSubscribable';
import {SkipPrevious} from '@site/src/Icon/SkipPrevious';
import {SkipNext} from '@site/src/Icon/SkipNext';
import {PlayArrow} from '@site/src/Icon/PlayArrow';
import {Pause} from '@site/src/Icon/Pause';
import {autocomplete} from '@site/src/components/Fiddle/autocomplete';
import {
  borrowPlayer,
  disposePlayer,
  tryBorrowPlayer,
} from '@site/src/components/Fiddle/SharedPlayer';
import styles from './styles.module.css';
import {
  transform,
  TransformError,
} from '@site/src/components/Fiddle/transformer';

export interface FiddleProps {
  children: string;
}

function highlight(sizePixels = 4) {
  return [
    {
      boxShadow: '0 0 0px 0 #ccc inset',
      easing: 'cubic-bezier(0.33, 1, 0.68, 1)',
    },
    {
      boxShadow: `0 0 0px ${sizePixels}px #ccc inset`,
      easing: 'cubic-bezier(0.32, 0, 0.67, 0)',
    },
    {boxShadow: '0 0 0px 0 #ccc inset'},
  ];
}

export default function Fiddle({children}: FiddleProps) {
  const [player, setPlayer] = useState<Player>(null);
  const editorView = useRef<EditorView>(null);
  const editorRef = useRef<HTMLDivElement>();
  const previewRef = useRef<HTMLDivElement>();

  const [error, setError] = useState<TransformError>(null);
  const duration = useSubscribableValue(player?.onDurationChanged);
  const frame = useSubscribableValue(player?.onFrameChanged);
  const state = useSubscribableValue(player?.onStateChanged);

  const [doc, setDoc] = useState<Text | null>(null);
  const [lastDoc, setLastDoc] = useState<Text | null>(null);
  const [initialState, setInitialState] = useState<EditorState>(null);

  const update = (newDoc: Text, animate = true) => {
    if (lastDoc?.eq(newDoc)) {
      return;
    }

    borrowPlayer(setPlayer, previewRef.current);
    const newError = transform(newDoc.sliceString(0));
    setError(newError);
    if (!newError) {
      setLastDoc(newDoc);
      if (animate) {
        previewRef.current.animate(highlight(), {duration: 300});
      }
    }
  };

  useEffect(() => {
    editorView.current = new EditorView({
      extensions: [
        basicSetup,
        keymap.of([
          indentWithTab,
          {
            key: 'Mod-s',
            preventDefault: true,
            run: view => {
              update(view.state.doc);
              return true;
            },
          },
        ]),
        EditorView.updateListener.of(update => {
          setDoc(update.state.doc);
          setError(null);
        }),
        autocomplete(),
        javascript({
          jsx: true,
          typescript: true,
        }),
        syntaxHighlighting(SyntaxHighlightStyle),
        EditorTheme,
      ],
      parent: editorRef.current,
      doc: children,
    });
    setInitialState(editorView.current.state);
    const borrowed = tryBorrowPlayer(setPlayer, previewRef.current);
    if (borrowed) {
      update(editorView.current.state.doc, false);
    }

    return () => {
      disposePlayer(setPlayer);
      editorView.current.destroy();
    };
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.preview} ref={previewRef}>
        {!player && <div>Press play to preview the animation</div>}
      </div>
      <div
        className={styles.progress}
        style={{width: player ? `${(frame / duration) * 100}%` : 0}}
      />
      <div className={styles.controls}>
        <div className={styles.section}>
          {lastDoc && !doc?.eq(lastDoc) && (
            <button
              onClick={() => update(editorView.current.state.doc)}
              className={styles.button}
            >
              <kbd>CTRL</kbd>
              <kbd>S</kbd>
              <small>Update preview</small>
            </button>
          )}
        </div>
        <div className={styles.section}>
          <button
            className={styles.icon}
            onClick={() => player?.requestPreviousFrame()}
          >
            <SkipPrevious />
          </button>
          <button
            className={styles.icon}
            onClick={() => {
              if (!player) {
                const borrowed = borrowPlayer(setPlayer, previewRef.current);
                update(editorView.current.state.doc);
                borrowed.togglePlayback(true);
              } else {
                if (!lastDoc) {
                  update(editorView.current.state.doc);
                }
                player.togglePlayback();
              }
            }}
          >
            {!player || (state?.paused ?? true) ? <PlayArrow /> : <Pause />}
          </button>
          <button
            className={styles.icon}
            onClick={() => player?.requestNextFrame()}
          >
            <SkipNext />
          </button>
        </div>
        <div className={styles.section}>
          {((initialState && !doc?.eq(initialState.doc)) ||
            (lastDoc && !doc?.eq(lastDoc))) && (
            <button
              className={styles.button}
              onClick={() => {
                editorView.current.setState(initialState);
                update(initialState.doc);
                setDoc(initialState.doc);
              }}
            >
              <small>Reset example</small>
            </button>
          )}
        </div>
      </div>
      {error && <pre className={styles.error}>{error.message}</pre>}
      <div className={styles.editor} ref={editorRef}>
        <CodeBlock className={styles.source} language="tsx">
          {children + '\n'}
        </CodeBlock>
      </div>
    </div>
  );
}
