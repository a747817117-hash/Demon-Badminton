from django.contrib import admin
from .models import Design, Tag, DesignLike


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Design)
class DesignAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'status', 'view_count', 'like_count', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['title', 'description', 'author__nickname']
    readonly_fields = ['view_count', 'like_count', 'fork_count', 'created_at', 'updated_at']
    list_per_page = 25


@admin.register(DesignLike)
class DesignLikeAdmin(admin.ModelAdmin):
    list_display = ['user', 'design', 'created_at']
    list_filter = ['created_at']
