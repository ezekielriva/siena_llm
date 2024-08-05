# Siena LLM
LLM Challenge

## Requirements

> details hidden due to confidential details.

High level requirement:

1. API to Ingest Data
2. Prompt Engineering
3. Service to process Ingested Data
4. Serve the data

## Installation

### Environment Details
1. Node Version: v22.5.1
1. NPM 10.8.2

### Instructions
1. Install Node v22.5.1, NPM 10.8.2
1. Install packages using `npm install`
1. Setup the database by running `npm run db:init`
1. Setup the database by running `npm run db:populate`

## Execution

1. Create your `.env` file using `.env.sample` as reference.
1. Run `npm run start:dev:local`

## Testing

1. Creaet your `.env.test.local` file using `.env.sample` as reference.
1. Setup the database by running `npm run db:init`
1. Run `npm test` or `npm run test:watch` to enable the watcher.
