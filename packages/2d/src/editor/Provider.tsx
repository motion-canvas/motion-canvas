import {Signal, useSignal} from '@preact/signals';
import {ComponentChildren, createContext} from 'preact';
import {useContext} from 'preact/hooks';

export interface InspectionState {
  nodeKey: Signal<string | null>;
}

const InspectionContext = createContext<InspectionState | null>(null);

export function useInspection() {
  return useContext(InspectionContext)!;
}

export function Provider({children}: {children?: ComponentChildren}) {
  const nodeKey = useSignal<string | null>(null);

  return (
    <InspectionContext.Provider value={{nodeKey}}>
      {children}
    </InspectionContext.Provider>
  );
}
