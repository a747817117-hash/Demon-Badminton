from rest_framework import serializers
from .models import Design, Tag, DesignLike


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']


class DesignListSerializer(serializers.ModelSerializer):
    author_nickname = serializers.CharField(source='author.nickname', read_only=True)
    author_avatar = serializers.ImageField(source='author.avatar', read_only=True)

    class Meta:
        model = Design
        fields = [
            'id', 'title', 'description', 'cover', 'status',
            'author_nickname', 'author_avatar',
            'view_count', 'like_count', 'fork_count',
            'created_at', 'updated_at',
        ]


class DesignDetailSerializer(serializers.ModelSerializer):
    author_nickname = serializers.CharField(source='author.nickname', read_only=True)
    author_avatar = serializers.ImageField(source='author.avatar', read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Design
        fields = [
            'id', 'title', 'description', 'cover', 'status', 'design_data',
            'author_nickname', 'author_avatar', 'tags',
            'view_count', 'like_count', 'fork_count',
            'created_at', 'updated_at', 'published_at',
            'is_liked',
        ]

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return DesignLike.objects.filter(user=request.user, design=obj).exists()
        return False


class DesignCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Design
        fields = ['title', 'description', 'design_data', 'status']

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)
