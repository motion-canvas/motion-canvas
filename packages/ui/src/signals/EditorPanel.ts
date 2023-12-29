export enum EditorPanel {
  VideoSettings = 'video-settings-panel',
  Threads = 'threads-panel',
  Console = 'console-panel',
  Settings = 'settings-panel',
  Timeline = 'timeline-panel',
}

export function isEditorPanel(value: string): value is EditorPanel {
  return Object.values(EditorPanel).includes(value as EditorPanel);
}
