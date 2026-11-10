import test from 'node:test';
import assert from 'node:assert/strict';
import fixture from '../dist/e2e-agent-value.cjs';
test('agent value matches the contract',()=>assert.equal(fixture.value,4));
