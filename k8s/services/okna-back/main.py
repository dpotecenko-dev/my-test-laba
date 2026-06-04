from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="API оконной компании")

# Разрешаем запросы с фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене лучше указать конкретный домен
    allow_methods=["*"],
    allow_headers=["*"],
)

# Модели данных
class Product(BaseModel):
    id: int
    title: str
    description: str
    price: str
    image: str

class CalcRequest(BaseModel):
    width: float
    height: float
    city: str
    phone: Optional[str] = None

class OrderRequest(BaseModel):
    name: str
    phone: str
    product_id: Optional[int] = None
    comment: Optional[str] = ""

# База данных продуктов
products_db = [
    {
        "id": 1,
        "title": "Пластиковые окна",
        "description": "Энергосберегающие окна с тройным стеклопакетом",
        "price": "от 12 500 ₽/м²",
        "image": "/images/window1.jpg"
    },
    {
        "id": 2,
        "title": "Панорамные двери",
        "description": "Раздвижные системы для террас и балконов",
        "price": "от 45 000 ₽/м²",
        "image": "/images/door1.jpg"
    },
    {
        "id": 3,
        "title": "Балконное остекление",
        "description": "Теплое и холодное остекление под ключ",
        "price": "от 18 000 ₽/м²",
        "image": "/images/balcony.jpg"
    },
    {
        "id": 4,
        "title": "Москитные сетки",
        "description": "Защита от насекомых на любой тип окон",
        "price": "от 2 500 ₽",
        "image": "/images/mosquito.jpg"
    }
]

# ----- API Эндпоинты -----

@app.get("/")
async def root():
    return {"message": "API оконной компании работает"}

@app.get("/api/products", response_model=List[Product])
async def get_products():
    """Получить список всех товаров"""
    return products_db

@app.get("/api/products/{product_id}")
async def get_product(product_id: int):
    """Получить конкретный товар по ID"""
    for product in products_db:
        if product["id"] == product_id:
            return product
    return {"error": "Товар не найден"}, 404

@app.post("/api/calculate")
async def calculate_price(data: CalcRequest):
    """Рассчитать примерную стоимость окна"""
    # Площадь в квадратных метрах
    area = (data.width * data.height) / 1000000  # переводим мм² в м²
    
    # Базовая цена за м²
    base_price = 12500
    
    # Коэффициент города (для примера)
    city_coef = 1.2 if data.city.lower() in ["москва", "санкт-петербург"] else 1.0
    
    # Скидка за большой объем
    discount = 0.9 if area > 8 else 1.0
    
    total = area * base_price * city_coef * discount
    
    return {
        "success": True,
        "area": round(area, 2),
        "price_per_m2": round(base_price * city_coef, 2),
        "total": round(total, 2),
        "message": f"Примерная стоимость: {round(total, 2)} ₽"
    }

@app.post("/api/order-measure")
async def order_measure(order: OrderRequest):
    """Заказать бесплатный замер"""
    # Здесь можно сохранить в БД, отправить email, уведомление в Telegram и т.д.
    print(f"Новый заказ замера: {order}")
    return {
        "success": True,
        "message": "Спасибо! Наш специалист свяжется с вами в течение 15 минут"
    }

@app.post("/api/callback")
async def callback(data: dict):
    """Заказать обратный звонок"""
    phone = data.get("phone")
    name = data.get("name", "Клиент")
    print(f"Заказан звонок: {name}, {phone}")
    return {
        "success": True,
        "message": "Ожидайте звонка в ближайшее время"
    }
