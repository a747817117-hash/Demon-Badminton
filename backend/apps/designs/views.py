from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Design, DesignLike
from .serializers import DesignListSerializer, DesignDetailSerializer, DesignCreateSerializer


class DesignViewSet(viewsets.ModelViewSet):
    """设计作品 CRUD + 自定义操作"""
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'tags__name']
    ordering_fields = ['created_at', 'updated_at', 'view_count', 'like_count']
    ordering = ['-created_at']
    filterset_fields = ['status']

    def get_queryset(self):
        qs = Design.objects.select_related('author').prefetch_related('tags')
        if self.action == 'list':
            return qs.only('id', 'title', 'description', 'cover', 'status', 
                          'author__nickname', 'author__avatar', 
                          'view_count', 'like_count', 'fork_count', 'created_at', 'updated_at')
        return qs

    def get_serializer_class(self):
        if self.action == 'list':
            return DesignListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return DesignCreateSerializer
        return DesignDetailSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        Design.objects.filter(pk=instance.pk).update(view_count=models.F('view_count') + 1)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        """点赞设计"""
        design = self.get_object()
        user = request.user
        
        like, created = DesignLike.objects.get_or_create(user=user, design=design)
        if not created:
            like.delete()
            Design.objects.filter(pk=design.pk).update(like_count=models.F('like_count') - 1)
            return Response({'status': 'unliked'})
        
        Design.objects.filter(pk=design.pk).update(like_count=models.F('like_count') + 1)
        return Response({'status': 'liked'})

    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        """发布设计"""
        design = self.get_object()
        if design.author != request.user:
            return Response({'detail': '只能发布自己的设计'}, status=status.HTTP_403_FORBIDDEN)
        
        design.status = 'published'
        design.published_at = timezone.now()
        design.save()
        
        return Response({'status': 'published'})

    @action(detail=False, methods=['get'], url_path='my-designs')
    def my_designs(self, request):
        """获取我的设计"""
        qs = self.get_queryset().filter(author=request.user)
        status_filter = request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = DesignListSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
        
        serializer = DesignListSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)
