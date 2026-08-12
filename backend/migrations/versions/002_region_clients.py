"""Add region_clients table

Revision ID: 002
Revises: 001
Create Date: 2026-08-13

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision: str = '002'
down_revision: Union[str, None] = '001'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('region_clients',
        sa.Column('id', UUID(as_uuid=True), primary_key=True),
        sa.Column('region_id', sa.String(50), nullable=False, index=True),
        sa.Column('client_id', UUID(as_uuid=True), sa.ForeignKey('clients.id'), nullable=False),
        sa.Column('description_uz', sa.Text(), nullable=True),
        sa.Column('description_ru', sa.Text(), nullable=True),
        sa.Column('description_en', sa.Text(), nullable=True),
        sa.Column('image', sa.String(500), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True)),
        sa.Column('updated_at', sa.DateTime(timezone=True)),
        sa.Column('is_deleted', sa.Boolean(), default=False),
        sa.Column('sort_order', sa.Integer(), default=0),
        sa.Column('is_visible', sa.Boolean(), default=True),
    )


def downgrade() -> None:
    op.drop_table('region_clients')
