import { Controller } from '@application/contracts/Controller';
import { SignInUseCase } from '@application/usecases/auth/SinInUseCase';
import { Injectable } from '@kernel/decorators/Injectable';
import { Schema } from '@kernel/decorators/Schema';
import { SignInBody, signInSChema } from './schemas/signInSchema';

@Injectable()
@Schema(signInSChema)
export class SignInController extends Controller<'public', SignInController.Response> {
  constructor(private readonly signInUseCase: SignInUseCase) {
    super();
  }

  protected override async handle(
    { body }: Controller.Request<'public', SignInBody>,
  ): Promise<Controller.Response<SignInController.Response>> {
    const { email, password } = body;

    const {
      accessToken,
      refreshToken,
    } = await this.signInUseCase.execute({ email, password });

    return {
      statusCode: 200,
      body: {
        accessToken,
        refreshToken,
      },
    };
  }
}

export namespace SignInController {
  export type Response = {
    accessToken: string;
    refreshToken: string;
  }
}
