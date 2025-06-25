document.addEventListener('DOMContentLoaded', () => {
    // Select form elements
    const form = document.getElementById('ipo-form');
    const submitBtn = document.getElementById('submit-btn');
    const messageContainer = document.getElementById('message-container');
    
    // Input fields
    const investorName = document.getElementById('investor-name');
    const bidQuantity = document.getElementById('bid-quantity');
    const bidPrice = document.getElementById('bid-price');
    const cutOffCheckbox = document.getElementById('cut-off-price');
    const upiId = document.getElementById('upi-id');
    const termsCheckbox = document.getElementById('terms');

    // --- FORM SUBMISSION HANDLER ---
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission
        
        // 1. Clear previous messages
        clearErrors();
        messageContainer.innerHTML = '';
        
        // 2. Perform validation
        if (!validateForm()) {
            return; // Stop if validation fails
        }
        
        // 3. Disable button to prevent multiple submissions
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        // 4. Prepare data for API
        const formData = {
            investorName: investorName.value,
            bidQuantity: parseInt(bidQuantity.value, 10),
            bidPrice: cutOffCheckbox.checked ? 'CUT-OFF' : parseFloat(bidPrice.value),
            upiId: upiId.value,
        };
        
        // 5. Connect form with API endpoint using Axios
        try {
            // ** IMPORTANT **
            // Replace with your actual API endpoint link.
            // We are using a placeholder that will fail, and we'll simulate success in the catch block.
            const apiEndpoint = 'https://api.your-broker.com/v1/ipo-applications';

            const response = await axios.post(apiEndpoint, formData);

            // Handle successful API response
            displayMessage('Application submitted successfully!', 'success');
            form.reset(); // Clear the form fields

        } catch (error) {
            // This block will run because the API endpoint above is a placeholder.
            // In a real scenario, this catches network errors or server errors (e.g., 400, 500).
            console.error('API Submission Error:', error);
            
            // For demonstration, we'll SIMULATE a successful submission here.
            // In a real app, you would show the actual error message.
            setTimeout(() => {
                displayMessage('Demo: Application submitted successfully!', 'success');
                form.reset();
            }, 1500); // Simulate a 1.5-second network delay
            
        } finally {
            // This block runs whether the API call succeeds or fails.
            // Re-enable the button after the simulated delay.
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Application';
            }, 1500);
        }
    });

    // --- VALIDATION LOGIC ---
    function validateForm() {
        let isValid = true;
        
        // Name validation
        if (investorName.value.trim() === '') {
            showError(investorName, 'Full name is required.');
            isValid = false;
        }

        // Quantity validation
        if (bidQuantity.value <= 0) {
            showError(bidQuantity, 'Bid quantity must be greater than 0.');
            isValid = false;
        }
        
        // Price validation (only if cut-off is not checked)
        if (!cutOffCheckbox.checked && bidPrice.value <= 0) {
            showError(bidPrice, 'Bid price must be greater than 0.');
            isValid = false;
        }
        
        // UPI ID validation (simple check)
        const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
        if (!upiRegex.test(upiId.value)) {
            showError(upiId, 'Please enter a valid UPI ID (e.g., yourname@bank).');
            isValid = false;
        }

        // Terms and conditions validation
        if (!termsCheckbox.checked) {
            showError(termsCheckbox, 'You must accept the terms and conditions.');
            isValid = false;
        }

        return isValid;
    }

    // --- HELPER FUNCTIONS ---
    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        errorSpan.textContent = message;
        // For the checkbox, the structure is different
        if (input.type === 'checkbox') {
             formGroup.parentElement.appendChild(errorSpan);
        } else {
             formGroup.appendChild(errorSpan);
        }
    }

    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
    }
    
    function displayMessage(message, type) {
        messageContainer.className = type === 'success' ? 'message-success' : 'message-error';
        messageContainer.textContent = message;
    }

    // Small UX improvement: if user checks 'cut-off', disable price input
    cutOffCheckbox.addEventListener('change', () => {
        if (cutOffCheckbox.checked) {
            bidPrice.disabled = true;
            bidPrice.value = '';
            bidPrice.style.backgroundColor = '#e9ecef'; // Visual cue
            clearErrors(); // Clear potential price errors
        } else {
            bidPrice.disabled = false;
            bidPrice.style.backgroundColor = '#fff';
        }
    });
});