export class FrameSaver {
  private static createImageMeta(
    frame: number,
    subDirectories: string[],
    fileType: string,
  ) {
    return {
      name: frame.toString().padStart(6, '0'),
      subDirectories,
      mimeType: fileType,
      frameNumber: frame,
    };
  }

  private static sendFrame(
    data: string,
    {
      frame,
      subDirectories,
      fileType,
    }: {
      frame: number;
      subDirectories: string[];
      fileType: string;
    },
  ) {
    if (import.meta.hot) {
      import.meta.hot.send('motion-canvas:export', {
        data,
        meta: FrameSaver.createImageMeta(frame, subDirectories, fileType),
      });
    }
  }

  public static saveSequenceFrame(
    data: string,
    {
      frame,
      fileType,
      sceneName,
      projectName,
      groupByScene,
    }: {
      frame: number;
      fileType: string;
      sceneName: string;
      projectName: string;
      groupByScene: boolean;
    },
  ) {
    const subDirectories = [projectName];
    if (groupByScene) subDirectories.push(sceneName);
    FrameSaver.sendFrame(data, {frame, fileType, subDirectories});
  }

  public static saveStillFrame(
    data: string,
    {
      frame,
      fileType,
      projectName,
    }: {
      frame: number;
      fileType: string;
      projectName: string;
    },
  ) {
    const subDirectories = ['still', projectName];
    FrameSaver.sendFrame(data, {frame, fileType, subDirectories});
  }
}
