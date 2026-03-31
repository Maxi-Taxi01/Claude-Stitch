# Claude-Stitch

A lightweight Node.js module that connects to the [Anthropic Claude API](https://docs.anthropic.com/).

## Prerequisites

- Node.js 18 or later
- An [Anthropic API key](https://console.anthropic.com/)

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure your API key**

   Copy the example environment file and add your key:

   ```bash
   cp .env.example .env
   ```

   Open `.env` and replace `your_api_key_here` with your actual Anthropic API key.

## Usage

Run the example script to verify the connection:

```bash
npm start
```

### Programmatic usage

```js
require('dotenv').config();
const { sendMessage } = require('./src/claude');

const reply = await sendMessage('Hello, Claude!');
console.log(reply);
```

`sendMessage` accepts an optional second argument for overriding the model or `maxTokens`:

```js
const reply = await sendMessage('Summarise this text …', {
  model: 'claude-opus-4-5',
  maxTokens: 2048,
});
```

## Tests

```bash
npm test
```

## Environment variables

| Variable           | Description                       |
| ------------------ | --------------------------------- |
| `ANTHROPIC_API_KEY` | Your Anthropic API key (required) |
