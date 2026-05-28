from rest_framework import viewsets, filters
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Material
from .serializers import MaterialSerializer


class MaterialViewSet(viewsets.ModelViewSet):
    """素材库 CRUD"""
    serializer_class = MaterialSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_official', 'is_public']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'use_count']
    ordering = ['-created_at']

    def get_queryset(self):
        qs = Material.objects.select_related('uploader')
        # Non-staff users can only see public materials
        if not self.request.user.is_staff:
            qs = qs.filter(is_public=True)
        return qs

    def perform_create(self, serializer):
        serializer.save(uploader=self.request.user)
