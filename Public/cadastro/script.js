// Elementos do DOM
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const switchLinks = document.querySelectorAll('.switch-link');
const togglePasswordButtons = document.querySelectorAll('.toggle-password');
const successModal = document.getElementById('successModal');
const registerPassword = document.getElementById('registerPassword');

// Alternar entre formulários
switchLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-target');
        
        if (target === 'register') {
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
        } else {
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
        }
        
        // Limpar mensagens de erro
        clearErrors();
    });
});

// Alternar visibilidade da senha
togglePasswordButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        const input = document.getElementById(targetId);
        
        if (input.type === 'password') {
            input.type = 'text';
            button.innerHTML = `
                <svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
            `;
        } else {
            input.type = 'password';
            button.innerHTML = `
                <svg class="eye-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            `;
        }
    });
});

// Indicador de força da senha
if (registerPassword) {
    registerPassword.addEventListener('input', () => {
        const password = registerPassword.value;
        const strengthBar = document.querySelector('.strength-fill');
        const strengthText = document.querySelector('.strength-text');
        
        const strength = calculatePasswordStrength(password);
        
        strengthBar.className = 'strength-fill';
        
        if (password.length === 0) {
            strengthBar.style.width = '0%';
            strengthText.textContent = '';
        } else if (strength < 3) {
            strengthBar.classList.add('weak');
            strengthText.textContent = 'Senha fraca';
        } else if (strength < 4) {
            strengthBar.classList.add('medium');
            strengthText.textContent = 'Senha média';
        } else {
            strengthBar.classList.add('strong');
            strengthText.textContent = 'Senha forte';
        }
    });
}

// Calcular força da senha
function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    return strength;
}

// Validação de e-mail
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validação de nome
function isValidName(name) {
    return name.trim().length >= 3;
}

// Validação de senha
function isValidPassword(password) {
    return password.length >= 8;
}

// Mostrar erro
function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(inputId + 'Error');
    
    input.classList.add('error');
    input.classList.remove('success');
    
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Mostrar sucesso
function showSuccess(inputId) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(inputId + 'Error');
    
    input.classList.remove('error');
    input.classList.add('success');
    
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Limpar erros
function clearErrors() {
    const inputs = document.querySelectorAll('input');
    const errorMessages = document.querySelectorAll('.error-message');
    
    inputs.forEach(input => {
        input.classList.remove('error', 'success');
    });
    
    errorMessages.forEach(error => {
        error.textContent = '';
    });
}

// Mostrar modal
function showModal(title, message) {
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    successModal.classList.add('active');
}

// Fechar modal
function closeModal() {
    successModal.classList.remove('active');
}

// Fechar modal ao clicar fora
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        closeModal();
    }
});

// Adicionar estado de loading ao botão
function setButtonLoading(button, loading) {
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
    } else {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Validação e submissão do formulário de login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const submitButton = loginForm.querySelector('button[type="submit"]');
    
    let isValid = true;
    
    // Validar e-mail
    if (!email) {
        showError('loginEmail', 'Por favor, insira seu e-mail');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('loginEmail', 'Por favor, insira um e-mail válido');
        isValid = false;
    } else {
        showSuccess('loginEmail');
    }
    
    // Validar senha
    if (!password) {
        showError('loginPassword', 'Por favor, insira sua senha');
        isValid = false;
    } else if (password.length < 6) {
        showError('loginPassword', 'A senha deve ter no mínimo 6 caracteres');
        isValid = false;
    } else {
        showSuccess('loginPassword');
    }
    
    if (isValid) {
        // Simular requisição de login
        setButtonLoading(submitButton, true);
        
        // Simular delay de requisição
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setButtonLoading(submitButton, false);
        
        // Aqui você faria a requisição real para o backend
        console.log('Login:', { email, password });
        
        showModal('Login realizado!', `Bem-vindo de volta! Você será redirecionado em instantes.`);
        
        // Limpar formulário
        loginForm.reset();
        clearErrors();
    }
});

