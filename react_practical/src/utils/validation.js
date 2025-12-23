// Common validation functions
export const validation = {
  // Email validation
  isValidEmail: (email) => {
    const pattern = /^[\w.]+@[\w]+\.[a-zA-Z]{2,}$/;
    return pattern.test(email);
  },

  // Phone validation (10 digits)
  isValidPhone: (phone) => {
    const pattern = /^[0-9]{10}$/;
    return pattern.test(phone);
  },

  // Password strength (min 6 characters)
  isValidPassword: (password) => {
    return password.length >= 6;
  },

  // Check if passwords match
  passwordsMatch: (password, confirmPassword) => {
    return password === confirmPassword;
  },

  // Check empty fields
  isNotEmpty: (value) => {
    return value && value.trim() !== '';
  },

  // Age validation
  isValidAge: (age) => {
    return age > 0 && age < 120;
  },

  // Validate form data
  validateRegistration: (data) => {
    const errors = {};
    
    if (!validation.isNotEmpty(data.username)) {
      errors.username = 'Username is required';
    }
    
    if (!validation.isValidEmail(data.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!validation.isValidPassword(data.password)) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!validation.passwordsMatch(data.password, data.cpassword)) {
      errors.cpassword = 'Passwords do not match';
    }
    
    if (!validation.isValidPhone(data.phone)) {
      errors.phone = 'Phone must be 10 digits';
    }
    
    return { isValid: Object.keys(errors).length === 0, errors };
  },

  validateLogin: (data) => {
    const errors = {};
    
    if (!validation.isValidEmail(data.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!validation.isNotEmpty(data.password)) {
      errors.password = 'Password is required';
    }
    
    return { isValid: Object.keys(errors).length === 0, errors };
  }
};
