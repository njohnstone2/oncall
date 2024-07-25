# Generated by Django 4.2.10 on 2024-07-24 14:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('alerts', '0054_usernotificationbundle_bundlednotification_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bundlednotification',
            name='alert_group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bundled_notifications', to='alerts.alertgroup'),
        ),
    ]