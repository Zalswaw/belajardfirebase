import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

let auth;

let isLoginMode = true;

const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const formTitle = document.getElementById('form-title');
const formSubtitle = document.getElementById('form-subtitle');
const authForm = document.getElementById('auth-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const submitBtn = document.getElementById('submit-btn');
const submitText = document.getElementById('submit-text');
const toggleText = document.getElementById('toggle-text');
const toggleBtn = document.getElementById('toggle-btn');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const userEmailDisplay = document.getElementById('user-email-display');
const logoutBtn = document.getElementById('logout-btn');

try {
    const firebaseConfig = typeof __firebase_config !== 'undefined'
        ? JSON.parse(__firebase_config)
        : {
            apiKey: "AIzaSyAuWhzygL146ONm5jHRN3ln93Vu768XN0A",
            authDomain: "smartparking-34f65.firebaseapp.com",
            projectId: "smartparking-34f65"
        };
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
} catch (error) {
    console.error("Firebase initialization failed:", error);
    showError("System configuration error. Please try again later.");
}

function toggleMode() {
    isLoginMode = !isLoginMode;
    hideError();
    passwordInput.value = '';

    if (isLoginMode) {
        formTitle.textContent = "Welcome Back";
        formSubtitle.textContent = "Please sign in to your account";
        submitText.textContent = "Sign in";
        toggleText.textContent = "Don't have an account?";
        toggleBtn.textContent = "Register here";
    } else {
        formTitle.textContent = "Create Account";
        formSubtitle.textContent = "Sign up to get started";
        submitText.textContent = "Register";
        toggleText.textContent = "Already have an account?";
        toggleBtn.textContent = "Sign in here";
    }
}

toggleBtn.addEventListener('click', toggleMode);

function showError(msg) {
    errorText.textContent = msg;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function setLoading(isLoading) {
    submitBtn.classList.toggle('btn-loading', isLoading);
    submitBtn.disabled = isLoading;
}

function showDashboard(user) {
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    userEmailDisplay.textContent = user.email;
}

function showAuth() {
    dashboardSection.classList.add('hidden');
    authSection.classList.remove('hidden');
    emailInput.value = '';
    passwordInput.value = '';
    hideError();
}

function getFriendlyErrorMessage(error) {
    switch (error.code) {
        case 'auth/invalid-email':
            return 'Invalid email address format.';
        case 'auth/user-disabled':
            return 'This user account has been disabled.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Invalid email or password.';
        case 'auth/email-already-in-use':
            return 'An account already exists with this email.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection.';
        case 'auth/operation-not-allowed':
            return 'Email/Password accounts are not enabled. Please contact support.';
        default:
            return error.message || 'An unexpected error occurred. Please try again.';
    }
}

authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showError("Please enter both email and password.");
        return;
    }

    setLoading(true);

    try {
        if (isLoginMode) {
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            await createUserWithEmailAndPassword(auth, email, password);
        }
    } catch (error) {
        console.error("Auth Error:", error);
        showError(getFriendlyErrorMessage(error));
        setLoading(false);
    }
});

logoutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Sign out error", error);
    }
});

if (auth) {
    onAuthStateChanged(auth, (user) => {
        setLoading(false);
        if (user) {
            showDashboard(user);
        } else {
            showAuth();
        }
    });
}
