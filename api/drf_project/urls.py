"""drf_project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions, routers

from blog.views import (
    BlogPostViewSet,
    CommentsView,
    ImageView,
    LoginView,
    LogoutView,
    RegisterView,
    TagsView,
    UserView,
)

from .views import ping

router = routers.SimpleRouter()
router.register(r"blog", BlogPostViewSet)

schema_view = get_schema_view(
    openapi.Info(title="Simple blog API", default_version="v1"),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("ping/", ping, name="ping"),
    path(
        "api/docs/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    path("api/register/", RegisterView.as_view(), name="register"),
    path("api/login/", LoginView.as_view(), name="login"),
    path("api/logout/", LogoutView.as_view(), name="logout"),
    path("api/user/", UserView.as_view(), name="current-user"),
    path("api/tags/", TagsView.as_view(), name="tags"),
    path("api/", include(router.urls)),
    path("api/blog/<slug:slug>/comments/", CommentsView.as_view(), name="comments"),
    path("api/image/", ImageView.as_view(), name="image"),
]
