import KSUID from 'ksuid';

export class Meal {
  readonly id: string;

  readonly accountId: string;

  status: Meal.Status;

  attempts: number;

  readonly inputType: Meal.InputType;

  readonly inputFileKey: string;

  name: string;

  icon: string;

  foods: Meal.Food[];

  readonly createdAt: Date;

  constructor(attr: Meal.Attributes) {
    this.id = attr.id ?? KSUID.randomSync().string;
    this.accountId = attr.accountId;
    this.attempts = attr.attempts ?? 0;
    this.foods = attr.foods ?? [];
    this.icon = attr.icon ?? '';
    this.inputFileKey = attr.inputFileKey;
    this.inputType = attr.inputType;
    this.name = attr.name ?? '';
    this.status = attr.status;
    this.createdAt = attr.createdAt ?? new Date();
  }
}

export namespace Meal {
  export type Attributes = {
    id?: string;
    accountId: string;
    status: Meal.Status;
    inputFileKey: string;
    inputType: Meal.InputType;
    attempts?: number;
    name?: string;
    icon?: string;
    foods?: Meal.Food[];
    createdAt?: Date;
  };

  export enum Status {
    UPLOADING = 'UPLOADING',
    QUEUED = 'QUEUED',
    PROCESSING = 'PROCESSING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
  }

  export enum InputType {
    AUDIO = 'AUDIO',
    PICTURE = 'PICTURE',
  }

  export type Food = {
    name: string;
    quantity: string;
    calories: number;
    proteins: number;
    carbohydrated: number;
    fats: number;
  };
}
