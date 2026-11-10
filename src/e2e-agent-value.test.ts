import {expect,test} from 'vitest';
import {value} from './e2e-agent-value';
test('agent value matches the contract',()=>expect(value).toBe(1));
