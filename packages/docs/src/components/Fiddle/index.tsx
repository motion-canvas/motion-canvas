import {indentWithTab} from '@codemirror/commands';
import {javascript} from '@codemirror/lang-javascript';
import {syntaxHighlighting} from '@codemirror/language';
import {EditorState, Text} from '@codemirror/state';
import {EditorView, keymap} from '@codemirror/view';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import {useLocation} from '@docusaurus/router';
import type {Player} from '@motion-canvas/core';
import IconImage from '@site/src/Icon/Image';
import {Pause} from '@site/src/Icon/Pause';
import {PlayArrow} from '@site/src/Icon/PlayArrow';
import {SkipNext} from '@site/src/Icon/SkipNext';
import {SkipPrevious} from '@site/src/Icon/SkipPrevious';
import IconSplit from '@site/src/Icon/Split';
import IconText from '@site/src/Icon/Text';
import Dropdown from '@site/src/components/Dropdown';
import {
  borrowPlayer,
  disposePlayer,
  tryBorrowPlayer,
  updatePlayer,
} from '@site/src/components/Fiddle/SharedPlayer';
import {autocomplete} from '@site/src/components/Fiddle/autocomplete';
import {
  clearErrors,
  errorExtension,
  underlineErrors,
} from '@site/src/components/Fiddle/errorHighlighting';
import {
  areImportsFolded,
  findImportRange,
  foldImports,
  folding,
} from '@site/src/components/Fiddle/folding';
import {parseFiddle} from '@site/src/components/Fiddle/parseFiddle';
import {
  EditorTheme,
  SyntaxHighlightStyle,
} from '@site/src/components/Fiddle/themes';
import {
  TransformError,
  compileScene,
  transform,
} from '@site/src/components/Fiddle/transformer';
import {useSubscribableValue} from '@site/src/utils/useSubscribable';
import CodeBlock from '@theme/CodeBlock';
import clsx from 'clsx';
import {basicSetup} from 'codemirror';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import styles from './styles.module.css';

