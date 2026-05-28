from rest_framework import serializers
from .models import Template


class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = [
            'id', 'name', 'category', 'description',
            'preview_image', 'template_data',
            'is_active', 'sort_order', 'use_count',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'use_count', 'created_at', 'updated_at']
