import {beforeEach, describe, expect, it, vi} from 'vitest';
import {isProxyEnabled, viaProxy} from './proxyUtils';
const WindowMock = {
  location: {
    toString: () => 'https://mockhostname:1234',
  },
};

function proxy(str: string) {
  return '/cors-proxy/' + encodeURIComponent(str);
}

describe('proxyUtils', () => {
  describe('isProxyEnabled()', () => {
    it('should default to false without import.meta set', () => {
      import.meta.env['VITE_MC_PROXY_ENABLED'] = undefined;
      expect(isProxyEnabled()).toStrictEqual(false);
    });

    it("should return true if 'true' is set for VITE_MC_PROXY_ENABLED", () => {
      import.meta.env['VITE_MC_PROXY_ENABLED'] = 'true';
      expect(isProxyEnabled()).toStrictEqual(true);
    });

    it("should return false if 'false' is set for VITE_MC_PROXY_ENABLED", () => {
      import.meta.env['VITE_MC_PROXY_ENABLED'] = 'false';
      expect(isProxyEnabled()).toStrictEqual(false);
    });
  });

  describe('viaProxy()', () => {
    it('should not Proxy if VITE_MC_PROXY_ENABLED is not set', () => {
      import.meta.env['VITE_MC_PROXY_ENABLED'] = undefined;
      const input = 'https://via.placeholder.com/300.png/09f/fff';
      expect(viaProxy(input)).toStrictEqual(input);
    });

    it("should not Proxy if VITE_MC_PROXY_ENABLED is set to 'false'", () => {
      import.meta.env['VITE_MC_PROXY_ENABLED'] = 'false';
      const input = 'https://via.placeholder.com/300.png/09f/fff';
      expect(viaProxy(input)).toStrictEqual(input);
    });

    describe('VITE_MC_PROXY_ENABLED is enabled', () => {
      beforeEach(() => {
        import.meta.env.VITE_MC_PROXY_ENABLED = 'true';
        import.meta.env.VITE_MC_PROXY_ALLOW_LIST = undefined;
        vi.stubGlobal('window', WindowMock);
      });
      const input = 'https://via.placeholder.com/300.png/09f/fff';
      const proxiedInput = proxy(input);

      it('should proxy if VITE_MC_PROXY_ALLOW_LIST is not set', () => {
        delete import.meta.env['VITE_MC_PROXY_ALLOW_LIST'];
        expect(viaProxy(input)).toStrictEqual(proxiedInput);
      });

      it('should not proxy if the host is not in the allow list', () => {
        import.meta.env['VITE_MC_PROXY_ALLOW_LIST'] = JSON.stringify([
          'google.com',
        ]);
        const x = viaProxy(input);
        expect(x).toStrictEqual(input);
      });

      it('should proxy if VITE_MC_PROXY_ALLOW_LIST is an empty list', () => {
        import.meta.env['VITE_MC_PROXY_ALLOW_LIST'] = JSON.stringify([]);
        expect(viaProxy(input)).toStrictEqual(proxiedInput);
      });

      it('should proxy if the host is on the allow list', () => {
        import.meta.env['VITE_MC_PROXY_ALLOW_LIST'] = JSON.stringify([
          'via.placeholder.com',
        ]);
        expect(viaProxy(input)).toStrictEqual(proxiedInput);
      });

      it('should not proxy if the host is the same as the server', () => {
        import.meta.env['VITE_MC_PROXY_ALLOW_LIST'] = JSON.stringify([]);
        const input = WindowMock.location.toString() + '/some/example.png';
        expect(viaProxy(input)).toStrictEqual(input);
      });
    });

    describe('Protocols', () => {
      beforeEach(() => {
        import.meta.env.VITE_MC_PROXY_ENABLED = 'true';
        import.meta.env.VITE_MC_PROXY_ALLOW_LIST = JSON.stringify([]);
        vi.stubGlobal('window', WindowMock);
      });

      it('should proxy if the request protocol is http and https', () => {
        const suffix = '://via.placeholder.com/300.png/09f/fff';
        const httpReq = 'http' + suffix;
        const httpsReq = 'https' + suffix;

        expect(viaProxy(httpReq)).toStrictEqual(proxy(httpReq));
        expect(viaProxy(httpsReq)).toStrictEqual(proxy(httpsReq));
      });

      it('should not proxy other protocols like data:', () => {
        const dataBlob =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2PYOO36fwAHOAMeASY22QAAAABJRU5ErkJggg==';
        expect(viaProxy(dataBlob)).toStrictEqual(dataBlob);
      });
    });

    it('should not rewrite an already proxied request', () => {
      const raw = 'https://via.placeholder.com/300.png/09f/fff';

      expect(viaProxy(raw)).not.toStrictEqual(raw);
      expect(viaProxy(viaProxy(raw))).toStrictEqual(viaProxy(raw));
    });
  });
});
