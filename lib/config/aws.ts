export const awsConfig = {
  cloudfront: {
    baseUrl: process.env.NEXT_PUBLIC_CLOUDFRONT_URL || '',
    courseContentPath: '/courses',
    mediaPath: '/media',
  },
  s3: {
    region: process.env.AWS_REGION || 'us-east-1',
    courseBucket: process.env.AWS_COURSE_BUCKET || '',
  }
} 