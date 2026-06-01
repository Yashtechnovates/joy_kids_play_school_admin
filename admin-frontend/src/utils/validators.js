// // // Validation utilities for all forms

// // export const validateEmail = (email) => {
// //   if (!email) return true; // Optional field
// //   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //   return re.test(email);
// // };

// // export const validatePhone = (phone) => {
// //   if (!phone) return false;
// //   const re = /^[0-9]{10}$/;
// //   return re.test(phone);
// // };

// // export const validateName = (name) => {
// //   if (!name) return false;
// //   const re = /^[a-zA-Z\s]{2,50}$/;
// //   return re.test(name.trim());
// // };

// // export const validateNumber = (value) => {
// //   if (!value) return true;
// //   return !isNaN(value) && Number(value) > 0;
// // };

// // export const validateDate = (date) => {
// //   if (!date) return false;
// //   const selectedDate = new Date(date);
// //   const today = new Date();
// //   return selectedDate <= today;
// // };

// // export const validateRequired = (value) => {
// //   return value && value.toString().trim() !== '';
// // };

// // export const validateMinLength = (value, min) => {
// //   return value && value.length >= min;
// // };

// // export const validateMaxLength = (value, max) => {
// //   return !value || value.length <= max;
// // };

// // // Student Form Validation
// // export const validateStudentForm = (data) => {
// //   const errors = {};
  
// //   if (!validateRequired(data.studentName)) {
// //     errors.studentName = 'Student name is required';
// //   } else if (!validateName(data.studentName)) {
// //     errors.studentName = 'Name should contain only letters and spaces (2-50 characters)';
// //   }
  
// //   if (!validateRequired(data.parentName)) {
// //     errors.parentName = 'Parent name is required';
// //   } else if (!validateName(data.parentName)) {
// //     errors.parentName = 'Parent name should contain only letters and spaces';
// //   }
  
// //   if (!validateRequired(data.parentContact)) {
// //     errors.parentContact = 'Parent contact is required';
// //   } else if (!validatePhone(data.parentContact)) {
// //     errors.parentContact = 'Please enter a valid 10-digit phone number';
// //   }
  
// //   if (data.email && !validateEmail(data.email)) {
// //     errors.email = 'Please enter a valid email address';
// //   }
  
// //   if (!validateRequired(data.className)) {
// //     errors.className = 'Class is required';
// //   }
  
// //   if (data.age && !validateNumber(data.age)) {
// //     errors.age = 'Please enter a valid age';
// //   }
  
// //   return errors;
// // };

// // // Staff Form Validation
// // export const validateStaffForm = (data) => {
// //   const errors = {};
  
// //   if (!validateRequired(data.name)) {
// //     errors.name = 'Staff name is required';
// //   } else if (!validateName(data.name)) {
// //     errors.name = 'Name should contain only letters and spaces';
// //   }
  
// //   if (!validateRequired(data.role)) {
// //     errors.role = 'Role is required';
// //   }
  
// //   if (!validateRequired(data.phone)) {
// //     errors.phone = 'Phone number is required';
// //   } else if (!validatePhone(data.phone)) {
// //     errors.phone = 'Please enter a valid 10-digit phone number';
// //   }
  
// //   if (data.email && !validateEmail(data.email)) {
// //     errors.email = 'Please enter a valid email address';
// //   }
  
// //   return errors;
// // };

// // // Material Form Validation
// // export const validateMaterialForm = (data) => {
// //   const errors = {};
  
// //   if (!validateRequired(data.name)) {
// //     errors.name = 'Material name is required';
// //   }
  
// //   if (!validateRequired(data.imageUrl)) {
// //     errors.imageUrl = 'Image URL is required';
// //   } else if (!data.imageUrl.match(/^https?:\/\/.+\..+/)) {
// //     errors.imageUrl = 'Please enter a valid image URL';
// //   }
  
// //   if (!validateRequired(data.description)) {
// //     errors.description = 'Description is required';
// //   } else if (!validateMinLength(data.description, 10)) {
// //     errors.description = 'Description must be at least 10 characters';
// //   }
  
// //   return errors;
// // };

// // // Event Form Validation
// // export const validateEventForm = (data) => {
// //   const errors = {};
  
// //   if (!validateRequired(data.title)) {
// //     errors.title = 'Event title is required';
// //   }
  
