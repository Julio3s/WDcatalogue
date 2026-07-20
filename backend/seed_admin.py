import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

user, created = User.objects.get_or_create(
    email='admin@worlddesign.local',
    defaults={
        'username': 'admin',
        'first_name': 'Admin',
        'last_name': 'World Design',
    },
)
user.username = user.username or 'admin'
user.first_name = 'Admin'
user.last_name = 'World Design'
user.is_staff = True
user.is_superuser = True
user.is_admin_user = True
user.set_password('AdminWorldDesign2026!')
user.save()

print('Admin user ready successfully.')
