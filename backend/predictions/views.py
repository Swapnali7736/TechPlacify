from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PredictionHistory
from .serializers import PredictRequestSerializer, PredictionHistorySerializer
from .ml_service import predict_placement


class PredictPlacementView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        serializer = PredictRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        student_name = data.get('student_name') or request.user.username or "Student"
        stream = data['stream']
        cgpa = data['cgpa']
        internships = data['internships']
        projects = data['projects']
        backlogs = data['backlogs']
        skills_text = data.get('skills', '')

        project_name_1 = data.get('project_name_1', '')
        project_domain_1 = data.get('project_domain_1', '')
        project_name_2 = data.get('project_name_2', '')
        project_domain_2 = data.get('project_domain_2', '')

        # Run inference
        result = predict_placement(
            stream=stream,
            cgpa=cgpa,
            internships=internships,
            backlogs=backlogs,
            projects=projects,
            skills_text=skills_text
        )

        # Save to user's history
        history_record = PredictionHistory.objects.create(
            user=request.user,
            student_name=student_name,
            stream=stream,
            cgpa=cgpa,
            internships=internships,
            projects=projects,
            backlogs=backlogs,
            skills=skills_text,
            project_name_1=project_name_1,
            project_domain_1=project_domain_1,
            project_name_2=project_name_2,
            project_domain_2=project_domain_2,
            prediction=result['prediction'],
            placement_chance=result['placement_chance'],
            skill_score=result['skill_score'],
            tier1_eligible=result['tier1_eligible'],
            company_tiers=result['company_tiers'],
            action_plan=result['action_plan']
        )

        # Update user's profile with latest cgpa/stream if needed
        user = request.user
        if user.cgpa != cgpa or user.stream != stream:
            user.cgpa = cgpa
            user.stream = stream
            user.save(update_fields=['cgpa', 'stream'])

        response_data = {
            "id": history_record.id,
            "student_name": student_name,
            **result,
            "created_at": history_record.created_at
        }
        return Response(response_data, status=status.HTTP_201_CREATED)


class PredictionHistoryListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = PredictionHistorySerializer

    def get_queryset(self):
        return PredictionHistory.objects.filter(user=self.request.user)


class PredictionHistoryDetailView(generics.RetrieveDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = PredictionHistorySerializer

    def get_queryset(self):
        return PredictionHistory.objects.filter(user=self.request.user)
