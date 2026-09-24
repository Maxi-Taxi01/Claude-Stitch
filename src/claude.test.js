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

  it('defaults to a model that is still available', () => {
    const { DEFAULT_MODEL } = require('./claude');
    assert.strictEqual(DEFAULT_MODEL, 'claude-haiku-4-5');
  });

  it('extractText returns the text when it follows a thinking block', () => {
    const { extractText } = require('./claude');
    const response = {
      content: [
        { type: 'thinking', thinking: '', signature: 'sig' },
        { type: 'text', text: 'Hello' },
        { type: 'text', text: ' there' },
      ],
    };
    assert.strictEqual(extractText(response), 'Hello there');
  });

  it('extractText throws when the response has no text blocks', () => {
    const { extractText } = require('./claude');
    assert.throws(
      () => extractText({ content: [{ type: 'thinking', thinking: '' }] }),
      /Unexpected response format from Claude API/
    );
    assert.throws(
      () => extractText({ content: [] }),
      /Unexpected response format from Claude API/
    );
  });
});
