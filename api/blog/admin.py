from django.contrib import admin

from .models import BlogPost, Comment, CustomUser, Tag


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    pass


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    fields = ("author", "title", "tags", "body")
    list_display = ("id", "author", "title", "slug", "created_on", "updated_on")


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    pass


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    pass
