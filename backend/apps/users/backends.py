from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q

User = get_user_model()


class EmailOrPhoneBackend(ModelBackend):
    """支持邮箱或手机号登录的认证后端"""
    
    def authenticate(self, request, email=None, phone=None, password=None, **kwargs):
        if not password:
            return None
            
        # 尝试通过邮箱查找用户
        if email:
            try:
                user = User.objects.get(email=email)
                if user.check_password(password) and self.user_can_authenticate(user):
                    return user
            except User.DoesNotExist:
                pass
        
        # 尝试通过手机号查找用户
        if phone:
            try:
                user = User.objects.get(phone=phone)
                if user.check_password(password) and self.user_can_authenticate(user):
                    return user
            except User.DoesNotExist:
                pass
        
        return None
