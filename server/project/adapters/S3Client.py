import os
import boto3
from botocore.exceptions import NoCredentialsError, ClientError

class S3Handler:
    def __init__(self, bucket_name=None, region_name="auto"):
        self.s3_client = boto3.client(
            "s3",
            endpoint_url=os.getenv("R2_ENDPOINT"),
            aws_access_key_id=os.getenv("R2_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("R2_SECRET_ACCESS_KEY"),
            region_name=region_name,
        )
        self.bucket_name = bucket_name or os.getenv("S3_BUCKET")

    def upload_file(self, file_obj, file_name, acl="private"):
        """Upload a file to S3."""
        try:
            self.s3_client.upload_fileobj(
                file_obj, self.bucket_name, file_name, ExtraArgs={"ACL": acl}
            )
            return f"https://{self.bucket_name}.s3.amazonaws.com/{file_name}"
        except NoCredentialsError:
            return "Credentials not available"
        except ClientError as e:
            return str(e)

    def download_file(self, file_name, download_path):
        """Download a file from S3."""
        try:
            self.s3_client.download_file(self.bucket_name, file_name, download_path)
            return f"File {file_name} downloaded to {download_path}"
        except ClientError as e:
            return str(e)

    def delete_file(self, file_name):
        """Delete a file from S3."""
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=file_name)
            return f"File {file_name} deleted from {self.bucket_name}"
        except ClientError as e:
            return str(e)

    def generate_presigned_url(self, file_name, expiration=3600):
        """Generate a pre-signed URL for accessing a file."""
        try:
            url = self.s3_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": self.bucket_name, "Key": file_name},
                ExpiresIn=expiration,
            )
            return url
        except ClientError as e:
            return str(e)