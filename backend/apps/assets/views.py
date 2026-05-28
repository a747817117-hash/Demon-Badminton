from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Asset
from .serializers import AssetSerializer


class AssetViewSet(viewsets.ModelViewSet):
    """资源文件 CRUD"""
    serializer_class = AssetSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Asset.objects.filter(uploader=self.request.user)

    def perform_create(self, serializer):
        file = self.request.FILES.get('file')
        if not file:
            raise serializers.ValidationError('请选择文件')
        
        # Detect mime type
        import magic
        mime_type = magic.from_buffer(file.read(1024), mime=True)
        file.seek(0)
        
        # Get image dimensions if applicable
        width, height = None, None
        if mime_type.startswith('image/'):
            from PIL import Image
            img = Image.open(file)
            width, height = img.size
            file.seek(0)
        
        serializer.save(
            uploader=self.request.user,
            file_size=file.size,
            mime_type=mime_type,
            width=width,
            height=height,
        )
