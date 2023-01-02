import React, {FunctionComponent, ReactNode, useContext} from 'react';
import type {JSONOutput} from 'typedoc';

declare module 'typedoc' {
  namespace JSONOutput {
    interface ReferenceType {
      lookupId?: number;
    }

    interface Reflection {
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
  contents: Record<string, FunctionComponent>;
  id: number;
}

export type ApiLookup = Record<number, JSONOutput.Reflection>;
export type ApiLookups = Record<number, ApiLookup>;

const Context = React.createContext<ApiContext>({
  lookup: {},
  urlLookup: {},
  contents: {},
  id: 0,
});

export function ApiProvider({
  children,
  lookup,
  urlLookup,
  contents,
  id,
}: {
  children: ReactNode;
  lookup: ApiLookups;
  urlLookup: Record<string, ReflectionReference>;
  contents: Record<string, FunctionComponent>;
  id: number;
}) {
  return (
    <Context.Provider value={{lookup, contents, urlLookup, id}}>
      {children}
    </Context.Provider>
  );
}

export function useApiContext(): ApiContext {
  return useContext(Context);
}

export function useApiLookup(customId?: number): ApiLookup {
  const {lookup, id} = useContext(Context);
  return lookup[customId ?? id];
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

export function useApiContent(id: string): FunctionComponent {
  const {contents} = useContext(Context);
  return contents[id] ?? React.Fragment;
}

export function getUrl(reflection?: JSONOutput.DeclarationReflection) {
  if (!reflection) return undefined;
  return reflection.href;
}
