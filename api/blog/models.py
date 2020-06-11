import itertools
import os
import urllib.request as urllib
import uuid
from io import BytesIO

import boto3
from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db import models
from django.urls import reverse
from django.utils import timezone
from django.utils.text import slugify
from PIL import Image


class UserManager(BaseUserManager):
    """
    Defining custom user creation.
    """

    def _create_user(
        self, email, password, is_staff, is_active, is_superuser, **extra_fields
    ):
        if not email:
            raise ValueError("Users must have an email address")

        now = timezone.now()
        user = self.model(
            email=self.normalize_email(email),
            is_staff=is_staff,
            is_active=is_active,
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
        is_active = int(os.environ.get("DEBUG", default=0)) == 1
        return self._create_user(
            email, password, False, is_active, False, **extra_fields
        )

    def create_superuser(self, email, password, **extra_fields):
        return self._create_user(email, password, True, True, True, **extra_fields)


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
    Model for image uploading. Convert image to jpg with 1920x1080 max resolution
    when uploading to S3.
    """

    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, null=True)
    image = models.ImageField(upload_to="images/")

    def _s3_process_image(self):
        original_path = "media/" + self.image.name

        img_file = urllib.urlopen(self.image.url)
        im = BytesIO(img_file.read())
        resized_image = Image.open(im)

        if resized_image.mode not in ("L", "RGB"):
            resized_image = resized_image.convert("RGB")

        resized_image.thumbnail((1920, 1080), Image.ANTIALIAS)

        temp_handle = BytesIO()
        resized_image.save(temp_handle, "jpeg")
        temp_handle.seek(0)

        suf = SimpleUploadedFile(
            os.path.split(self.image.name)[-1].split(".")[0],
            temp_handle.read(),
            content_type="image/jpeg",
        )
        self.image.save("%s.jpg" % suf.name, suf, save=True)

        client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        )

        client.delete_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=original_path)

    def save(self, *args, **kwargs):
        if not self.id:
            super(ImageModel, self).save(*args, **kwargs)
            if settings.USE_S3:
                self._s3_process_image()
