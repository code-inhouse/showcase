# Generated by Django 2.2 on 2019-04-07 20:13

from django.db import migrations, models
import events.models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='plan',
            name='edit_id',
            field=models.CharField(db_index=True, default=events.models._get_id, max_length=45),
        ),
        migrations.AlterField(
            model_name='plan',
            name='read_id',
            field=models.CharField(db_index=True, default=events.models._get_id, max_length=45),
        ),
    ]
