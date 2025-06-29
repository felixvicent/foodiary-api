import { Controller } from '@application/contracts/Controller';
import { ApplicationError } from '@application/errors/application/ApplicationError';
import { ErrorCode } from '@application/errors/ErrorCode';
import { HttpError } from '@application/errors/http/HttpError';
import { lambdaBodyParser } from '@main/utils/lambdaBodyParser';
import { lambdaErrorResponse } from '@main/utils/lambdaErrorResponse';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { ZodError } from 'zod';

export function lambdaHttpAdapter(controller: Controller<unknown>) {
  return async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    try {
      const body = lambdaBodyParser(event.body);
      const params = event.pathParameters ?? {};
      const queryParams = event.queryStringParameters ?? {};

      const response = await controller.execute({ body, params, queryParams });

      return {
        statusCode: response.statusCode,
        body: response.body ? JSON.stringify(response.body) : undefined,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return lambdaErrorResponse({
          code: ErrorCode.VALIDATION,
          message: error.issues.map(issue => ({
            field: issue.path.join('.'),
            error: issue.message,
          })),
          statusCode: 400,
        });
      }

      if (error instanceof HttpError) {
        return lambdaErrorResponse(error);
      }

      if (error instanceof ApplicationError) {
        return lambdaErrorResponse({
          code: error.code,
          message: error.message,
          statusCode: error.statusCode ?? 400,
        });
      }

      // eslint-disable-next-line no-console
      console.log(error);

      return lambdaErrorResponse({
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        statusCode: 500,
      });
    }
  };

}
