from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import CustomUser
from .validators import validate_username


class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        user = authenticate(username=attrs['email'], password=attrs['password'])

        if not user:
            raise serializers.ValidationError('Incorrect email or password.')

        return {'user': user}


class UserSerializer(serializers.ModelSerializer):

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
