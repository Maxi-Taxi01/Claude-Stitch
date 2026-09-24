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

const DEFAULT_MODEL = 'claude-haiku-4-5';

/**
 * Extracts the reply text from a Messages API response.
 *
 * Newer models can return non-text blocks (such as `thinking`) before the
 * text, so every `text` block is collected rather than only the first block.
 *
 * @param {object} response - Response returned by client.messages.create
 * @returns {string} The concatenated text of all text blocks
 */
function extractText(response) {
  const textBlocks = (response.content || []).filter(
    (block) => block.type === 'text'
  );
  if (textBlocks.length === 0) {
    throw new Error('Unexpected response format from Claude API');
  }
  return textBlocks.map((block) => block.text).join('');
}

/**
 * Sends a single user message to Claude and returns the text response.
 *
 * @param {string} message - The user message to send
 * @param {object} [options] - Optional parameters
 * @param {string} [options.model='claude-haiku-4-5'] - Claude model to use
 * @param {number} [options.maxTokens=1024] - Maximum tokens in the response
 * @returns {Promise<string>} The text content of Claude's reply
 */
async function sendMessage(message, options = {}) {
  const client = createClient();
  const { model = DEFAULT_MODEL, maxTokens = 1024 } = options;

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: message }],
  });

  return extractText(response);
}

module.exports = { DEFAULT_MODEL, createClient, extractText, sendMessage };
