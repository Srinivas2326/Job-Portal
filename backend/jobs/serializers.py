from rest_framework import serializers
from .models import Job, Application


# -------------------------
# JOB SERIALIZER
# -------------------------
class JobSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source="created_by.username", read_only=True)

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


# -------------------------
# APPLICATION SERIALIZER
# -------------------------
class ApplicationSerializer(serializers.ModelSerializer):
    candidate_username = serializers.CharField(source="candidate.username", read_only=True)

    # IMPORTANT FIX: accept job ID correctly
    job = serializers.PrimaryKeyRelatedField(queryset=Job.objects.all())

    class Meta:
        model = Application
        fields = [
            "id",
            "job",
            "candidate",
            "candidate_username",
            "cover_letter",
            "created_at",
        ]
        read_only_fields = ["candidate", "created_at"]
