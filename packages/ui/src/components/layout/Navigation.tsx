import {useInspection, useLogger} from '../../contexts';
import {useEffect, useRef, useState} from 'preact/hooks';
import {useReducedMotion} from '../../hooks';
import {emphasize, shake} from '../animations';
import {EditorPanel, BottomPanel, SidebarPanel} from '../../signals';
import {Badge, Space, Tab, TabGroup, TabLink, Tabs} from '../tabs';
import {
  AccountTree,
  Bug,
  HourglassBottom,
  MotionCanvas,
  Movie,
  School,
  Settings,
  Videocam,
} from '../icons';
import styles from './Navigation.module.scss';

export function Navigation() {
  const {inspectedElement} = useInspection();
  const inspectorTab = useRef<HTMLButtonElement>();
  const reducedMotion = useReducedMotion();
  const logger = useLogger();
  const badge = useRef<HTMLDivElement>();
  const [errorCount, setErrorCount] = useState(logger.onErrorLogged.current);

  useEffect(
    () =>
      logger.onErrorLogged.subscribe(value => {
        setErrorCount(value);
        if (!reducedMotion) {
          setTimeout(() => {
            badge.current?.animate(shake(2), {duration: 300});
          }, 0);
        }
      }),
    [logger, reducedMotion],
  );

  useEffect(() => {
    if (
      inspectedElement &&
      SidebarPanel.get() !== EditorPanel.Inspector &&
      !reducedMotion &&
      inspectorTab.current.getAnimations().length < 2
    ) {
      inspectorTab.current.animate(emphasize(), {duration: 400});
      inspectorTab.current.animate([{color: 'white'}, {color: ''}], {
        duration: 800,
      });
    }
  }, [inspectedElement, reducedMotion]);

  return (
    <Tabs className={styles.root}>
      <TabLink
        title="Project Selection"
        id="project-selection-link"
        href={window.location.pathname === '/' ? undefined : '../'}
      >
        <MotionCanvas />
      </TabLink>
      <TabGroup tab={SidebarPanel.get()} setTab={SidebarPanel.set}>
        <Tab
          title="Video Settings"
          id="rendering-tab"
          tab={EditorPanel.VideoSettings}
        >
          <Videocam />
        </Tab>
        <Tab
          forwardRef={inspectorTab}
          title="Inspector"
          id="inspector-tab"
          tab={EditorPanel.Inspector}
        >
          <AccountTree />
        </Tab>
        <Tab title="Thread Debugger" id="threads-tab" tab={EditorPanel.Threads}>
          <HourglassBottom />
        </Tab>
        <Tab
          title={errorCount > 0 ? `Console (${errorCount})` : 'Console'}
          id="console-tab"
          tab={EditorPanel.Console}
        >
          <Bug />
          {errorCount > 0 && (
            <Badge badgeRef={badge}>
              {errorCount > 999 ? `999+` : errorCount}
            </Badge>
          )}
        </Tab>
        <Tab title="Settings" id="settings-tab" tab={EditorPanel.Settings}>
          <Settings />
        </Tab>
      </TabGroup>
      <Space />
      <TabLink
        title="Docs"
        id="docs-external-link"
        href="https://motioncanvas.io/docs/"
        target="_blank"
      >
        <School />
      </TabLink>
      <TabGroup tab={BottomPanel.get()} setTab={BottomPanel.set}>
        <Tab title="Timeline" id="timeline-tab" tab={EditorPanel.Timeline}>
          <Movie />
        </Tab>
      </TabGroup>
    </Tabs>
  );
}
