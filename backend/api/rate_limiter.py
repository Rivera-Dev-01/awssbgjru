import time
from collections import defaultdict

from . import config


class RateLimiter:
    def __init__(self, requests=config.RATE_LIMIT_REQUESTS, window=config.RATE_LIMIT_WINDOW):
        self.requests = requests
        self.window = window
        self._history = defaultdict(list)

    def is_allowed(self, key):
        now = time.time()
        cutoff = now - self.window
        self._history[key] = [t for t in self._history[key] if t > cutoff]

        if len(self._history[key]) >= self.requests:
            return False

        self._history[key].append(now)
        return True
