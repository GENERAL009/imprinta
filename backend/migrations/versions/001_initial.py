"""Initial migration

Revision ID: 001
Revises:
Create Date: 2024-01-01

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision: str = '001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('users',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('username', sa.String(100), unique=True, nullable=False),
        sa.Column('email', sa.String(255), unique=True, nullable=True),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=True),
        sa.Column('role', sa.String(50), default='admin'),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('created_at', sa.DateTime(timezone=True)),
        sa.Column('updated_at', sa.DateTime(timezone=True)),
        sa.Column('is_deleted', sa.Boolean(), default=False),
        sa.Column('sort_order', sa.Integer(), default=0),
        sa.Column('is_visible', sa.Boolean(), default=True),
    )

    op.create_table('services',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('title_uz', sa.String(500), nullable=False),
        sa.Column('title_ru', sa.String(500), nullable=False),
        sa.Column('title_en', sa.String(500), nullable=False),
        sa.Column('description_uz', sa.Text(), nullable=True),
        sa.Column('description_ru', sa.Text(), nullable=True),
        sa.Column('description_en', sa.Text(), nullable=True),
        sa.Column('icon', sa.String(100), nullable=True),
        sa.Column('image', sa.String(500), nullable=True),
        sa.Column('slug', sa.String(500), unique=True, nullable=False),
        sa.Column('is_featured', sa.Boolean(), default=False),
        sa.Column('created_at', sa.DateTime(timezone=True)),
        sa.Column('updated_at', sa.DateTime(timezone=True)),
        sa.Column('is_deleted', sa.Boolean(), default=False),
        sa.Column('sort_order', sa.Integer(), default=0),
        sa.Column('is_visible', sa.Boolean(), default=True),
    )

    op.create_table('categories',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('name_uz', sa.String(255), nullable=False),
        sa.Column('name_ru', sa.String(255), nullable=False),
        sa.Column('name_en', sa.String(255), nullable=False),
        sa.Column('slug', sa.String(255), unique=True, nullable=False),
        sa.Column('type', sa.String(50), default='portfolio'),
        sa.Column('created_at', sa.DateTime(timezone=True)),
        sa.Column('updated_at', sa.DateTime(timezone=True)),
        sa.Column('is_deleted', sa.Boolean(), default=False),
        sa.Column('sort_order', sa.Integer(), default=0),
        sa.Column('is_visible', sa.Boolean(), default=True),
    )

    op.create_table('portfolio',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('title_uz', sa.String(500), nullable=False),
        sa.Column('title_ru', sa.String(500), nullable=False),
        sa.Column('title_en', sa.String(500), nullable=False),
        sa.Column('description_uz', sa.Text(), nullable=True),
        sa.Column('description_ru', sa.Text(), nullable=True),
        sa.Column('description_en', sa.Text(), nullable=True),
        sa.Column('image', sa.String(500), nullable=True),
        sa.Column('images', sa.JSON(), default=[]),
        sa.Column('category_id', UUID(as_uuid=True), nullable=True),
        sa.Column('client', sa.String(255), nullable=True),
        sa.Column('slug', sa.String(500), unique=True, nullable=False),
        sa.Column('is_featured', sa.Boolean(), default=False),
        sa.Column('status', sa.String(20), default='published'),
        sa.Column('created_at', sa.DateTime(timezone=True)),
        sa.Column('updated_at', sa.DateTime(timezone=True)),
        sa.Column('is_deleted', sa.Boolean(), default=False),
        sa.Column('sort_order', sa.Integer(), default=0),
        sa.Column('is_visible', sa.Boolean(), default=True),
    )

    op.create_table('clients',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('logo', sa.String(500), nullable=True),
        sa.Column('website', sa.String(500), nullable=True),
        sa.Column('is_partner', sa.Boolean(), default=False),
        sa.Column('created_at', sa.DateTime(timezone=True)),
        sa.Column('updated_at', sa.DateTime(timezone=True)),
        sa.Column('is_deleted', sa.Boolean(), default=False),
        sa.Column('sort_order', sa.Integer(), default=0),
        sa.Column('is_visible', sa.Boolean(), default=True),
    )

    op.create_table('testimonials',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('author_name', sa.String(255), nullable=False),
        sa.Column('author_position', sa.String(255), nullable=True),
        sa.Column('author_company', sa.String(255), nullable=True),
        sa.Column('author_image', sa.String(500), nullable=True),
        sa.Column('content_uz', sa.Text(), nullable=False),
        sa.Column('content_ru', sa.Text(), nullable=False),
        sa.Column('content_en', sa.Text(), nullable=False),
        sa.Column('rating', sa.Integer(), default=5),
        sa.Column('created_at', sa.DateTime(timezone=True)),
        sa.Column('updated_at', sa.DateTime(timezone=True)),
        sa.Column('is_deleted', sa.Boolean(), default=False),
        sa.Column('sort_order', sa.Integer(), default=0),
        sa.Column('is_visible', sa.Boolean(), default=True),
    )

    op.create_table('faqs',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('question_uz', sa.Text(), nullable=False),
        sa.Column('question_ru', sa.Text(), nullable=False),
        sa.Column('question_en', sa.Text(), nullable=False),
        sa.Column('answer_uz', sa.Text(), nullable=False),
        sa.Column('answer_ru', sa.Text(), nullable=False),
        sa.Column('answer_en', sa.Text(), nullable=False),
        sa.Column('category', sa.String(100), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True)),
        sa.Column('updated_at', sa.DateTime(timezone=True)),
        sa.Column('is_deleted', sa.Boolean(), default=False),
        sa.Column('sort_order', sa.Integer(), default=0),
        sa.Column('is_visible', sa.Boolean(), default=True),
    )

    op.create_table('news',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('title_uz', sa.String(500), nullable=False),
        sa.Column('title_ru', sa.String(500), nullable=False),
        sa.Column('title_en', sa.String(500), nullable=False),
        sa.Column('content_uz', sa.Text(), nullable=True),
        sa.Column('content_ru', sa.Text(), nullable=True),
        sa.Column('content_en', sa.Text(), nullable=True),
        sa.Column('excerpt_uz', sa.Text(), nullable=True),
        sa.Column('excerpt_ru', sa.Text(), nullable=True),
        sa.Column('excerpt_en', sa.Text(), nullable=True),
        sa.Column('image', sa.String(500), nullable=True),
        sa.Column('slug', sa.String(500), unique=True, nullable=False),
        sa.Column('status', sa.String(20), default='published'),
        sa.Column('views', sa.Integer(), default=0),
        sa.Column('created_at', sa.DateTime(timezone=True)),
        sa.Column('updated_at', sa.DateTime(timezone=True)),
        sa.Column('is_deleted', sa.Boolean(), default=False),
        sa.Column('sort_order', sa.Integer(), default=0),
        sa.Column('is_visible', sa.Boolean(), default=True),
    )

    op.create_table('vacancies',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('title_uz', sa.String(500), nullable=False),
        sa.Column('title_ru', sa.String(500), nullable=False),
        sa.Column('title_en', sa.String(500), nullable=False),
        sa.Column('description_uz', sa.Text(), nullable=True),
        sa.Column('description_ru', sa.Text(), nullable=True),
        sa.Column('description_en', sa.Text(), nullable=True),
        sa.Column('requirements_uz', sa.Text(), nullable=True),
        sa.Column('requirements_ru', sa.Text(), nullable=True),
        sa.Column('requirements_en', sa.Text(), nullable=True),
        sa.Column('salary', sa.String(100), nullable=True),
        sa.Column('location', sa.String(255), nullable=True),
        sa.Column('type', sa.String(50), default='full-time'),
        sa.Column('status', sa.String(20), default='published'),
        sa.Column('created_at', sa.DateTime(timezone=True)),
        sa.Column('updated_at', sa.DateTime(timezone=True)),
        sa.Column('is_deleted', sa.Boolean(), default=False),
        sa.Column('sort_order', sa.Integer(), default=0),
        sa.Column('is_visible', sa.Boolean(), default=True),
    )

    op.create_table('employees',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('name_uz', sa.String(255), nullable=False),
        sa.Column('name_ru', sa.String(255), nullable=False),
        sa.Column('name_en', sa.String(255), nullable=False),
        sa.Column('position_uz', sa.String(255), nullable=True),
        sa.Column('position_ru', sa.String(255), nullable=True),
        sa.Column('position_en', sa.String(255), nullable=True),
        sa.Column('image', sa.String(500), nullable=True),
        sa.Column('bio_uz', sa.Text(), nullable=True),
        sa.Column('bio_ru', sa.Text(), nullable=True),
        sa.Column('bio_en', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True)),
        sa.Column('updated_at', sa.DateTime(timezone=True)),
        sa.Column('is_deleted', sa.Boolean(), default=False),
        sa.Column('sort_order', sa.Integer(), default=0),
        sa.Column('is_visible', sa.Boolean(), default=True),
    )

    op.create_table('certificates',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('title_uz', sa.String(500), nullable=False),
        sa.Column('title_ru', sa.String(500), nullable=False),
        sa.Column('title_en', sa.String(500), nullable=False),
        sa.Column('image', sa.String(500), nullable=True),
        sa.Column('issued_by', sa.String(255), nullable=True),
        sa.Column('year', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True)),
        sa.Column('updated_at', sa.DateTime(timezone=True)),
        sa.Column('is_deleted', sa.Boolean(), default=False),
        sa.Column('sort_order', sa.Integer(), default=0),
        sa.Column('is_visible', sa.Boolean(), default=True),
    )

    op.create_table('gallery',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('title_uz', sa.String(500), nullable=True),
        sa.Column('title_ru', sa.String(500), nullable=True),
        sa.Column('title_en', sa.String(500), nullable=True),
        sa.Column('image', sa.String(500), nullable=False),
        sa.Column('category', sa.String(100), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True)),
        sa.Column('updated_at', sa.DateTime(timezone=True)),
        sa.Column('is_deleted', sa.Boolean(), default=False),
        sa.Column('sort_order', sa.Integer(), default=0),
        sa.Column('is_visible', sa.Boolean(), default=True),
    )

    op.create_table('contact_messages',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('phone', sa.String(50), nullable=False),
        sa.Column('email', sa.String(255), nullable=True),
        sa.Column('company', sa.String(255), nullable=True),
        sa.Column('service', sa.String(255), nullable=True),
        sa.Column('message', sa.Text(), nullable=True),
        sa.Column('attachment', sa.String(500), nullable=True),
        sa.Column('is_read', sa.Boolean(), default=False),
        sa.Column('status', sa.String(20), default='new'),
        sa.Column('created_at', sa.DateTime(timezone=True)),
        sa.Column('updated_at', sa.DateTime(timezone=True)),
        sa.Column('is_deleted', sa.Boolean(), default=False),
        sa.Column('sort_order', sa.Integer(), default=0),
        sa.Column('is_visible', sa.Boolean(), default=True),
    )

    op.create_table('site_settings',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('key', sa.String(255), unique=True, nullable=False),
        sa.Column('value', sa.JSON(), nullable=True),
        sa.Column('type', sa.String(50), default='text'),
        sa.Column('group', sa.String(100), default='general'),
        sa.Column('created_at', sa.DateTime(timezone=True)),
        sa.Column('updated_at', sa.DateTime(timezone=True)),
        sa.Column('is_deleted', sa.Boolean(), default=False),
        sa.Column('sort_order', sa.Integer(), default=0),
        sa.Column('is_visible', sa.Boolean(), default=True),
    )

    op.create_table('seo_meta',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('page', sa.String(255), unique=True, nullable=False),
        sa.Column('title_uz', sa.String(500), nullable=True),
        sa.Column('title_ru', sa.String(500), nullable=True),
        sa.Column('title_en', sa.String(500), nullable=True),
        sa.Column('description_uz', sa.Text(), nullable=True),
        sa.Column('description_ru', sa.Text(), nullable=True),
        sa.Column('description_en', sa.Text(), nullable=True),
        sa.Column('keywords', sa.Text(), nullable=True),
        sa.Column('og_image', sa.String(500), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True)),
        sa.Column('updated_at', sa.DateTime(timezone=True)),
        sa.Column('is_deleted', sa.Boolean(), default=False),
        sa.Column('sort_order', sa.Integer(), default=0),
        sa.Column('is_visible', sa.Boolean(), default=True),
    )


def downgrade() -> None:
    op.drop_table('seo_meta')
    op.drop_table('site_settings')
    op.drop_table('contact_messages')
    op.drop_table('gallery')
    op.drop_table('certificates')
    op.drop_table('employees')
    op.drop_table('vacancies')
    op.drop_table('news')
    op.drop_table('faqs')
    op.drop_table('testimonials')
    op.drop_table('clients')
    op.drop_table('portfolio')
    op.drop_table('categories')
    op.drop_table('services')
    op.drop_table('users')
