declare module 'parse-svg-path' {
  export type PathCommand = [
    string,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ];
  function parse(path: string): PathCommand[];
  export default parse;
}
