from rest_framework import serializers
from .models import Job, Application


# JOB SERIALIZER
class JobSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(
        source="created_by.username", read_only=True
    )

    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "company",
            "location",
            "description",
            "created_by",
            "created_by_username",
            "created_at",
        ]
        read_only_fields = ["created_by", "created_at"]


# APPLICATION SERIALIZER
class ApplicationSerializer(serializers.ModelSerializer):
    candidate_username = serializers.CharField(
        source="candidate.username", read_only=True
    )

    # Return full job details in responses
    job = JobSerializer(read_only=True)

    # Accept job id when creating (job_id in JSON → job FK)
    job_id = serializers.PrimaryKeyRelatedField(
        queryset=Job.objects.all(), write_only=True, source="job"
    )

    class Meta:
        model = Application
        fields = [
            "id",
            "job",              # nested job object (for GET)
            "job_id",           # job id to POST
            "candidate",
            "candidate_username",
            "cover_letter",
            "created_at",
        ]
        read_only_fields = ["candidate", "created_at"]
