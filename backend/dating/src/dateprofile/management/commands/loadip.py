from django.core.management.base import BaseCommand, CommandError
from dateprofile.models import City, CityIp


class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def add_arguments(self, parser):
        parser.add_argument('cities', type=str)
        parser.add_argument('ips', type=str)

    def handle(self, *args, **options):
        city_ids = {}
        k = 1
        with open(options['cities']) as cities:
            for city_line in cities:
                print('city#', k)
                k += 1
                raw_city = city_line.strip().strip(',;()').split(', ')
                try:
                    [id, _, name, name_en, _, _, lat_str, long_str] = raw_city
                    lat = float(lat_str[1:-1])
                    long = float(long_str[1:-1])
                    name = name[1:-1].replace('\\\'', '\'')
                    name_en = name_en[1:-1].replace('\\\'', '\'')
                    city = City.objects.create(name=name, name_en=name_en,
                                               latitude=lat, longtitude=long)
                    city_ids[id] = city.pk
                except Exception as e:
                    print(str(e))
                    print(raw_city)
        k = 1
        with open(options['ips']) as ips:
            for ip_line in ips:
                print('ip#', k)
                k += 1
                raw_ip = ip_line.strip().strip(',;()').split(', ')
                try:
                    [city_id, start_ip, end_ip] = map(int, raw_ip)
                    CityIp.objects.create(city_id=city_ids[str(city_id)],
                                          start_ip=start_ip,
                                          end_ip=end_ip)
                except Exception as e:
                    print(str(e))
                    print(raw_ip)
