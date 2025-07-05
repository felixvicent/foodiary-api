import { Controller } from '@application/contracts/Controller';
import { Meal } from '@application/entities/Meal';
import { ListMealsByDayQyery } from '@application/query/ListMealsByDayQuery';
import { Injectable } from '@kernel/decorators/Injectable';
import { ListMealsByDaySchema } from './schemas/listMealsByDaySchema';

@Injectable()
export class ListMealsByDayController extends Controller<
  'private',
  ListMealsByDayController.Response
> {
  constructor(private readonly listMealsByDayQuery: ListMealsByDayQyery) {
    super();
  }

  protected override async handle({
    accountId,
    queryParams,
  }: Controller.Request<'private'>): Promise<
    Controller.Response<ListMealsByDayController.Response>
  > {
    const { date } = ListMealsByDaySchema.parse(queryParams);

    const { meals } = await this.listMealsByDayQuery.execute({
      accountId,
      date,
    });

    return {
      statusCode: 200,
      body: {
        meals,
      },
    };
  }
}

export namespace ListMealsByDayController {
  export type Response = {
    meals: {
      id: string;
      createdAt: string;
      name: string;
      icon: string;
      foods: Meal.Food[];
    }[];
  };
}
