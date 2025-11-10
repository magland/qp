# Testing Guide

This project uses [Vitest](https://vitest.dev/) for testing.

## Running Tests

```bash
# Run tests in watch mode (interactive)
npm test

# Run tests once and exit
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Test Structure

Tests are colocated with the code they test using the `.test.ts` or `.test.tsx` suffix.

Example:
- `src/assistants/bids-assistant/retrieveBidsDocs.tsx` - Implementation
- `src/assistants/bids-assistant/retrieveBidsDocs.test.ts` - Unit tests
- `src/assistants/bids-assistant/integration.test.ts` - Integration tests

## Writing Tests

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from './myModule';

describe('myFunction', () => {
  it('should return expected value', () => {
    const result = myFunction('input');
    expect(result).toBe('output');
  });
});
```

### Integration Tests

Integration tests verify that different parts of the system work together:

```typescript
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Feature Integration', () => {
  it('should be integrated in App.tsx', () => {
    const appPath = join(process.cwd(), 'src/App.tsx');
    const content = readFileSync(appPath, 'utf8');
    expect(content).toContain('my-feature');
  });
});
```

## Network Tests

Network tests that make real HTTP requests are typically skipped in the test environment due to:
- CORS restrictions in test DOM environments
- Flakiness from network issues
- Slow execution times

Use `it.skip()` for network-dependent tests:

```typescript
it.skip('should fetch data from API', async () => {
  // This test is skipped in CI/automated runs
  const result = await fetchFromAPI();
  expect(result).toBeDefined();
});
```

For network functionality, prefer:
1. Testing the structure and validation logic
2. Manual testing with `npm run dev`
3. End-to-end tests in a real browser

## Test Configuration

- **Config file**: `vitest.config.ts`
- **Setup file**: `src/test/setup.ts`
- **Environment**: happy-dom (lightweight DOM implementation)

## Coverage

Coverage reports show which code is tested:

```bash
npm run test:coverage
```

Coverage files are generated in `coverage/` directory.

## Best Practices

1. **Test behavior, not implementation** - Focus on what the code does, not how it does it
2. **Keep tests isolated** - Each test should run independently
3. **Use descriptive names** - Test names should explain what is being tested
4. **Organize with describe blocks** - Group related tests together
5. **Test edge cases** - Don't just test the happy path

## Example: BIDS Assistant Tests

The BIDS assistant includes comprehensive tests:

- **Unit tests** (`retrieveBidsDocs.test.ts`):
  - Document list validation
  - URL structure verification
  - Modality coverage
  - Tool function structure

- **Integration tests** (`integration.test.ts`):
  - File structure verification
  - App integration checks
  - API route integration
  - Documentation updates

Run just these tests:
```bash
npm test -- src/assistants/bids-assistant/
```
