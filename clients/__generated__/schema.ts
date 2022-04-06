import type { Dayjs } from 'dayjs';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { readonly [key: string]: unknown }> = { readonly [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { readonly [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { readonly [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  readonly ID: string;
  readonly String: string;
  readonly Boolean: boolean;
  readonly Int: number;
  readonly Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  readonly DateTime: Dayjs;
  /** ObjectId is a mongodb ObjectId. String of 12 or 24 hex chars */
  readonly ObjectId: string;
};

export type AcceptCompetitionInviteResponse = Competition | ForbiddenError | NotFoundError;

export type AcceptUserInviteResponse = ForbiddenError | NotFoundError | User;

export type AdditionalEntityFields = {
  readonly path?: InputMaybe<Scalars['String']>;
  readonly type?: InputMaybe<Scalars['String']>;
};

export type AuthenticationError = Error & {
  readonly __typename: 'AuthenticationError';
  readonly message: Scalars['String'];
};

export type CodeNotValidError = Error & {
  readonly __typename: 'CodeNotValidError';
  readonly message: Scalars['String'];
};

export type CommonSampleProps = {
  readonly _id: Scalars['ObjectId'];
  readonly appleHealthKitUUID?: Maybe<Scalars['String']>;
  readonly createdAt: Scalars['DateTime'];
  readonly endDate?: Maybe<Scalars['DateTime']>;
  readonly modifiedAt: Scalars['DateTime'];
  readonly sourceType: SourceType;
  readonly startDate: Scalars['DateTime'];
  readonly userId: Scalars['ObjectId'];
};

export type Competition = {
  readonly __typename: 'Competition';
  readonly _id: Scalars['ObjectId'];
  readonly competitionState: CompetitionState;
  readonly competitorIds: ReadonlyArray<Scalars['ObjectId']>;
  readonly competitors: ReadonlyArray<RestrictedUser>;
  readonly createdAt: Scalars['DateTime'];
  readonly createdBy?: Maybe<RestrictedUser>;
  readonly createdById: Scalars['ObjectId'];
  readonly endDate: Scalars['DateTime'];
  readonly leaderboard: ReadonlyArray<LeaderboardEntry>;
  readonly modifiedAt: Scalars['DateTime'];
  readonly modifiedBy?: Maybe<RestrictedUser>;
  readonly modifiedById: Scalars['ObjectId'];
  readonly name: Scalars['String'];
  readonly quantityType: QuantityType;
  readonly startDate: Scalars['DateTime'];
};

export type CompetitionByIdResponse = AuthenticationError | Competition | NotFoundError;

export type CompetitionInvitationResponse = ForbiddenError | InvitationResponseSuccess | NotFoundError;

export enum CompetitionState {
  FINISHED = 'FINISHED',
  FUTURE = 'FUTURE',
  STARTED = 'STARTED'
}

export type EmailNotValidError = Error & {
  readonly __typename: 'EmailNotValidError';
  readonly message: Scalars['String'];
};

export type Error = {
  readonly message: Scalars['String'];
};

export type Food = {
  readonly __typename: 'Food';
  readonly _id: Scalars['ObjectId'];
  readonly allNutrientsPer100g: ReadonlyArray<NutrientQuantity>;
  readonly createdAt: Scalars['DateTime'];
  readonly foodsWithProportions: ReadonlyArray<FoodWithProportion>;
  readonly image?: Maybe<Scalars['String']>;
  readonly modifiedAt: Scalars['DateTime'];
  readonly nutrientsPer100g: ReadonlyArray<NutrientQuantity>;
  readonly standardServingSize?: Maybe<Scalars['Float']>;
  readonly title: Scalars['String'];
};

export type FoodWithProportion = {
  readonly __typename: 'FoodWithProportion';
  readonly food: Food;
  readonly foodId: Scalars['ObjectId'];
  readonly proportion: Scalars['Float'];
};

export type FoodWithProportionInput = {
  readonly foodId: Scalars['ObjectId'];
  readonly proportion: Scalars['Float'];
};

export type ForbiddenError = Error & {
  readonly __typename: 'ForbiddenError';
  readonly message: Scalars['String'];
};

export type IUser = {
  readonly _id: Scalars['ObjectId'];
  readonly avatarUrl: Scalars['String'];
  readonly displayName: Scalars['String'];
};

export type InvitationResponseSuccess = {
  readonly __typename: 'InvitationResponseSuccess';
  readonly invitationToken: Scalars['String'];
  readonly invitationUrl: Scalars['String'];
};

export type LeaderboardEntry = {
  readonly __typename: 'LeaderboardEntry';
  readonly score: StatWithValue;
  readonly user: RestrictedUser;
};

export type LibreMonitor = {
  readonly __typename: 'LibreMonitor';
  readonly _id: Scalars['ObjectId'];
  readonly email: Scalars['String'];
};

export enum Locale {
  EN = 'EN',
  SV = 'SV'
}

export type LoginConfirmResponse = CodeNotValidError | EmailNotValidError | LoginConfirmSuccessfulResponse | LoginFailedError;

export type LoginConfirmSuccessfulResponse = {
  readonly __typename: 'LoginConfirmSuccessfulResponse';
  readonly accessToken: Scalars['String'];
};

export type LoginFailedError = Error & {
  readonly __typename: 'LoginFailedError';
  readonly message: Scalars['String'];
};

export type LoginRequestResponse = EmailNotValidError | LoginRequestSuccessResponse;

export type LoginRequestSuccessResponse = {
  readonly __typename: 'LoginRequestSuccessResponse';
  readonly success: Scalars['Boolean'];
};

export type MeResponse = AuthenticationError | User;

export type MealSample = CommonSampleProps & {
  readonly __typename: 'MealSample';
  readonly _id: Scalars['ObjectId'];
  readonly appleHealthKitUUID?: Maybe<Scalars['String']>;
  readonly createdAt: Scalars['DateTime'];
  readonly derivedQuantityIds: ReadonlyArray<Scalars['ObjectId']>;
  readonly endDate: Scalars['DateTime'];
  readonly foodsWithProportions: ReadonlyArray<FoodWithProportion>;
  readonly image?: Maybe<Scalars['String']>;
  readonly mealType: MealType;
  readonly modifiedAt: Scalars['DateTime'];
  readonly parentMealId: Scalars['ObjectId'];
  readonly quantities: ReadonlyArray<QuantitySample>;
  readonly quantitiesAfterMeal: ReadonlyArray<QuantitySample>;
  readonly quantityIds: ReadonlyArray<Scalars['ObjectId']>;
  readonly sourceType: SourceType;
  readonly startDate: Scalars['DateTime'];
  readonly statAfterMeal: Scalars['Float'];
  readonly title?: Maybe<Scalars['String']>;
  readonly userId: Scalars['ObjectId'];
  readonly weightInGrams?: Maybe<Scalars['Float']>;
};

export type MealSampleQuantitiesAfterMealArgs = {
  readonly durationInMinutes: Scalars['Int'];
  readonly offsetInMinutes?: InputMaybe<Scalars['Int']>;
  readonly quantityType: QuantityType;
};

export type MealSampleStatAfterMealArgs = {
  readonly durationInMinutes: Scalars['Int'];
  readonly offsetInMinutes?: InputMaybe<Scalars['Int']>;
  readonly quantityType: QuantityType;
  readonly statType: QuantityStat;
};

export type MealSampleUpsert = {
  readonly _id?: InputMaybe<Scalars['ObjectId']>;
  readonly appleHealthKitUUID?: InputMaybe<Scalars['String']>;
  readonly endDate?: InputMaybe<Scalars['DateTime']>;
  readonly foodsWithProportions?: InputMaybe<ReadonlyArray<FoodWithProportionInput>>;
  readonly mealType?: InputMaybe<MealType>;
  readonly parentMealId?: InputMaybe<Scalars['ObjectId']>;
  readonly quantities?: InputMaybe<ReadonlyArray<QuantitySampleUpsert>>;
  readonly sourceType?: InputMaybe<SourceType>;
  readonly startDate?: InputMaybe<Scalars['DateTime']>;
  readonly timestamp?: InputMaybe<Scalars['DateTime']>;
  readonly title?: InputMaybe<Scalars['String']>;
  readonly weightInGrams?: InputMaybe<Scalars['Float']>;
};

export enum MealType {
  BREAKFAST = 'BREAKFAST',
  DINNER = 'DINNER',
  LUNCH = 'LUNCH',
  SNACK = 'SNACK',
  UNKOWN = 'UNKOWN'
}

export type Mutation = {
  readonly __typename: 'Mutation';
  readonly acceptCompetitionInvite: AcceptCompetitionInviteResponse;
  readonly acceptFollowerInvite: AcceptUserInviteResponse;
  readonly addSet: WorkoutSample;
  readonly generateCompetitionInvite: CompetitionInvitationResponse;
  readonly generateFollowerInvite: InvitationResponseSuccess;
  readonly loginConfirm: LoginConfirmResponse;
  readonly loginRequest: LoginRequestResponse;
  readonly subscribeToLibre: LibreMonitor;
  readonly upsertCompetition: Competition;
  readonly upsertMeals: UpsertedResult;
  readonly upsertQuantitySample: QuantitySample;
  readonly upsertQuantitySamples: UpsertedResult;
  readonly upsertWorkoutSamples: UpsertedResult;
};

export type MutationAcceptCompetitionInviteArgs = {
  readonly inviteToken: Scalars['String'];
};

export type MutationAcceptFollowerInviteArgs = {
  readonly inviteToken: Scalars['String'];
};

export type MutationAddSetArgs = {
  readonly set: WorkoutSetInput;
  readonly workoutId: Scalars['ObjectId'];
};

export type MutationGenerateCompetitionInviteArgs = {
  readonly competitionId: Scalars['ObjectId'];
};

export type MutationLoginConfirmArgs = {
  readonly code: Scalars['String'];
  readonly email: Scalars['String'];
};

export type MutationLoginRequestArgs = {
  readonly email: Scalars['String'];
};

export type MutationUpsertCompetitionArgs = {
  readonly competition: UpsertCompetition;
};

export type MutationUpsertMealsArgs = {
  readonly samples: ReadonlyArray<MealSampleUpsert>;
};

export type MutationUpsertQuantitySampleArgs = {
  readonly quantitySample: QuantitySampleUpsert;
};

export type MutationUpsertQuantitySamplesArgs = {
  readonly samples: ReadonlyArray<QuantitySampleUpsert>;
};

export type MutationUpsertWorkoutSamplesArgs = {
  readonly samples: ReadonlyArray<WorkoutSampleUpsert>;
};

export type NotFoundError = Error & {
  readonly __typename: 'NotFoundError';
  readonly message: Scalars['String'];
};

export type NutrientQuantity = {
  readonly __typename: 'NutrientQuantity';
  readonly nutrient: QuantityType;
  readonly quantity: Scalars['Float'];
  readonly unit: UnitInternal;
};

export type PageInfo = {
  readonly __typename: 'PageInfo';
  readonly endCursor?: Maybe<Scalars['ID']>;
  readonly hasNextPage: Scalars['Boolean'];
};

export type QuantitySample = CommonSampleProps & {
  readonly __typename: 'QuantitySample';
  readonly _id: Scalars['ObjectId'];
  readonly appleHealthKitUUID?: Maybe<Scalars['String']>;
  readonly createdAt: Scalars['DateTime'];
  readonly endDate: Scalars['DateTime'];
  readonly modifiedAt: Scalars['DateTime'];
  readonly quantityType: QuantityType;
  readonly sourceType: SourceType;
  readonly startDate: Scalars['DateTime'];
  readonly unit: UnitInternal;
  readonly userId: Scalars['ObjectId'];
  readonly value: Scalars['Float'];
};

export type QuantitySampleValueArgs = {
  readonly asUnit?: InputMaybe<Unit>;
};

export type QuantitySampleUpsert = {
  readonly _id?: InputMaybe<Scalars['ObjectId']>;
  readonly appleHealthKitUUID?: InputMaybe<Scalars['String']>;
  readonly endDate?: InputMaybe<Scalars['DateTime']>;
  readonly quantityType: QuantityType;
  readonly sourceType?: InputMaybe<SourceType>;
  readonly startDate?: InputMaybe<Scalars['DateTime']>;
  readonly timestamp?: InputMaybe<Scalars['DateTime']>;
  readonly unit: UnitInternal;
  readonly value: Scalars['Float'];
};

export type QuantitySort = {
  readonly sortBy: QuantitySortBy;
  readonly sortDirection: SortDirection;
};

export enum QuantitySortBy {
  createdAt = 'createdAt',
  endDate = 'endDate',
  modifiedAt = 'modifiedAt',
  startDate = 'startDate',
  value = 'value'
}

export enum QuantityStat {
  AVG = 'AVG',
  COUNT = 'COUNT',
  MAX = 'MAX',
  MIN = 'MIN',
  STD_DEV_POP = 'STD_DEV_POP',
  STD_DEV_SAMPLE = 'STD_DEV_SAMPLE',
  SUM = 'SUM'
}

export enum QuantityType {
  SUBJECTIVE_CARB_AMOUNT = 'SUBJECTIVE_CARB_AMOUNT',
  SUBJECTIVE_ENERGY_LEVEL = 'SUBJECTIVE_ENERGY_LEVEL',
  SUBJECTIVE_MEAL_SIZE = 'SUBJECTIVE_MEAL_SIZE',
  SUBJECTIVE_MOOD_LEVEL = 'SUBJECTIVE_MOOD_LEVEL',
  SUBJECTIVE_SLEEP_QUALITY = 'SUBJECTIVE_SLEEP_QUALITY',
  SUBJECTIVE_STRESS_LEVEL = 'SUBJECTIVE_STRESS_LEVEL',
  SUBJECTIVE_WORKOUT_PERFORMANCE = 'SUBJECTIVE_WORKOUT_PERFORMANCE',
  activeEnergyBurned = 'activeEnergyBurned',
  appleExerciseTime = 'appleExerciseTime',
  appleStandTime = 'appleStandTime',
  basalBodyTemperature = 'basalBodyTemperature',
  basalEnergyBurned = 'basalEnergyBurned',
  bloodAlcoholContent = 'bloodAlcoholContent',
  bloodGlucose = 'bloodGlucose',
  bloodPressureDiastolic = 'bloodPressureDiastolic',
  bloodPressureSystolic = 'bloodPressureSystolic',
  bodyFatPercentage = 'bodyFatPercentage',
  bodyMass = 'bodyMass',
  bodyMassIndex = 'bodyMassIndex',
  bodyTemperature = 'bodyTemperature',
  dietaryBiotin = 'dietaryBiotin',
  dietaryCaffeine = 'dietaryCaffeine',
  dietaryCalcium = 'dietaryCalcium',
  dietaryCarbohydrates = 'dietaryCarbohydrates',
  dietaryChloride = 'dietaryChloride',
  dietaryCholesterol = 'dietaryCholesterol',
  dietaryChromium = 'dietaryChromium',
  dietaryCopper = 'dietaryCopper',
  dietaryEnergyConsumed = 'dietaryEnergyConsumed',
  dietaryFatMonounsaturated = 'dietaryFatMonounsaturated',
  dietaryFatPolyunsaturated = 'dietaryFatPolyunsaturated',
  dietaryFatSaturated = 'dietaryFatSaturated',
  dietaryFatTotal = 'dietaryFatTotal',
  dietaryFiber = 'dietaryFiber',
  dietaryFolate = 'dietaryFolate',
  dietaryIodine = 'dietaryIodine',
  dietaryIron = 'dietaryIron',
  dietaryMagnesium = 'dietaryMagnesium',
  dietaryManganese = 'dietaryManganese',
  dietaryMolybdenum = 'dietaryMolybdenum',
  dietaryNiacin = 'dietaryNiacin',
  dietaryPantothenicAcid = 'dietaryPantothenicAcid',
  dietaryPhosphorus = 'dietaryPhosphorus',
  dietaryPotassium = 'dietaryPotassium',
  dietaryProtein = 'dietaryProtein',
  dietaryRiboflavin = 'dietaryRiboflavin',
  dietarySelenium = 'dietarySelenium',
  dietarySodium = 'dietarySodium',
  dietarySugar = 'dietarySugar',
  dietaryThiamin = 'dietaryThiamin',
  dietaryVitaminA = 'dietaryVitaminA',
  dietaryVitaminB6 = 'dietaryVitaminB6',
  dietaryVitaminB12 = 'dietaryVitaminB12',
  dietaryVitaminC = 'dietaryVitaminC',
  dietaryVitaminD = 'dietaryVitaminD',
  dietaryVitaminE = 'dietaryVitaminE',
  dietaryVitaminK = 'dietaryVitaminK',
  dietaryWater = 'dietaryWater',
  dietaryZinc = 'dietaryZinc',
  distanceCycling = 'distanceCycling',
  distanceDownhillSnowSports = 'distanceDownhillSnowSports',
  distanceSwimming = 'distanceSwimming',
  distanceWalkingRunning = 'distanceWalkingRunning',
  distanceWheelchair = 'distanceWheelchair',
  electrodermalActivity = 'electrodermalActivity',
  environmentalAudioExposure = 'environmentalAudioExposure',
  flightsClimbed = 'flightsClimbed',
  forcedExpiratoryVolume1 = 'forcedExpiratoryVolume1',
  forcedVitalCapacity = 'forcedVitalCapacity',
  headphoneAudioExposure = 'headphoneAudioExposure',
  heartRate = 'heartRate',
  heartRateVariabilitySDNN = 'heartRateVariabilitySDNN',
  height = 'height',
  inhalerUsage = 'inhalerUsage',
  insulinDeliveryBasal = 'insulinDeliveryBasal',
  insulinDeliveryBolus = 'insulinDeliveryBolus',
  leanBodyMass = 'leanBodyMass',
  nikeFuel = 'nikeFuel',
  numberOfTimesFallen = 'numberOfTimesFallen',
  oxygenSaturation = 'oxygenSaturation',
  peakExpiratoryFlowRate = 'peakExpiratoryFlowRate',
  peripheralPerfusionIndex = 'peripheralPerfusionIndex',
  pushCount = 'pushCount',
  respiratoryRate = 'respiratoryRate',
  restingHeartRate = 'restingHeartRate',
  stepCount = 'stepCount',
  swimmingStrokeCount = 'swimmingStrokeCount',
  uvExposure = 'uvExposure',
  vo2Max = 'vo2Max',
  waistCircumference = 'waistCircumference',
  walkingHeartRateAverage = 'walkingHeartRateAverage'
}

export type Query = {
  readonly __typename: 'Query';
  readonly competitionById: CompetitionByIdResponse;
  readonly me: MeResponse;
  readonly timestamp: Scalars['DateTime'];
  readonly userById: UserByIdResponse;
};

export type QueryCompetitionByIdArgs = {
  readonly competitionId: Scalars['ObjectId'];
};

export type QueryUserByIdArgs = {
  readonly userId: Scalars['ObjectId'];
};

export enum ResistanceType {
  BARBELL = 'BARBELL',
  BODY_WEIGHT = 'BODY_WEIGHT',
  CABLE = 'CABLE',
  DUMBBELL = 'DUMBBELL',
  KETTLEBELL = 'KETTLEBELL',
  MACHINE = 'MACHINE',
  UNKNOWN = 'UNKNOWN'
}

export type RestrictedUser = IUser & {
  readonly __typename: 'RestrictedUser';
  readonly _id: Scalars['ObjectId'];
  readonly avatarUrl: Scalars['String'];
  readonly displayName: Scalars['String'];
};

export type SampleSort = {
  readonly sortBy: SampleSortBy;
  readonly sortDirection: SortDirection;
};

export enum SampleSortBy {
  createdAt = 'createdAt',
  endDate = 'endDate',
  modifiedAt = 'modifiedAt',
  startDate = 'startDate',
  value = 'value'
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

export enum SourceType {
  HEALTHKIT = 'HEALTHKIT',
  INTERNAL = 'INTERNAL',
  LIBRELINKUP = 'LIBRELINKUP'
}

export type StatWithValue = {
  readonly __typename: 'StatWithValue';
  readonly unit: Unit;
  readonly value: Scalars['Float'];
};

export enum Unit {
  CELSIUS = 'CELSIUS',
  CENTILITER = 'CENTILITER',
  CENTIMETER = 'CENTIMETER',
  COUNT = 'COUNT',
  COUNT_PER_MINUTE = 'COUNT_PER_MINUTE',
  DAY = 'DAY',
  FAHRENHEIT = 'FAHRENHEIT',
  GRAM = 'GRAM',
  HOUR = 'HOUR',
  INTERNATIONAL_UNIT = 'INTERNATIONAL_UNIT',
  KILOCALORIE = 'KILOCALORIE',
  KILOGRAM = 'KILOGRAM',
  KILOJOULE = 'KILOJOULE',
  LITER = 'LITER',
  METER = 'METER',
  MICROLITER = 'MICROLITER',
  MILLIGRAM_PER_DECILITER = 'MILLIGRAM_PER_DECILITER',
  MILLILITER = 'MILLILITER',
  MILLILITRE_PER_KILOGRAM_PER_MINUTE = 'MILLILITRE_PER_KILOGRAM_PER_MINUTE',
  MILLIMETER = 'MILLIMETER',
  MILLIMOL_PER_LITER = 'MILLIMOL_PER_LITER',
  MILLIMOL_PER_MOL = 'MILLIMOL_PER_MOL',
  MILLISECOND = 'MILLISECOND',
  MINUTE = 'MINUTE',
  PERCENT = 'PERCENT',
  SECOND = 'SECOND',
  SUBJECTIVE_QUANTITY = 'SUBJECTIVE_QUANTITY'
}

export enum UnitInternal {
  CELSIUS = 'CELSIUS',
  COUNT = 'COUNT',
  COUNT_PER_MINUTE = 'COUNT_PER_MINUTE',
  GRAM = 'GRAM',
  INTERNATIONAL_UNIT = 'INTERNATIONAL_UNIT',
  KILOCALORIE = 'KILOCALORIE',
  MILLILITER = 'MILLILITER',
  MILLILITRE_PER_KILOGRAM_PER_MINUTE = 'MILLILITRE_PER_KILOGRAM_PER_MINUTE',
  MILLIMETER = 'MILLIMETER',
  MILLIMOL_PER_LITER = 'MILLIMOL_PER_LITER',
  MILLIMOL_PER_MOL = 'MILLIMOL_PER_MOL',
  MILLISECOND = 'MILLISECOND',
  PERCENT = 'PERCENT',
  SUBJECTIVE_QUANTITY = 'SUBJECTIVE_QUANTITY'
}

export type UpsertCompetition = {
  readonly _id?: InputMaybe<Scalars['ObjectId']>;
  readonly endDate: Scalars['DateTime'];
  readonly name: Scalars['String'];
  readonly quantityType: QuantityType;
  readonly startDate?: InputMaybe<Scalars['DateTime']>;
  readonly timestamp?: InputMaybe<Scalars['DateTime']>;
};

export enum UpsertOperationType {
  INSERTED = 'INSERTED',
  UPSERTED = 'UPSERTED'
}

export type UpsertedItem = {
  readonly __typename: 'UpsertedItem';
  readonly _id: Scalars['ObjectId'];
  readonly result: UpsertOperationType;
};

export type UpsertedResult = {
  readonly __typename: 'UpsertedResult';
  readonly insertedCount: Scalars['Int'];
  readonly items: ReadonlyArray<UpsertedItem>;
  readonly modifiedCount: Scalars['Int'];
  readonly upsertedCount: Scalars['Int'];
};

export type User = IUser & {
  readonly __typename: 'User';
  readonly _id: Scalars['ObjectId'];
  readonly avatarUrl: Scalars['String'];
  readonly chartImageUrl: Scalars['String'];
  readonly competitions: ReadonlyArray<Competition>;
  readonly displayName: Scalars['String'];
  readonly email: Scalars['String'];
  readonly followerIds: ReadonlyArray<Scalars['ObjectId']>;
  readonly followers: ReadonlyArray<RestrictedUser>;
  readonly following: ReadonlyArray<User>;
  readonly isConfirmed: Scalars['Boolean'];
  readonly lastActiveAt: Scalars['DateTime'];
  readonly mealSamples: ReadonlyArray<MealSample>;
  readonly quantitySampleMax?: Maybe<QuantitySample>;
  readonly quantitySampleMin?: Maybe<QuantitySample>;
  readonly quantitySamples: ReadonlyArray<QuantitySample>;
  readonly quantityStat: StatWithValue;
  readonly userSettings: UserSettings;
  readonly workoutSamples: ReadonlyArray<WorkoutSample>;
};

export type UserChartImageUrlArgs = {
  readonly quantityType: QuantityType;
};

export type UserMealSamplesArgs = {
  readonly fromDate?: InputMaybe<Scalars['DateTime']>;
  readonly limit?: InputMaybe<Scalars['Int']>;
  readonly offset?: InputMaybe<Scalars['Int']>;
  readonly sortBy?: InputMaybe<ReadonlyArray<SampleSort>>;
  readonly toDate?: InputMaybe<Scalars['DateTime']>;
};

export type UserQuantitySampleMaxArgs = {
  readonly fromDate?: InputMaybe<Scalars['DateTime']>;
  readonly quantityType: QuantityType;
  readonly toDate?: InputMaybe<Scalars['DateTime']>;
};

export type UserQuantitySampleMinArgs = {
  readonly fromDate?: InputMaybe<Scalars['DateTime']>;
  readonly quantityType: QuantityType;
  readonly toDate?: InputMaybe<Scalars['DateTime']>;
};

export type UserQuantitySamplesArgs = {
  readonly fromDate?: InputMaybe<Scalars['DateTime']>;
  readonly limit?: InputMaybe<Scalars['Int']>;
  readonly offset?: InputMaybe<Scalars['Int']>;
  readonly quantityType: QuantityType;
  readonly sortBy?: InputMaybe<ReadonlyArray<QuantitySort>>;
  readonly toDate?: InputMaybe<Scalars['DateTime']>;
};

export type UserQuantityStatArgs = {
  readonly fromDate?: InputMaybe<Scalars['DateTime']>;
  readonly quantityType: QuantityType;
  readonly statistic: QuantityStat;
  readonly toDate?: InputMaybe<Scalars['DateTime']>;
  readonly unit?: InputMaybe<Unit>;
};

export type UserWorkoutSamplesArgs = {
  readonly fromDate?: InputMaybe<Scalars['DateTime']>;
  readonly limit?: InputMaybe<Scalars['Int']>;
  readonly offset?: InputMaybe<Scalars['Int']>;
  readonly sortBy?: InputMaybe<ReadonlyArray<SampleSort>>;
  readonly toDate?: InputMaybe<Scalars['DateTime']>;
};

export type UserByIdResponse = AuthenticationError | NotFoundError | RestrictedUser | User;

export enum UserInputErrorMessageCode {
  INVALID_EMAIL = 'INVALID_EMAIL',
  LOGIN_CODE_SHOULD_BE_6_CHARACTERS = 'LOGIN_CODE_SHOULD_BE_6_CHARACTERS',
  UNSPECIFIED = 'UNSPECIFIED'
}

export type UserSettings = {
  readonly __typename: 'UserSettings';
  readonly locale: Locale;
  readonly prefers24HourClock: Scalars['Boolean'];
};

export enum WorkoutActivityType {
  AMERICAN_FOOTBALL = 'AMERICAN_FOOTBALL',
  ARCHERY = 'ARCHERY',
  AUSTRALIAN_FOOTBALL = 'AUSTRALIAN_FOOTBALL',
  BADMINTON = 'BADMINTON',
  BARRE = 'BARRE',
  BASEBALL = 'BASEBALL',
  BASKETBALL = 'BASKETBALL',
  BOWLING = 'BOWLING',
  BOXING = 'BOXING',
  CLIMBING = 'CLIMBING',
  CORE_TRAINING = 'CORE_TRAINING',
  CRICKET = 'CRICKET',
  CROSS_COUNTRY_SKIING = 'CROSS_COUNTRY_SKIING',
  CROSS_TRAINING = 'CROSS_TRAINING',
  CURLING = 'CURLING',
  CYCLING = 'CYCLING',
  DANCE = 'DANCE',
  DANCE_INSPIRED_TRAINING = 'DANCE_INSPIRED_TRAINING',
  DISC_SPORTS = 'DISC_SPORTS',
  DOWNHILL_SKIING = 'DOWNHILL_SKIING',
  ELLIPTICAL = 'ELLIPTICAL',
  EQUESTRIAN_SPORTS = 'EQUESTRIAN_SPORTS',
  FENCING = 'FENCING',
  FISHING = 'FISHING',
  FITNESS_GAMING = 'FITNESS_GAMING',
  FLEXIBILITY = 'FLEXIBILITY',
  FUNCTIONAL_STRENGTH_TRAINING = 'FUNCTIONAL_STRENGTH_TRAINING',
  GOLF = 'GOLF',
  GYMNASTICS = 'GYMNASTICS',
  HANDBALL = 'HANDBALL',
  HAND_CYCLING = 'HAND_CYCLING',
  HIGH_INTENSITY_INTERVAL_TRAINING = 'HIGH_INTENSITY_INTERVAL_TRAINING',
  HIKING = 'HIKING',
  HOCKEY = 'HOCKEY',
  HUNTING = 'HUNTING',
  JUMP_ROPE = 'JUMP_ROPE',
  KICKBOXING = 'KICKBOXING',
  LACROSSE = 'LACROSSE',
  MARTIAL_ARTS = 'MARTIAL_ARTS',
  MIND_AND_BODY = 'MIND_AND_BODY',
  MIXED_CARDIO = 'MIXED_CARDIO',
  MIXED_METABOLIC_CARDIO_TRAINING = 'MIXED_METABOLIC_CARDIO_TRAINING',
  OTHER = 'OTHER',
  PADDLE_SPORTS = 'PADDLE_SPORTS',
  PILATES = 'PILATES',
  PLAY = 'PLAY',
  PREPARATION_AND_RECOVERY = 'PREPARATION_AND_RECOVERY',
  RACQUETBALL = 'RACQUETBALL',
  ROWING = 'ROWING',
  RUGBY = 'RUGBY',
  RUNNING = 'RUNNING',
  SAILING = 'SAILING',
  SKATING_SPORTS = 'SKATING_SPORTS',
  SNOWBOARDING = 'SNOWBOARDING',
  SNOW_SPORTS = 'SNOW_SPORTS',
  SOCCER = 'SOCCER',
  SOFTBALL = 'SOFTBALL',
  SQUASH = 'SQUASH',
  STAIRS = 'STAIRS',
  STAIR_CLIMBING = 'STAIR_CLIMBING',
  STEP_TRAINING = 'STEP_TRAINING',
  SURFING_SPORTS = 'SURFING_SPORTS',
  SWIMMING = 'SWIMMING',
  TABLE_TENNIS = 'TABLE_TENNIS',
  TAI_CHI = 'TAI_CHI',
  TENNIS = 'TENNIS',
  TRACK_AND_FIELD = 'TRACK_AND_FIELD',
  TRADITIONAL_STRENGTH_TRAINING = 'TRADITIONAL_STRENGTH_TRAINING',
  VOLLEYBALL = 'VOLLEYBALL',
  WALKING = 'WALKING',
  WATER_FITNESS = 'WATER_FITNESS',
  WATER_POLO = 'WATER_POLO',
  WATER_SPORTS = 'WATER_SPORTS',
  WHEELCHAIR_RUN_PACE = 'WHEELCHAIR_RUN_PACE',
  WHEELCHAIR_WALK_PACE = 'WHEELCHAIR_WALK_PACE',
  WRESTLING = 'WRESTLING',
  YOGA = 'YOGA'
}

export enum WorkoutExerciseType {
  BACK_EXTENSION = 'BACK_EXTENSION',
  BRIDGE_HIP_SINGLE_LEG = 'BRIDGE_HIP_SINGLE_LEG',
  BURPEE = 'BURPEE',
  CALF_PRESS = 'CALF_PRESS',
  CALF_RAISE = 'CALF_RAISE',
  CALF_RAISE_SEATED = 'CALF_RAISE_SEATED',
  CALF_RAISE_STANDING = 'CALF_RAISE_STANDING',
  CHINUP = 'CHINUP',
  CLEAN = 'CLEAN',
  CLEAN_HANG = 'CLEAN_HANG',
  CLEAN_HANG_POWER = 'CLEAN_HANG_POWER',
  CLEAN_JERK = 'CLEAN_JERK',
  CLEAN_POWER = 'CLEAN_POWER',
  CRUNCH = 'CRUNCH',
  CRUNCH_TWISTING = 'CRUNCH_TWISTING',
  CURL_BICEP = 'CURL_BICEP',
  DEADLIFT = 'DEADLIFT',
  DEADLIFT_RDL = 'DEADLIFT_RDL',
  DEADLIFT_SINGLE_LEG = 'DEADLIFT_SINGLE_LEG',
  DEADLIFT_STRAIGHT_LEG = 'DEADLIFT_STRAIGHT_LEG',
  DIP = 'DIP',
  DIP_CHEST = 'DIP_CHEST',
  DIP_TRICEPS = 'DIP_TRICEPS',
  FLY = 'FLY',
  GOOD_MORNING = 'GOOD_MORNING',
  HIP_EXTENSION = 'HIP_EXTENSION',
  HIP_RAISE = 'HIP_RAISE',
  HIP_THRUST = 'HIP_THRUST',
  JUMPING_JACK = 'JUMPING_JACK',
  LEG_CURL = 'LEG_CURL',
  LEG_EXTENSION = 'LEG_EXTENSION',
  LEG_PRESS = 'LEG_PRESS',
  LEG_RAISE = 'LEG_RAISE',
  LUNGE = 'LUNGE',
  LUNGE_REAR = 'LUNGE_REAR',
  LUNGE_SIDE = 'LUNGE_SIDE',
  PLANK = 'PLANK',
  PLANK_SIDE = 'PLANK_SIDE',
  PRESS_BENCH = 'PRESS_BENCH',
  PRESS_BENCH_CLOSE_GRIP = 'PRESS_BENCH_CLOSE_GRIP',
  PRESS_BENCH_DECLINE = 'PRESS_BENCH_DECLINE',
  PRESS_BENCH_INCLINE = 'PRESS_BENCH_INCLINE',
  PRESS_JM = 'PRESS_JM',
  PRESS_PIKE = 'PRESS_PIKE',
  PRESS_SHOULDER = 'PRESS_SHOULDER',
  PRESS_SHOULDER_ARNOLD = 'PRESS_SHOULDER_ARNOLD',
  PRESS_SHOULDER_MILITARY = 'PRESS_SHOULDER_MILITARY',
  PULLDOWN = 'PULLDOWN',
  PULLOVER = 'PULLOVER',
  PULLUP = 'PULLUP',
  PUSHUP = 'PUSHUP',
  PUSHUP_CLOSE_GRIP = 'PUSHUP_CLOSE_GRIP',
  PUSHUP_PIKE = 'PUSHUP_PIKE',
  RAISE_FRONT = 'RAISE_FRONT',
  RAISE_LATERAL = 'RAISE_LATERAL',
  RAISE_LATERAL_REAR = 'RAISE_LATERAL_REAR',
  ROW = 'ROW',
  ROW_HIGH = 'ROW_HIGH',
  ROW_UPRIGHT = 'ROW_UPRIGHT',
  RUN_HIGH_KNEE = 'RUN_HIGH_KNEE',
  RUSSIAN_TWIST = 'RUSSIAN_TWIST',
  SHRUG = 'SHRUG',
  SITUP = 'SITUP',
  SITUP_TWISTING = 'SITUP_TWISTING',
  SQUAT = 'SQUAT',
  STEP_UP = 'STEP_UP',
  SWING = 'SWING',
  THRUSTER = 'THRUSTER',
  TRICEPS_EXTENSION = 'TRICEPS_EXTENSION',
  VUPS = 'VUPS',
  WALL_SIT = 'WALL_SIT'
}

export type WorkoutSample = CommonSampleProps & {
  readonly __typename: 'WorkoutSample';
  readonly _id: Scalars['ObjectId'];
  readonly appleHealthKitUUID?: Maybe<Scalars['String']>;
  readonly createdAt: Scalars['DateTime'];
  readonly endDate?: Maybe<Scalars['DateTime']>;
  readonly modifiedAt: Scalars['DateTime'];
  readonly quantities: ReadonlyArray<QuantitySample>;
  readonly quantitiesAfterWorkout: ReadonlyArray<QuantitySample>;
  readonly sets: ReadonlyArray<WorkoutSet>;
  readonly sourceType: SourceType;
  readonly startDate: Scalars['DateTime'];
  readonly stat: Scalars['Float'];
  readonly statAfterWorkout: Scalars['Float'];
  readonly userId: Scalars['ObjectId'];
  readonly workoutActivityType: WorkoutActivityType;
};

export type WorkoutSampleQuantitiesArgs = {
  readonly quantityType: QuantityType;
};

export type WorkoutSampleQuantitiesAfterWorkoutArgs = {
  readonly durationInMinutes: Scalars['Int'];
  readonly quantityType: QuantityType;
};

export type WorkoutSampleStatArgs = {
  readonly quantityType: QuantityType;
  readonly statType: QuantityStat;
};

export type WorkoutSampleStatAfterWorkoutArgs = {
  readonly durationInMinutes: Scalars['Int'];
  readonly offsetInMinutes?: InputMaybe<Scalars['Int']>;
  readonly quantityType: QuantityType;
  readonly statType: QuantityStat;
};

export type WorkoutSampleUpsert = {
  readonly _id?: InputMaybe<Scalars['ObjectId']>;
  readonly appleHealthKitUUID?: InputMaybe<Scalars['String']>;
  readonly endDate?: InputMaybe<Scalars['DateTime']>;
  readonly sets?: InputMaybe<ReadonlyArray<WorkoutSetInput>>;
  readonly sourceType?: InputMaybe<SourceType>;
  readonly startDate?: InputMaybe<Scalars['DateTime']>;
  readonly timestamp?: InputMaybe<Scalars['DateTime']>;
  readonly workoutActivityType: WorkoutActivityType;
};

export type WorkoutSet = {
  readonly __typename: 'WorkoutSet';
  readonly endDate?: Maybe<Scalars['DateTime']>;
  readonly exerciseType: WorkoutExerciseType;
  readonly repititions?: Maybe<Scalars['Int']>;
  readonly resistanceType?: Maybe<ResistanceType>;
  readonly resistanceUnit?: Maybe<UnitInternal>;
  readonly resistanceValue?: Maybe<Scalars['Float']>;
  readonly startDate: Scalars['DateTime'];
  readonly weight?: Maybe<Scalars['Float']>;
};

export type WorkoutSetInput = {
  readonly endDate?: InputMaybe<Scalars['DateTime']>;
  readonly exerciseType: WorkoutExerciseType;
  readonly repititions?: InputMaybe<Scalars['Int']>;
  readonly resistanceType?: InputMaybe<ResistanceType>;
  readonly resistanceUnit?: InputMaybe<UnitInternal>;
  readonly resistanceValue?: InputMaybe<Scalars['Float']>;
  readonly startDate: Scalars['DateTime'];
  readonly weight?: InputMaybe<Scalars['Float']>;
};
