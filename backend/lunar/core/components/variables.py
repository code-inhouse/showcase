import os


def parent_dir(path, n=1):
    dirname = path
    while n > 0:
        dirname = os.path.dirname(dirname)
        n -= 1
    return dirname


APP_ENV = os.getenv('APP_ENV', 'dev')
BASE_DIR = parent_dir(os.path.abspath(__file__), 3)
