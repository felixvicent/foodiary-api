import { Meal } from '@application/entities/Meal';
import { ResourceNotFound } from '@application/errors/application/ResourceNotFound';
import { MealRepository } from '@infra/database/dynamo/repositories/MealRepository';
import { Injectable } from '@kernel/decorators/Injectable';

const MAX_ATTEMPTS = 2;

@Injectable()
export class ProcessMealUseCase {
  constructor(private readonly mealRepository: MealRepository) {}

  async execute({
    accountId,
    mealId,
  }: ProcessMealUseCase.Input): Promise<ProcessMealUseCase.Output> {
    const meal = await this.mealRepository.findById({ accountId, mealId });

    if (!meal) {
      throw new ResourceNotFound(`Meal "${mealId}" not found.`);
    }

    if (meal.status === Meal.Status.UPLOADING) {
      throw new Error(`Meal "${mealId}" is still uploading.`);
    }

    if (meal.status === Meal.Status.PROCESSING) {
      throw new Error(`Meal "${mealId}" is already being processed.`);
    }

    if (meal.status === Meal.Status.SUCCESS) {
      return;
    }

    try {
      meal.status = Meal.Status.PROCESSING;
      meal.attempts += 1;
      await this.mealRepository.save(meal);

      meal.status = Meal.Status.SUCCESS;
      meal.name = 'Almoço';
      meal.icon = '🥐';
      meal.foods = [
        {
          calories: 100,
          carbohydrated: 200,
          fats: 300,
          name: 'Pãozin',
          proteins: 200,
          quantity: '2 unidades',
        },
      ];

      await this.mealRepository.save(meal);
    } catch (error) {
      meal.status =
        meal.attempts >= MAX_ATTEMPTS ? Meal.Status.FAILED : Meal.Status.QUEUED;
      await this.mealRepository.save(meal);

      throw error;
    }
  }
}

export namespace ProcessMealUseCase {
  export type Input = {
    accountId: string;
    mealId: string;
  };

  export type Output = void;
}
