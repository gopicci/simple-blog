from django.http import Http404
from django.conf import settings
from django.contrib.auth import login, logout
from rest_framework import views, viewsets, generics, response, permissions, authentication, status
from .serializers import UserSerializer, LoginSerializer, BlogPostSerializer, TagSerializer
from .models import BlogPost, Tag


class LoginView(views.APIView):
    serializer_class = LoginSerializer
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (authentication.SessionAuthentication,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return response.Response(UserSerializer(user).data)


class LogoutView(views.APIView):
    def post(self, request):
        logout(request)
        return response.Response()


class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (authentication.SessionAuthentication,)

    def perform_create(self, serializer):
        user = serializer.save()
        user.backend = settings.AUTHENTICATION_BACKENDS[0]
        login(self.request, user)


class UserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)
    lookup_field = 'pk'

    def get_object(self, *args, **kwargs):
        return self.request.user


class IsAuthor(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        return obj.author == request.user


class TagsView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class BlogPostViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer

    def get_permissions(self):
        if self.action in ('update', 'partial_update', 'destroy', ):
            permission_classes = [IsAuthor, ]
        elif self.action in ('create', ):
            permission_classes = [permissions.IsAuthenticated, ]
        else:
            permission_classes = [permissions.AllowAny, ]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
