"""Seed initial data for ImPrinta - Advertising & Printing Company"""
import asyncio
from sqlalchemy import select
from app.core.database import async_session
from app.core.security import get_password_hash
from app.core.config import settings
from app.models.user import User
from app.models.content import (
    Service, FAQ, SiteSettings, SeoMeta, Client, Testimonial,
    Portfolio, Category, News, Gallery, Vacancy, Employee, Certificate
)


async def seed():
    async with async_session() as db:
        # Admin user
        result = await db.execute(select(User).where(User.username == settings.ADMIN_USERNAME))
        if not result.scalar_one_or_none():
            admin = User(
                username=settings.ADMIN_USERNAME,
                email="admin@imprinta.uz",
                hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                full_name="ImPrinta Admin",
                role="admin",
                is_active=True,
            )
            db.add(admin)

        # Services
        result = await db.execute(select(Service).limit(1))
        if not result.scalar_one_or_none():
            services_data = [
                {
                    "title_uz": "Keng formatli bosma",
                    "title_ru": "Широкоформатная печать",
                    "title_en": "Wide Format Printing",
                    "description_uz": "Bannerlar, bilbordlar, orakal, mesh-banner va boshqa keng formatli reklama materiallari. 720-1440 dpi sifatda, UV va solventli bosma texnologiyalari bilan.",
                    "description_ru": "Баннеры, билборды, оракал, mesh-баннеры и другие широкоформатные рекламные материалы. Качество 720-1440 dpi, UV и сольвентные технологии печати.",
                    "description_en": "Banners, billboards, vinyl, mesh banners and other wide format advertising materials. 720-1440 dpi quality with UV and solvent printing technologies.",
                    "icon": "Printer",
                    "image": "/gallery/billboard.jpg",
                    "slug": "wide-format-printing",
                    "is_featured": True,
                    "sort_order": 1,
                },
                {
                    "title_uz": "Tashqi reklama",
                    "title_ru": "Наружная реклама",
                    "title_en": "Outdoor Advertising",
                    "description_uz": "Bilbordlar, city-light, brendmauer, krysha ustidagi konstruksiyalar va yo'l bo'yidagi reklama tashuvchilari. Dizayndan montajgacha to'liq xizmat.",
                    "description_ru": "Билборды, сити-лайты, брандмауэры, крышные конструкции и придорожные рекламные носители. Полный цикл от дизайна до монтажа.",
                    "description_en": "Billboards, city-lights, brandmauers, rooftop structures and roadside advertising carriers. Full service from design to installation.",
                    "icon": "Monitor",
                    "image": "/gallery/city-banner.jpg",
                    "slug": "outdoor-advertising",
                    "is_featured": True,
                    "sort_order": 2,
                },
                {
                    "title_uz": "Poligrafiya",
                    "title_ru": "Полиграфия",
                    "title_en": "Polygraphy",
                    "description_uz": "Vizitka, buklet, katalog, flayer, jurnal, kitob va afisha bosish. Ofset va raqamli bosma. Tiraj 1 donadan 100 000+ gacha.",
                    "description_ru": "Визитки, буклеты, каталоги, флаеры, журналы, книги и афиши. Офсетная и цифровая печать. Тираж от 1 до 100 000+ экземпляров.",
                    "description_en": "Business cards, brochures, catalogs, flyers, magazines, books and posters. Offset and digital printing. Runs from 1 to 100,000+ copies.",
                    "icon": "BookOpen",
                    "image": "/gallery/poster-mockup.jpg",
                    "slug": "polygraphy",
                    "is_featured": True,
                    "sort_order": 3,
                },
                {
                    "title_uz": "Brending va dizayn",
                    "title_ru": "Брендинг и дизайн",
                    "title_en": "Branding & Design",
                    "description_uz": "Logo, firmaviy uslub, brendbuk, korporativ identifikatsiya va vizual strategiya ishlab chiqish. Kompaniyangiz brendini professional darajada yaratamiz.",
                    "description_ru": "Логотип, фирменный стиль, брендбук, корпоративная идентификация и визуальная стратегия. Профессиональная разработка бренда вашей компании.",
                    "description_en": "Logo, corporate identity, brand book, corporate identification and visual strategy. Professional brand development for your company.",
                    "icon": "Palette",
                    "slug": "branding-design",
                    "is_featured": True,
                    "sort_order": 4,
                },
                {
                    "title_uz": "3D reklama va yoritilgan harflar",
                    "title_ru": "3D реклама и световые буквы",
                    "title_en": "3D Advertising & Light Letters",
                    "description_uz": "Yoritilgan harflar, light-box, neon, LED ekranlar va 3D konstruksiyalar. Zamonaviy yorug'lik texnologiyalari bilan brendingizni ajralib tursing.",
                    "description_ru": "Световые буквы, лайтбоксы, неон, LED экраны и 3D конструкции. Выделите свой бренд с помощью современных световых технологий.",
                    "description_en": "Light letters, lightboxes, neon, LED screens and 3D structures. Make your brand stand out with modern lighting technologies.",
                    "icon": "Box",
                    "slug": "3d-advertising",
                    "is_featured": False,
                    "sort_order": 5,
                },
                {
                    "title_uz": "Packaging va qadoqlash",
                    "title_ru": "Упаковка и пакетирование",
                    "title_en": "Packaging Solutions",
                    "description_uz": "Qutillar, paketlar, etiketka, maxsus qadoqlash va sovg'a to'plamlari. Individual dizayn va ishlab chiqarish.",
                    "description_ru": "Коробки, пакеты, этикетки, специальная упаковка и подарочные наборы. Индивидуальный дизайн и производство.",
                    "description_en": "Boxes, bags, labels, custom packaging and gift sets. Individual design and production.",
                    "icon": "Package",
                    "slug": "packaging",
                    "is_featured": False,
                    "sort_order": 6,
                },
                {
                    "title_uz": "Transport reklamasi",
                    "title_ru": "Транспортная реклама",
                    "title_en": "Vehicle Advertising",
                    "description_uz": "Avtobuslar, taksi, yuk mashinalari va korporativ transportni brendlash. Orakal va magnit yechimlar.",
                    "description_ru": "Брендирование автобусов, такси, грузовых и корпоративного транспорта. Оракал и магнитные решения.",
                    "description_en": "Branding of buses, taxis, trucks and corporate vehicles. Vinyl and magnetic solutions.",
                    "icon": "Truck",
                    "slug": "vehicle-advertising",
                    "is_featured": False,
                    "sort_order": 7,
                },
                {
                    "title_uz": "Montaj xizmati",
                    "title_ru": "Монтажные услуги",
                    "title_en": "Installation Services",
                    "description_uz": "Professional o'rnatish va montaj xizmatlari. Balandlikda ishlash, kranlar va alpinist uskunalari bilan.",
                    "description_ru": "Профессиональные услуги установки и монтажа. Работа на высоте, с кранами и альпинистским оборудованием.",
                    "description_en": "Professional installation and mounting services. High-altitude work with cranes and climbing equipment.",
                    "icon": "Wrench",
                    "slug": "installation-services",
                    "is_featured": False,
                    "sort_order": 8,
                },
            ]
            for s in services_data:
                db.add(Service(**s))

        # Categories
        result = await db.execute(select(Category).limit(1))
        if not result.scalar_one_or_none():
            categories_data = [
                {"name_uz": "Bilbordlar", "name_ru": "Билборды", "name_en": "Billboards", "slug": "billboards", "type": "portfolio", "sort_order": 1},
                {"name_uz": "Bannerlar", "name_ru": "Баннеры", "name_en": "Banners", "slug": "banners", "type": "portfolio", "sort_order": 2},
                {"name_uz": "Poligrafiya", "name_ru": "Полиграфия", "name_en": "Polygraphy", "slug": "polygraphy", "type": "portfolio", "sort_order": 3},
                {"name_uz": "Brending", "name_ru": "Брендинг", "name_en": "Branding", "slug": "branding", "type": "portfolio", "sort_order": 4},
                {"name_uz": "3D reklama", "name_ru": "3D реклама", "name_en": "3D Advertising", "slug": "3d-advertising", "type": "portfolio", "sort_order": 5},
            ]
            for c in categories_data:
                db.add(Category(**c))

        # Portfolio
        result = await db.execute(select(Portfolio).limit(1))
        if not result.scalar_one_or_none():
            portfolio_data = [
                {
                    "title_uz": "Pandora bilbordi — Toshkent shahri",
                    "title_ru": "Билборд Pandora — город Ташкент",
                    "title_en": "Pandora Billboard — Tashkent City",
                    "description_uz": "Pandora brendi uchun 6x3m bilbord tayyorlash va o'rnatish. UV bosma, yuqori sifatli materiallar.",
                    "description_ru": "Изготовление и установка билборда 6x3м для бренда Pandora. UV печать, материалы высокого качества.",
                    "description_en": "Production and installation of a 6x3m billboard for Pandora brand. UV printing, high quality materials.",
                    "image": "/gallery/pandora-billboard.jpg",
                    "client": "Pandora",
                    "slug": "pandora-billboard-tashkent",
                    "is_featured": True,
                    "status": "published",
                    "sort_order": 1,
                },
                {
                    "title_uz": "City banner — reklama kampaniyasi",
                    "title_ru": "City баннер — рекламная кампания",
                    "title_en": "City Banner — Advertising Campaign",
                    "description_uz": "Shahar ko'chalarida katta hajmli banner reklama kampaniyasi. Mesh-banner va vinil materiallar.",
                    "description_ru": "Масштабная баннерная рекламная кампания на улицах города. Mesh-баннеры и виниловые материалы.",
                    "description_en": "Large-scale banner advertising campaign on city streets. Mesh banners and vinyl materials.",
                    "image": "/gallery/city-banner.jpg",
                    "client": "City Mall",
                    "slug": "city-banner-campaign",
                    "is_featured": True,
                    "status": "published",
                    "sort_order": 2,
                },
                {
                    "title_uz": "Poster dizayn va bosma",
                    "title_ru": "Дизайн и печать постеров",
                    "title_en": "Poster Design & Print",
                    "description_uz": "A1 va A0 formatda poster dizayn va yuqori sifatli bosma. Foto-sifatli qog'ozda solventli bosma.",
                    "description_ru": "Дизайн и высококачественная печать постеров формата A1 и A0. Сольвентная печать на фотобумаге.",
                    "description_en": "A1 and A0 format poster design and high quality print. Solvent printing on photo paper.",
                    "image": "/gallery/poster-mockup.jpg",
                    "client": "Various",
                    "slug": "poster-design-print",
                    "is_featured": True,
                    "status": "published",
                    "sort_order": 3,
                },
                {
                    "title_uz": "Visatchi — tashqi reklama loyihasi",
                    "title_ru": "Visatchi — проект наружной рекламы",
                    "title_en": "Visatchi — Outdoor Advertising Project",
                    "description_uz": "Visatchi brendi uchun to'liq tashqi reklama yechimi: bilbordlar, bannerlar va yo'nalish ko'rsatuvchi belgilar.",
                    "description_ru": "Комплексное решение наружной рекламы для бренда Visatchi: билборды, баннеры и указатели.",
                    "description_en": "Complete outdoor advertising solution for Visatchi brand: billboards, banners and directional signs.",
                    "image": "/gallery/visatchi.jpg",
                    "client": "Visatchi",
                    "slug": "visatchi-outdoor-advertising",
                    "is_featured": False,
                    "status": "published",
                    "sort_order": 4,
                },
                {
                    "title_uz": "Billboard reklama — markaziy ko'cha",
                    "title_ru": "Билборд реклама — центральная улица",
                    "title_en": "Billboard Advertising — Central Street",
                    "description_uz": "Markaziy ko'chada 12x4m bilbord. Yuqori trafikli joyda strategik joylashuv. LED yoritish bilan tungi ko'rinish.",
                    "description_ru": "Билборд 12x4м на центральной улице. Стратегическое расположение в зоне высокого трафика. Ночная видимость с LED подсветкой.",
                    "description_en": "12x4m billboard on central street. Strategic placement in high-traffic zone. Night visibility with LED lighting.",
                    "image": "/gallery/billboard.jpg",
                    "client": "ImPrinta",
                    "slug": "billboard-central-street",
                    "is_featured": True,
                    "status": "published",
                    "sort_order": 5,
                },
            ]
            for p in portfolio_data:
                db.add(Portfolio(**p))

        # Clients / Brands
        result = await db.execute(select(Client).limit(1))
        if not result.scalar_one_or_none():
            clients_data = [
                {"name": "Uzum Bank", "website": "https://uzumbank.uz", "is_partner": True, "sort_order": 1},
                {"name": "Pandora", "website": "https://pandora.net", "is_partner": True, "sort_order": 2},
                {"name": "Coca-Cola", "website": "https://coca-cola.com", "is_partner": False, "sort_order": 3},
                {"name": "Artel", "website": "https://artelelectronics.com", "is_partner": True, "sort_order": 4},
                {"name": "Chevrolet Uz", "website": "https://chevrolet.uz", "is_partner": False, "sort_order": 5},
                {"name": "Humans.uz", "website": "https://humans.uz", "is_partner": True, "sort_order": 6},
                {"name": "Payme", "website": "https://payme.uz", "is_partner": False, "sort_order": 7},
                {"name": "Korzinka", "website": "https://korzinka.uz", "is_partner": True, "sort_order": 8},
                {"name": "Beeline", "website": "https://beeline.uz", "is_partner": False, "sort_order": 9},
                {"name": "Ucell", "website": "https://ucell.uz", "is_partner": False, "sort_order": 10},
            ]
            for c in clients_data:
                db.add(Client(**c))

        # Testimonials
        result = await db.execute(select(Testimonial).limit(1))
        if not result.scalar_one_or_none():
            testimonials_data = [
                {
                    "author_name": "Aziz Karimov",
                    "author_position": "Marketing direktor",
                    "author_company": "Uzum Bank",
                    "content_uz": "ImPrinta bilan ishlash juda qulay. Bankimizning barcha tashqi reklama ehtiyojlarini sifatli va o'z vaqtida bajarishdi. Bilbordlar va city-lightlar ajoyib chiqdi.",
                    "content_ru": "Работать с ImPrinta очень удобно. Все наши потребности в наружной рекламе были выполнены качественно и в срок. Билборды и сити-лайты получились отличными.",
                    "content_en": "Working with ImPrinta is very convenient. All our outdoor advertising needs were fulfilled with quality and on time. Billboards and city-lights turned out excellent.",
                    "rating": 5,
                    "sort_order": 1,
                },
                {
                    "author_name": "Malika Rashidova",
                    "author_position": "Kreativ direktor",
                    "author_company": "Humans.uz",
                    "content_uz": "Professional jamoa, zamonaviy uskunalar va yuqori sifat. Bizning brending loyihamizni A dan Z gacha mukammal bajardilar. Tavsiya qilamiz!",
                    "content_ru": "Профессиональная команда, современное оборудование и высокое качество. Наш проект брендинга выполнен от А до Я безупречно. Рекомендуем!",
                    "content_en": "Professional team, modern equipment and high quality. Our branding project was executed perfectly from A to Z. Highly recommended!",
                    "rating": 5,
                    "sort_order": 2,
                },
                {
                    "author_name": "Bobur Saidov",
                    "author_position": "CEO",
                    "author_company": "TechVentures",
                    "content_uz": "3 yildan beri ImPrinta bilan ishlaymiz. Har doim sifatli natija, tez ijro va moslashuvchan narxlar. Keng formatli bosma bo'yicha eng yaxshi Toshkentda.",
                    "content_ru": "Работаем с ImPrinta уже 3 года. Всегда качественный результат, быстрое исполнение и гибкие цены. Лучшие в Ташкенте по широкоформатной печати.",
                    "content_en": "We've been working with ImPrinta for 3 years. Always quality results, fast execution and flexible pricing. Best in Tashkent for wide format printing.",
                    "rating": 5,
                    "sort_order": 3,
                },
                {
                    "author_name": "Dilnoza Umarova",
                    "author_position": "Marketing manager",
                    "author_company": "Korzinka",
                    "content_uz": "Butun tarmoqimiz bo'ylab 200+ do'konning tashqi va ichki brendingini ImPrinta bajargan. Sifat bir xil, muddatlar aniq. Ishonchli hamkor.",
                    "content_ru": "ImPrinta выполнила внешний и внутренний брендинг для 200+ магазинов нашей сети. Одинаковое качество, точные сроки. Надёжный партнёр.",
                    "content_en": "ImPrinta handled external and internal branding for 200+ stores across our chain. Consistent quality, exact deadlines. Reliable partner.",
                    "rating": 5,
                    "sort_order": 4,
                },
                {
                    "author_name": "Jahongir Toshmatov",
                    "author_position": "Reklama bo'limi boshlig'i",
                    "author_company": "Beeline Uzbekistan",
                    "content_uz": "Butun O'zbekiston bo'ylab reklama kampaniyamizning bosma materiallarini ImPrinta tayyorladi. Mintaqalarga yetkazib berish ham o'z vaqtida bo'ldi.",
                    "content_ru": "ImPrinta подготовила печатные материалы для нашей рекламной кампании по всему Узбекистану. Доставка в регионы тоже была своевременной.",
                    "content_en": "ImPrinta prepared printed materials for our advertising campaign across all of Uzbekistan. Delivery to regions was also on time.",
                    "rating": 4,
                    "sort_order": 5,
                },
            ]
            for t in testimonials_data:
                db.add(Testimonial(**t))

        # FAQs
        result = await db.execute(select(FAQ).limit(1))
        if not result.scalar_one_or_none():
            faqs_data = [
                {
                    "question_uz": "Buyurtma berish jarayoni qanday?",
                    "question_ru": "Как происходит процесс заказа?",
                    "question_en": "How does the ordering process work?",
                    "answer_uz": "Siz biz bilan bog'lanasiz (telefon, telegram yoki sayt orqali), loyihangizni muhokama qilamiz, dizayn tasdiqlaymiz, narx kelishamiz va ishlab chiqarishni boshlaymiz. Tayyor mahsulotni o'zimiz yetkazib beramiz yoki montaj qilamiz.",
                    "answer_ru": "Вы связываетесь с нами (по телефону, Telegram или через сайт), мы обсуждаем проект, утверждаем дизайн, согласовываем цену и начинаем производство. Доставляем готовую продукцию или выполняем монтаж.",
                    "answer_en": "You contact us (phone, Telegram or website), we discuss the project, approve design, agree on price and start production. We deliver the finished product or perform installation.",
                    "sort_order": 1,
                },
                {
                    "question_uz": "Minimal buyurtma miqdori bormi?",
                    "question_ru": "Есть ли минимальный объём заказа?",
                    "question_en": "Is there a minimum order quantity?",
                    "answer_uz": "Raqamli bosma uchun 1 donadan boshlab qabul qilamiz. Ofset bosma uchun minimal tiraj 500 dona. Keng formatli bosma — 1 m² dan.",
                    "answer_ru": "Для цифровой печати принимаем от 1 экземпляра. Для офсетной печати минимальный тираж — 500 экземпляров. Широкоформатная печать — от 1 м².",
                    "answer_en": "For digital printing we accept from 1 copy. For offset printing minimum run is 500 copies. Wide format printing — from 1 m².",
                    "sort_order": 2,
                },
                {
                    "question_uz": "Yetkazib berish xizmati bormi?",
                    "question_ru": "Есть ли услуга доставки?",
                    "question_en": "Do you offer delivery?",
                    "answer_uz": "Ha, Toshkent shahri bo'ylab bepul yetkazib berish xizmati mavjud. Viloyatlarga ham yetkazib beramiz (qo'shimcha narxda).",
                    "answer_ru": "Да, бесплатная доставка по городу Ташкент. Доставка в регионы также доступна (за дополнительную плату).",
                    "answer_en": "Yes, we offer free delivery within Tashkent city. Delivery to regions is also available (at additional cost).",
                    "sort_order": 3,
                },
                {
                    "question_uz": "Qancha vaqtda tayyor bo'ladi?",
                    "question_ru": "Сколько времени занимает изготовление?",
                    "question_en": "How long does production take?",
                    "answer_uz": "Vizitka — 2-3 soat, banner — 1 kun, bilbord — 2-3 kun, brending loyiha — 7-14 kun. Shoshilinch buyurtmalar ham qabul qilinadi.",
                    "answer_ru": "Визитки — 2-3 часа, баннеры — 1 день, билборды — 2-3 дня, проекты брендинга — 7-14 дней. Принимаем срочные заказы.",
                    "answer_en": "Business cards — 2-3 hours, banners — 1 day, billboards — 2-3 days, branding projects — 7-14 days. Rush orders accepted.",
                    "sort_order": 4,
                },
                {
                    "question_uz": "Dizayn xizmati ham bormi?",
                    "question_ru": "Вы также предоставляете услуги дизайна?",
                    "question_en": "Do you also provide design services?",
                    "answer_uz": "Ha, bizda professional dizaynerlar jamoasi bor. Logo, brending, reklama bannerlari, poster, buklet va boshqa barcha turdagi grafik dizayn xizmatlarini ko'rsatamiz.",
                    "answer_ru": "Да, у нас есть команда профессиональных дизайнеров. Мы предоставляем все виды графического дизайна: логотипы, брендинг, рекламные баннеры, постеры, буклеты.",
                    "answer_en": "Yes, we have a team of professional designers. We provide all types of graphic design: logos, branding, advertising banners, posters, brochures.",
                    "sort_order": 5,
                },
                {
                    "question_uz": "To'lov qanday amalga oshiriladi?",
                    "question_ru": "Как производится оплата?",
                    "question_en": "How is payment made?",
                    "answer_uz": "Naqd, bank o'tkazmasi, Click, Payme va korporativ shartnoma asosida to'lov qabul qilamiz. Doimiy mijozlarga bo'lib to'lash imkoniyati mavjud.",
                    "answer_ru": "Принимаем оплату наличными, банковским переводом, Click, Payme и по корпоративному договору. Для постоянных клиентов доступна рассрочка.",
                    "answer_en": "We accept cash, bank transfer, Click, Payme and corporate contract payments. Installment plans available for regular clients.",
                    "sort_order": 6,
                },
            ]
            for f in faqs_data:
                db.add(FAQ(**f))

        # Gallery
        result = await db.execute(select(Gallery).limit(1))
        if not result.scalar_one_or_none():
            gallery_data = [
                {
                    "title_uz": "Pandora bilbordi",
                    "title_ru": "Билборд Pandora",
                    "title_en": "Pandora Billboard",
                    "image": "/gallery/pandora-billboard.jpg",
                    "category": "billboards",
                    "sort_order": 1,
                },
                {
                    "title_uz": "Shahar banneri",
                    "title_ru": "Городской баннер",
                    "title_en": "City Banner",
                    "image": "/gallery/city-banner.jpg",
                    "category": "banners",
                    "sort_order": 2,
                },
                {
                    "title_uz": "Poster namunasi",
                    "title_ru": "Образец постера",
                    "title_en": "Poster Sample",
                    "image": "/gallery/poster-mockup.jpg",
                    "category": "polygraphy",
                    "sort_order": 3,
                },
                {
                    "title_uz": "Visatchi reklama",
                    "title_ru": "Реклама Visatchi",
                    "title_en": "Visatchi Advertising",
                    "image": "/gallery/visatchi.jpg",
                    "category": "outdoor",
                    "sort_order": 4,
                },
                {
                    "title_uz": "Ko'cha bilbordi",
                    "title_ru": "Уличный билборд",
                    "title_en": "Street Billboard",
                    "image": "/gallery/billboard.jpg",
                    "category": "billboards",
                    "sort_order": 5,
                },
            ]
            for g in gallery_data:
                db.add(Gallery(**g))

        # News
        result = await db.execute(select(News).limit(1))
        if not result.scalar_one_or_none():
            news_data = [
                {
                    "title_uz": "ImPrinta yangi UV printer sotib oldi",
                    "title_ru": "ImPrinta приобрела новый UV принтер",
                    "title_en": "ImPrinta Acquired New UV Printer",
                    "content_uz": "Kompaniyamiz yangi avlod UV flatbed printerni ishga tushirdi. Endi biz har qanday sirtga — yog'och, metall, shisha, plastik — to'g'ridan-to'g'ri bosma xizmatini taklif etamiz. Bu texnologiya mahsulot sifatini yanada oshiradi va yangi imkoniyatlar ochadi.",
                    "content_ru": "Наша компания запустила UV планшетный принтер нового поколения. Теперь мы предлагаем прямую печать на любой поверхности — дерево, металл, стекло, пластик. Эта технология повышает качество продукции и открывает новые возможности.",
                    "content_en": "Our company launched a new generation UV flatbed printer. We now offer direct printing on any surface — wood, metal, glass, plastic. This technology enhances product quality and opens new possibilities.",
                    "excerpt_uz": "Yangi UV flatbed printer bilan har qanday sirtga bosma mumkin",
                    "excerpt_ru": "Новый UV планшетный принтер позволяет печатать на любой поверхности",
                    "excerpt_en": "New UV flatbed printer enables printing on any surface",
                    "image": "/gallery/poster-mockup.jpg",
                    "slug": "new-uv-printer-2024",
                    "status": "published",
                    "views": 234,
                    "sort_order": 1,
                },
                {
                    "title_uz": "Toshkentda eng katta bilbord o'rnatildi",
                    "title_ru": "В Ташкенте установлен самый большой билборд",
                    "title_en": "Largest Billboard Installed in Tashkent",
                    "content_uz": "ImPrinta jamoasi Toshkent shahrida 24x6 metrli katta bilbordni muvaffaqiyatli o'rnatdi. Bu loyiha Pandora brendi uchun amalga oshirildi va shaharning eng ko'p qatnov yo'lida joylashgan. LED yoritish tizimi tungi ko'rinishni ta'minlaydi.",
                    "content_ru": "Команда ImPrinta успешно установила в Ташкенте билборд размером 24x6 метров. Проект реализован для бренда Pandora и расположен на самой оживлённой трассе города. Система LED подсветки обеспечивает ночную видимость.",
                    "content_en": "ImPrinta team successfully installed a 24x6 meter billboard in Tashkent. The project was completed for Pandora brand and is located on the city's busiest highway. LED lighting system provides night visibility.",
                    "excerpt_uz": "24x6m bilbord — Toshkentdagi eng katta reklama konstruksiyasi",
                    "excerpt_ru": "Билборд 24x6м — крупнейшая рекламная конструкция в Ташкенте",
                    "excerpt_en": "24x6m billboard — the largest advertising structure in Tashkent",
                    "image": "/gallery/pandora-billboard.jpg",
                    "slug": "largest-billboard-tashkent",
                    "status": "published",
                    "views": 567,
                    "sort_order": 2,
                },
                {
                    "title_uz": "Reklama bozori tendentsiyalari 2024",
                    "title_ru": "Тенденции рекламного рынка 2024",
                    "title_en": "Advertising Market Trends 2024",
                    "content_uz": "O'zbekiston reklama bozori yiliga 15-20% o'smoqda. Tashqi reklama segmenti eng tez rivojlanayotgan yo'nalish hisoblanadi. Raqamli bosma texnologiyalari esa an'anaviy ofsetni siqib chiqarmoqda. ImPrinta bu tendentsiyalarga mos ravishda zamonaviy uskunalarga investitsiya qilmoqda.",
                    "content_ru": "Рекламный рынок Узбекистана растёт на 15-20% ежегодно. Сегмент наружной рекламы — самое быстрорастущее направление. Технологии цифровой печати вытесняют традиционный офсет. ImPrinta инвестирует в современное оборудование в соответствии с этими тенденциями.",
                    "content_en": "Uzbekistan's advertising market is growing 15-20% annually. The outdoor advertising segment is the fastest growing direction. Digital printing technologies are displacing traditional offset. ImPrinta invests in modern equipment in line with these trends.",
                    "excerpt_uz": "O'zbekiston reklama bozori yiliga 15-20% o'sish ko'rsatmoqda",
                    "excerpt_ru": "Рекламный рынок Узбекистана показывает рост 15-20% в год",
                    "excerpt_en": "Uzbekistan's advertising market shows 15-20% annual growth",
                    "image": "/gallery/city-banner.jpg",
                    "slug": "advertising-trends-2024",
                    "status": "published",
                    "views": 189,
                    "sort_order": 3,
                },
                {
                    "title_uz": "Yangi filial Samarqandda ochildi",
                    "title_ru": "Открыт новый филиал в Самарканде",
                    "title_en": "New Branch Opened in Samarkand",
                    "content_uz": "ImPrinta Samarqand shahridagi yangi filialini ochdi. Endi Samarqand va atrofdagi viloyatlar mijozlari bizning xizmatlarimizdan qulay foydalanishlari mumkin. Filialda keng formatli bosma, poligrafiya va montaj xizmatlari mavjud.",
                    "content_ru": "ImPrinta открыла новый филиал в городе Самарканд. Теперь клиенты Самарканда и близлежащих областей могут удобно пользоваться нашими услугами. В филиале доступны широкоформатная печать, полиграфия и монтаж.",
                    "content_en": "ImPrinta opened a new branch in Samarkand city. Now clients in Samarkand and nearby regions can conveniently access our services. The branch offers wide format printing, polygraphy and installation services.",
                    "excerpt_uz": "Samarqandda yangi filial — mintaqaviy mijozlar uchun qulay xizmat",
                    "excerpt_ru": "Новый филиал в Самарканде — удобный сервис для региональных клиентов",
                    "excerpt_en": "New branch in Samarkand — convenient service for regional clients",
                    "image": "/gallery/billboard.jpg",
                    "slug": "new-branch-samarkand",
                    "status": "published",
                    "views": 312,
                    "sort_order": 4,
                },
            ]
            for n in news_data:
                db.add(News(**n))

        # Vacancies
        result = await db.execute(select(Vacancy).limit(1))
        if not result.scalar_one_or_none():
            vacancies_data = [
                {
                    "title_uz": "Grafik dizayner",
                    "title_ru": "Графический дизайнер",
                    "title_en": "Graphic Designer",
                    "description_uz": "Reklama va bosma materiallar uchun grafik dizayn ishlab chiqish. Adobe Creative Suite bilan ishlash tajribasi talab qilinadi.",
                    "description_ru": "Разработка графического дизайна для рекламных и печатных материалов. Требуется опыт работы с Adobe Creative Suite.",
                    "description_en": "Developing graphic design for advertising and print materials. Experience with Adobe Creative Suite required.",
                    "requirements_uz": "Adobe Photoshop, Illustrator, InDesign. Kamida 2 yil tajriba. Portfolio talab qilinadi.",
                    "requirements_ru": "Adobe Photoshop, Illustrator, InDesign. Минимум 2 года опыта. Требуется портфолио.",
                    "requirements_en": "Adobe Photoshop, Illustrator, InDesign. Minimum 2 years experience. Portfolio required.",
                    "salary": "5 000 000 - 8 000 000 UZS",
                    "location": "Toshkent",
                    "type": "full-time",
                    "status": "published",
                    "sort_order": 1,
                },
                {
                    "title_uz": "Bosma operator",
                    "title_ru": "Оператор печати",
                    "title_en": "Print Operator",
                    "description_uz": "Keng formatli printer operatori. Roland, Mimaki yoki shunga o'xshash uskunalar bilan ishlash tajribasi.",
                    "description_ru": "Оператор широкоформатного принтера. Опыт работы с Roland, Mimaki или аналогичным оборудованием.",
                    "description_en": "Wide format printer operator. Experience with Roland, Mimaki or similar equipment.",
                    "requirements_uz": "Keng formatli bosma tajribasi. Rang kalibrovkasi. Materiallar bilan ishlash ko'nikmasi.",
                    "requirements_ru": "Опыт широкоформатной печати. Калибровка цветов. Навыки работы с материалами.",
                    "requirements_en": "Wide format printing experience. Color calibration. Material handling skills.",
                    "salary": "4 000 000 - 6 000 000 UZS",
                    "location": "Toshkent",
                    "type": "full-time",
                    "status": "published",
                    "sort_order": 2,
                },
                {
                    "title_uz": "Montajchi",
                    "title_ru": "Монтажник",
                    "title_en": "Installation Technician",
                    "description_uz": "Tashqi reklama konstruksiyalarini o'rnatish. Balandlikda ishlash tajribasi talab qilinadi.",
                    "description_ru": "Установка конструкций наружной рекламы. Требуется опыт работы на высоте.",
                    "description_en": "Installation of outdoor advertising structures. High-altitude work experience required.",
                    "requirements_uz": "Balandlikda ishlash sertifikati. Jismoniy sog'lom. Jamoada ishlash.",
                    "requirements_ru": "Сертификат работы на высоте. Физическое здоровье. Командная работа.",
                    "requirements_en": "Height work certificate. Physical fitness. Teamwork.",
                    "salary": "4 500 000 - 7 000 000 UZS",
                    "location": "Toshkent",
                    "type": "full-time",
                    "status": "published",
                    "sort_order": 3,
                },
            ]
            for v in vacancies_data:
                db.add(Vacancy(**v))

        # Employees
        result = await db.execute(select(Employee).limit(1))
        if not result.scalar_one_or_none():
            employees_data = [
                {
                    "name_uz": "Abdulloh Rahimov",
                    "name_ru": "Абдуллох Рахимов",
                    "name_en": "Abdulloh Rahimov",
                    "position_uz": "Bosh direktor",
                    "position_ru": "Генеральный директор",
                    "position_en": "CEO",
                    "bio_uz": "10 yillik reklama sohasidagi tajriba. ImPrinta asoschisi.",
                    "bio_ru": "10 лет опыта в рекламной сфере. Основатель ImPrinta.",
                    "bio_en": "10 years of experience in advertising. Founder of ImPrinta.",
                    "sort_order": 1,
                },
                {
                    "name_uz": "Sardor Toshmatov",
                    "name_ru": "Сардор Тошматов",
                    "name_en": "Sardor Toshmatov",
                    "position_uz": "Ishlab chiqarish boshlig'i",
                    "position_ru": "Руководитель производства",
                    "position_en": "Production Manager",
                    "bio_uz": "Keng formatli bosma bo'yicha mutaxassis. 7 yillik tajriba.",
                    "bio_ru": "Специалист по широкоформатной печати. 7 лет опыта.",
                    "bio_en": "Wide format printing specialist. 7 years of experience.",
                    "sort_order": 2,
                },
                {
                    "name_uz": "Nodira Karimova",
                    "name_ru": "Нодира Каримова",
                    "name_en": "Nodira Karimova",
                    "position_uz": "Kreativ direktor",
                    "position_ru": "Креативный директор",
                    "position_en": "Creative Director",
                    "bio_uz": "Brending va dizayn bo'yicha mutaxassis. 100+ loyiha portfolio.",
                    "bio_ru": "Специалист по брендингу и дизайну. Портфолио 100+ проектов.",
                    "bio_en": "Branding and design specialist. Portfolio of 100+ projects.",
                    "sort_order": 3,
                },
                {
                    "name_uz": "Javohir Aliyev",
                    "name_ru": "Жавохир Алиев",
                    "name_en": "Javohir Aliyev",
                    "position_uz": "Sotuvlar menejeri",
                    "position_ru": "Менеджер по продажам",
                    "position_en": "Sales Manager",
                    "bio_uz": "Korporativ mijozlar bilan ishlash. B2B sotuv tajribasi.",
                    "bio_ru": "Работа с корпоративными клиентами. Опыт B2B продаж.",
                    "bio_en": "Working with corporate clients. B2B sales experience.",
                    "sort_order": 4,
                },
            ]
            for e in employees_data:
                db.add(Employee(**e))

        # Certificates
        result = await db.execute(select(Certificate).limit(1))
        if not result.scalar_one_or_none():
            certificates_data = [
                {
                    "title_uz": "ISO 9001:2015 Sifat menejmenti",
                    "title_ru": "ISO 9001:2015 Менеджмент качества",
                    "title_en": "ISO 9001:2015 Quality Management",
                    "issued_by": "SGS International",
                    "year": 2023,
                    "sort_order": 1,
                },
                {
                    "title_uz": "Roland Authorized Partner",
                    "title_ru": "Roland Authorized Partner",
                    "title_en": "Roland Authorized Partner",
                    "issued_by": "Roland DG Corporation",
                    "year": 2024,
                    "sort_order": 2,
                },
                {
                    "title_uz": "Eng yaxshi reklama agentligi 2023",
                    "title_ru": "Лучшее рекламное агентство 2023",
                    "title_en": "Best Advertising Agency 2023",
                    "issued_by": "Uzbekistan Advertising Association",
                    "year": 2023,
                    "sort_order": 3,
                },
            ]
            for cert in certificates_data:
                db.add(Certificate(**cert))

        # Site Settings
        result = await db.execute(select(SiteSettings).limit(1))
        if not result.scalar_one_or_none():
            default_settings = [
                {"key": "company_name", "value": "ImPrinta", "group": "general"},
                {"key": "company_phone", "value": "+998 90 123 45 67", "group": "contact"},
                {"key": "company_email", "value": "info@imprinta.uz", "group": "contact"},
                {"key": "company_address_uz", "value": "Toshkent shahri, Chilonzor tumani, Bunyodkor ko'chasi 42", "group": "contact"},
                {"key": "company_address_ru", "value": "г. Ташкент, Чиланзарский район, ул. Бунёдкор 42", "group": "contact"},
                {"key": "company_address_en", "value": "42 Bunyodkor street, Chilanzar district, Tashkent", "group": "contact"},
                {"key": "telegram", "value": "https://t.me/imprinta_uz", "group": "social"},
                {"key": "instagram", "value": "https://instagram.com/imprinta.uz", "group": "social"},
                {"key": "facebook", "value": "https://facebook.com/imprinta.uz", "group": "social"},
                {"key": "youtube", "value": "https://youtube.com/@imprinta", "group": "social"},
                {"key": "hero_title_uz", "value": "Professional reklama va bosma xizmatlari", "group": "hero"},
                {"key": "hero_title_ru", "value": "Профессиональные рекламные и полиграфические услуги", "group": "hero"},
                {"key": "hero_title_en", "value": "Professional Advertising & Printing Services", "group": "hero"},
                {"key": "hero_subtitle_uz", "value": "Bilbordlar, bannerlar, poligrafiya, brending va tashqi reklama — barchasi bir joyda. Zamonaviy uskunalar va tajribali jamoa.", "group": "hero"},
                {"key": "hero_subtitle_ru", "value": "Билборды, баннеры, полиграфия, брендинг и наружная реклама — всё в одном месте. Современное оборудование и опытная команда.", "group": "hero"},
                {"key": "hero_subtitle_en", "value": "Billboards, banners, polygraphy, branding and outdoor advertising — all in one place. Modern equipment and experienced team.", "group": "hero"},
                {"key": "stats_projects", "value": "1200+", "group": "stats"},
                {"key": "stats_clients", "value": "150+", "group": "stats"},
                {"key": "stats_experience", "value": "7+", "group": "stats"},
                {"key": "stats_equipment", "value": "35+", "group": "stats"},
                {"key": "google_maps", "value": "https://maps.google.com/maps?q=41.2995,69.2401&z=15&output=embed", "group": "contact"},
                {"key": "working_hours", "value": "Dush-Shan: 09:00 - 18:00", "group": "contact"},
                {"key": "working_hours_ru", "value": "Пн-Сб: 09:00 - 18:00", "group": "contact"},
                {"key": "working_hours_en", "value": "Mon-Sat: 09:00 - 18:00", "group": "contact"},
            ]
            for s in default_settings:
                db.add(SiteSettings(**s))

        # SEO Meta
        result = await db.execute(select(SeoMeta).limit(1))
        if not result.scalar_one_or_none():
            seo_data = [
                {
                    "page": "home",
                    "title_uz": "ImPrinta — Professional reklama va bosma xizmatlari Toshkentda",
                    "title_ru": "ImPrinta — Профессиональные рекламные и полиграфические услуги в Ташкенте",
                    "title_en": "ImPrinta — Professional Advertising & Printing Services in Tashkent",
                    "description_uz": "Bilbordlar, bannerlar, poligrafiya, brending, 3D reklama va montaj xizmatlari. 7 yillik tajriba, 1200+ loyiha, 150+ mijoz.",
                    "description_ru": "Билборды, баннеры, полиграфия, брендинг, 3D реклама и монтажные услуги. 7 лет опыта, 1200+ проектов, 150+ клиентов.",
                    "description_en": "Billboards, banners, polygraphy, branding, 3D advertising and installation services. 7 years experience, 1200+ projects, 150+ clients.",
                    "keywords": "imprinta, reklama, bosma, printing, billboard, banner, tashkent, uzbekistan, poligrafiya, brending",
                },
                {
                    "page": "services",
                    "title_uz": "Xizmatlar — ImPrinta",
                    "title_ru": "Услуги — ImPrinta",
                    "title_en": "Services — ImPrinta",
                    "description_uz": "Keng formatli bosma, tashqi reklama, poligrafiya, brending, 3D reklama va montaj xizmatlari.",
                    "description_ru": "Широкоформатная печать, наружная реклама, полиграфия, брендинг, 3D реклама и монтаж.",
                    "description_en": "Wide format printing, outdoor advertising, polygraphy, branding, 3D advertising and installation.",
                    "keywords": "printing services, reklama xizmatlari, outdoor advertising, billboard, banner",
                },
                {
                    "page": "portfolio",
                    "title_uz": "Portfolio — ImPrinta",
                    "title_ru": "Портфолио — ImPrinta",
                    "title_en": "Portfolio — ImPrinta",
                    "description_uz": "Bizning ishlarimiz: bilbordlar, bannerlar, brending loyihalar va boshqa reklama mahsulotlari.",
                    "description_ru": "Наши работы: билборды, баннеры, проекты брендинга и другая рекламная продукция.",
                    "description_en": "Our work: billboards, banners, branding projects and other advertising products.",
                    "keywords": "portfolio, reklama, billboard, banner, branding",
                },
                {
                    "page": "contact",
                    "title_uz": "Bog'lanish — ImPrinta",
                    "title_ru": "Контакты — ImPrinta",
                    "title_en": "Contact — ImPrinta",
                    "description_uz": "Biz bilan bog'laning: telefon, telegram, email yoki ofisimizga tashrif buyuring.",
                    "description_ru": "Свяжитесь с нами: телефон, Telegram, email или посетите наш офис.",
                    "description_en": "Contact us: phone, Telegram, email or visit our office.",
                    "keywords": "contact, imprinta, tashkent, reklama",
                },
            ]
            for s in seo_data:
                db.add(SeoMeta(**s))

        await db.commit()
        print("Seed data created successfully! All advertising-related content loaded.")


if __name__ == "__main__":
    asyncio.run(seed())
