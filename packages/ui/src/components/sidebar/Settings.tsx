import {useApplication} from '../../contexts';
import {Expandable} from '../fields';
import {MetaFieldView} from '../meta';
import {Pane} from '../tabs';

export function Settings() {
  const {settings} = useApplication();

  return (
    <Pane title="Settings" id="app-settings-pane">
      <Expandable title={settings.appearance.name} open>
        <MetaFieldView field={settings.appearance} />
      </Expandable>
      <Expandable title={settings.defaults.name}>
        <MetaFieldView field={settings.defaults} />
      </Expandable>
    </Pane>
  );
}
