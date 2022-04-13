export function classes(...args: (string | [string, boolean])[]): string {
  let classList = '';
  for (const arg of args) {
    if (typeof arg === 'string') {
      classList += ' ' + arg;
    } else if (arg[1]) {
      classList += ' ' + arg[0];
    }
  }

  return classList;
}