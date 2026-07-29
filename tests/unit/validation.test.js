/**
 * Form Validation Tests (Jest)
 * Tests for phone, email, name, and age validation
 */

describe('Form Validation', () => {

  // Phone Number Validation
  describe('Phone Validation', () => {
    
    function validatePhone(phone) {
      if (!phone) return false;
      const cleaned = phone.replace(/[\s.-]/g, '');
      return /^0[0-9]{9}$/.test(cleaned);
    }

    test('accepts valid 10-digit phone starting with 0', () => {
      expect(validatePhone('0901234567')).toBe(true);
      expect(validatePhone('0987654321')).toBe(true);
      expect(validatePhone('0912345678')).toBe(true);
    });

    test('accepts phone with spaces', () => {
      expect(validatePhone('0901 234 567')).toBe(true);
      expect(validatePhone('090 1234 567')).toBe(true);
    });

    test('accepts phone with hyphens', () => {
      expect(validatePhone('090-123-4567')).toBe(true);
      expect(validatePhone('0901-234-567')).toBe(true);
    });

    test('rejects phone without leading 0', () => {
      expect(validatePhone('901234567')).toBe(false);
      expect(validatePhone('1901234567')).toBe(false);
    });

    test('rejects phone with wrong digit count', () => {
      expect(validatePhone('090123456')).toBe(false); // 9 digits
      expect(validatePhone('09012345678')).toBe(false); // 11 digits
    });

    test('rejects empty phone', () => {
      expect(validatePhone('')).toBe(false);
      expect(validatePhone(null)).toBe(false);
      expect(validatePhone(undefined)).toBe(false);
    });

    test('rejects international format', () => {
      expect(validatePhone('+84901234567')).toBe(false);
      expect(validatePhone('+858901234567')).toBe(false);
    });
  });

  // Email Validation
  describe('Email Validation', () => {
    
    function validateEmail(email) {
      if (!email) return false;
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }

    test('accepts valid emails', () => {
      expect(validateEmail('user@company.com')).toBe(true);
      expect(validateEmail('john.doe@example.co.uk')).toBe(true);
      expect(validateEmail('test123@mail.example.org')).toBe(true);
    });

    test('rejects emails without @', () => {
      expect(validateEmail('usercompany.com')).toBe(false);
      expect(validateEmail('invalid.email')).toBe(false);
    });

    test('rejects emails without domain extension', () => {
      expect(validateEmail('user@company')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
    });

    test('rejects emails with spaces', () => {
      expect(validateEmail('user @company.com')).toBe(false);
      expect(validateEmail('user@company .com')).toBe(false);
    });

    test('rejects empty email', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
    });
  });

  // Name Validation
  describe('Name Validation', () => {
    
    function validateName(name) {
      if (!name || typeof name !== 'string') return false;
      return name.trim().length > 0 && name.length <= 255;
    }

    test('accepts valid names', () => {
      expect(validateName('Nguyễn Văn A')).toBe(true);
      expect(validateName('John Doe')).toBe(true);
      expect(validateName('Maria García')).toBe(true);
    });

    test('rejects empty names', () => {
      expect(validateName('')).toBe(false);
      expect(validateName('   ')).toBe(false);
    });

    test('rejects names over 255 chars', () => {
      const longName = 'a'.repeat(256);
      expect(validateName(longName)).toBe(false);
    });

    test('accepts names with exactly 255 chars', () => {
      const maxName = 'a'.repeat(255);
      expect(validateName(maxName)).toBe(true);
    });

    test('rejects non-string names', () => {
      expect(validateName(null)).toBe(false);
      expect(validateName(undefined)).toBe(false);
      expect(validateName(123)).toBe(false);
    });
  });

  // Age Validation
  describe('Age Validation', () => {
    
    function validateAge(age) {
      // Must be a number type, not a string
      if (typeof age !== 'number' || age === null || isNaN(age)) return false;
      const num = age;
      return Number.isInteger(num) && num >= 18 && num <= 100;
    }

    test('accepts valid ages 18-100', () => {
      expect(validateAge(18)).toBe(true);
      expect(validateAge(25)).toBe(true);
      expect(validateAge(65)).toBe(true);
      expect(validateAge(100)).toBe(true);
    });

    test('rejects ages below 18', () => {
      expect(validateAge(17)).toBe(false);
      expect(validateAge(0)).toBe(false);
      expect(validateAge(-5)).toBe(false);
    });

    test('rejects ages above 100', () => {
      expect(validateAge(101)).toBe(false);
      expect(validateAge(150)).toBe(false);
    });

    test('rejects decimal ages', () => {
      expect(validateAge(25.5)).toBe(false);
      expect(validateAge(30.1)).toBe(false);
    });

    test('rejects non-numeric ages', () => {
      expect(validateAge('25')).toBe(false); // string (not number)
      expect(validateAge(null)).toBe(false);
      expect(validateAge(undefined)).toBe(false);
      expect(validateAge(NaN)).toBe(false);
    });
  });

  // Combined Form Validation
  describe('Combined Form Validation', () => {
    
    function validateContactForm(data) {
      const errors = {};
      
      if (!data.name || data.name.trim().length === 0) {
        errors.name = 'Vui lòng nhập họ tên';
      }
      
      if (!data.phone || !/^0[0-9]{9}$/.test(data.phone.replace(/[\s.-]/g, ''))) {
        errors.phone = 'Vui lòng nhập số điện thoại hợp lệ';
      }
      
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Vui lòng nhập email hợp lệ';
      }
      
      return {
        isValid: Object.keys(errors).length === 0,
        errors
      };
    }

    test('validates complete valid form', () => {
      const result = validateContactForm({
        name: 'John Doe',
        phone: '0901234567',
        email: 'john@company.com'
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    test('catches multiple validation errors', () => {
      const result = validateContactForm({
        name: '',
        phone: '123',
        email: 'invalid'
      });
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBe(3);
      expect(result.errors.name).toBeDefined();
      expect(result.errors.phone).toBeDefined();
      expect(result.errors.email).toBeDefined();
    });

    test('catches missing required fields', () => {
      const result = validateContactForm({
        name: 'John'
        // missing phone and email
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.phone).toBeDefined();
      expect(result.errors.email).toBeDefined();
    });
  });
});
