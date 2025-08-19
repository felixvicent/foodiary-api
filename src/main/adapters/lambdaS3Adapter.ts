import { IFileEventHandler } from '@application/contracts/IFIleEventHandler';
import { S3Handler } from 'aws-lambda';

export function lambdaS3Adapter(eventHander: IFileEventHandler): S3Handler {
  return async (event) => {
    const responses = await Promise.allSettled(
      event.Records.map((record) =>
        eventHander.handle({ fileKey: record.s3.object.key }),
      ),
    );

    const failedEvents = responses.filter(
      (response) => response.status === 'rejected',
    );

    for (const event of failedEvents) {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(event.reason, null, 2));
    }
  };
}
