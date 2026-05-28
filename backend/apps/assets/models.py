import uuid
from django.db import models
from django.conf import settings


def asset_upload_path(instance, filename):
    """按类型/年/月组织上传目录"""
    ext = filename.rsplit('.', 1)[-1].lower()
    return f"assets/{instance.asset_type}/{instance.created_at:%Y/%m}/{uuid.uuid4().hex}.{ext}"


class Asset(models.Model):
    """统一资源管理"""
    ASSET_TYPE_CHOICES = [
        ('image', '图片'),
        ('model', '3D模型'),
        ('texture', '材质贴图'),
        ('template', '设计模板'),
        ('document', '文档'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file = models.FileField('文件', upload_to=asset_upload_path)
    asset_type = models.CharField('资源类型', max_length=20, choices=ASSET_TYPE_CHOICES)
    original_name = models.CharField('原始文件名', max_length=255)
    file_size = models.PositiveIntegerField('文件大小(bytes)')
    mime_type = models.CharField('MIME类型', max_length=100)

    # 图片专用字段
    width = models.PositiveIntegerField('宽度', null=True, blank=True)
    height = models.PositiveIntegerField('高度', null=True, blank=True)

    # 关联
    uploader = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='assets'
    )
    created_at = models.DateTimeField('上传时间', auto_now_add=True)
    is_public = models.BooleanField('是否公开', default=False)

    class Meta:
        db_table = 'assets'
        ordering = ['-created_at']
        verbose_name = '资源文件'
        verbose_name_plural = '资源文件'

    def __str__(self):
        return self.original_name

    @property
    def url(self):
        return self.file.url

    @property
    def size_display(self):
        """人类可读的文件大小"""
        size = self.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024:
                return f"{size:.1f} {unit}"
            size /= 1024
