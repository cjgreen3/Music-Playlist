from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Song
from .serializer import SongSerializer

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