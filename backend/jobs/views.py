from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied

from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer


# -----------------------------
# CUSTOM PERMISSIONS
# -----------------------------

class IsRecruiter(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and hasattr(request.user, "profile")
            and request.user.profile.role == "recruiter"
        )


class IsCandidate(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and hasattr(request.user, "profile")
            and request.user.profile.role == "candidate"
        )


# -----------------------------
# JOB LIST + CREATE
# -----------------------------

class JobListCreateView(generics.ListCreateAPIView):
    queryset = Job.objects.all().order_by("-created_at")
    serializer_class = JobSerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated(), IsRecruiter()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


# -----------------------------
# JOB DETAIL
# -----------------------------

class JobDetailView(generics.RetrieveAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer


# -----------------------------
# APPLY TO JOB (Candidate only)
# -----------------------------

class ApplicationCreateView(generics.CreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def perform_create(self, serializer):
        job = serializer.validated_data["job"]

        # Prevent duplicate applications
        if Application.objects.filter(job=job, candidate=self.request.user).exists():
            raise PermissionDenied("You already applied for this job.")

        serializer.save(candidate=self.request.user)



# -----------------------------
# LIST MY APPLICATIONS (Candidate Dashboard)
# -----------------------------

class MyApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated, IsCandidate]

    def get_queryset(self):
        return Application.objects.filter(candidate=self.request.user)


# -----------------------------
# RECRUITER: LIST THEIR POSTED JOBS
# -----------------------------

class RecruiterJobsView(generics.ListAPIView):
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated, IsRecruiter]

    def get_queryset(self):
        return Job.objects.filter(created_by=self.request.user)
