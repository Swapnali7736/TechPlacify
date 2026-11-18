from django.db import models
from django.conf import settings


class PredictionHistory(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='predictions'
    )
    student_name = models.CharField(max_length=150)
    stream = models.IntegerField()
    cgpa = models.FloatField()
    internships = models.IntegerField(default=0)
    projects = models.IntegerField(default=0)
    backlogs = models.IntegerField(default=0)
    skills = models.TextField(blank=True)

    project_name_1 = models.CharField(max_length=200, blank=True)
    project_domain_1 = models.CharField(max_length=100, blank=True)
    project_name_2 = models.CharField(max_length=200, blank=True)
    project_domain_2 = models.CharField(max_length=100, blank=True)

    # Prediction outcomes
    prediction = models.IntegerField()
    placement_chance = models.FloatField()
    skill_score = models.IntegerField()
    tier1_eligible = models.BooleanField(default=False)
    company_tiers = models.JSONField(default=list)
    action_plan = models.JSONField(default=list)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student_name} - {self.placement_chance}% ({self.created_at.strftime('%Y-%m-%d %H:%M')})"