// //   if (!validateRequired(data.date)) {
// //     errors.date = 'Event date is required';
// //   }
  
// //   if (!validateRequired(data.venue)) {
// //     errors.venue = 'Venue is required';
// //   }
  
// //   return errors;
// // };

// // // Activity Form Validation
// // export const validateActivityForm = (data) => {
// //   const errors = {};
  
// //   if (!validateRequired(data.title)) {
// //     errors.title = 'Activity title is required';
// //   }
  
// //   if (!validateRequired(data.date)) {
// //     errors.date = 'Activity date is required';
// //   }
  
// //   if (!validateRequired(data.instructor)) {
// //     errors.instructor = 'Instructor name is required';
// //   }
  
// //   return errors;
// // };

// // Validation utilities for all forms across the application

// // ==================== BASIC VALIDATIONS ====================

// // Name validation - Only letters and spaces, no numbers or special characters
// export const validateName = (name, fieldName = 'Name') => {
//   if (!name || name.trim() === '') {
//     return { isValid: false, error: `${fieldName} is required` };
//   }
//   const nameRegex = /^[a-zA-Z\s]{2,50}$/;
//   if (!nameRegex.test(name.trim())) {
//     return { isValid: false, error: `${fieldName} should contain only letters and spaces (2-50 characters)` };
//   }
//   return { isValid: true, error: null };
// };

// // Phone validation - Exactly 10 digits, no letters or special characters
// export const validatePhone = (phone, fieldName = 'Phone number') => {
//   if (!phone || phone.trim() === '') {
//     return { isValid: false, error: `${fieldName} is required` };
//   }
//   const phoneRegex = /^[0-9]{10}$/;
//   if (!phoneRegex.test(phone)) {
//     return { isValid: false, error: `${fieldName} must be a valid 10-digit number` };
//   }
//   return { isValid: true, error: null };
// };

// // Email validation - Standard email format
// export const validateEmail = (email) => {
//   if (!email || email.trim() === '') {
//     return { isValid: true, error: null }; // Email is optional
//   }
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     return { isValid: false, error: 'Please enter a valid email address' };
//   }
//   return { isValid: true, error: null };
// };

// // Age validation - Between 2 and 6 years (Pre-KG to UKG appropriate)
// export const validateAge = (age) => {
//   if (!age || age === '') {
//     return { isValid: true, error: null }; // Age is optional
//   }
//   const ageNum = Number(age);
//   if (isNaN(ageNum)) {
//     return { isValid: false, error: 'Age must be a valid number' };
//   }
//   if (ageNum < 2 || ageNum > 6) {
//     return { isValid: false, error: 'Age must be between 2 and 6 years' };
//   }
//   return { isValid: true, error: null };
// };

// // Number validation for quantities, salary, etc.
// export const validateNumber = (value, fieldName = 'Quantity', min = 0, max = null) => {
//   if (!value || value === '') {
//     return { isValid: true, error: null }; // Optional field
//   }
//   const num = Number(value);
//   if (isNaN(num)) {
//     return { isValid: false, error: `${fieldName} must be a valid number` };
//   }
//   if (num < min) {
//     return { isValid: false, error: `${fieldName} must be at least ${min}` };
//   }
//   if (max !== null && num > max) {
//     return { isValid: false, error: `${fieldName} must be at most ${max}` };
//   }
//   return { isValid: true, error: null };
// };

