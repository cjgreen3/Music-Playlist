from django.db import models

# Create your models here.

class Playlist(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name
    
class Song(models.Model):
    name = models.CharField(max_length=100)
    artist = models.CharField(max_length=100, default='Unknown')
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, related_name="songs", null=True, blank=True)
    # album = models.CharField(max_length=100)
    # release_date = models.DateField()
    # likes = models.IntegerField()

    def __str__(self):
        return self.name

    


