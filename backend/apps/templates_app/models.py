import uuid
from django.db import models
from django.conf import settings


class Template(models.Model):
    """设计模板"""
    CATEGORY_CHOICES = [
        ('professional', '专业竞技'),
        ('leisure', '休闲娱乐'),
        ('custom', '定制系列'),
        ('tournament', '赛事限定'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField('模板名称', max_length=200)
    category = models.CharField('分类', max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField('描述', blank=True)
    preview_image = models.ImageField('预览图', upload_to='templates/preview/%Y/%m/')

    # 模板结构 (默认元素配置)
    template_data = models.TextField('模板数据', default='{}', help_text='默认元素/布局/参数')

    is_active = models.BooleanField('是否启用', default=True)
    sort_order = models.PositiveIntegerField('排序', default=0)
    use_count = models.PositiveIntegerField('使用次数', default=0)

    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)

    class Meta:
        db_table = 'templates'
        ordering = ['sort_order', '-created_at']
        verbose_name = '模板'
        verbose_name_plural = '模板'

    def __str__(self):
        return self.name
