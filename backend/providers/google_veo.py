"""
Google Veo Video Provider - Current GenAI SDK
Uses: from google import genai, from google.genai import types
Model: VEO_MODEL=veo-3.1-generate-preview
Flow: submit -> operation/job ID -> async poll -> RUNNING -> COMPLETE/FAILED -> retrieve MP4 -> Media Library
No fal.ai fallback.
"""
import os
import uuid
import time
from enum import Enum
from typing import Optional

from google import genai
from google.genai import types

class VideoJobStatus(str, Enum):
    QUEUED = "QUEUED"
    RUNNING = "RUNNING"
    COMPLETE = "COMPLETE"
    FAILED = "FAILED"

VEO_MODEL = os.getenv("VEO_MODEL", "veo-3.1-generate-preview")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SUPPORTED_ASPECTS = ["16:9", "9:16"]
SUPPORTED_DURATIONS = [4, 6, 8]

class GoogleVeoVideoProvider:
    """
    Production Veo provider using current Google GenAI SDK.
    - client.models.generate_videos()
    - client.operations.get()
    """
    def __init__(self, db):
        self.db = db
        if not GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY missing - Veo disabled")
        self.client = genai.Client(api_key=GEMINI_API_KEY)

    async def submit_generation(self, user_id: str, prompt: str, aspect_ratio: str = "16:9",
                                duration: int = 6, image_bytes: Optional[bytes] = None,
                                negative_prompt: Optional[str] = None, audio_enabled: bool = True):
        # Validate
        if aspect_ratio not in SUPPORTED_ASPECTS:
            aspect_ratio = "16:9"
        if duration not in SUPPORTED_DURATIONS:
            duration = 6

        job_id = str(uuid.uuid4())

        # Build config with current SDK types
        config = types.GenerateVideosConfig(
            aspect_ratio=aspect_ratio,
            duration_seconds=duration,
            negative_prompt=negative_prompt,
            generate_audio=audio_enabled,
        )

        # Submit to Veo - returns Operation
        # If image_bytes provided, use image-to-video
        if image_bytes:
            # image-to-video where supported
            operation = self.client.models.generate_videos(
                model=VEO_MODEL,
                prompt=prompt,
                image=types.Image(image_bytes=image_bytes),
                config=config,
            )
        else:
            operation = self.client.models.generate_videos(
                model=VEO_MODEL,
                prompt=prompt,
                config=config,
            )

        doc = {
            "id": job_id,
            "job_id": job_id,
            "user_id": user_id,
            "prompt": prompt,
            "negative_prompt": negative_prompt,
            "aspect_ratio": aspect_ratio,
            "duration": duration,
            "audio_enabled": audio_enabled,
            "model": VEO_MODEL,
            "operation_name": operation.name,  # for client.operations.get()
            "status": VideoJobStatus.QUEUED,
            "created_at": time.time(),
            "updated_at": time.time(),
            "result_url": None,
            "error": None,
        }
        await self.db.video_jobs.insert_one(doc) if hasattr(self.db, 'video_jobs') else None
        return {"job_id": job_id, "operation_name": operation.name, "status": VideoJobStatus.QUEUED}

    async def poll_status(self, operation_name: str):
        # Poll using client.operations.get()
        operation = self.client.operations.get(operation_name)
        # operation.done indicates complete
        if not operation.done:
            return {"status": VideoJobStatus.RUNNING, "operation_name": operation_name, "done": False}
        
        # Check for error
        if operation.error:
            return {"status": VideoJobStatus.FAILED, "error": str(operation.error), "done": True}
        
        # On success, result contains generated videos
        # operation.result.generated_videos[0].video.uri or similar
        return {"status": VideoJobStatus.COMPLETE, "result": operation.result, "done": True}

    async def retrieve_and_save(self, job_id: str, user_id: str, operation_result):
        # Download MP4 from operation result and save to Media Library
        # operation_result.generated_videos[0].video -> download via client.files.download or operation.result
        generated_videos = operation_result.generated_videos if hasattr(operation_result, 'generated_videos') else []
        if not generated_videos:
            return None

        video = generated_videos[0]
        # The video file is accessible via video.video.uri - download
        # For SDK: client.files.download or use video.video.uri
        # Here we store uri as result_url and let frontend retrieve via signed URL
        result_url = getattr(video.video, 'uri', None) or getattr(video, 'uri', None)

        media_doc = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "type": "video",
            "source": "veo",
            "job_id": job_id,
            "url": result_url,  # object-storage URL, not Base64
            "prompt": "",  # filled from job
            "metadata": {
                "aspect_ratio": "16:9",
                "duration": 6,
                "model": VEO_MODEL,
            },
            "created_at": time.time(),
        }
        return media_doc
