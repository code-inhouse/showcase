import threading
import logging

from .queue import get_task


logger = logging.getLogger(__name__)


class MailWorker(threading.Thread):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.daemon = True

    def run(self):
        while True:
            task = get_task()
            try:
                task()
            except Exception:
                logger.exception('Error')

    def start(self, *args, **kwargs):
        super().start(*args, **kwargs)
