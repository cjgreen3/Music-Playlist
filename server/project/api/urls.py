from django.urls import path
from .views import create_song, get_songs, song_detail

urlpatterns = [
    path('songs/', get_songs),
    path('songs/create/', create_song, name='create_song'),
    path('songs/<int:pk>/', song_detail, name='song_detail'),
]