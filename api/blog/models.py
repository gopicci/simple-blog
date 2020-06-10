import itertools
import uuid

from PIL import Image

from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models
from django.urls import reverse
from django.utils import timezone
from django.utils.text import slugify


class UserManager(BaseUserManager):
    """
    Defining custom user creation.
    """

    def _create_user(self, email, password, is_staff, is_superuser, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")

        now = timezone.now()
        user = self.model(
            email=self.normalize_email(email),
            is_staff=is_staff,
            is_active=True,
            is_superuser=is_superuser,
            last_login=now,
            joined_at=now,
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def get_by_natural_key(self, username):
        return self.get(**{"{}__iexact".format(self.model.USERNAME_FIELD): username})

    def create_user(self, email, password, **extra_fields):
        return self._create_user(email, password, False, False, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        return self._create_user(email, password, True, True, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    """
    Model defining a custom user with email as identifier.
    """

    email = models.EmailField("Email", max_length=255, unique=True)
    username = models.CharField("Name", max_length=255, unique=True, blank=False)
    is_staff = models.BooleanField("Is staff", default=False)
    is_active = models.BooleanField("Is active", default=True)
    joined_at = models.DateTimeField("Joined at", default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username


class BlogPost(models.Model):
    """
    Model representing a blog post.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)

    author = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, editable=False, unique=True)

    tags = models.ManyToManyField("Tag", blank=True)

    body = models.TextField(max_length=100000)

    class Meta:
        ordering = ["-created_on"]

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("blog-detail", args=[str(self.id)])

    def _generate_unique_slug(self):
        """
        Iterating through slugs adding an int until it's unique
        """
        slug_candidate = slug_original = slugify(self.title, allow_unicode=True)

        if slug_candidate == self.slug:
            return

        for i in itertools.count(1):
            if not BlogPost.objects.filter(slug=slug_candidate).exists():
                break
            slug_candidate = f"{slug_original}-{i}"

        self.slug = slug_candidate

    def save(self, *args, **kwargs):
        self._generate_unique_slug()
        super().save(*args, **kwargs)


class Tag(models.Model):
    """
    Model representing a post tag.
    """

    name = models.CharField(max_length=50, help_text="Enter a post tag")

    def __str__(self):
        return self.name


class Comment(models.Model):
    """
    Model representing a comment.
    """

    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, null=True)
    created_on = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    body = models.TextField(max_length=10000)

    class Meta:
        ordering = ["-created_on"]


class ImageModel(models.Model):
    """
    Model for image uploading. Resizes to a maximum of 1920x1080
    """

    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, null=True)
    image = models.ImageField(upload_to="images/")

    def save(self, *args, **kwargs):
        try:
            this = ImageModel.objects.get(id=self.id)
            if this.image != self.image:
                this.image.delete(save=False)
        except Exception:
            pass

        super(ImageModel, self).save(*args, **kwargs)

        img = Image.open(self.image.path)

        img.thumbnail((1920, 1080))

        img.save(self.image.path, quality=80, optimize=True)
