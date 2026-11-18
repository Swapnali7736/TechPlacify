from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    STREAM_CHOICES = (
        (2, 'Computer Science'),
        (3, 'Information Technology'),
        (4, 'Other'),
    )

    email = models.EmailField(unique=True)
    stream = models.IntegerField(choices=STREAM_CHOICES, default=2)
    cgpa = models.FloatField(null=True, blank=True)

    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username or self.email
