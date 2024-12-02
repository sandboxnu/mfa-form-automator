import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { queryClient } from '../_app';

// https://vercel.com/docs/storage/vercel-blob/client-upload
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const body = request.body as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathName) => {
        return {
          allowedContentTypes: ['application/pdf'],
          tokenPayload: JSON.stringify({
            pathName,
          }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('Blob uploaded:', blob);
      },
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    return response.status(400).json({ error: (error as Error).message });
  }
}
