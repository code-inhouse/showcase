import uuid

import abc


class BaseStrategy(abc.ABC):
    def _generate_filename(self, name):
        prefix = uuid.uuid4().hex[:6]
        return f'{prefix}/{name}'

    @abc.abstractmethod
    def upload_file(self, filepath, filename, bucket_name, uploader_id,
                    mime_type='application/octet-stream'):
        raise NotImplementedError

    @abc.abstractmethod
    def get_link(self, cloud_file):
        raise NotImplementedError
