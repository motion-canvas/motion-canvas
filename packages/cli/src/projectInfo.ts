let ConfigFile: string;
let Language: string;

export function setConfigFile(newConfigFile: string) {
  ConfigFile = newConfigFile;
}

export function setLanguage(newLanguage: string) {
  Language = newLanguage;
}

export function getConfigFile(): string {
  if (ConfigFile == undefined)
    throw new Error(
      'configFile is undefined, try setting it first with setConfigFile()',
    );
  return ConfigFile;
}

export function getLanguage(): string {
  if (ConfigFile == undefined)
    throw new Error(
      'language is undefined, try setting it first with setLanguage()',
    );
  return Language;
}
