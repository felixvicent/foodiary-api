import KSUID from 'ksuid';

export class Profile {
  readonly accountId: string;

  name: string;

  birthDate: Date;

  gender: Profile.Gender;

  height: number;

  weight: number;

  readonly goal: Profile.Goal;

  readonly activityLevel: Profile.ActivityLevel;

  readonly createdAt: Date;

  constructor(attr: Profile.Attributes) {
    this.accountId = attr.accountId ?? KSUID.randomSync().string;
    this.name = attr.name;
    this.birthDate = attr.birthDate;
    this.gender = attr.gender;
    this.height = attr.height;
    this.weight = attr.weight;
    this.activityLevel = attr.activityLevel;
    this.goal = attr.goal;
    this.createdAt = attr.createdAt ?? new Date();
  }
}

export namespace Profile {
  export type Attributes = {
    accountId: string;
    name: string;
    birthDate: Date;
    gender: Profile.Gender;
    height: number;
    weight: number;
    goal: Profile.Goal;
    activityLevel: Profile.ActivityLevel;
    createdAt?: Date;
  };

  export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
  }

  export enum Goal {
    LOSE = 'LOSE',
    GAIN = 'GAIN',
    MAINTAIN = 'MAINTAIN',
  }

  export enum ActivityLevel {
    SEDENTARY = 'SEDENTARY',
    LIGHT = 'LIGHT',
    MODERATE = 'MODERATE',
    HEAVY = 'HEAVY',
    ATHLETE = 'ATHLETE',
  }
}
