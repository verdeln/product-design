import test from 'node:test';
import assert from 'node:assert/strict';
import { health } from '../e2e/code-change-health.mjs';
test('code-change health remains green', () => assert.equal(health, 'green'));
