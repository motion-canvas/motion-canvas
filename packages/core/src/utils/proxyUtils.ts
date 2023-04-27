/**
 * Utility to redirect remote sources via Proxy
 *
 * This utility is used to rewrite a request to be routed through
 * the Proxy instead.
 */

import {useLogger} from './useScene';

/**
 * Route the given url through a local proxy.
 *
 * @example
 * This rewrites a remote url like `https://via.placeholder.com/300.png/09f/fff`
 * into a URI-Component-Encoded string like
 * `/cors-proxy/https%3A%2F%2Fvia.placeholder.com%2F300.png%2F09f%2Ffff`
 */
export function viaProxy(url: string) {
  if (!isProxyEnabled()) {
    // Proxy is disabled, so we just pass as-is.
    return url;
  }

  if (url.startsWith('/cors-proxy/')) {
    // Already proxied, return as-is
    return url;
  }

  // window.location.hostname is being passed here to ensure that
  // this does not throw an Error for same-origin requests
  // e.g. /some/image -> localhost:9000/some/image
  const selfUrl = new URL(window.location.toString());
  // inside a try-catch in case the URL cannot be understood
  try {
    const expandedUrl = new URL(url, selfUrl);
    if (!expandedUrl.protocol.startsWith('http')) {
      // this is probably some embedded image (e.g. image/png;base64).
      // don't touch and pass as is
      return url;
    }
    if (selfUrl.host === expandedUrl.host) {
      // This is a request to a "local" resource.
      // No need to rewrite
      return url;
    }

    // Check if the host matches the Allow List.
    // if not, no rewrite takes place.
    // will fail in the Editor if the
    // remote host does not accept anonymous
    if (!isInsideAllowList(expandedUrl.host)) {
      return url;
    }
  } catch (_) {
    // in case of error just silently pass as-is
    return url;
  }

  // Everything else is a "remote" resource and requires a rewrite.
  return `/cors-proxy/${encodeURIComponent(url)}`;
}

/**
 * Check the provided host is allowed to be routed
 * to the Proxy.
 */
function isInsideAllowList(host: string) {
  const allowList = getAllowList();
  if (allowList.length === 0) {
    // Allow List defaults to allow all if empty
    return true;
  }
  for (const entry of allowList) {
    if (entry.toLowerCase().trim() === host) {
      return true;
    }
  }
  return false;
}

/**
 * Check if the proxy is enabled via the plugin by checking
 * for `import.meta.env.VITE_MC_PROXY_ENABLED`
 *
 * @remarks The value can either be 'true' of 'false'
 * (as strings) if present, or be undefined if not run
 * from a vite context or run without the MC Plugin.
 */
export function isProxyEnabled() {
  if (import.meta.env) {
    return import.meta.env.VITE_MC_PROXY_ENABLED === 'true';
  }
  return false;
}

/**
 * Cached value so getAllowList does not
 * try to parse the Env var on every call,
 * spamming the console in the process
 */
let AllowListCache: string[] | undefined = undefined;
/**
 * Return the list of allowed hosts
 * from the Plugin Config
 */
function getAllowList() {
  // Condition should get optimized away for Prod
  if (import.meta.env.VITEST !== 'true') {
    if (AllowListCache) {
      return [...AllowListCache];
    }
  }

  // Inline function gets immediately invoked
  // and the result stored in getAllowListCache.
  // The cached value is used on subsequent requests.
  const result = (function () {
    if (!isProxyEnabled() || !import.meta.env) {
      return [];
    }

    // This value is encoded as a JSON String.
    const valueJson = import.meta.env.VITE_MC_PROXY_ALLOW_LIST ?? '[]';
    const parsedJson = JSON.parse(valueJson);
    // Do an additional check that only strings are present,
    // create a warning and ignore the value
    if (!Array.isArray(parsedJson)) {
      useLogger().error(
        'Parsed Allow List expected to be an Array, but is ' +
          typeof parsedJson,
      );
    }
    const validatedEntries = [];
    for (const entry of parsedJson) {
      if (typeof entry !== 'string') {
        useLogger().warn(
          'Unexpected Value in Allow List: ' +
            entry +
            '. Expected a String. Skipping.',
        );
        continue;
      }
      validatedEntries.push(entry);
    }
    return validatedEntries;
  })();
  AllowListCache = result;
  return [...AllowListCache];
}
