from django.db import models

# Create your models here.
class Song(models.Model):
    name = models.CharField(max_length=100)
    artist = models.CharField(max_length=100, default='Unknown')
    # album = models.CharField(max_length=100)
    # release_date = models.DateField()
    # likes = models.IntegerField()

    def __str__(self):
        return self.name


