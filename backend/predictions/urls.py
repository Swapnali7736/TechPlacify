from django.urls import path
from .views import (
    PredictPlacementView,
    PredictionHistoryListView,
    PredictionHistoryDetailView,
)

urlpatterns = [
    path('predict/', PredictPlacementView.as_view(), name='placement_predict'),
    path('history/', PredictionHistoryListView.as_view(), name='prediction_history_list'),
    path('history/<int:pk>/', PredictionHistoryDetailView.as_view(), name='prediction_history_detail'),
]
