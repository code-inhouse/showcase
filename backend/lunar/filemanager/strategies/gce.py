import os

from django.db import transaction

from google.cloud import storage

from .base import BaseStrategy
from ..models import CloudFile
from ..constants import STRATEGY_GCE


class GCEStrategy(BaseStrategy):
    def __init__(self):
        self.client = storage.Client()

    @transaction.atomic
    def upload_file(self, filepath, filename, bucket_name,
                    uploader_id, mime_type='application/octet-stream'):
        bucket = self.client.get_bucket(bucket_name)
        name = self._generate_filename(filename)
        blob = bucket.blob(name)
        cf = CloudFile.objects.create(
            uploaded_by_id=uploader_id,
            size=os.path.getsize(filepath),
            mime_type=mime_type,
            bucket=bucket,
            strategy=STRATEGY_GCE,
            name=name,
            human_name=filename
        )
        blob.upload_from_filename(filepath)
        return cf

    def get_link(self, cloud_file):
        bucket = self.client.get_bucket(cloud_file.bucket)
        blob = bucket.blob(cloud_file.name)
        return blob.public_url
