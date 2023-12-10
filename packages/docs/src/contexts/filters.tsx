import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import useIsBrowser from '@docusaurus/useIsBrowser';
import React, {ReactNode, useContext, useState} from 'react';
import type {JSONOutput} from 'typedoc';

export interface Filters {
  private: boolean;
  inherited: boolean;
}

type FiltersContext = [Filters, (value: Filters) => void];

const FILTERS_KEY = 'api-filters';

const StoredValue = ExecutionEnvironment.canUseDOM
  ? localStorage.getItem(FILTERS_KEY)
  : null;
const DefaultValue = StoredValue
  ? JSON.parse(StoredValue)
  : {
      inherited: true,
      private: false,
    };

const Context = React.createContext<FiltersContext>([
  DefaultValue,
  () => {
    // do nothing
  },
]);

export function FiltersProvider({children}: {children: ReactNode}) {
  const [filters, setFilters] = useState<Filters>(DefaultValue);
  const isBrowser = useIsBrowser();

  return (
    <Context.Provider
      value={[
        filters,
        value => {
          if (isBrowser) {
            localStorage.setItem(FILTERS_KEY, JSON.stringify(value));
          }
          setFilters(value);
        },
      ]}
    >
      {children}
    </Context.Provider>
  );
}

export function useFilters(): FiltersContext {
  return useContext(Context);
}

export function matchFilters(
  filter: Filters,
  reflection: JSONOutput.DeclarationReflection,
) {
  const isPrivate =
    reflection.flags?.isPrivate || reflection.flags?.isProtected;
  if (!filter.private && isPrivate) return false;

  const isInherited = !!reflection.inheritedFrom;
  if (!filter.inherited && isInherited) return false;

  return true;
}
