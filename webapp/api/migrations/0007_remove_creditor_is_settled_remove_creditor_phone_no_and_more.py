# Generated by Django 4.1.3 on 2023-04-23 07:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_creditor_phone_no_alter_debtor_phone_no'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='creditor',
            name='is_settled',
        ),
        migrations.RemoveField(
            model_name='creditor',
            name='phone_no',
        ),
        migrations.RemoveField(
            model_name='debtor',
            name='is_settled',
        ),
        migrations.RemoveField(
            model_name='debtor',
            name='phone_no',
        ),
    ]