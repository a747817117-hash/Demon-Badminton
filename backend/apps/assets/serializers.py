from rest_framework import serializers
from .models import Asset


class AssetSerializer(serializers.ModelSerializer):
    url = serializers.ReadOnlyField()
    size_display = serializers.ReadOnlyField()

    class Meta:
        model = Asset
        fields = [
            'id', 'file', 'asset_type', 'original_name', 'file_size',
            'mime_type', 'width', 'height', 'url', 'size_display',
            'created_at', 'is_public',
        ]
        read_only_fields = ['id', 'file_size', 'mime_type', 'width', 'height', 'created_at']
