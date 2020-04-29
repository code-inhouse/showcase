from .constants import STRATEGY_GCE
from .strategies.gce import GCEStrategy


def _get_strategy(strategy):
    if strategy == STRATEGY_GCE:
        return GCEStrategy()
    raise ValueError(f'Strategy for {strategy} not found')


def upload_file(strategy, filepath, filename, bucket_name, uploader_id,
                mime_type='application/octet-stream'):
    strat = _get_strategy(strategy)
    return strat.upload_file(filepath, filename, bucket_name, uploader_id, mime_type)


def get_link(cloud_file):
    strat = _get_strategy(cloud_file.strategy)
    return strat.get_link(cloud_file)
