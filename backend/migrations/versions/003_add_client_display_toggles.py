"""Add show_text and show_logo to clients

Revision ID: 003
Revises: 002
Create Date: 2026-08-15

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '003'
down_revision: Union[str, None] = '002'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('clients', sa.Column('show_text', sa.Boolean(), server_default=sa.text('true'), nullable=False))
    op.add_column('clients', sa.Column('show_logo', sa.Boolean(), server_default=sa.text('true'), nullable=False))


def downgrade() -> None:
    op.drop_column('clients', 'show_logo')
    op.drop_column('clients', 'show_text')
