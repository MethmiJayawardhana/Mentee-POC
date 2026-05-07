// Global error handling utilities for the Mentee POC application

class ErrorHandler {
  constructor() {
    this.errorTimeout = 5000; // Auto-hide error messages after 5 seconds
  }

  /**
   * Show error notification to the user
   * @param {string} message - Error message to display
   * @param {HTMLElement} container - Optional container to show error
   */
  showError(message, container = null) {
    console.error('[ERROR]', message);
    
    if (container) {
      const errorEl = document.createElement('div');
      errorEl.className = 'error-notification';
      errorEl.textContent = message;
      errorEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fee2e2;
        color: #dc2626;
        padding: 16px 20px;
        border-radius: 8px;
        border: 1px solid #fecaca;
        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
        font-size: 14px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
      `;
      
      document.body.appendChild(errorEl);
      
      setTimeout(() => {
        errorEl.remove();
      }, this.errorTimeout);
    } else {
      alert(`Error: ${message}`);
    }
  }

  /**
   * Show success notification to the user
   * @param {string} message - Success message to display
   */
  showSuccess(message) {
    console.log('[SUCCESS]', message);
    const successEl = document.createElement('div');
    successEl.className = 'success-notification';
    successEl.textContent = message;
    successEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #dcfce7;
      color: #16a34a;
      padding: 16px 20px;
      border-radius: 8px;
      border: 1px solid #bbf7d0;
      box-shadow: 0 4px 12px rgba(22, 163, 74, 0.15);
      font-size: 14px;
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(successEl);
    
    setTimeout(() => {
      successEl.remove();
    }, this.errorTimeout);
  }

  /**
   * Validate required fields
   * @param {Object} fields - Object with field names and values
   * @returns {Object} - Object with field name and error message if any
   */
  validateRequired(fields) {
    const errors = {};
    
    for (const [fieldName, value] of Object.entries(fields)) {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        errors[fieldName] = `${fieldName} is required`;
      }
    }
    
    return errors;
  }

  /**
   * Make API request with error handling
   * @param {string} url - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise} - Response data or error
   */
  async apiCall(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[API ERROR]', error.message);
      throw error;
    }
  }

  /**
   * Handle network errors
   * @param {Error} error - Error object
   * @returns {string} - User-friendly error message
   */
  handleNetworkError(error) {
    if (error instanceof TypeError) {
      return 'Network connection failed. Please check your internet connection.';
    }
    if (error.message.includes('Failed to fetch')) {
      return 'Unable to connect to server. Please try again later.';
    }
    return error.message || 'An unexpected error occurred.';
  }

  /**
   * Add CSS animations for notifications
   */
  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .error-notification,
      .success-notification {
        animation: slideIn 0.3s ease forwards;
      }
    `;
    document.head.appendChild(style);
  }
}

// Create global instance
const errorHandler = new ErrorHandler();

// Add styles on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    errorHandler.addStyles();
  });
} else {
  errorHandler.addStyles();
}

// Global error handler for uncaught errors
window.addEventListener('error', (event) => {
  console.error('[UNCAUGHT ERROR]', event.error);
  errorHandler.showError('An unexpected error occurred. Please refresh the page.');
});

// Global handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('[UNHANDLED REJECTION]', event.reason);
  errorHandler.showError('An error occurred. Please try again.');
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ErrorHandler;
}
