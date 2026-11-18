from rest_framework import serializers
from .models import PredictionHistory
from .ml_service import STREAM_NAMES


class PredictRequestSerializer(serializers.Serializer):
    student_name = serializers.CharField(required=False, allow_blank=True, max_length=150)
    stream = serializers.IntegerField()
    cgpa = serializers.FloatField(min_value=0.0, max_value=10.0)
    internships = serializers.IntegerField(min_value=0, default=0)
    projects = serializers.IntegerField(min_value=0, default=0)
    backlogs = serializers.IntegerField(min_value=0, default=0)
    skills = serializers.CharField(required=False, allow_blank=True)

    project_name_1 = serializers.CharField(required=False, allow_blank=True, max_length=200)
    project_domain_1 = serializers.CharField(required=False, allow_blank=True, max_length=100)
    project_name_2 = serializers.CharField(required=False, allow_blank=True, max_length=200)
    project_domain_2 = serializers.CharField(required=False, allow_blank=True, max_length=100)

    def validate_stream(self, value):
        if value not in STREAM_NAMES:
            raise serializers.ValidationError("Stream must be 2 (CS), 3 (IT), or 4 (Other).")
        return value


class PredictionHistorySerializer(serializers.ModelSerializer):
    stream_name = serializers.SerializerMethodField()

    class Meta:
        model = PredictionHistory
        fields = [
            'id',
            'student_name',
            'stream',
            'stream_name',
            'cgpa',
            'internships',
            'projects',
            'backlogs',
            'skills',
            'project_name_1',
            'project_domain_1',
            'project_name_2',
            'project_domain_2',
            'prediction',
            'placement_chance',
            'skill_score',
            'tier1_eligible',
            'company_tiers',
            'action_plan',
            'created_at'
        ]
        read_only_fields = fields

    def get_stream_name(self, obj):
        return STREAM_NAMES.get(obj.stream, "Other")
