import pytest
from blog.models import BlogPost, CustomUser, Comment, ImageModel


@pytest.mark.django_db
def test_can_visit_list(client):
    resp = client.get('/api/blog/')
    assert resp.status_code == 200


@pytest.mark.django_db
def test_can_create_a_post(client):
    posts = BlogPost.objects.all()
    assert len(posts) == 0

    resp1 = client.post(
        '/api/register/',
        {'username': 'test', 'email': 'test@test.com', 'password1': 'pAzzw0rd!', 'password2': 'pAzzw0rd!', },
        content_type='application/json',
    )
    resp2 = client.post(
        '/api/login/',
        {'email': 'test@test.com', 'password': 'pAzzw0rd!', },
        content_type='application/json',
    )
    assert resp2.status_code == 200

    resp = client.post(
        '/api/blog/',
        {'title': 'test', 'tags': [], 'body': 'test body', },
        content_type='application/json',
    )
    assert resp.data['author'] == resp2.data['username']
    posts = BlogPost.objects.all()
    assert len(posts) == 1


@pytest.mark.django_db
def test_anon_can_view_post(client):
    resp1 = client.post(
        '/api/register/',
        {'username': 'test', 'email': 'test@test.com', 'password1': 'pAzzw0rd!', 'password2': 'pAzzw0rd!', },
        content_type='application/json',
    )
    resp2 = client.post(
        '/api/login/',
        {'email': 'test@test.com', 'password': 'pAzzw0rd!', },
        content_type='application/json',
    )
    resp3 = client.post(
        '/api/blog/',
        {'title': 'test', 'tags': [], 'body': 'test body', },
        content_type='application/json',
    )
    resp4 = client.post(
        '/api/logout/',
        content_type='application/json',
    )
    resp = client.get(
        f'/api/blog/{resp3.data["slug"]}/'
    )
    assert resp.status_code == 200


@pytest.mark.django_db
def test_can_post_comments(client):
    comments = Comment.objects.all()
    assert len(comments) == 0

    resp1 = client.post(
        '/api/register/',
        {'username': 'test', 'email': 'test@test.com', 'password1': 'pAzzw0rd!', 'password2': 'pAzzw0rd!', },
        content_type='application/json',
    )
    resp2 = client.post(
        '/api/login/',
        {'email': 'test@test.com', 'password': 'pAzzw0rd!', },
        content_type='application/json',
    )
    resp3 = client.post(
        '/api/blog/',
        {'title': 'test', 'tags': [], 'body': 'test body', },
        content_type='application/json',
    )
    resp = client.post(
        f'/api/blog/{resp3.data["slug"]}/comments/',
        {'body': 'test comment', },
        content_type='application/json',
    )
    assert resp.status_code == 201
    comments = Comment.objects.all()
    assert len(comments) == 1


@pytest.mark.django_db
def test_anon_cannot_post_comments(client):
    resp1 = client.post(
        '/api/register/',
        {'username': 'test', 'email': 'test@test.com', 'password1': 'pAzzw0rd!', 'password2': 'pAzzw0rd!', },
        content_type='application/json',
    )
    resp2 = client.post(
        '/api/login/',
        {'email': 'test@test.com', 'password': 'pAzzw0rd!', },
        content_type='application/json',
    )
    resp3 = client.post(
        '/api/blog/',
        {'title': 'test', 'tags': [], 'body': 'test body', },
        content_type='application/json',
    )
    resp4 = client.post(
        '/api/logout/',
        content_type='application/json',
    )
    resp = client.post(
        f'/api/blog/{resp3.data["slug"]}/comments/',
        {'body': 'test comment', },
        content_type='application/json',
    )
    assert resp.status_code == 403
    comments = Comment.objects.all()
    assert len(comments) == 0


@pytest.mark.django_db
def test_anon_can_view_comments(client):
    resp1 = client.post(
        '/api/register/',
        {'username': 'test', 'email': 'test@test.com', 'password1': 'pAzzw0rd!', 'password2': 'pAzzw0rd!', },
        content_type='application/json',
    )
    resp2 = client.post(
        '/api/login/',
        {'email': 'test@test.com', 'password': 'pAzzw0rd!', },
        content_type='application/json',
    )
    resp3 = client.post(
        '/api/blog/',
        {'title': 'test', 'tags': [], 'body': 'test body', },
        content_type='application/json',
    )
    resp4 = client.post(
        f'/api/blog/{resp3.data["slug"]}/comments/',
        {'body': 'test comment', },
        content_type='application/json',
    )
    resp5 = client.post(
        '/api/logout/',
        content_type='application/json',
    )
    resp = client.get(
        f'/api/blog/{resp3.data["slug"]}/comments/'
    )
    assert resp.status_code == 200
    assert resp.data[0]['body'] == 'test comment'


@pytest.mark.django_db
def test_can_upload_image(client):
    images = ImageModel.objects.all()
    assert len(images) == 0

    resp1 = client.post(
        '/api/register/',
        {'username': 'test', 'email': 'test@test.com', 'password1': 'pAzzw0rd!', 'password2': 'pAzzw0rd!', },
        content_type='application/json',
    )
    resp2 = client.post(
        '/api/login/',
        {'email': 'test@test.com', 'password': 'pAzzw0rd!', },
        content_type='application/json',
    )
    resp = client.post(
        '/api/image/',
        {'image': open('tests/blog/media/image_small.jpg', 'rb')},
    )

    assert resp.status_code == 201
    images = ImageModel.objects.all()
    assert len(images) == 1


@pytest.mark.django_db
def test_keep_one_image_when_resizing(client):
    images = ImageModel.objects.all()
    assert len(images) == 0

    resp1 = client.post(
        '/api/register/',
        {'username': 'test', 'email': 'test@test.com', 'password1': 'pAzzw0rd!', 'password2': 'pAzzw0rd!', },
        content_type='application/json',
    )
    resp2 = client.post(
        '/api/login/',
        {'email': 'test@test.com', 'password': 'pAzzw0rd!', },
        content_type='application/json',
    )
    resp = client.post(
        '/api/image/',
        {'image': open('tests/blog/media/image_big.jpg', 'rb')},
    )

    assert resp.status_code == 201
    images = ImageModel.objects.all()
    assert len(images) == 1


@pytest.mark.django_db
def test_anon_cannot_upload_image(client):
    resp = client.post(
        '/api/image/',
        {'image': 'media/image_small.jpg'},
        content_type='application/json',
    )
    assert resp.status_code == 403
