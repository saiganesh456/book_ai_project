from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    description = models.TextField()

    rating = models.FloatField(default=1)

    # 🔥 NEW FIELDS
    image = models.URLField(null=True, blank=True)
    price = models.FloatField(default=100)
    genre = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.title