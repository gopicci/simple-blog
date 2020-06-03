import pytest

from blog.models import CustomUser, BlogPost, Tag


@pytest.mark.django_db
def test_custom_user_model():
    user = CustomUser(email='test@test.com', username='test', )
    user.save()
    assert user.email == 'test@test.com'
    assert user.username == 'test'
    assert user.joined_at
    assert user.is_active
    assert not user.is_staff
    assert not user.is_superuser
    assert str(user) == user.email


@pytest.mark.django_db
def test_tag_model():
    tag = Tag(name='test')
    tag.save()
    assert tag.name == 'test'
    assert str(tag) == tag.name


@pytest.mark.django_db
def test_blog_post_model():
    user = CustomUser(email='test@test.com', username='test', )
    user.save()
    tag1 = Tag(name='tag1')
    tag1.save()
    tag2 = Tag(name='tag2')
    tag2.save()
    post = BlogPost(author=user, title='Test title!', body='post body', )
    post.tags.set([tag1, tag2])
    post.save()
    assert post.author.username == 'test'
    assert post.title == 'Test title!'
    assert post.slug == 'test-title'
    assert post.tags.all()[1] == tag2
    assert post.body == 'post body'
    assert str(post) == post.title


@pytest.mark.django_db
def test_blog_post_model_unique_slugs():
    user = CustomUser(email='test@test.com', username='test', )
    user.save()
    post1 = BlogPost(author=user, title='Test title!', body='post body', )
    post1.save()
    post2 = BlogPost(author=user, title='Test title', body='post body', )
    post2.save()
    assert post1.slug == 'test-title'
    assert post1.slug != post2.slug
