let LoaderCount = 0;

/**
 * Execute a given async function while displaying a loading indication.
 *
 * @param callback - A function to execute.
 */
export async function withLoader(callback: () => Promise<unknown>) {
  LoaderCount++;
  document.body.classList.add('wait');
  try {
    await callback();
  } finally {
    LoaderCount--;
    if (LoaderCount === 0) {
      document.body.classList.remove('wait');
    }
  }
}
