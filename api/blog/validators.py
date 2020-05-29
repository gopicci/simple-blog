from django.core.exceptions import ValidationError
from .models import CustomUser


def validate_username(username):
    if CustomUser.objects.filter(**{'{}__iexact'.format(CustomUser.USERNAME_FIELD): username}).exists():
        raise ValidationError('User with this {} already exists'.format(CustomUser.USERNAME_FIELD))
    return username