// // Date validation - Cannot be in the future
// export const validateDate = (date, fieldName = 'Date') => {
//   if (!date) {
//     return { isValid: false, error: `${fieldName} is required` };
//   }
//   const selectedDate = new Date(date);
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   if (selectedDate > today) {
//     return { isValid: false, error: `${fieldName} cannot be in the future` };
//   }
//   return { isValid: true, error: null };
// };

// // Required field validation
// export const validateRequired = (value, fieldName = 'Field') => {
//   if (!value || value.toString().trim() === '') {
//     return { isValid: false, error: `${fieldName} is required` };
//   }
//   return { isValid: true, error: null };
// };

// // Text validation for descriptions, addresses, etc.
// export const validateText = (value, fieldName = 'Text', minLength = 5, maxLength = 500) => {
//   if (!value || value.trim() === '') {
//     return { isValid: false, error: `${fieldName} is required` };
//   }
//   if (value.trim().length < minLength) {
//     return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
//   }
//   if (value.trim().length > maxLength) {
//     return { isValid: false, error: `${fieldName} must be less than ${maxLength} characters` };
//   }
//   return { isValid: true, error: null };
// };

// // URL validation for images
// export const validateImageUrl = (url) => {
//   if (!url || url.trim() === '') {
//     return { isValid: false, error: 'Image URL is required' };
//   }
//   const urlRegex = /^https?:\/\/.+\..+/;
//   if (!urlRegex.test(url)) {
//     return { isValid: false, error: 'Please enter a valid image URL (starting with http:// or https://)' };
//   }
//   return { isValid: true, error: null };
// };

// // Gender validation
// export const validateGender = (gender) => {
//   if (!gender || gender === '') {
//     return { isValid: false, error: 'Gender is required' };
//   }
//   if (gender !== 'Male' && gender !== 'Female') {
//     return { isValid: false, error: 'Please select a valid gender' };
//   }
//   return { isValid: true, error: null };
// };

// // Status validation for staff
// export const validateStatus = (status) => {
//   if (!status) {
//     return { isValid: false, error: 'Status is required' };
//   }
//   const validStatuses = ['Active', 'Inactive', 'On Leave'];
//   if (!validStatuses.includes(status)) {
//     return { isValid: false, error: 'Please select a valid status' };
//   }
//   return { isValid: true, error: null };
// };

// // Experience validation
// export const validateExperience = (experience) => {
//   if (!experience || experience === '') {
//     return { isValid: true, error: null }; // Optional field
//   }
//   const expRegex = /^\d+\s*(years?|months?)$/i;
//   if (!expRegex.test(experience.trim())) {
//     return { isValid: false, error: 'Experience should be in format: "5 years" or "6 months"' };
//   }
//   return { isValid: true, error: null };
// };

// // Salary validation
// export const validateSalary = (salary) => {
//   if (!salary || salary === '') {
//     return { isValid: true, error: null }; // Optional field
//   }
//   const salaryNum = Number(salary);
//   if (isNaN(salaryNum)) {
//     return { isValid: false, error: 'Salary must be a valid number' };
//   }
//   if (salaryNum < 0) {
//     return { isValid: false, error: 'Salary cannot be negative' };
//   }
//   return { isValid: true, error: null };
// };

// // ==================== FORM VALIDATIONS ====================

// // Student Form Validation
// export const validateStudentForm = (data) => {
//   const errors = {};
  
//   // Student Name
//   const studentNameValidation = validateName(data.studentName, 'Student name');
//   if (!studentNameValidation.isValid) errors.studentName = studentNameValidation.error;
  
//   // Parent Name
//   const parentNameValidation = validateName(data.parentName, 'Parent name');
//   if (!parentNameValidation.isValid) errors.parentName = parentNameValidation.error;
  
//   // Parent Contact
//   const phoneValidation = validatePhone(data.parentContact, 'Parent contact');
//   if (!phoneValidation.isValid) errors.parentContact = phoneValidation.error;
  
//   // Alternate Contact (optional but must be valid if provided)
//   if (data.alternateContact && data.alternateContact.trim() !== '') {
//     const altPhoneValidation = validatePhone(data.alternateContact, 'Alternate contact');
//     if (!altPhoneValidation.isValid) errors.alternateContact = altPhoneValidation.error;
//   }
  
//   // Email (optional but must be valid if provided)
//   if (data.email && data.email.trim() !== '') {
//     const emailValidation = validateEmail(data.email);
//     if (!emailValidation.isValid) errors.email = emailValidation.error;
//   }
  
//   // Age (optional)
//   if (data.age && data.age !== '') {
//     const ageValidation = validateAge(data.age);
//     if (!ageValidation.isValid) errors.age = ageValidation.error;
//   }
  
//   // Class
//   const classValidation = validateRequired(data.className, 'Class');
//   if (!classValidation.isValid) errors.className = classValidation.error;
  
//   // Gender
//   const genderValidation = validateGender(data.gender);
//   if (!genderValidation.isValid) errors.gender = genderValidation.error;
  
//   // Address
//   const addressValidation = validateText(data.address, 'Address', 5, 200);
//   if (!addressValidation.isValid) errors.address = addressValidation.error;
  
//   // Date of Birth (optional but must be valid if provided)
//   if (data.dateOfBirth && data.dateOfBirth !== '') {
//     const dobValidation = validateDate(data.dateOfBirth, 'Date of birth');
//     if (!dobValidation.isValid) errors.dateOfBirth = dobValidation.error;
//   }
  
//   // Date of Admission
//   const doaValidation = validateDate(data.dateOfAdmission, 'Date of admission');
//   if (!doaValidation.isValid) errors.dateOfAdmission = doaValidation.error;
  
//   return errors;
// };

// // Staff Form Validation
// export const validateStaffForm = (data) => {
//   const errors = {};
  
//   // Staff Name
//   const nameValidation = validateName(data.name, 'Staff name');
//   if (!nameValidation.isValid) errors.name = nameValidation.error;
  
//   // Role
//   const roleValidation = validateRequired(data.role, 'Role');
//   if (!roleValidation.isValid) errors.role = roleValidation.error;
  
//   // Phone
//   const phoneValidation = validatePhone(data.phone, 'Phone number');
//   if (!phoneValidation.isValid) errors.phone = phoneValidation.error;
  
//   // Email (optional but must be valid if provided)
//   if (data.email && data.email.trim() !== '') {
//     const emailValidation = validateEmail(data.email);
//     if (!emailValidation.isValid) errors.email = emailValidation.error;
//   }
  
//   // Department (optional)
//   if (data.department && data.department.trim() !== '') {
//     const deptValidation = validateRequired(data.department, 'Department');
//     if (!deptValidation.isValid) errors.department = deptValidation.error;
//   }
  
//   // Salary (optional)
//   if (data.salary && data.salary !== '') {
//     const salaryValidation = validateSalary(data.salary);
//     if (!salaryValidation.isValid) errors.salary = salaryValidation.error;
//   }
  
//   // Status
//   const statusValidation = validateStatus(data.status);
//   if (!statusValidation.isValid) errors.status = statusValidation.error;
  
//   // Join Date
//   const joinDateValidation = validateDate(data.joinDate, 'Join date');
//   if (!joinDateValidation.isValid) errors.joinDate = joinDateValidation.error;
  
//   // Address (optional but must be valid if provided)
//   if (data.address && data.address.trim() !== '') {
//     const addressValidation = validateText(data.address, 'Address', 5, 200);
//     if (!addressValidation.isValid) errors.address = addressValidation.error;
//   }
  
//   // Experience (optional)
//   if (data.experience && data.experience.trim() !== '') {
//     const expValidation = validateExperience(data.experience);
//     if (!expValidation.isValid) errors.experience = expValidation.error;
//   }
  
//   return errors;
// };

// // Material Form Validation (Kids Play Area)
// export const validateMaterialForm = (data) => {
//   const errors = {};
  
//   // Material Name
//   const nameValidation = validateRequired(data.name, 'Material name');
//   if (!nameValidation.isValid) errors.name = nameValidation.error;
  
//   // Image URL
//   const urlValidation = validateImageUrl(data.imageUrl);
//   if (!urlValidation.isValid) errors.imageUrl = urlValidation.error;
  
//   // Description
//   const descriptionValidation = validateText(data.description, 'Description', 10, 500);
//   if (!descriptionValidation.isValid) errors.description = descriptionValidation.error;
  
//   // Category (required)
//   const categoryValidation = validateRequired(data.category, 'Category');
//   if (!categoryValidation.isValid) errors.category = categoryValidation.error;
  
//   // Quantity (optional admin field)
//   if (data.quantity && data.quantity !== '') {
//     const quantityValidation = validateNumber(data.quantity, 'Total quantity', 0);
//     if (!quantityValidation.isValid) errors.quantity = quantityValidation.error;
//   }
  
//   // Available Quantity (optional admin field)
//   if (data.availableQuantity && data.availableQuantity !== '') {
//     const availableValidation = validateNumber(data.availableQuantity, 'Available quantity', 0);
//     if (!availableValidation.isValid) errors.availableQuantity = availableValidation.error;
//   }
  
//   return errors;
// };

// // Event Form Validation (Cultural Events)
// export const validateEventForm = (data) => {
//   const errors = {};
  
//   // Event Title
//   const titleValidation = validateRequired(data.title, 'Event title');
//   if (!titleValidation.isValid) errors.title = titleValidation.error;
  
//   // Event Date
//   const dateValidation = validateDate(data.date, 'Event date');
//   if (!dateValidation.isValid) errors.date = dateValidation.error;
  
//   // Venue
//   const venueValidation = validateRequired(data.venue, 'Venue');
//   if (!venueValidation.isValid) errors.venue = venueValidation.error;
  
//   // Event Type
//   const typeValidation = validateRequired(data.type, 'Event type');
//   if (!typeValidation.isValid) errors.type = typeValidation.error;
  
//   // Description (optional but must be valid if provided)
//   if (data.description && data.description.trim() !== '') {
//     const descValidation = validateText(data.description, 'Description', 10, 500);
//     if (!descValidation.isValid) errors.description = descValidation.error;
//   }
  
//   return errors;
// };

// // Activity Form Validation (Academic Activities)
// export const validateActivityForm = (data) => {
//   const errors = {};
  
//   // Activity Title
//   const titleValidation = validateRequired(data.title, 'Activity title');
//   if (!titleValidation.isValid) errors.title = titleValidation.error;
  
//   // Activity Date
//   const dateValidation = validateDate(data.date, 'Activity date');
//   if (!dateValidation.isValid) errors.date = dateValidation.error;
  
//   // Instructor Name
//   const instructorValidation = validateName(data.instructor, 'Instructor name');
//   if (!instructorValidation.isValid) errors.instructor = instructorValidation.error;
  
//   // Category
//   const categoryValidation = validateRequired(data.category, 'Category');
//   if (!categoryValidation.isValid) errors.category = categoryValidation.error;
  
//   // Class
//   const classValidation = validateRequired(data.class, 'Class');
//   if (!classValidation.isValid) errors.class = classValidation.error;
  
//   // Capacity (optional)
//   if (data.capacity && data.capacity !== '') {
//     const capacityValidation = validateNumber(data.capacity, 'Capacity', 1);
//     if (!capacityValidation.isValid) errors.capacity = capacityValidation.error;
//   }
  
//   return errors;
// };

// // ==================== HELPER FUNCTIONS ====================

// // Helper function to get all validation errors as a single string
// export const getValidationErrorMessage = (errors) => {
//   const errorMessages = Object.values(errors);
//   if (errorMessages.length === 0) return null;
//   return errorMessages[0]; // Return first error message
// };

// // Helper function to check if form is valid
// export const isFormValid = (errors) => {
//   return Object.keys(errors).length === 0;
// };

// // Helper function to clear all errors
// export const clearErrors = (setErrors) => {
//   setErrors({});
// };

// ==================== BASIC VALIDATIONS ====================

// Name validation - ONLY LETTERS, no numbers, no special characters
export const validateName = (name, fieldName = 'Name') => {
  if (!name || name.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  // Only allows letters A-Z, a-z and spaces
  const nameRegex = /^[A-Za-z\s]{2,50}$/;
  if (!nameRegex.test(name.trim())) {
    return { isValid: false, error: `${fieldName} should contain only letters (A-Z, a-z) and spaces. No numbers or special characters allowed.` };
  }
  return { isValid: true, error: null };
};

// Phone validation - EXACTLY 10 digits, NO letters, NO special characters
export const validatePhone = (phone, fieldName = 'Phone number') => {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  // Only allows exactly 10 digits, no spaces, no dashes
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: `${fieldName} must be exactly 10 digits (0-9 only). No spaces, dashes, or letters allowed.` };
  }
  return { isValid: true, error: null };
};

