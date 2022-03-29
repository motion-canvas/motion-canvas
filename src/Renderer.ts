import type {Project} from './Project';

export const Renderer = (factory: () => Project) => {
  document.addEventListener('click', () =>
    render(factory()).catch(console.error),
  );
};

async function render(project: Project) {
  let totalSize = 0;
  const startTime = Date.now();

  project.start();
  const directory = await window.showDirectoryPicker();

  while (!(await project.next())) {
    project.draw();
    const name = project.frame.toString().padStart(6, '0');
    const content = await new Promise<Blob>(resolve => project.toCanvas().toBlob(resolve, 'image/png'));
    const size = (content.size) / 1024;
    totalSize += size;

    const file = await directory.getFileHandle(`frame-${name}.png`, {
      create: true,
    });
    const stream = await file.createWritable();
    await stream.write(content);
    await stream.close();

    console.log(
      `Frame: ${name}, Size: ${Math.round(size)} kB, Total: ${Math.round(
        totalSize,
      )} kB, Elapsed: ${Math.round((Date.now() - startTime) / 1000)}`,
    );

    await new Promise(resolve => setTimeout(resolve, 0));
  }
}
