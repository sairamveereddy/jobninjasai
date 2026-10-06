import os
import boto3
from dotenv import load_dotenv

# Load .env from backend directory
script_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dotenv_path = os.path.join(script_dir, ".env")
load_dotenv(dotenv_path)

class S3Service:
    def __init__(self):
        self.s3 = boto3.client(
            's3',
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            region_name=os.getenv("AWS_REGION")
        )
        self.bucket = os.getenv("AWS_S3_BUCKET")

    def upload_resume(self, file_content, file_name):
        try:
            self.s3.put_object(
                Bucket=self.bucket,
                Key=f"resumes/{file_name}",
                Body=file_content
            )
            return f"https://{self.bucket}.s3.{os.getenv('AWS_REGION')}.amazonaws.com/resumes/{file_name}"
        except Exception as e:
            print(f"S3 Upload Error: {e}")
            return None
