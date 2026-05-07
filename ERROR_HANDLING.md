# Error Handling Documentation - Mentee POC

## Overview
This document outlines the comprehensive error handling system implemented across the Mentee POC project.

## Frontend Error Handling

### 1. Global Error Handler (`errorHandler.js`)
A centralized error handling utility class that manages:
- **Error Notifications**: Displays user-friendly error messages with animations
- **Success Notifications**: Shows confirmation messages for successful actions
- **Form Validation**: Validates required fields and provides feedback
- **API Calls**: Makes requests with built-in error handling
- **Network Error Handling**: Translates technical errors to user-friendly messages
- **Uncaught Exception Handling**: Global listeners for unexpected errors

#### Usage:
```javascript
// Show error to user
errorHandler.showError('Something went wrong', container);

// Show success message
errorHandler.showSuccess('Action completed successfully');

// Validate required fields
const errors = errorHandler.validateRequired({
  email: userEmail,
  password: userPassword
});

// Make API call with error handling
try {
  const data = await errorHandler.apiCall('/api/endpoint', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
} catch (error) {
  errorHandler.showError(errorHandler.handleNetworkError(error));
}
```

### 2. Login/Signup Form Validation (`index.html`)
- **Email Validation**: Checks format correctness
- **Password Validation**: Minimum 6 characters requirement
- **Phone Validation**: Valid phone number format (10+ digits)
- **Username Validation**: Minimum 3 characters requirement
- **Real-time Error Display**: Shows errors below each field
- **Form-level Messaging**: Success/error messages at form top

#### Error Messages:
- "Email is required"
- "Please enter a valid email address"
- "Password must be at least 6 characters"
- "Phone number must be valid format"
- "Username must be at least 3 characters"

### 3. Router Error Handling (`router.js`)
- Try-catch blocks for route transitions
- Page not found error logging
- Safe element access with null checks
- Errors logged to console for debugging

### 4. Navigation & Logout (`dashboard.html`)
- Confirmation dialog before logout
- Clear session/local storage on logout
- Error handling for navigation failures
- Try-catch blocks for all event handlers

### 5. Calendar & Journal Management (`history.html`)
- **Sentence Count Validation**: Minimum 10 sentences required to save
- **Dynamic Error Messages**: Shows current sentence count vs required
- **Entry Truncation**: Displays long entries with "..." indicator
- **History Tracking**: Maintains edit history with timestamps
- **Proper Timezone Handling**: Timestamps in user's local format

#### Error Message Example:
```
"Please write at least 10 sentences to save. You currently have 5."
```

## Backend Error Handling

### 1. Express Server Error Handling (`app.js`)

#### Middleware:
- **Request Logging**: Timestamps and method/path logging
- **CORS Configuration**: Proper cross-origin headers
- **JSON Parser**: Handles `400` errors gracefully
- **Error Response Middleware**: Consistent error format

#### Routes:
- **GET /**: Welcome message with version info
- **GET /health**: Server status check with timestamp
- **404 Handler**: Logs and returns not found error
- **Global Error Handler**: Catches all server errors

#### Error Response Format:
```json
{
  "error": "Error message",
  "status": 400,
  "timestamp": "2026-05-07T10:30:00.000Z"
}
```

#### Process-Level Error Handling:
- **Uncaught Exceptions**: Logs stack trace and exits gracefully
- **Unhandled Promise Rejections**: Logs reason and continues
- **Server Errors**: Checks for port conflicts (EADDRINUSE)
- **Connection Errors**: Proper error messages for debugging

#### Console Output Examples:
```
✓ Server started successfully at http://localhost:8080
✓ Health check available at http://localhost:8080/health
[2026-05-07T10:30:00.000Z] GET /health
[404] Route not found: GET /undefined
[ERROR] Stack trace here
[UNCAUGHT EXCEPTION] Error details
```

## Error Handling Flow

### Form Submission
1. User submits form
2. JavaScript validates all fields locally
3. If validation fails:
   - Field gets red border
   - Error message displayed below field
   - Form submission prevented
4. If validation succeeds:
   - Success message shown
   - User redirected to next page

### API Request
1. User triggers action requiring server call
2. `errorHandler.apiCall()` makes request
3. Response checked for errors
4. If error:
   - Error logged to console
   - User-friendly message shown
5. If success:
   - Data returned to calling code
   - Optional success message shown

### Journal Entry Save
1. User clicks save
2. Sentence count validated
3. If less than 10 sentences:
   - Error message shown in red
   - Shows: "Please write at least 10 sentences. You currently have X."
4. If 10+ sentences:
   - Entry saved to storage
   - Timestamp recorded
   - Success confirmation shown
   - History updated

## Error Types Handled

### Client-Side
- ✓ Invalid email format
- ✓ Weak passwords
- ✓ Missing required fields
- ✓ Invalid phone numbers
- ✓ Insufficient journal entry length
- ✓ Network failures
- ✓ Page navigation errors
- ✓ Uncaught JavaScript exceptions
- ✓ Unhandled promise rejections

### Server-Side
- ✓ Port already in use
- ✓ Invalid request format
- ✓ Missing required parameters
- ✓ 404 not found errors
- ✓ Uncaught exceptions
- ✓ Unhandled rejections

## Testing Error Handlers

### Frontend Testing
```javascript
// Test error notification
errorHandler.showError('Test error message');

// Test form validation
const errors = errorHandler.validateRequired({
  email: '',
  password: '12345'
});

// Test API call
await errorHandler.apiCall('http://localhost:8080/invalid-route');
```

### Backend Testing
```bash
# Check health endpoint
curl http://localhost:8080/health

# Test 404 error
curl http://localhost:8080/nonexistent

# Start server and check for port conflicts
node app.js
```

## Best Practices Implemented

1. **User-Friendly Messages**: Technical errors translated to plain language
2. **Consistent Format**: All errors follow same display pattern
3. **Logging**: All errors logged with timestamps and context
4. **Graceful Degradation**: Application continues working despite errors
5. **Validation**: Client-side and server-side validation
6. **Accessibility**: Error messages are visible and understandable
7. **Recovery**: Users guided on how to fix errors
8. **Feedback**: Clear success/failure feedback for all actions

## Future Enhancements

1. Integration with error tracking service (Sentry, LogRocket)
2. Retry logic for failed API calls
3. Offline mode error handling
4. Rate limiting error messages
5. Custom error codes for different scenarios
6. Multilingual error messages
7. Error reporting dashboard
8. User-reported error analytics

## Support & Debugging

For debugging:
1. Check browser console (F12) for JavaScript errors
2. Check network tab for API failures
3. Check server logs for backend errors
4. Use `errorHandler.apiCall()` for consistent error handling
5. Enable verbose logging in development

---

**Last Updated**: May 7, 2026
**Version**: 1.0.0