export interface FiddleProps {
  className?: string;
  children: string;
  mode?: 'code' | 'editor' | 'preview';
  ratio?: string;
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

export default function Fiddle({
  children,
  className,
  mode: initialMode = 'editor',
  ratio = '4',
}: FiddleProps) {
  const [player, setPlayer] = useState<Player>(null);
  const editorView = useRef<EditorView>(null);
  const editorRef = useRef<HTMLDivElement>();
  const previewRef = useRef<HTMLDivElement>();
  const [mode, setMode] = useState(initialMode);
  const {pathname} = useLocation();

  const [error, setError] = useState<string>(null);
  const duration = useSubscribableValue(player?.onDurationChanged);
  const frame = useSubscribableValue(player?.onFrameChanged);
  const state = useSubscribableValue(player?.onStateChanged);

  const [doc, setDoc] = useState<Text | null>(null);
  const [lastDoc, setLastDoc] = useState<Text | null>(null);

  const parsedRatio = useMemo(() => {
    if (ratio.includes('/')) {
      const parts = ratio.split('/');
      const calculated = parseFloat(parts[0]) / parseFloat(parts[1]);
      if (!isNaN(calculated)) {
        return calculated;
      }
    }
    const value = parseFloat(ratio);
    return isNaN(value) ? 4 : value;
  }, [ratio]);

  const update = async (newDoc: Text, animate = true) => {
    await borrowPlayer(setPlayer, previewRef.current, parsedRatio, setError);
    try {
      const scene = await compileScene(newDoc.sliceString(0), pathname);
      updatePlayer(scene);
      setLastDoc(newDoc);
      if (animate && !lastDoc?.eq(newDoc)) {
        previewRef.current.animate(highlight(), {duration: 300});
      }
      return true;
    } catch (e) {
      if (e instanceof TransformError) {
        underlineErrors(editorView.current, e.errors, e.message);
      }
      setError(e.message);
      player?.togglePlayback(false);
      return false;
    }
  };

  const switchState = async (id: number) => {
    setSnippetId(id);
    const isFolded = areImportsFolded(editorView.current.state);
    editorView.current.setState(snippets[id].state);
    await update(snippets[id].state.doc);
    if (isFolded) {
      foldImports(editorView.current);
    }
  };

  const [snippetId, setSnippetId] = useState(0);
  const snippets = useMemo(
    () =>
      parseFiddle(children).map(snippet => ({
        name: snippet.name,
        state: EditorState.create({
          doc: Text.of(snippet.lines),
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
              if (update.docChanged) {
                setError(null);
                clearErrors(editorView.current);
              }
            }),
            autocomplete(),
            folding(),
            errorExtension(),
            javascript({
              jsx: true,
              typescript: true,
            }),
            syntaxHighlighting(SyntaxHighlightStyle),
            EditorTheme,
          ],
        }),
      })),
    [children],
  );

  if (!ExecutionEnvironment.canUseDOM) {
    // Validate the snippets during Server-Side Rendering.
    snippets.forEach(snippet => {
      transform(snippet.state.doc.sliceString(0), pathname);
    });
  }

  useEffect(() => {
    editorView.current = new EditorView({
      parent: editorRef.current,
      state: snippets[snippetId].state,
    });
    foldImports(editorView.current);

    tryBorrowPlayer(
      setPlayer,
      previewRef.current,
      parsedRatio,
      setError,
      async borrowed => {
        const success = await update(snippets[snippetId].state.doc, false);
        if (success && mode !== 'code') {
          borrowed.togglePlayback(true);
        }
      },
    );

    return () => {
      disposePlayer(setPlayer);
      editorView.current.destroy();
    };
  }, []);

  // Ghost code is displayed before the editor is initialized.
  const ghostCode = useMemo(() => {
    const initialState = snippets[0].state;
    const range = findImportRange(initialState);
    let text = initialState.doc;
    if (range) {
      text = text.replace(range.from, range.to, Text.of(['...']));
    }
    return text.toString() + '\n';
  }, [snippets]);

  const hasChangedSinceLastUpdate = lastDoc && doc && !doc.eq(lastDoc);
  const hasChanged =
    (doc && !doc.eq(snippets[snippetId].state.doc)) ||
    hasChangedSinceLastUpdate;

  return (
    <div
      className={clsx(styles.root, className, {
        [styles.codeOnly]: mode === 'code',
        [styles.previewOnly]: mode === 'preview',
      })}
    >
      <div className={styles.layoutControl}>
        <button
          className={clsx(styles.icon, mode === 'code' && styles.active)}
          onClick={() => {
            setMode('code');
            player?.togglePlayback(false);
          }}
          title="Source code"
        >
          <IconText />
        </button>
        <button
          className={clsx(styles.icon, mode === 'editor' && styles.active)}
          onClick={() => setMode('editor')}
          title="Editor with preview"
        >
          <IconSplit />
        </button>
        <button
          className={clsx(styles.icon, mode === 'preview' && styles.active)}
          onClick={() => setMode('preview')}
          title="Preview"
        >
          <IconImage />
        </button>
      </div>
      <div
        className={styles.preview}
        style={{aspectRatio: ratio}}
        ref={previewRef}
      >
        {!player && <div>Press play to preview the animation</div>}
      </div>
      {duration > 0 && (
        <div
          className={styles.progress}
          style={{width: player ? `${(frame / duration) * 100}%` : 0}}
        />
      )}
      <div className={styles.controls}>
        <div className={styles.section}>
          {hasChangedSinceLastUpdate && (
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
        <div
          className={clsx(
            styles.section,
            duration === 0 && player && styles.disabled,
          )}
        >
          <button
            className={styles.icon}
            onClick={() => player?.requestPreviousFrame()}
          >
            <SkipPrevious />
          </button>
          <button
            className={styles.icon}
            onClick={async () => {
              if (!player) {
                const borrowed = await borrowPlayer(
                  setPlayer,
                  previewRef.current,
                  parsedRatio,
                  setError,
                );
                const success = await update(editorView.current.state.doc);
                if (success) {
                  borrowed.togglePlayback(true);
                }
              } else {
                let success = true;
                if (!lastDoc) {
                  success = await update(editorView.current.state.doc);
                }
                if (success) {
                  player.togglePlayback();
                }
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
          {snippets.length === 1 && hasChanged && (
            <button className={styles.button} onClick={() => switchState(0)}>
              <small>Reset example</small>
            </button>
          )}
          {snippets.length > 1 && (
            <Dropdown
              className={styles.picker}
              value={hasChanged ? -1 : snippetId}
              onChange={switchState}
              options={snippets
                .map((snippet, index) => ({
                  value: index,
                  name: snippet.name,
                }))
                .concat(hasChanged ? {value: -1, name: 'Custom'} : [])}
            />
          )}
        </div>
      </div>
      {error && <pre className={styles.error}>{error}</pre>}
      <div className={styles.editor} ref={editorRef}>
        <CodeBlock className={styles.source} language="tsx">
          {mode === 'code'
            ? snippets[snippetId].state.doc.toString()
            : ghostCode}
        </CodeBlock>
      </div>
    </div>
  );
}
