import uuid

import pytest

from app.models.content import (
    Service, Category, Portfolio, Client, Testimonial,
    FAQ, News, Vacancy, Employee, Certificate, Gallery,
    ContactMessage, SiteSettings, SeoMeta
)
from app.models.user import User
from app.models.base import BaseModel


class TestBaseModel:
    def test_base_model_is_abstract(self):
        assert BaseModel.__abstract__ is True

    def test_base_model_has_required_columns(self):
        columns = [c.name for c in BaseModel.__table__.columns] if hasattr(BaseModel, '__table__') else []
        assert hasattr(BaseModel, 'id')
        assert hasattr(BaseModel, 'created_at')
        assert hasattr(BaseModel, 'updated_at')
        assert hasattr(BaseModel, 'is_deleted')
        assert hasattr(BaseModel, 'sort_order')
        assert hasattr(BaseModel, 'is_visible')


class TestUserModel:
    def test_user_tablename(self):
        assert User.__tablename__ == "users"

    def test_user_has_required_fields(self):
        assert hasattr(User, 'username')
        assert hasattr(User, 'email')
        assert hasattr(User, 'hashed_password')
        assert hasattr(User, 'full_name')
        assert hasattr(User, 'role')
        assert hasattr(User, 'is_active')


class TestServiceModel:
    def test_service_tablename(self):
        assert Service.__tablename__ == "services"

    def test_service_has_multilingual_fields(self):
        assert hasattr(Service, 'title_uz')
        assert hasattr(Service, 'title_ru')
        assert hasattr(Service, 'title_en')
        assert hasattr(Service, 'description_uz')
        assert hasattr(Service, 'description_ru')
        assert hasattr(Service, 'description_en')

    def test_service_has_slug(self):
        assert hasattr(Service, 'slug')

    def test_service_has_featured_flag(self):
        assert hasattr(Service, 'is_featured')


class TestCategoryModel:
    def test_category_tablename(self):
        assert Category.__tablename__ == "categories"

    def test_category_has_multilingual_names(self):
        assert hasattr(Category, 'name_uz')
        assert hasattr(Category, 'name_ru')
        assert hasattr(Category, 'name_en')

    def test_category_has_type(self):
        assert hasattr(Category, 'type')


class TestPortfolioModel:
    def test_portfolio_tablename(self):
        assert Portfolio.__tablename__ == "portfolio"

    def test_portfolio_has_multilingual_fields(self):
        assert hasattr(Portfolio, 'title_uz')
        assert hasattr(Portfolio, 'title_ru')
        assert hasattr(Portfolio, 'title_en')

    def test_portfolio_has_images(self):
        assert hasattr(Portfolio, 'image')
        assert hasattr(Portfolio, 'images')

    def test_portfolio_has_category_relation(self):
        assert hasattr(Portfolio, 'category_id')

    def test_portfolio_has_status(self):
        assert hasattr(Portfolio, 'status')


class TestClientModel:
    def test_client_tablename(self):
        assert Client.__tablename__ == "clients"

    def test_client_has_required_fields(self):
        assert hasattr(Client, 'name')
        assert hasattr(Client, 'logo')
        assert hasattr(Client, 'website')
        assert hasattr(Client, 'is_partner')


class TestTestimonialModel:
    def test_testimonial_tablename(self):
        assert Testimonial.__tablename__ == "testimonials"

    def test_testimonial_has_author_fields(self):
        assert hasattr(Testimonial, 'author_name')
        assert hasattr(Testimonial, 'author_position')
        assert hasattr(Testimonial, 'author_company')
        assert hasattr(Testimonial, 'author_image')

    def test_testimonial_has_multilingual_content(self):
        assert hasattr(Testimonial, 'content_uz')
        assert hasattr(Testimonial, 'content_ru')
        assert hasattr(Testimonial, 'content_en')

    def test_testimonial_has_rating(self):
        assert hasattr(Testimonial, 'rating')


class TestFAQModel:
    def test_faq_tablename(self):
        assert FAQ.__tablename__ == "faqs"

    def test_faq_has_multilingual_fields(self):
        assert hasattr(FAQ, 'question_uz')
        assert hasattr(FAQ, 'question_ru')
        assert hasattr(FAQ, 'question_en')
        assert hasattr(FAQ, 'answer_uz')
        assert hasattr(FAQ, 'answer_ru')
        assert hasattr(FAQ, 'answer_en')


