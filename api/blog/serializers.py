from django.contrib.auth import authenticate, get_user
from django.core.exceptions import ObjectDoesNotExist
from django.utils.encoding import smart_text
from rest_framework import serializers

from .models import CustomUser, BlogPost, Tag, Comment
from .validators import validate_username


class LoginSerializer(serializers.Serializer):
    """
    Login serializer, validates email and password.
    """
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        user = authenticate(username=attrs['email'], password=attrs['password'])

        if not user:
            raise serializers.ValidationError('Incorrect email or password.')

        return {'user': user}


class UserSerializer(serializers.ModelSerializer):
    """
    Custom user serializer, validates that both password match on creation.
    """
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = (
            'id',
            'last_login',
            'email',
            'username',
            'is_active',
            'joined_at',
            'password1',
            'password2',
        )
        read_only_fields = ('id', 'last_login', 'is_active', 'joined_at')
        extra_kwargs = {
            'password1': {'required': True, 'write_only': True},
            'password2': {'required': True, 'write_only': True},
            'username': {'required': True},
        }

    @staticmethod
    def validate_email(value):
        return validate_username(value)

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError('Passwords must match.')
        return data

    def create(self, validated_data):
        data = {
            key: value for key, value in validated_data.items()
            if key not in ('password1', 'password2')
        }
        data['password'] = validated_data['password1']
        user = self.Meta.model.objects.create_user(**data)
        return user


class CreatableSlugRelatedField(serializers.SlugRelatedField):
    """
    Defines a creatable slug related field for tags.
    """
    def to_internal_value(self, data):
        try:
            return self.get_queryset().get_or_create(**{self.slug_field: data})[0]
        except ObjectDoesNotExist:
            self.fail('does_not_exist', slug_name=self.slug_field, value=smart_text(data))
        except (TypeError, ValueError):
            self.fail('invalid')


class BlogPostSerializer(serializers.ModelSerializer):
    """
    Blog post serializer. View sends user from request.
    """
    tags = CreatableSlugRelatedField(queryset=Tag.objects.all(),
                                     many=True,
                                     slug_field='name',
                                     )
    author = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = BlogPost
        fields = (
            'id',
            'author',
            'title',
            'tags',
            'body',
            'slug',
            'created_on',
            'updated_on',
        )
        read_only_fields = (
            'id',
            'author',
            'slug',
            'created_on',
            'updated_on',
        )


class TagSerializer(serializers.ModelSerializer):
    """
    Tag serializer.
    """
    class Meta:
        model = Tag
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    """
    Comment serializer. View sends author from request, post from url slug.
    """
    author = serializers.ReadOnlyField(source='author.username')
    post = serializers.ReadOnlyField(source='post.slug')

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = (
            'id',
            'created_on',
            'author',
            'post',
        )
