import {vi} from 'vitest';

vi.stubGlobal('AudioContext', class {});
