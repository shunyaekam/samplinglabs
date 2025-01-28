import { awsConfig } from '../config/aws'

export const getCourseContentUrl = (courseId: string, path: string) => {
  const CLOUDFRONT_URL = 'https://your-distribution.cloudfront.net'
  return `${CLOUDFRONT_URL}/courses/${courseId}/${path}`
}

export const getMediaUrl = (path: string) => {
  // Replace with your CloudFront distribution URL
  const CLOUDFRONT_URL = 'https://your-distribution.cloudfront.net'
  return `${CLOUDFRONT_URL}/media/${path}`
} 