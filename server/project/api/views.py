from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Playlist, Song
from .serializer import PlaylistSerializer, SongSerializer

@api_view(['GET'])
def get_playlists(request):
        playlists = Playlist.objects.all()
        serialized_playlists = PlaylistSerializer(playlists, many=True).data
        return Response(serialized_playlists, status=status.HTTP_200_OK)
        
@api_view(['POST'])
def create_playlist(request):
    data = request.data
    serializer = PlaylistSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def add_song_to_playlist(request, playlist_id):
    try:
        # Fetch the playlist by ID
        playlist = Playlist.objects.get(pk=playlist_id)
    except Playlist.DoesNotExist:
        return Response({"error": "Playlist not found"}, status=status.HTTP_404_NOT_FOUND)

    # Get the song ID from the request data
    song_id = request.data.get("song_id")
    if not song_id:
        return Response({"error": "Song ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Fetch the existing song by ID
        song = Song.objects.get(pk=song_id)
    except Song.DoesNotExist:
        return Response({"error": "Song not found"}, status=status.HTTP_404_NOT_FOUND)

    # Associate the song with the playlist
    song.playlist = playlist
    song.save()

    # Return the updated song data
    serializer = SongSerializer(song)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def remove_song_from_playlist(request, playlist_id, song_id):
    try:
        # Fetch the playlist by ID
        playlist = Playlist.objects.get(pk=playlist_id)
    except Playlist.DoesNotExist:
        return Response({"error": "Playlist not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        # Fetch the song by ID
        song = Song.objects.get(pk=song_id)
    except Song.DoesNotExist:
        return Response({"error": "Song not found"}, status=status.HTTP_404_NOT_FOUND)

    # Check if the song is associated with the given playlist
    if song.playlist != playlist:
        return Response({"error": "Song is not in this playlist"}, status=status.HTTP_400_BAD_REQUEST)

    # Remove the song from the playlist
    song.playlist = None
    song.save()

    return Response({"message": "Song removed from playlist successfully"}, status=status.HTTP_200_OK)

@api_view(["GET"])
def get_songs(request):
    songs = Song.objects.all()
    serialized_songs = SongSerializer(songs, many=True).data
    return Response(serialized_songs, status=status.HTTP_200_OK)
    
@api_view(["POST"])
def create_song(request):
    data = request.data
    serializer = SongSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PUT", "DELETE"])
def song_detail(request, pk):
    try:
        song = Song.objects.get(pk=pk)
    except Song.DoesNotExist:
        return Response({"error": "Song not found"}, status=status.HTTP_404_NOT_FOUND)
    if request.method == "DELETE":
        song.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == "PUT":
        data = request.data
        serializer = SongSerializer(song, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)