// Validação e submissão do formulário de cadastro
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;
    const submitButton = registerForm.querySelector('button[type="submit"]');
    
    let isValid = true;
    
    // Validar nome
    if (!name) {
        showError('registerName', 'Por favor, insira seu nome completo');
        isValid = false;
    } else if (!isValidName(name)) {
        showError('registerName', 'O nome deve ter no mínimo 3 caracteres');
        isValid = false;
    } else {
        showSuccess('registerName');
    }
    
    // Validar e-mail
    if (!email) {
        showError('registerEmail', 'Por favor, insira seu e-mail');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('registerEmail', 'Por favor, insira um e-mail válido');
        isValid = false;
    } else {
        showSuccess('registerEmail');
    }
    
    // Validar senha
    if (!password) {
        showError('registerPassword', 'Por favor, crie uma senha');
        isValid = false;
    } else if (!isValidPassword(password)) {
        showError('registerPassword', 'A senha deve ter no mínimo 8 caracteres');
        isValid = false;
    } else {
        showSuccess('registerPassword');
    }
    
    // Validar confirmação de senha
    if (!confirmPassword) {
        showError('registerConfirmPassword', 'Por favor, confirme sua senha');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('registerConfirmPassword', 'As senhas não coincidem');
        isValid = false;
    } else {
        showSuccess('registerConfirmPassword');
    }
    
    // Validar termos
    if (!acceptTerms) {
        alert('Você precisa aceitar os Termos de Uso e a Política de Privacidade');
        isValid = false;
    }
    
    if (isValid) {
        // Simular requisição de cadastro
        setButtonLoading(submitButton, true);
        
        // Simular delay de requisição
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setButtonLoading(submitButton, false);
        
        // Aqui você faria a requisição real para o backend
        console.log('Cadastro:', { name, email, password });
        
        showModal('Cadastro realizado!', `Olá ${name}! Sua conta foi criada com sucesso. Você será redirecionado para fazer login.`);
        
        // Limpar formulário e voltar para login
        registerForm.reset();
        clearErrors();
        
        setTimeout(() => {
            closeModal();
            registerForm.classList.remove('active');
            loginForm.classList.add('active');
        }, 3000);
    }
});

// Validação em tempo real para os campos
document.getElementById('loginEmail').addEventListener('blur', function() {
    if (this.value && !isValidEmail(this.value)) {
        showError('loginEmail', 'Por favor, insira um e-mail válido');
    } else if (this.value) {
        showSuccess('loginEmail');
    }
});

document.getElementById('registerName').addEventListener('blur', function() {
    if (this.value && !isValidName(this.value)) {
        showError('registerName', 'O nome deve ter no mínimo 3 caracteres');
    } else if (this.value) {
        showSuccess('registerName');
    }
});

document.getElementById('registerEmail').addEventListener('blur', function() {
    if (this.value && !isValidEmail(this.value)) {
        showError('registerEmail', 'Por favor, insira um e-mail válido');
    } else if (this.value) {
        showSuccess('registerEmail');
    }
});

document.getElementById('registerPassword').addEventListener('blur', function() {
    if (this.value && !isValidPassword(this.value)) {
        showError('registerPassword', 'A senha deve ter no mínimo 8 caracteres');
    } else if (this.value) {
        showSuccess('registerPassword');
    }
});

document.getElementById('registerConfirmPassword').addEventListener('blur', function() {
    const password = document.getElementById('registerPassword').value;
    if (this.value && this.value !== password) {
        showError('registerConfirmPassword', 'As senhas não coincidem');
    } else if (this.value) {
        showSuccess('registerConfirmPassword');
    }
});

// Botões de login social (simulação)
const socialButtons = document.querySelectorAll('.btn-social');
socialButtons.forEach(button => {
    button.addEventListener('click', () => {
        const provider = button.classList.contains('btn-google') ? 'Google' : 'Facebook';
        console.log(`Login com ${provider} clicado`);
        alert(`Funcionalidade de login com ${provider} seria implementada aqui.`);
    });
});

// Link "Esqueceu a senha"
const forgotPasswordLink = document.querySelector('.forgot-password');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Funcionalidade de recuperação de senha seria implementada aqui.');
    });
}
