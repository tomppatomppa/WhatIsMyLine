"""Initial migration.

Revision ID: 50f898ec3e9c
Revises: 
Create Date: 2024-04-21 14:57:41.596836

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '50f898ec3e9c'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('scripts',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('script_id', sa.String(), nullable=False),
    sa.Column('filename', sa.String(), nullable=False),
    sa.Column('user_id', sa.String(), nullable=False),
    sa.Column('scenes', sa.PickleType(), nullable=True),
    sa.Column('created_on', sa.DateTime(), nullable=False),
    sa.Column('modified_on', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('script_id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.String(), nullable=False),
    sa.Column('picture', sa.String(), nullable=True),
    sa.Column('provider', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('registered_on', sa.DateTime(), nullable=False),
    sa.Column('refresh_token', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('picture'),
    sa.UniqueConstraint('user_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('users')
    op.drop_table('scripts')
    # ### end Alembic commands ###