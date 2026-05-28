from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from django.utils import timezone


class CustomUserManager(BaseUserManager):
    def create_user(self, email=None, phone=None, password=None, **extra_fields):
        if not email and not phone:
            raise ValueError('必须提供邮箱或手机号')
        if email:
            email = self.normalize_email(email)
        user = self.model(email=email, phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email=email, password=password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """自定义用户模型 - 支持邮箱/手机号双登录"""
    email = models.EmailField('邮箱', unique=True, null=True, blank=True)
    phone = models.CharField('手机号', max_length=20, unique=True, null=True, blank=True)
    nickname = models.CharField('昵称', max_length=50, blank=True)
    avatar = models.ImageField('头像', upload_to='avatars/%Y/%m/', blank=True)
    bio = models.TextField('个人简介', max_length=500, blank=True)

    is_active = models.BooleanField('是否活跃', default=True)
    is_staff = models.BooleanField('是否员工', default=False)
    date_joined = models.DateTimeField('注册时间', default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['phone']

    class Meta:
        db_table = 'users'
        verbose_name = '用户'
        verbose_name_plural = '用户'

    def __str__(self):
        return self.email or str(self.phone)