class TestNewsModel:
    def test_news_tablename(self):
        assert News.__tablename__ == "news"

    def test_news_has_multilingual_fields(self):
        assert hasattr(News, 'title_uz')
        assert hasattr(News, 'title_ru')
        assert hasattr(News, 'title_en')
        assert hasattr(News, 'content_uz')
        assert hasattr(News, 'content_ru')
        assert hasattr(News, 'content_en')

    def test_news_has_views(self):
        assert hasattr(News, 'views')

    def test_news_has_status(self):
        assert hasattr(News, 'status')


class TestVacancyModel:
    def test_vacancy_tablename(self):
        assert Vacancy.__tablename__ == "vacancies"

    def test_vacancy_has_multilingual_fields(self):
        assert hasattr(Vacancy, 'title_uz')
        assert hasattr(Vacancy, 'title_ru')
        assert hasattr(Vacancy, 'title_en')
        assert hasattr(Vacancy, 'description_uz')
        assert hasattr(Vacancy, 'requirements_uz')

    def test_vacancy_has_job_details(self):
        assert hasattr(Vacancy, 'salary')
        assert hasattr(Vacancy, 'location')
        assert hasattr(Vacancy, 'type')


class TestEmployeeModel:
    def test_employee_tablename(self):
        assert Employee.__tablename__ == "employees"

    def test_employee_has_multilingual_names(self):
        assert hasattr(Employee, 'name_uz')
        assert hasattr(Employee, 'name_ru')
        assert hasattr(Employee, 'name_en')

    def test_employee_has_position(self):
        assert hasattr(Employee, 'position_uz')
        assert hasattr(Employee, 'position_ru')
        assert hasattr(Employee, 'position_en')


class TestCertificateModel:
    def test_certificate_tablename(self):
        assert Certificate.__tablename__ == "certificates"

    def test_certificate_has_required_fields(self):
        assert hasattr(Certificate, 'title_uz')
        assert hasattr(Certificate, 'title_ru')
        assert hasattr(Certificate, 'title_en')
        assert hasattr(Certificate, 'image')
        assert hasattr(Certificate, 'issued_by')
        assert hasattr(Certificate, 'year')


class TestGalleryModel:
    def test_gallery_tablename(self):
        assert Gallery.__tablename__ == "gallery"

    def test_gallery_has_required_fields(self):
        assert hasattr(Gallery, 'title_uz')
        assert hasattr(Gallery, 'image')
        assert hasattr(Gallery, 'category')


class TestContactMessageModel:
    def test_contact_message_tablename(self):
        assert ContactMessage.__tablename__ == "contact_messages"

    def test_contact_message_has_fields(self):
        assert hasattr(ContactMessage, 'name')
        assert hasattr(ContactMessage, 'phone')
        assert hasattr(ContactMessage, 'email')
        assert hasattr(ContactMessage, 'company')
        assert hasattr(ContactMessage, 'service')
        assert hasattr(ContactMessage, 'message')
        assert hasattr(ContactMessage, 'is_read')
        assert hasattr(ContactMessage, 'status')


class TestSiteSettingsModel:
    def test_site_settings_tablename(self):
        assert SiteSettings.__tablename__ == "site_settings"

    def test_site_settings_has_fields(self):
        assert hasattr(SiteSettings, 'key')
        assert hasattr(SiteSettings, 'value')
        assert hasattr(SiteSettings, 'type')
        assert hasattr(SiteSettings, 'group')


class TestSeoMetaModel:
    def test_seo_meta_tablename(self):
        assert SeoMeta.__tablename__ == "seo_meta"

    def test_seo_meta_has_multilingual_fields(self):
        assert hasattr(SeoMeta, 'page')
        assert hasattr(SeoMeta, 'title_uz')
        assert hasattr(SeoMeta, 'title_ru')
        assert hasattr(SeoMeta, 'title_en')
        assert hasattr(SeoMeta, 'description_uz')
        assert hasattr(SeoMeta, 'keywords')
        assert hasattr(SeoMeta, 'og_image')
