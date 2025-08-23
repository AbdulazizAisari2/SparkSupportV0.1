# Rate Limiting Improvements

This document outlines the comprehensive rate limiting and error handling improvements made to the chat functionality.

## Problem

The application was encountering rate limiting errors (HTTP 429) from the backend API, causing:
- Uncaught promise rejections
- Poor user experience with cryptic error messages
- No retry mechanism for transient failures
- Aggressive refresh intervals that exacerbated the problem

## Solution

### 1. Enhanced API Call Function (`apiCall`)

The core `apiCall` function in `ChatContext.tsx` has been completely rewritten with:

- **Retry Logic with Exponential Backoff**: Automatically retries failed requests with increasing delays
- **Rate Limit Detection**: Specifically handles HTTP 429 responses
- **Configurable Retry Behavior**: Different retry configurations for different types of operations
- **Better Error Handling**: Distinguishes between different types of errors (auth, rate limit, server errors)

### 2. Rate Limiter Class

A custom `RateLimiter` class tracks API usage and prevents excessive requests:

- **Request Tracking**: Monitors request counts per endpoint
- **Request Queuing**: Queues requests when rate limits are detected
- **Automatic Recovery**: Clears rate limit status when requests succeed

### 3. Intelligent Background Refresh

The periodic refresh mechanism has been improved:

- **Adaptive Intervals**: Starts at 30 seconds, increases on rate limits (up to 5 minutes)
- **Conservative Retry Config**: Uses fewer retries for background operations
- **Error-Aware Scheduling**: Adjusts refresh frequency based on error types

### 4. User-Friendly Status Indicators

Added visual feedback for rate limiting:

- **RateLimitStatus Component**: Shows when rate limiting is active
- **Countdown Timer**: Displays time until retry
- **Non-Intrusive Notifications**: Warns users about rate limits without being alarming

### 5. Improved Error Messages

Enhanced error handling throughout the application:

- **Context-Aware Messages**: Different messages for different types of rate limiting
- **Automatic Retry for Messages**: Attempts to resend messages after rate limit clears
- **User Education**: Explains what's happening and what to expect

## Configuration

### Default Retry Configuration

```typescript
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2
};
```

### Background Task Configuration

```typescript
const backgroundRetryConfig: RetryConfig = {
  maxRetries: 2,
  baseDelay: 2000,
  maxDelay: 10000,
  backoffMultiplier: 2
};
```

### Rate Limiter Settings

- **Request Limit**: 10 requests per endpoint per minute
- **Queue Timeout**: 5 minutes
- **Check Interval**: 1 second

## Usage

The improvements are automatically applied to all API calls. No changes are needed in existing code, but you can customize retry behavior:

```typescript
// Custom retry configuration for specific calls
const customConfig: RetryConfig = {
  maxRetries: 5,
  baseDelay: 500,
  maxDelay: 10000,
  backoffMultiplier: 1.5
};

await apiCall('/some/endpoint', options, customConfig);
```

## Benefits

1. **Reliability**: Automatic retry with exponential backoff handles transient failures
2. **User Experience**: Clear feedback about rate limiting with countdown timers
3. **Performance**: Adaptive refresh intervals reduce unnecessary API calls
4. **Robustness**: Comprehensive error handling prevents uncaught exceptions
5. **Scalability**: Rate limiting awareness prevents overwhelming the backend

## Monitoring

The improvements include extensive logging:

- Request attempts and failures
- Rate limit detection and recovery
- Retry delays and intervals
- Error categorization

Monitor the browser console for detailed information about API call behavior.

## Future Enhancements

Potential improvements for the future:

1. **Server-Side Rate Limit Headers**: Parse `X-RateLimit-*` headers for better visibility
2. **User Preference**: Allow users to configure refresh intervals
3. **Priority Queuing**: Priority system for different types of requests
4. **Metrics Dashboard**: Visual display of API usage and rate limiting statistics
5. **Smart Batching**: Combine multiple requests to reduce API calls