# Generated by Django 2.2 on 2019-04-07 20:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0004_auto_20190407_2023'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='plan',
            name='description',
        ),
        migrations.RemoveField(
            model_name='plan',
            name='place',
        ),
        migrations.AddField(
            model_name='timeslot',
            name='description',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='timeslot',
            name='place',
            field=models.CharField(default='', max_length=200),
        ),
    ]
