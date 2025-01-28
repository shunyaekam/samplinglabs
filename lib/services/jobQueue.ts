import { Queue } from 'bullmq'
import { vectorizeCourse } from './vectorStore'

const vectorizationQueue = new Queue('vectorization', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
})

export async function queueVectorization(courseId: string) {
  await vectorizationQueue.add('vectorize-course', { courseId }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  })
} 