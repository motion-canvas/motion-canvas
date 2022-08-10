jest.mock('./utils/ifHot');
global.AudioContext = class {} as new () => AudioContext;
