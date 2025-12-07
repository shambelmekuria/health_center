from datetime import datetime
from rest_framework import serializers
from .models import Anc
from django.utils import timezone


class AncSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anc
        fields = "__all__"
    def validate_mrn(self,value):
        today = timezone.now().date()
        check = Anc.objects.filter(mrn=value,created_at__date=today).count()
        if check >1:
            raise serializers.ValidationError("Already Registered Today")
        return value