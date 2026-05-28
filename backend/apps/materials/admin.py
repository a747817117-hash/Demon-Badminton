from django.contrib import admin
from .models import Material


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'uploader', 'is_official', 'use_count', 'created_at']
    list_filter = ['category', 'is_official', 'is_public']
    search_fields = ['name', 'description']
    list_editable = ['is_official']
