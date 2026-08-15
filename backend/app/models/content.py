from sqlalchemy import Column, String, Text, Boolean, Integer, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class Service(BaseModel):
    __tablename__ = "services"

    title_uz = Column(String(500), nullable=False)
    title_ru = Column(String(500), nullable=False)
    title_en = Column(String(500), nullable=False)
    description_uz = Column(Text, nullable=True)
    description_ru = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)
    icon = Column(String(100), nullable=True)
    image = Column(String(500), nullable=True)
    slug = Column(String(500), unique=True, nullable=False, index=True)
    is_featured = Column(Boolean, default=False)


class Category(BaseModel):
    __tablename__ = "categories"

    name_uz = Column(String(255), nullable=False)
    name_ru = Column(String(255), nullable=False)
    name_en = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    type = Column(String(50), default="portfolio")


class Portfolio(BaseModel):
    __tablename__ = "portfolio"

    title_uz = Column(String(500), nullable=False)
    title_ru = Column(String(500), nullable=False)
    title_en = Column(String(500), nullable=False)
    description_uz = Column(Text, nullable=True)
    description_ru = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)
    image = Column(String(500), nullable=True)
    images = Column(JSON, default=list)
    category_id = Column(UUID(as_uuid=True), nullable=True)
    client = Column(String(255), nullable=True)
    slug = Column(String(500), unique=True, nullable=False, index=True)
    is_featured = Column(Boolean, default=False)
    status = Column(String(20), default="published")


class Client(BaseModel):
    __tablename__ = "clients"

    name = Column(String(255), nullable=False)
    logo = Column(String(500), nullable=True)
    website = Column(String(500), nullable=True)
    is_partner = Column(Boolean, default=False)
    show_text = Column(Boolean, default=True)
    show_logo = Column(Boolean, default=True)


class Testimonial(BaseModel):
    __tablename__ = "testimonials"

    author_name = Column(String(255), nullable=False)
    author_position = Column(String(255), nullable=True)
    author_company = Column(String(255), nullable=True)
    author_image = Column(String(500), nullable=True)
    content_uz = Column(Text, nullable=False)
    content_ru = Column(Text, nullable=False)
    content_en = Column(Text, nullable=False)
    rating = Column(Integer, default=5)


class FAQ(BaseModel):
    __tablename__ = "faqs"

    question_uz = Column(Text, nullable=False)
    question_ru = Column(Text, nullable=False)
    question_en = Column(Text, nullable=False)
    answer_uz = Column(Text, nullable=False)
    answer_ru = Column(Text, nullable=False)
    answer_en = Column(Text, nullable=False)
    category = Column(String(100), nullable=True)


class News(BaseModel):
    __tablename__ = "news"

    title_uz = Column(String(500), nullable=False)
    title_ru = Column(String(500), nullable=False)
    title_en = Column(String(500), nullable=False)
    content_uz = Column(Text, nullable=True)
    content_ru = Column(Text, nullable=True)
    content_en = Column(Text, nullable=True)
    excerpt_uz = Column(Text, nullable=True)
    excerpt_ru = Column(Text, nullable=True)
    excerpt_en = Column(Text, nullable=True)
    image = Column(String(500), nullable=True)
    slug = Column(String(500), unique=True, nullable=False, index=True)
    status = Column(String(20), default="published")
    views = Column(Integer, default=0)


class Vacancy(BaseModel):
    __tablename__ = "vacancies"

    title_uz = Column(String(500), nullable=False)
    title_ru = Column(String(500), nullable=False)
    title_en = Column(String(500), nullable=False)
    description_uz = Column(Text, nullable=True)
    description_ru = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)
    requirements_uz = Column(Text, nullable=True)
    requirements_ru = Column(Text, nullable=True)
    requirements_en = Column(Text, nullable=True)
    salary = Column(String(100), nullable=True)
    location = Column(String(255), nullable=True)
    type = Column(String(50), default="full-time")
    status = Column(String(20), default="published")


class Employee(BaseModel):
    __tablename__ = "employees"

    name_uz = Column(String(255), nullable=False)
    name_ru = Column(String(255), nullable=False)
    name_en = Column(String(255), nullable=False)
    position_uz = Column(String(255), nullable=True)
    position_ru = Column(String(255), nullable=True)
    position_en = Column(String(255), nullable=True)
    image = Column(String(500), nullable=True)
    bio_uz = Column(Text, nullable=True)
    bio_ru = Column(Text, nullable=True)
    bio_en = Column(Text, nullable=True)


class Certificate(BaseModel):
    __tablename__ = "certificates"

    title_uz = Column(String(500), nullable=False)
    title_ru = Column(String(500), nullable=False)
    title_en = Column(String(500), nullable=False)
    image = Column(String(500), nullable=True)
    issued_by = Column(String(255), nullable=True)
    year = Column(Integer, nullable=True)


class Gallery(BaseModel):
    __tablename__ = "gallery"

    title_uz = Column(String(500), nullable=True)
    title_ru = Column(String(500), nullable=True)
    title_en = Column(String(500), nullable=True)
    image = Column(String(500), nullable=False)
    category = Column(String(100), nullable=True)


class ContactMessage(BaseModel):
    __tablename__ = "contact_messages"

    name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    email = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    service = Column(String(255), nullable=True)
    message = Column(Text, nullable=True)
    attachment = Column(String(500), nullable=True)
    is_read = Column(Boolean, default=False)
    status = Column(String(20), default="new")


class RegionClient(BaseModel):
    __tablename__ = "region_clients"

    region_id = Column(String(50), nullable=False, index=True)
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=False)
    description_uz = Column(Text, nullable=True)
    description_ru = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)
    image = Column(String(500), nullable=True)

    client = relationship("Client", lazy="joined")


class SiteSettings(BaseModel):
    __tablename__ = "site_settings"

    key = Column(String(255), unique=True, nullable=False, index=True)
    value = Column(JSON, nullable=True)
    type = Column(String(50), default="text")
    group = Column(String(100), default="general")


class SeoMeta(BaseModel):
    __tablename__ = "seo_meta"

    page = Column(String(255), unique=True, nullable=False, index=True)
    title_uz = Column(String(500), nullable=True)
    title_ru = Column(String(500), nullable=True)
    title_en = Column(String(500), nullable=True)
    description_uz = Column(Text, nullable=True)
    description_ru = Column(Text, nullable=True)
    description_en = Column(Text, nullable=True)
    keywords = Column(Text, nullable=True)
    og_image = Column(String(500), nullable=True)
