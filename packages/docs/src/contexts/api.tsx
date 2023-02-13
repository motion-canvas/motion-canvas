import React, {ReactNode, useContext} from 'react';
import type {JSONOutput} from 'typedoc';

declare module 'typedoc' {
  namespace JSONOutput {
    interface Type {
      project?: number;
    }

    interface Reflection {
      project?: number;
      docId: string;
      href: string;
      url: string;
      hasOwnPage: boolean;
      anchor?: string;
      next?: any;
      previous?: any;
      importPath?: string;
    }

    interface Comment {
      summaryText?: string;
      summaryId?: string;
    }

    interface CommentTag {
      contentId: string;
    }
  }
}

export interface ReflectionReference {
  id: number;
  projectId: number;
}

export interface ApiContext {
  lookup: ApiLookups;
  urlLookup: Record<string, ReflectionReference>;
}

export type ApiLookup = Record<number, JSONOutput.Reflection>;
export type ApiLookups = Record<number, ApiLookup>;

const Context = React.createContext<ApiContext>({
  lookup: {},
  urlLookup: {},
});

export function ApiProvider({
  children,
  lookup,
  urlLookup,
}: {
  children: ReactNode;
  lookup: ApiLookups;
  urlLookup: Record<string, ReflectionReference>;
}) {
  return (
    <Context.Provider value={{lookup, urlLookup}}>{children}</Context.Provider>
  );
}

export function useApiContext(): ApiContext {
  return useContext(Context);
}

export function useApiLookup(id: number): ApiLookup {
  const {lookup} = useContext(Context);
  return lookup[id];
}

interface ApiFinder {
  <T extends JSONOutput.Reflection>(value?: {id: number; project: number}): T;
}

export function useApiFinder(): ApiFinder {
  const {lookup} = useContext(Context);
  return (value => {
    if (typeof value?.project === 'number') {
      return lookup[value.project][value.id];
    }
    return undefined;
  }) as ApiFinder;
}

export function useUrlLookup(): (url: string) => JSONOutput.Reflection | null {
  const {urlLookup, lookup} = useContext(Context);

  return url => {
    const reference = urlLookup[url];
    if (!reference) {
      return null;
    }

    return lookup[reference.projectId]?.[reference.id] ?? null;
  };
}

export function getUrl(reflection?: JSONOutput.DeclarationReflection) {
  if (!reflection) return undefined;
  return reflection.href;
}
