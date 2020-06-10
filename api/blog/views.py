from django.conf import settings
from django.contrib.auth import login, logout
from rest_framework import (
    authentication,
    generics,
    permissions,
    response,
    views,
    viewsets,
)

from .models import BlogPost, Comment, Tag
from .serializers import (
    BlogPostSerializer,
    CommentSerializer,
    ImageSerializer,
    LoginSerializer,
    TagSerializer,
    UserSerializer,
)


class LoginView(views.APIView):
    """
    Login view.
    """

    serializer_class = LoginSerializer
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (authentication.SessionAuthentication,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        login(request, user)
        return response.Response(UserSerializer(user).data)


class LogoutView(views.APIView):
    """
    Logout view.
    """

    def post(self, request):
        logout(request)
        return response.Response()


class RegisterView(generics.CreateAPIView):
    """
    Register view, login the user on creation.
    """

    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (authentication.SessionAuthentication,)

    def perform_create(self, serializer):
        user = serializer.save()
        user.backend = settings.AUTHENTICATION_BACKENDS[0]
        login(self.request, user)


class UserView(generics.RetrieveAPIView):
    """
    User detail view.
    """

    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)
    lookup_field = "pk"

    def get_object(self, *args, **kwargs):
        return self.request.user


class IsAuthor(permissions.BasePermission):
    """
    Check if user is original author.
    """

    def has_object_permission(self, request, view, obj):
        return obj.author == request.user


class TagsView(generics.ListAPIView):
    """
    Tags view.
    """

    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class BlogPostViewSet(viewsets.ModelViewSet):
    """
    Blog post viewset. Can create if authenticated, modify if author,
    view list and detail anonymously.
    """

    lookup_field = "slug"
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer

    def get_permissions(self):
        if self.action in ("update", "partial_update", "destroy"):
            permission_classes = (IsAuthor,)
        elif self.action in ("create",):
            permission_classes = (permissions.IsAuthenticated,)
        else:
            permission_classes = (permissions.AllowAny,)
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class CommentsView(generics.ListCreateAPIView):
    """
    Comments view, bound by url slug. Post only if authenticated.
    """

    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        return Comment.objects.filter(post__slug=self.kwargs["slug"])

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        serializer.save(post=BlogPost.objects.get(slug=self.kwargs["slug"]))


class ImageView(generics.CreateAPIView):
    serializer_class = ImageSerializer
    permission_classes = (permissions.IsAuthenticated,)
