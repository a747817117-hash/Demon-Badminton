from django.contrib import admin
from .models import Template


@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'is_active', 'use_count', 'sort_order']
    list_filter = ['category', 'is_active']
    list_editable = ['is_active', 'sort_order']
    search_fields = ['name', 'description']
