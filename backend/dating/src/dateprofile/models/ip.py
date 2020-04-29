from django.db import models


class City(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    name_en = models.CharField(max_length=100,
                               blank=True,
                               null=True)
    country = models.CharField(max_length=200,
                               blank=True,
                               null=True)
    latitude = models.FloatField()
    longtitude = models.FloatField()

    def __str__(self):
        return self.name_en


class CityIp(models.Model):
    city = models.ForeignKey(City, related_name='ips')
    start_ip = models.BigIntegerField()
    end_ip = models.BigIntegerField()

    def __str__(self):
        return '{} {}-{}'.format(self.city.name, self.start_ip, self.end_ip)

