from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Template
from .serializers import TemplateSerializer


class TemplateViewSet(viewsets.ModelViewSet):
    """模板 CRUD"""
    serializer_class = TemplateSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['name', 'description']
    ordering_fields = ['sort_order', 'created_at', 'use_count']
    ordering = ['sort_order', '-created_at']

    def get_queryset(self):
        return Template.objects.filter(is_active=True)

    @action(detail=True, methods=['post'])
    def use(self, request, pk=None):
        """使用模板创建设计"""
        template = self.get_object()
        # Increment use count
        Template.objects.filter(pk=template.pk).update(use_count=models.F('use_count') + 1)
        
        return Response({
            'template_data': template.template_data,
            'message': '模板数据已返回',
        })
