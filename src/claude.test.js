'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

describe('claude module', () => {
  it('createClient throws when ANTHROPIC_API_KEY is missing', () => {
    const saved = process.env.ANTHROPIC_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;

    try {
      const { createClient } = require('./claude');
      assert.throws(
        () => createClient(),
        /ANTHROPIC_API_KEY environment variable is not set/
      );
    } finally {
      if (saved !== undefined) {
        process.env.ANTHROPIC_API_KEY = saved;
      }
    }
  });

  it('createClient returns an Anthropic instance when key is present', () => {
    process.env.ANTHROPIC_API_KEY = 'test-key';
    const { createClient } = require('./claude');
    const client = createClient();
    assert.ok(client, 'client should be truthy');
    assert.strictEqual(typeof client.messages.create, 'function');
    delete process.env.ANTHROPIC_API_KEY;
  });
});