// Email validation
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { isValid: true, error: null };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address (e.g., name@example.com)' };
  }
  return { isValid: true, error: null };
};

// Age validation - Number between 2 and 6
export const validateAge = (age) => {
  if (!age || age === '') {
    return { isValid: true, error: null };
  }
  const ageNum = Number(age);
  if (isNaN(ageNum)) {
    return { isValid: false, error: 'Age must be a valid number' };
  }
  if (!Number.isInteger(ageNum)) {
    return { isValid: false, error: 'Age must be a whole number' };
  }
  if (ageNum < 2 || ageNum > 6) {
    return { isValid: false, error: 'Age must be between 2 and 6 years' };
  }
  return { isValid: true, error: null };
};

// Number validation for quantities
export const validateNumber = (value, fieldName = 'Quantity', min = 0) => {
  if (!value || value === '') {
    return { isValid: true, error: null };
  }
  const num = Number(value);
  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }
  if (!Number.isInteger(num)) {
    return { isValid: false, error: `${fieldName} must be a whole number` };
  }
  if (num < min) {
    return { isValid: false, error: `${fieldName} cannot be less than ${min}` };
  }
  return { isValid: true, error: null };
};

// Date validation
export const validateDate = (date, fieldName = 'Date') => {
  if (!date) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate > today) {
    return { isValid: false, error: `${fieldName} cannot be in the future` };
  }
  return { isValid: true, error: null };
};

