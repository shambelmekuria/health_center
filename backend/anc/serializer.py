from datetime import datetime
from rest_framework import serializers
from .models import Anc
from django.utils import timezone


class AncSerializer(serializers.ModelSerializer):
    payment_check = ['laboratory','medicine','ultrasound','service','imaging','procedure']
    class Meta:
        model = Anc
        fields = "__all__"
        
    def create(self, validated_data):
        value = validated_data['mrn']
        today = timezone.now().date()
        check = Anc.objects.filter(mrn=value,created_at__date=today).count()
        if check >=1:
            raise serializers.ValidationError("Already Registered Today")   
        return super().create(validated_data)
    def update(self, instance, validated_data):
        value = validated_data['mrn']
        check = Anc.objects.filter(mrn=value,created_at__date=instance.created_at.date()).exclude(id=instance.id).count()
        if check >=1:
            raise serializers.ValidationError("Unable to update: This MRN is already assigned to another entry today.") 
        return super().update(instance, validated_data)
    
