import {usePrismTheme} from '@docusaurus/theme-common';
import {Language, PrismTheme} from 'prism-react-renderer';
import React, {ReactNode, useContext, useMemo} from 'react';

export type StyleObj = {
  [key: string]: string | number | void;
};

export type ThemeDict = {
  root: StyleObj;
  plain: StyleObj;
  [type: string]: StyleObj;
};

export function themeToDict(theme: PrismTheme, language: Language): ThemeDict {
  const {plain} = theme;
  const base: ThemeDict = Object.create(null);

  const themeDict = theme.styles.reduce((acc, themeEntry) => {
    const {languages, style} = themeEntry;
    if (languages && !languages.includes(language)) {
      return acc;
    }

    themeEntry.types.forEach(type => {
      acc[type] = {...acc[type], ...style};
    });

    return acc;
  }, base);

  themeDict.root = plain;
  themeDict.plain = {...plain, backgroundColor: null};

  return themeDict;
}

const Context = React.createContext<ThemeDict | null>(null);

export function ThemeDictProvider({children}: {children: ReactNode}) {
  const theme = usePrismTheme();
  const dictionary = useMemo(() => themeToDict(theme, 'typescript'), [theme]);

  return <Context.Provider value={dictionary}>{children}</Context.Provider>;
}

export function useTokenProps(type = 'plain') {
  const dictionary = useContext(Context);
  return {
    className: `token ${type}`,
    style: dictionary[type] ?? dictionary.plain,
  };
}

export function useTokenStyle(type = 'plain') {
  const dictionary = useContext(Context);
  return dictionary[type] ?? dictionary.plain;
}
