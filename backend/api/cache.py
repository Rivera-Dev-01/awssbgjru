import time
from collections import OrderedDict

from . import config


class TTLCache:
    def __init__(self, ttl=config.CACHE_TTL):
        self.ttl = ttl
        self._store = OrderedDict()

    def get(self, key):
        if key not in self._store:
            return None
        value, expiry = self._store[key]
        if time.time() > expiry:
            del self._store[key]
            return None
        self._store.move_to_end(key)
        return value

    def set(self, key, value):
        self._store[key] = (value, time.time() + self.ttl)
        self._store.move_to_end(key)

    def clear(self):
        self._store.clear()
