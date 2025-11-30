from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['is_staff'] = user.is_staff
        token['is_active'] = user.is_active
        token['role'] = user.role
        token['username']= user.username
        token['full_name'] = user.get_full_name().title()
        return token