from queue import Queue


queue = Queue()


def add_task(func):
    queue.put(func)


def get_task():
    return queue.get()
