import abc
from models import User

class AbstractRepository(abc.ABC):
    @abc.abstractmethod
    def _add(self, user: User):
        raise NotImplementedError

    @abc.abstractmethod
    def _get(self, sku) -> User:
        raise NotImplementedError
