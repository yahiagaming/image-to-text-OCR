let storedPassword = '';  // Will store the created password

// Function to handle sign up
function signUp() {
    const password = document.getElementById('signUpPassword').value;
    if (password) {
        storedPassword = password;
        // Create a file with the password and save it locally
        const file = new Blob([storedPassword], { type: 'text/plain' });
        saveAs(file, 'password.txt');  // This will prompt the user to download the file
        document.getElementById('authMessage').textContent = 'Sign Up successful! Your password has been saved as a file.';
        document.getElementById('signUpPassword').value = '';  // Clear input after sign up
    } else {
        document.getElementById('authMessage').textContent = 'Please enter a valid password for Sign Up.';
    }
}

// Function to handle sign in
function signIn() {
    const enteredPassword = document.getElementById('signInPassword').value;
    if (enteredPassword === storedPassword) {
        document.getElementById('authMessage').textContent = 'Sign In successful! You can now upload a photo.';
        document.getElementById('signInPassword').value = '';  // Clear input after sign in
        document.getElementById('ocrSection').style.display = 'block';  // Show OCR section after sign in
    } else {
        document.getElementById('authMessage').textContent = 'Incorrect password. Please try again.';
    }
}

// Function to read content from photo using Tesseract.js
document.getElementById('photoInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // Display image preview
                const photoPreview = document.getElementById('photoPreview');
                photoPreview.style.display = 'block';
                photoPreview.src = e.target.result;

                // Extract text using Tesseract.js
                document.getElementById('extractedText').textContent = "Extracting text... Please wait.";
                
                Tesseract.recognize(
                    e.target.result,
                    'eng', // Language code (English)
                    {
                        logger: (m) => console.log(m) // Log the OCR progress
                    }
                ).then(({ data: { text } }) => {
                    document.getElementById('extractedText').textContent = text || 'No text found.';
                }).catch(err => {
                    console.error('Error during OCR:', err);
                    document.getElementById('extractedText').textContent = 'OCR failed. Please try with a clearer image.';
                });
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});
