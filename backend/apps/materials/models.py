import uuid
from django.db import models
from django.conf import settings


class Material(models.Model):
    """素材库"""
    CATEGORY_CHOICES = [
        ('color', '配色方案'),
        ('pattern', '图案'),
        ('texture', '材质纹理'),
        ('logo', 'Logo/标识'),
        ('sticker', '贴纸'),
        ('shape', '形状'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField('素材名称', max_length=200)
    category = models.CharField('分类', max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField('描述', blank=True)

    # 素材文件
    preview_image = models.ImageField('预览图', upload_to='materials/preview/%Y/%m/')
    source_file = models.FileField('源文件', upload_to='materials/source/%Y/%m/', blank=True)

    # 素材属性 (颜色值/纹理参数等结构化数据)
    properties = models.TextField('属性', default='{}', blank=True)

    # 关联
    uploader = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='materials'
    )
    is_official = models.BooleanField('官方素材', default=False)
    is_public = models.BooleanField('是否公开', default=True)

    # 统计
    use_count = models.PositiveIntegerField('使用次数', default=0)

    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)

    class Meta:
        db_table = 'materials'
        ordering = ['-created_at']
        verbose_name = '素材'
        verbose_name_plural = '素材'

    def __str__(self):
        return self.name
