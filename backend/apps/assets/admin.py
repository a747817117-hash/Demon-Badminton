from django.contrib import admin
from .models import Asset


@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = ['original_name', 'asset_type', 'uploader', 'file_size', 'created_at']
    list_filter = ['asset_type', 'created_at']
    search_fields = ['original_name']
    readonly_fields = ['file_size', 'mime_type', 'width', 'height', 'created_at']
