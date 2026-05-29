import os
import django

os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings.local'
django.setup()

from apps.users.models import User

# 重置管理员密码
try:
    user = User.objects.get(email='admin@demon.com')
    user.set_password('admin123456')
    user.save()
    print(f'管理员密码已重置: admin@demon.com / admin123456')
except User.DoesNotExist:
    print('管理员账号不存在，正在创建...')
    user = User.objects.create_superuser(
        email='admin@demon.com',
        password='admin123456',
        phone='13800138000',
        nickname='Admin'
    )
    print(f'管理员账号已创建: admin@demon.com / admin123456')

# 显示所有用户
print('\n所有用户:')
for u in User.objects.all():
    print(f'  - {u.email} | {u.phone} | {u.nickname}')
