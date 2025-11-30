from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _ 

ROLE_CHOICES ={
    'cashier':'Cashier',
    'manager':'Manager'
}
# Customize defualt user models
class CustomUser(AbstractUser):
    role = models.CharField(_("Role"), max_length=50,choices=ROLE_CHOICES,default='cashier')

