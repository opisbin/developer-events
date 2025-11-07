# Test Suite Documentation

This directory contains comprehensive unit tests for the database models and utilities added in the `database-models` branch.

## Overview

The test suite uses:
- **Jest** - Testing framework
- **MongoDB Memory Server** - In-memory MongoDB for isolated testing
- **TypeScript** - Full type safety in tests

## Test Coverage

### Database Models

#### 1. Event Model Tests (`database/event.model.test.ts`)
Comprehensive tests for the Event Mongoose model covering:

- **Schema Validation**: Required fields, field constraints, maxlength validations
- **Slug Generation**: Automatic slug creation from titles, special character handling, uniqueness
- **Date/Time Normalization**: ISO format conversion, validation, time format normalization
- **String Trimming**: Whitespace handling across all string fields
- **Timestamps**: Automatic createdAt/updatedAt handling
- **Array Fields**: Agenda and tags validation
- **Edge Cases**: Empty strings, special characters, boundary conditions

**Test Count**: 40+ tests covering all model functionality

#### 2. Booking Model Tests (`database/booking.model.test.ts`)
Comprehensive tests for the Booking Mongoose model covering:

- **Schema Validation**: Required fields (eventId, email)
- **Email Validation**: RFC 5322 compliant email validation with extensive test cases
- **Event Reference Validation**: Pre-save hook testing for event existence
- **Timestamps**: CreatedAt/updatedAt behavior
- **Indexes**: Verification of database indexes
- **Multiple Bookings**: Same event, different events scenarios
- **Model Population**: Testing Mongoose populate functionality
- **Query Performance**: Index effectiveness testing
- **Edge Cases**: Long emails, special characters, subdomains

**Test Count**: 30+ tests covering all booking scenarios

#### 3. Database Index Tests (`database/index.test.ts`)
Tests for the database module exports:

- **Model Exports**: Verification of Event and Booking exports
- **Type Exports**: TypeScript interface exports (IEvent, IBooking)
- **Export Consistency**: Model properties and methods
- **Mongoose Integration**: Verification of Mongoose model features

**Test Count**: 8 tests for module consistency

### Utilities

#### 4. MongoDB Connection Tests (`lib/mongodb.test.ts`)
Comprehensive tests for the MongoDB connection utility:

- **Environment Validation**: MONGODB_URI requirement
- **Connection Establishment**: Successful connection handling
- **Connection Caching**: Global cache behavior, connection reuse
- **Error Handling**: Graceful failure, retry capability
- **Concurrent Connections**: Thread-safety testing
- **Global Cache**: Cache initialization and management
- **Connection State**: Mongoose connection state tracking
- **Integration Tests**: Database operations after connection
- **Edge Cases**: Already connected scenarios, empty cache

**Test Count**: 25+ tests for connection reliability

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npm test -- __tests__/database/event.model.test.ts
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="Email Validation"
```

## Test Structure

Each test file follows this structure:

```typescript
describe('Component Name', () => {
  // Setup
  beforeAll(async () => { /* Initialize test environment */ });
  afterEach(async () => { /* Clean up after each test */ });
  afterAll(async () => { /* Tear down test environment */ });

  describe('Feature Group', () => {
    it('should do something specific', async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## Key Testing Patterns

### 1. In-Memory MongoDB
All database tests use MongoDB Memory Server for:
- Fast execution
- Isolation from real database
- No external dependencies
- Automatic cleanup

### 2. Comprehensive Coverage
Tests cover:
- ✅ Happy paths
- ✅ Error conditions
- ✅ Edge cases
- ✅ Boundary conditions
- ✅ Integration scenarios

### 3. Descriptive Test Names
Test names clearly describe:
- What is being tested
- Expected behavior
- Specific conditions

### 4. Independent Tests
Each test:
- Runs independently
- Sets up its own data
- Cleans up after itself
- Doesn't depend on other tests

## Common Test Scenarios

### Testing Model Validation
```typescript
it('should fail when email is missing', async () => {
  const invalidBooking = { eventId: testEventId };
  const booking = new Booking(invalidBooking);
  await expect(booking.save()).rejects.toThrow();
});
```

### Testing Pre-Save Hooks
```typescript
it('should generate slug from title on creation', async () => {
  const event = new Event({ title: 'React Summit 2025', /* ... */ });
  await event.save();
  expect(event.slug).toBe('react-summit-2025');
});
```

### Testing Error Handling
```typescript
it('should handle connection errors gracefully', async () => {
  await mongoServer.stop();
  await expect(connectDB()).rejects.toThrow();
});
```

## Coverage Goals

Target coverage metrics:
- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

View coverage report:
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## Continuous Integration

These tests are designed to run in CI/CD pipelines:
- Fast execution (< 30 seconds total)
- No external dependencies
- Consistent results
- Clear error messages

## Debugging Tests

### Run Single Test
```bash
npm test -- -t "should create a valid event"
```

### Verbose Output
```bash
npm test -- --verbose
```

### Debug Mode
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Best Practices

1. **Keep tests focused**: Each test should verify one specific behavior
2. **Use descriptive names**: Test names should be clear and specific
3. **Arrange-Act-Assert**: Follow AAA pattern for clarity
4. **Mock external dependencies**: Use in-memory database, mock APIs
5. **Test error cases**: Don't just test happy paths
6. **Keep tests fast**: Use efficient setup/teardown
7. **Independent tests**: No test should depend on another

## Maintenance

### Adding New Tests
1. Follow existing test structure
2. Use descriptive describe blocks
3. Include setup/teardown as needed
4. Cover happy path, errors, and edge cases
5. Run full suite to ensure no regressions

### Updating Tests
1. Update tests when models change
2. Maintain comprehensive coverage
3. Keep tests passing in CI/CD
4. Document any special test requirements

## Troubleshooting

### MongoDB Memory Server Issues
```bash
# Clear downloaded binaries
rm -rf ~/.cache/mongodb-memory-server
```

### Jest Cache Issues
```bash
# Clear Jest cache
npm test -- --clearCache
```

### Timeout Issues
```bash
# Increase timeout in jest.setup.js
jest.setTimeout(30000);
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Mongoose Testing Guide](https://mongoosejs.com/docs/jest.html)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
- [Testing Best Practices](https://testingjavascript.com/)

## Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Maintain or improve coverage
4. Update this README if needed