// Required field validation
export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || value.toString().trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true, error: null };
};

// Text/Description validation
export const validateText = (value, fieldName = 'Text', minLength = 5) => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  if (value.trim().length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }
  return { isValid: true, error: null };
};

// URL validation
export const validateImageUrl = (url) => {
  if (!url || url.trim() === '') {
    return { isValid: false, error: 'Image URL is required' };
  }
  const urlRegex = /^https?:\/\/[^\s]+(jpg|jpeg|png|gif|webp|svg)/i;
  if (!urlRegex.test(url)) {
    return { isValid: false, error: 'Please enter a valid image URL (https://...jpg, .png, .gif)' };
  }
  return { isValid: true, error: null };
};

// ==================== FORM VALIDATIONS ====================

export const validateStudentForm = (data) => {
  const errors = {};
  
  const nameValidation = validateName(data.studentName, 'Student name');
  if (!nameValidation.isValid) errors.studentName = nameValidation.error;
  
  const parentNameValidation = validateName(data.parentName, 'Parent name');
  if (!parentNameValidation.isValid) errors.parentName = parentNameValidation.error;
  
  const phoneValidation = validatePhone(data.parentContact, 'Parent contact');
  if (!phoneValidation.isValid) errors.parentContact = phoneValidation.error;
  
  if (data.alternateContact && data.alternateContact.trim() !== '') {
    const altPhoneValidation = validatePhone(data.alternateContact, 'Alternate contact');
    if (!altPhoneValidation.isValid) errors.alternateContact = altPhoneValidation.error;
  }
  
  if (data.email && data.email.trim() !== '') {
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) errors.email = emailValidation.error;
  }
  
  if (data.age && data.age !== '') {
    const ageValidation = validateAge(data.age);
    if (!ageValidation.isValid) errors.age = ageValidation.error;
  }
  
  const addressValidation = validateText(data.address, 'Address', 5);
  if (!addressValidation.isValid) errors.address = addressValidation.error;
  
  return errors;
};

