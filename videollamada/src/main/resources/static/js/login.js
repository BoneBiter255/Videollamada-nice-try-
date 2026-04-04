// Validación y funcionalidad del formulario de login

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
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
 * Valida el formulario y maneja el envío
 */
function handleLoginSubmit(e) {
    e.preventDefault();
    
    // Limpiar errores previos
    clearErrors();
    
    // Obtener valores del formulario
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    let isValid = true;
    
    // Validaciones
    if (!email) {
        showError('email', 'El correo electrónico es requerido');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('email', 'Por favor ingresa un correo válido');
        isValid = false;
    }
    
    if (!password) {
        showError('password', 'La contraseña es requerida');
        isValid = false;
    } else if (password.length < 8) {
        showError('password', 'La contraseña debe tener al menos 8 caracteres');
        isValid = false;
    }
    
    // Si todo es válido, enviar datos
    if (isValid) {
        submitLogin({
            email,
            password,
            remember
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
    const inputElements = document.querySelectorAll('input[type="email"], input[type="password"]');
    
    errorElements.forEach(el => {
        el.classList.remove('show');
        el.textContent = '';
    });
    
    inputElements.forEach(el => {
        el.classList.remove('error');
    });
}

/**
 * Envía los datos del login al servidor
 */
function submitLogin(data) {
    console.log('Datos de login:', data);
    
    // Mostrar spinner o desabilitar botón
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Iniciando sesión...';
    
    // Guardar preferencia de "recuérdame"
    if (data.remember) {
        localStorage.setItem('rememberEmail', data.email);
    } else {
        localStorage.removeItem('rememberEmail');
    }
    
    // Enviar al servidor
    fetch('/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: data.email,
            password: data.password
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error || 'Error al iniciar sesión');
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Login exitoso:', data);
        // Guardar token si lo devuelve el servidor
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('userName', data.user.username);
        }
        // Redirigir a index.html inmediatamente
        window.location.href = '/index.html';
    })
    .catch(error => {
        console.error('Error:', error);
        showError('email', error.message);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    });
}

// Restaurar email si está guardado
window.addEventListener('load', function() {
    const rememberEmail = localStorage.getItem('rememberEmail');
    if (rememberEmail) {
        document.getElementById('email').value = rememberEmail;
        document.getElementById('remember').checked = true;
    }
});

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
