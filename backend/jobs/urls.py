from django.urls import path
from .views import (
    JobListCreateView,
    JobDetailView,
    ApplicationCreateView,
    MyApplicationsView,
    RecruiterJobsView
)

urlpatterns = [
    path("", JobListCreateView.as_view()),
    path("<int:pk>/", JobDetailView.as_view()),
    path("apply/", ApplicationCreateView.as_view()),   # THIS ONE
    path("my-applications/", MyApplicationsView.as_view()),
    path("my-jobs/", RecruiterJobsView.as_view()),
]
