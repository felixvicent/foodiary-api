import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import KSUID from 'ksuid';

import { Meal } from '@application/entities/Meal';
import { s3Client } from '@infra/clients/s3Client';
import { Injectable } from '@kernel/decorators/Injectable';
import { AppConfig } from '@shared/config/AppConfig';
import { minutesToSecond } from '@shared/utils/minutesToSeconds';

@Injectable()
export class MealsFileStorageGateway {
  constructor(private readonly appConfig: AppConfig) {}

  static generateInputFileKey({
    accountId,
    inputType,
  }: MealsFileStorageGateway.GenerateInputFileKeyParams): string {
    const extension = inputType === Meal.InputType.AUDIO ? 'm4a' : 'jpeg';
    const filename = `${KSUID.randomSync().string}.${extension}`;

    return `${accountId}/${filename}`;
  }

  async createPost({
    file,
    mealId,
  }: MealsFileStorageGateway.CreatePostParams): Promise<MealsFileStorageGateway.CreatePostResult> {
    const bucket = this.appConfig.storage.mealsBucket;
    const contentType =
      file.inputType === Meal.InputType.AUDIO ? 'audio/m4a' : 'image/jpeg';

    const { fields, url } = await createPresignedPost(s3Client, {
      Bucket: bucket,
      Key: file.key,
      Expires: minutesToSecond(5),
      Conditions: [
        { bucket },
        ['eq', '$key', file.key],
        ['eq', '$Content-Type', contentType],
        ['content-length-range', file.size, file.size],
      ],
      Fields: { 'x-amz-meta-mealid': mealId },
    });

    const uploadSignature = Buffer.from(
      JSON.stringify({
        url,
        fields: { ...fields, 'Content-Type': contentType },
      }),
    ).toString('base64');

    return { uploadSignature };
  }
}

export namespace MealsFileStorageGateway {
  export type GenerateInputFileKeyParams = {
    accountId: string;
    inputType: Meal.InputType;
  };

  export type CreatePostParams = {
    mealId: string;
    file: {
      key: string;
      size: number;
      inputType: Meal.InputType;
    };
  };

  export type CreatePostResult = {
    uploadSignature: string;
  };
}
