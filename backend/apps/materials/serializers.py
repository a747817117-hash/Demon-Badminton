from rest_framework import serializers
from .models import Material


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = [
            'id', 'name', 'category', 'description',
            'preview_image', 'source_file', 'properties',
            'is_official', 'is_public', 'use_count',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'use_count', 'created_at', 'updated_at']
