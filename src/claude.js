'use strict';

const Anthropic = require('@anthropic-ai/sdk');

/**
 * Creates and returns an authenticated Anthropic client.
 *
 * The client reads the API key from the ANTHROPIC_API_KEY environment
 * variable.  Copy .env.example to .env and fill in your key before running.
 *
 * @returns {Anthropic} Configured Anthropic client instance
 */
function createClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY environment variable is not set. ' +
        'Copy .env.example to .env and add your API key.'
    );
  }
  return new Anthropic({ apiKey });
}

/**
 * Sends a single user message to Claude and returns the text response.
 *
 * @param {string} message - The user message to send
 * @param {object} [options] - Optional parameters
 * @param {string} [options.model='claude-3-5-haiku-20241022'] - Claude model to use
 * @param {number} [options.maxTokens=1024] - Maximum tokens in the response
 * @returns {Promise<string>} The text content of Claude's reply
 */
async function sendMessage(message, options = {}) {
  const client = createClient();
  const { model = 'claude-3-5-haiku-20241022', maxTokens = 1024 } = options;

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: message }],
  });

  const block = response.content[0];
  if (!block || block.type !== 'text') {
    throw new Error('Unexpected response format from Claude API');
  }
  return block.text;
}

module.exports = { createClient, sendMessage };
