from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics  import ListCreateAPIView

# custom code
from .serializer import AncSerializer
from .models import Anc

class AncViewSet(viewsets.ModelViewSet):
    serializer_class = AncSerializer
    queryset = Anc.objects.all()


# dashboard For ANC

@api_view(['GET'])
def dashboard(request):
    return Response({"total":30})


    

    