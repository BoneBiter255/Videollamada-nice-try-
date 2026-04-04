// Validación y funcionalidad del formulario de registro

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('register-password');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegisterSubmit);
        
        // Monitorear cambios en la contraseña para mostrar el indicador de fuerza
        if (passwordInput) {
            passwordInput.addEventListener('input', updatePasswordStrength);
        }
    }
});

/**
 * Alterna la visibilidad de las contraseñas
 */
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = event.target.closest('.toggle-password');
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

/**
 * Actualiza el indicador de fuerza de la contraseña
 */
function updatePasswordStrength() {
    const password = document.getElementById('register-password').value;
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.getElementById('strength-text');
    
    let strength = calculatePasswordStrength(password);
    let percentage = 0;
    let text = '';
    let color = '';
    
    if (strength === 0) {
        percentage = 0;
        text = 'Contraseña muy débil';
        color = '#f56565'; // Rojo
    } else if (strength === 1) {
        percentage = 25;
        text = 'Contraseña débil';
        color = '#ed8936'; // Naranja
    } else if (strength === 2) {
        percentage = 50;
        text = 'Contraseña media';
        color = '#ecc94b'; // Amarillo
    } else if (strength === 3) {
        percentage = 75;
        text = 'Contraseña fuerte';
        color = '#48bb78'; // Verde claro
    } else {
        percentage = 100;
        text = 'Contraseña muy fuerte';
        color = '#38a169'; // Verde oscuro
    }
    
    strengthBar.style.setProperty('--width', percentage + '%');
    strengthBar.innerHTML = `<div style="width: ${percentage}%; height: 100%; background-color: ${color}; transition: all 0.3s ease;"></div>`;
    strengthText.textContent = text;
    strengthText.style.color = color;
}

/**
 * Calcula la fortaleza de la contraseña
 */
function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (!password) return strength;
    
    // Longitud
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Mayúsculas
    if (/[A-Z]/.test(password)) strength++;
    
    // Minúsculas
    if (/[a-z]/.test(password)) strength++;
    
    // Números
    if (/[0-9]/.test(password)) strength++;
    
    // Caracteres especiales
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;
    
    // Retornar un valor de 0-4 (en lugar de 0-6)
    return Math.min(Math.floor(strength / 1.5), 4);
}

/**
 * Valida el formulario y maneja el envío
 */
function handleRegisterSubmit(e) {
    e.preventDefault();
    
    // Limpiar errores previos
    clearErrors();
    
    // Obtener valores del formulario
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const terms = document.getElementById('terms').checked;
    
    let isValid = true;
    
    // Validaciones
    if (!fullname) {
        showError('fullname', 'El nombre completo es requerido');
        isValid = false;
    } else if (fullname.length < 3) {
        showError('fullname', 'El nombre debe tener al menos 3 caracteres');
        isValid = false;
    }
    
    if (!email) {
        showError('register-email', 'El correo electrónico es requerido');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('register-email', 'Por favor ingresa un correo válido');
        isValid = false;
    }
    
    if (!username) {
        showError('username', 'El nombre de usuario es requerido');
        isValid = false;
    } else if (username.length < 3) {
        showError('username', 'El usuario debe tener al menos 3 caracteres');
        isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showError('username', 'El usuario solo puede contener letras, números y guiones bajos');
        isValid = false;
    }
    
    if (!password) {
        showError('register-password', 'La contraseña es requerida');
        isValid = false;
    } else if (password.length < 8) {
        showError('register-password', 'La contraseña debe tener al menos 8 caracteres');
        isValid = false;
    }
    
    if (!confirmPassword) {
        showError('confirm-password', 'Debes confirmar la contraseña');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirm-password', 'Las contraseñas no coinciden');
        isValid = false;
    }
    
    if (!terms) {
        showError('terms', 'Debes aceptar los términos y condiciones');
        isValid = false;
    }
    
    // Si todo es válido, enviar datos
    if (isValid) {
        submitRegistration({
            fullname,
            email,
            username,
            password,
            newsletter: document.getElementById('newsletter').checked
        });
    }
}

/**
 * Valida el formato de email
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Muestra un mensaje de error para un campo
 */
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '-error');
    
    if (field) {
        field.classList.add('error');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

/**
 * Limpia todos los errores
 */
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const inputElements = document.querySelectorAll('input');
    
    errorElements.forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
    });
    
    inputElements.forEach(el => {
        el.classList.remove('error');
    });
}

/**
 * Envía los datos del registro al servidor
 */
function submitRegistration(data) {
    console.log('Datos de registro:', data);
    
    // Mostrar spinner o desabilitar botón
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
    
    // Enviar al servidor
    fetch('/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error || 'Error al registrar');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Registro exitoso:', data);
        // Redirigir a login
        window.location.href = '/login.html';
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al registrar: ' + error.message);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    });
}

// Agregar estilos dinámicos para campos con error
const style = document.createElement('style');
style.textContent = `
    input.error {
        border-color: #f56565 !important;
        background-color: #fff5f5 !important;
    }
    
    input.error:focus {
        box-shadow: 0 0 0 3px rgba(245, 101, 101, 0.1) !important;
    }
`;
document.head.appendChild(style);
