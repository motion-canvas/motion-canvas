let loaderCount = 0;

/**
 * Execute a given async function while displaying a loading indication.
 *
 * @param callback - A function to execute.
 */
export async function withLoader(callback: () => Promise<unknown>) {
  loaderCount++;
  document.body.classList.add('wait');
  try {
    await callback();
  } finally {
    loaderCount--;
    if (loaderCount == 0) {
      document.body.classList.remove('wait');
    }
  }
}
