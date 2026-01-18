// Placeholder for S3 service
// You can implement this later when you add file upload functionality

export const uploadToS3 = async (
  file: Buffer,
  filename: string
): Promise<string> => {
  // AWS S3 upload logic would go here
  throw new Error('S3 service not implemented yet');
};

export const deleteFromS3 = async (fileUrl: string): Promise<void> => {
  // AWS S3 delete logic would go here
  throw new Error('S3 service not implemented yet');
};