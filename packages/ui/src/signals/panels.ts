import {computed} from '@preact/signals';
import {EditorPanel, isEditorPanel} from './EditorPanel';
import {storedSignal} from './storedSignal';

function panelSignals(initial: EditorPanel, id: string) {
  const storedPanel = storedSignal<EditorPanel>(initial, id, value => {
    return isEditorPanel(value) ? value : initial;
  });
  const isHidden = storedSignal(storedPanel.value === null, `${id}-hidden`);
  const current = computed(() => (isHidden.value ? null : storedPanel.value));

  function get() {
    return current.value;
  }

  function set(value: EditorPanel | null) {
    if (value === null) {
      isHidden.value = true;
    } else {
      storedPanel.value = value;
      isHidden.value = false;
    }
  }

  return {get, set, isHidden};
}

export const SidebarPanel = panelSignals(EditorPanel.VideoSettings, 'sidebar');
export const BottomPanel = panelSignals(EditorPanel.Timeline, 'bottom-panel');
