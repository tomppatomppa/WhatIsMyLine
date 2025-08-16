import abc
from datetime import datetime
from sqlalchemy import Table, MetaData, Column, Integer, String, DateTime, PickleType, ForeignKey
from sqlalchemy.orm import relationship, declarative_base, registry

mapper_registry = registry()

Base = declarative_base()
metadata = MetaData()

files_table = Table(
    "files",
    mapper_registry.metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("file_id", String, unique=True, nullable=False),
    Column("filename", String, nullable=False),
    Column("user_id", Integer, ForeignKey("users.id"), nullable=False),
    Column("content", PickleType, nullable=True),
    Column("created_on", DateTime, default=datetime.utcnow, nullable=False),
    Column("modified_on", DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False),
    Column("deleted_at", DateTime, nullable=True),
)

class File:
    def __init__(self, file_id, filename, user_id, content=None):
        self.file_id = file_id
        self.filename = filename
        self.user_id = user_id
        self.content = content
        self.created_on = datetime.now()
        self.modified_on = datetime.now()
        self.deleted_at = None
    
    def __repr__(self):
        return f"File(id={self.id}, filename='{self.filename}', user_id={self.user_id})"


class AbstractRepository(abc.ABC):
    @abc.abstractmethod
    def add(self, file: File):
        raise NotImplementedError

    @abc.abstractmethod
    def get(self, file_id) -> File:
        raise NotImplementedError


class AbstractFileRepository(AbstractRepository):
    def __init__(self, session):
        self.session = session

    def add(self, batch):
        self.session.add(batch)

    def get(self, file_id):
        return self.session.query(File).filter_by(file_id=file_id).one()


def start_mappers(db):
    print("Starting mappers")
    files = mapper_registry.map_imperatively(File, files_table, properties={
    "user": relationship("User", back_populates="files")
    })
    metadata.create_all(db.engine)