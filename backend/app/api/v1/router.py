from fastapi import APIRouter

from app.api.v1.endpoints import auth, services, portfolio, clients, testimonials, faq, news, vacancies, employees, certificates, gallery, contact, settings, seo, upload, categories, region_clients

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(services.router, prefix="/services", tags=["Services"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
api_router.include_router(portfolio.router, prefix="/portfolio", tags=["Portfolio"])
api_router.include_router(clients.router, prefix="/clients", tags=["Clients"])
api_router.include_router(region_clients.router, prefix="/region-clients", tags=["Region Clients"])
api_router.include_router(testimonials.router, prefix="/testimonials", tags=["Testimonials"])
api_router.include_router(faq.router, prefix="/faq", tags=["FAQ"])
api_router.include_router(news.router, prefix="/news", tags=["News"])
api_router.include_router(vacancies.router, prefix="/vacancies", tags=["Vacancies"])
api_router.include_router(employees.router, prefix="/employees", tags=["Employees"])
api_router.include_router(certificates.router, prefix="/certificates", tags=["Certificates"])
api_router.include_router(gallery.router, prefix="/gallery", tags=["Gallery"])
api_router.include_router(contact.router, prefix="/contact", tags=["Contact"])
api_router.include_router(settings.router, prefix="/settings", tags=["Settings"])
api_router.include_router(seo.router, prefix="/seo", tags=["SEO"])
api_router.include_router(upload.router, prefix="/upload", tags=["Upload"])
