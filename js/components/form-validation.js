// This file contains validation logic for the contact form to ensure user inputs are correct before submission.

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitButton = document.getElementById('submit');

    // Enhanced form validation with real-time feedback
    function initFormValidation() {
        if (!form) return;
        
        // Add custom styles for validation states
        document.head.insertAdjacentHTML('beforeend', `
            <style>
                .form-group {
                    position: relative;
                }
                
                .error-message {
                    color: #e74c3c;
                    font-size: 0.85em;
                    margin-top: 8px;
                    display: block;
                    opacity: 0;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                }
                
                .error-message.show {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .form-group.success input,
                .form-group.success textarea {
                    border: 1px solid #2ecc71 !important;
                    box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.1) !important;
                }
                
                .form-group.error input,
                .form-group.error textarea {
                    border: 1px solid #e74c3c !important;
                    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1) !important;
                }
                
                .form-group.success:after {
                    font-family: "Font Awesome 5 Free";
                    content: "\\f058";
                    font-weight: 900;
                    position: absolute;
                    right: 15px;
                    top: 15px;
                    color: #2ecc71;
                }
                
                .form-group.error:after {
                    font-family: "Font Awesome 5 Free";
                    content: "\\f057";
                    font-weight: 900;
                    position: absolute;
                    right: 15px;
                    top: 15px;
                    color: #e74c3c;
                }
                
                .contact-form button {
                    position: relative;
                    overflow: hidden;
                }
                
                .contact-form button.submitting {
                    pointer-events: none;
                    opacity: 0.8;
                }
                
                .contact-form button.submitting span {
                    visibility: hidden;
                }
                
                .contact-form button.submitting:after {
                    content: "";
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    top: calc(50% - 10px);
                    left: calc(50% - 10px);
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top: 2px solid white;
                    animation: spin 1s infinite linear;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .submit-success-message {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255,255,255,0.9);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    border-radius: 15px;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.5s ease;
                    z-index: 10;
                }
                
                .submit-success-message.show {
                    opacity: 1;
                    visibility: visible;
                }
                
                .success-icon {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: #2ecc71;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 20px;
                    position: relative;
                }
                
                .success-icon i {
                    color: white;
                    font-size: 40px;
                }
                
                .success-icon:after {
                    content: '';
                    position: absolute;
                    top: -10px;
                    left: -10px;
                    right: -10px;
                    bottom: -10px;
                    border-radius: 50%;
                    border: 2px solid #2ecc71;
                    animation: pulse-ring 1.5s infinite;
                }
                
                @keyframes pulse-ring {
                    0% { transform: scale(0.8); opacity: 0.8; }
                    100% { transform: scale(1.2); opacity: 0; }
                }
            </style>
        `);
        
        // Real-time validation
        const inputs = [nameInput, emailInput, messageInput];
        
        inputs.forEach(input => {
            if (!input) return;
            
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                // If field was previously marked with error, validate on input
                if (this.parentElement.classList.contains('error')) {
                    validateField(this);
                }
            });
        });

        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'submit-success-message';
        successMessage.innerHTML = `
            <div class="success-icon">
                <i class="fas fa-check"></i>
            </div>
            <h3>Thank You!</h3>
            <p>Your message has been sent successfully.</p>
            <p>We'll get back to you soon.</p>
        `;
        form.appendChild(successMessage);
        
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            let valid = true;

            // Clear previous error messages
            clearErrors();

            // Validate all fields
            inputs.forEach(input => {
                if (input && !validateField(input)) {
                    valid = false;
                }
            });

            // Enhanced security: sanitize inputs
            if (valid) {
                const sanitizedData = {
                    name: DOMPurify.sanitize(nameInput.value.trim()),
                    email: DOMPurify.sanitize(emailInput.value.trim()),
                    message: DOMPurify.sanitize(messageInput.value.trim())
                };
                
                // Show loading state on button
                submitButton.classList.add('submitting');
                
                // Example of how to submit the form data securely
                // Replace with your actual endpoint
                /*
                fetch('https://your-form-endpoint.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(sanitizedData)
                })
                .then(response => response.json())
                .then(data => {
                    submitButton.classList.remove('submitting');
                    successMessage.classList.add('show');
                    
                    // Reset form after delay
                    setTimeout(() => {
                        form.reset();
                        successMessage.classList.remove('show');
                        inputs.forEach(input => {
                            if (input) {
                                input.parentElement.classList.remove('success');
                            }
                        });
                    }, 3000);
                })
                .catch(error => {
                    console.error('Error submitting form:', error);
                    submitButton.classList.remove('submitting');
                    // Show error message to user
                });
                */
                
                // For demo purposes without a backend
                setTimeout(() => {
                    submitButton.classList.remove('submitting');
                    
                    // Show success message
                    successMessage.classList.add('show');
                    
                    // Reset form after delay
                    setTimeout(() => {
                        form.reset();
                        successMessage.classList.remove('show');
                        inputs.forEach(input => {
                            if (input) {
                                input.parentElement.classList.remove('success');
                            }
                        });
                    }, 3000);
                }, 1500);
            }
        });
    }

    function validateField(input) {
        if (!input) return false;
        
        const formGroup = input.parentElement;
        let valid = true;
        let message = '';
        
        // Remove previous states
        formGroup.classList.remove('success', 'error');
        
        // Get field name for error messages
        const fieldName = input.previousElementSibling ? 
                         input.previousElementSibling.textContent : 
                         input.getAttribute('placeholder');
        
        // Different validation rules based on input type
        switch (input.id) {
            case 'name':
                if (input.value.trim() === '') {
                    message = `${fieldName} is required.`;
                    valid = false;
                } else if (input.value.trim().length < 2) {
                    message = `${fieldName} must be at least 2 characters.`;
                    valid = false;
                }
                break;
                
            case 'email':
                if (input.value.trim() === '') {
                    message = `${fieldName} is required.`;
                    valid = false;
                } else if (!isValidEmail(input.value.trim())) {
                    message = 'Please enter a valid email address.';
                    valid = false;
                }
                break;
                
            case 'message':
                if (input.value.trim() === '') {
                    message = `${fieldName} cannot be empty.`;
                    valid = false;
                } else if (input.value.trim().length < 10) {
                    message = `${fieldName} must be at least 10 characters.`;
                    valid = false;
                }
                break;
        }
        
        if (valid) {
            formGroup.classList.add('success');
        } else {
            formGroup.classList.add('error');
            showError(input, message);
        }
        
        return valid;
    }

    function showError(input, message) {
        const formGroup = input.parentElement;
        
        // Check if error message element already exists
        let error = formGroup.querySelector('.error-message');
        
        if (!error) {
            error = document.createElement('span');
            error.className = 'error-message';
            formGroup.appendChild(error);
        }
        
        error.textContent = message;
        
        // Animated error message
        setTimeout(() => {
            error.classList.add('show');
        }, 10);
    }

    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        const formGroups = document.querySelectorAll('.form-group');
        
        errorMessages.forEach(function(error) {
            error.classList.remove('show');
            setTimeout(() => {
                error.remove();
            }, 300);
        });
        
        formGroups.forEach(function(group) {
            group.classList.remove('error', 'success');
        });
    }

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // Initialize form validation
    initFormValidation();
});