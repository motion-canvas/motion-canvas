import type {InspectedElement} from '@motion-canvas/core';
import {ComponentChildren, createContext} from 'preact';
import {useContext, useMemo, useState} from 'preact/hooks';

export interface AppState {
  inspectedElement: InspectedElement | null;
  setInspectedElement: (element: InspectedElement | null) => void;
}

const InspectionContext = createContext<AppState>({
  inspectedElement: null,
  setInspectedElement: () => {
    throw new Error('setSelectedNode not implemented');
  },
});

export function InspectionProvider({children}: {children: ComponentChildren}) {
  const [inspectedElement, setInspectedElement] =
    useState<InspectedElement | null>(null);

  const state = useMemo(
    () => ({
      inspectedElement,
      setInspectedElement,
    }),
    [inspectedElement],
  );

  return (
    <InspectionContext.Provider value={state}>
      {children}
    </InspectionContext.Provider>
  );
}

export function useInspection() {
  return useContext(InspectionContext);
}
