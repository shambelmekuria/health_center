from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError

# Create your models here.
def validate_payment(value):
    if value<0:
        raise ValidationError('Payment must be positive.')

class Anc (models.Model):
    name = models.CharField(_("Name"), max_length=255)
    mrn = models.CharField(_("MRN"), max_length=100) # Medical Record Number
    card_payment = models.DecimalField(
        _("Card Payment"),
        max_digits=8,
        decimal_places=2,
        validators=[validate_payment]
    )
    laboratory = models.DecimalField(
        _("Laboratory Payment"), max_digits=8, decimal_places=2, blank=True, null=True
    )
    medicine = models.DecimalField(
        _("Medicine Payment"), max_digits=8, decimal_places=2, blank=True, null=True
    )
    ultrasound = models.DecimalField(
        _("Ultrasound Payment"), max_digits=8, decimal_places=2, blank=True, null=True
    )
    service = models.DecimalField(
        _("Service Payment"), max_digits=8, decimal_places=2, default=0
    )

    imaging = models.DecimalField(
        _("Imaging Payment"), max_digits=8, decimal_places=2, blank=True, null=True
    )
    procedure = models.DecimalField(
        _("Procedure Payment"), max_digits=8, decimal_places=2, blank=True, null=True
    )
    sleep_patient = models.DecimalField(
        _("Sleep Patient"), max_digits=8, decimal_places=2, blank=True, null=True
    )
    total_payment = models.DecimalField(
        _("Total"), max_digits=8, decimal_places=2, default=0, editable=False
    )
    created_at = models.DateTimeField(_("Register Date"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Last Update"), auto_now=True)
    
    @property
    def total(self):
        common_payment = (
            self.card_payment
            + (self.laboratory or 0)
            + (self.medicine or 0)
            + (self.ultrasound or 0)
            + (self.service or 0)
        )
        not_common_payment = (
            (self.imaging or 0) + (self.procedure or 0) + (self.sleep_patient or 0)
        )
        return f"${common_payment + not_common_payment}"

    def save(self, *args, **kwargs):
        # Clean Name
        self.name = self.name.title()
        
        # Payment
        common_payment = (
            self.card_payment
            + (self.laboratory or 0)
            + (self.medicine or 0)
            + (self.ultrasound or 0)
            + (self.service or 0)
        )
        not_common_payment = (
            (self.imaging or 0) + (self.procedure or 0) + (self.sleep_patient or 0)
        )
        self.total_payment = common_payment + not_common_payment
        self.full_clean()
        return super().save(*args, **kwargs)
    
    class Meta:
        verbose_name = _("ANCVisit")
        verbose_name_plural = _("ANCVisits")

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse("ANCVisit_detail", kwargs={"pk": self.pk})
