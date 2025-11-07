# Testing Guide for Database Models

This document describes the comprehensive test suite created for the database models and MongoDB connection utility in the `database-models` branch.

## 📋 Overview

A complete test suite has been generated with **105+ tests** across **4 test files**, providing comprehensive coverage of:
- Event Mongoose model (database/event.model.ts)
- Booking Mongoose model (database/booking.model.ts)
- Database index exports (database/index.ts)
- MongoDB connection utility (lib/mongodb.ts)

## 🎯 Test Summary

| Component | File | Tests | Coverage |
|-----------|------|-------|----------|
| Event Model | `__tests__/database/event.model.test.ts` | 42 | Schema validation, slug generation, date/time normalization |
| Booking Model | `__tests__/database/booking.model.test.ts` | 29 | Email validation, event references, indexes |
| Database Index | `__tests__/database/index.test.ts` | 8 | Module exports, TypeScript types |
| MongoDB Connection | `__tests__/lib/mongodb.test.ts` | 26 | Connection caching, error handling, concurrency |

**Total**: 105+ tests across 1,703 lines of test code

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

This will install the testing dependencies added to `package.json`:
- `jest` - Testing framework
- `@types/jest` - TypeScript support for Jest
- `ts-jest` - TypeScript preprocessor
- `jest-environment-node` - Node.js test environment
- `mongodb-memory-server` - In-memory MongoDB for testing

### 2. Run Tests
```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Run in watch mode (re-runs on file changes)
npm run test:watch
```

### 3. View Results
Tests will execute and show results in the terminal. Coverage reports are generated in the `coverage/` directory.

## 📁 Test Structure