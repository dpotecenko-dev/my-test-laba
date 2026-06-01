// Конфигурация
const API_BASE_URL = 'http://localhost:8000/api';  // Для локальной разработки
// Для Docker используем: const API_BASE_URL = 'http://backend:8000/api';

// Состояние приложения
let currentCity = 'Москва';

// ----- Инициализация при загрузке страницы -----
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
});

// ----- Настройка обработчиков событий -----
function setupEventListeners() {
    // Город
    document.getElementById('citySelector').addEventListener('click', () => {
        openModal('cityModal');
    });
    
    // Кнопки модалок
    document.getElementById('measureBtn').addEventListener('click', () => {
        openModal('measureModal');
    });
    
    // Калькулятор
    document.getElementById('calculateBtn').addEventListener('click', calculatePrice);
    
    // Формы
    document.getElementById('callbackForm').addEventListener('submit', handleCallback);
    document.getElementById('measureForm').addEventListener('submit', handleMeasure);
    
    // Закрытие модалок
    document.querySelectorAll('.modal-close, .city-close').forEach(btn => {
        btn.addEventListener('click', () => {
            closeAllModals();
        });
    });
    
    // Выбор города
    document.querySelectorAll('.city-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const city = e.target.dataset.city;
            selectCity(city);
        });
    });
    
    // Определение города
    document.getElementById('detectCity').addEventListener('click', detectCity);
    
    // Закрытие по клику вне модалки
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
}

// ----- Загрузка продуктов с бэкенда -----
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Ошибка загрузки продуктов:', error);
        document.getElementById('productsGrid').innerHTML = 
            '<div class="error">Ошибка загрузки. Попробуйте позже</div>';
    }
}

function renderProducts(products) {
    const grid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        grid.innerHTML = '<div class="empty">Товары временно отсутствуют</div>';
        return;
    }
    
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <i class="fas fa-window-maximize fa-3x"></i>
            </div>
            <h3 class="product-title">${product.title}</h3>
            <p class="product-desc">${product.description}</p>
            <div class="product-price">${product.price}</div>
            <button class="btn btn-outline" onclick="orderProduct(${product.id})">
                Заказать
            </button>
        </div>
    `).join('');
}

// ----- Калькулятор -----
async function calculatePrice() {
    const width = document.getElementById('width').value;
    const height = document.getElementById('height').value;
    
    if (!width || !height) {
        showCalcResult('Заполните все поля', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                width: parseFloat(width),
                height: parseFloat(height),
                city: currentCity
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showCalcResult(`
                <strong>${data.message}</strong><br>
                <small>Площадь: ${data.area} м²</small><br>
                <small>Цена за м²: ${data.price_per_m2} ₽</small>
            `, 'success');
        } else {
            showCalcResult('Ошибка расчета', 'error');
        }
    } catch (error) {
        showCalcResult('Ошибка сервера', 'error');
    }
}

function showCalcResult(message, type) {
    const resultDiv = document.getElementById('calcResult');
    resultDiv.innerHTML = message;
    resultDiv.className = `calc-result ${type} active`;
}

// ----- Заказ замера -----
async function handleMeasure(e) {
    e.preventDefault();
    
    const name = document.getElementById('measureName').value;
    const phone = document.getElementById('measurePhone').value;
    const address = document.getElementById('measureAddress').value;
    
    if (!name || !phone) {
        showMeasureMessage('Заполните имя и телефон', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/order-measure`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, address })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMeasureMessage(data.message, 'success');
            document.getElementById('measureForm').reset();
            setTimeout(() => {
                closeAllModals();
            }, 2000);
        } else {
            showMeasureMessage('Ошибка', 'error');
        }
    } catch (error) {
        showMeasureMessage('Ошибка сервера', 'error');
    }
}

function showMeasureMessage(message, type) {
    const msgDiv = document.getElementById('measureMessage');
    msgDiv.textContent = message;
    msgDiv.className = `form-message ${type}`;
}

// ----- Обратный звонок -----
async function handleCallback(e) {
    e.preventDefault();
    
    const name = document.getElementById('callbackName').value;
    const phone = document.getElementById('callbackPhone').value;
    
    if (!phone) {
        showCallbackMessage('Введите телефон', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/callback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showCallbackMessage(data.message, 'success');
            document.getElementById('callbackForm').reset();
        } else {
            showCallbackMessage('Ошибка', 'error');
        }
    } catch (error) {
        showCallbackMessage('Ошибка сервера', 'error');
    }
}

function showCallbackMessage(message, type) {
    const msgDiv = document.getElementById('callbackMessage');
    msgDiv.textContent = message;
    msgDiv.className = `form-message ${type}`;
}

// ----- Работа с городом -----
function selectCity(city) {
    currentCity = city;
    document.getElementById('selectedCity').textContent = city;
    closeAllModals();
}

function detectCity() {
    // Имитация определения города
    selectCity('Москва');
}

// ----- Заказ продукта -----
function orderProduct(productId) {
    alert(`Заказ товара #${productId}. Скоро менеджер свяжется с вами!`);
}

// ----- Управление модалками -----
function openModal(modalId) {
    closeAllModals();
    document.getElementById(modalId).classList.add('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// ----- Cookies -----
function acceptCookies() {
    document.getElementById('cookieBanner').style.display = 'none';
    // Здесь можно сохранить согласие в localStorage
}
