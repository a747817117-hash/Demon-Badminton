import uuid
from django.db import models
from django.conf import settings


class Tag(models.Model):
    """标签"""
    name = models.CharField('标签名', max_length=50, unique=True)
    slug = models.SlugField('Slug', max_length=50, unique=True)

    class Meta:
        db_table = 'tags'
        verbose_name = '标签'
        verbose_name_plural = '标签'

    def __str__(self):
        return self.name


class Design(models.Model):
    """设计作品"""
    STATUS_CHOICES = [
        ('draft', '草稿'),
        ('published', '已发布'),
        ('archived', '已归档'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField('标题', max_length=200)
    description = models.TextField('描述', blank=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='designs'
    )
    status = models.CharField('状态', max_length=20, choices=STATUS_CHOICES, default='draft')
    cover = models.ImageField('封面图', upload_to='designs/covers/%Y/%m/', blank=True)

    # 设计数据 (JSON 存储画布/参数等结构化数据)
    design_data = models.TextField('设计数据', default='{}', blank=True)

    # 关联
    tags = models.ManyToManyField(Tag, blank=True, related_name='designs')

    # 统计
    view_count = models.PositiveIntegerField('浏览次数', default=0)
    like_count = models.PositiveIntegerField('点赞次数', default=0)
    fork_count = models.PositiveIntegerField('复制次数', default=0)

    # 时间
    created_at = models.DateTimeField('创建时间', auto_now_add=True)
    updated_at = models.DateTimeField('更新时间', auto_now=True)
    published_at = models.DateTimeField('发布时间', null=True, blank=True)

    class Meta:
        db_table = 'designs'
        ordering = ['-created_at']
        verbose_name = '设计作品'
        verbose_name_plural = '设计作品'

    def __str__(self):
        return self.title


class DesignLike(models.Model):
    """设计点赞"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    design = models.ForeignKey(Design, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField('点赞时间', auto_now_add=True)

    class Meta:
        db_table = 'design_likes'
        unique_together = ['user', 'design']
        verbose_name = '设计点赞'
        verbose_name_plural = '设计点赞'