export const validateStaffForm = (data) => {
  const errors = {};
  
  const nameValidation = validateName(data.name, 'Staff name');
  if (!nameValidation.isValid) errors.name = nameValidation.error;
  
  const roleValidation = validateRequired(data.role, 'Role');
  if (!roleValidation.isValid) errors.role = roleValidation.error;
  
  const phoneValidation = validatePhone(data.phone, 'Phone number');
  if (!phoneValidation.isValid) errors.phone = phoneValidation.error;
  
  if (data.email && data.email.trim() !== '') {
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) errors.email = emailValidation.error;
  }
  
  return errors;
};

export const validateMaterialForm = (data) => {
  const errors = {};
  
  const nameValidation = validateRequired(data.name, 'Material name');
  if (!nameValidation.isValid) errors.name = nameValidation.error;
  
  const urlValidation = validateImageUrl(data.imageUrl);
  if (!urlValidation.isValid) errors.imageUrl = urlValidation.error;
  
  const descriptionValidation = validateText(data.description, 'Description', 10);
  if (!descriptionValidation.isValid) errors.description = descriptionValidation.error;
  
  return errors;
};

export const validateInfrastructureForm = (data) => {
  const errors = {};
  
  const titleValidation = validateRequired(data.title, 'Facility title');
  if (!titleValidation.isValid) errors.title = titleValidation.error;
  
  const urlValidation = validateImageUrl(data.imageUrl);
  if (!urlValidation.isValid) errors.imageUrl = urlValidation.error;
  
  const descriptionValidation = validateText(data.description, 'Description', 10);
  if (!descriptionValidation.isValid) errors.description = descriptionValidation.error;
  
  return errors;
};