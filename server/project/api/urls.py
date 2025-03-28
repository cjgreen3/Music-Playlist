from django.urls import path
from .views import add_song_to_playlist, create_playlist, create_song, get_playlists, get_songs, remove_song_from_playlist, song_detail

urlpatterns = [
    path('songs/', get_songs),
    path('songs/create/', create_song, name='create_song'),
    path('songs/<int:pk>/', song_detail, name='song_detail'),
    path("playlists/", get_playlists, name="playlists"),
    path("playlists/create/", create_playlist, name="create_playlist"),
    path("playlists/<int:playlist_id>/add-song-to-playlist/", add_song_to_playlist, name="add_song_to_playlist"),
    path(
        "playlists/<int:playlist_id>/remove-song/<int:song_id>/",
        remove_song_from_playlist,
        name="remove_song_from_playlist",
    ),
]