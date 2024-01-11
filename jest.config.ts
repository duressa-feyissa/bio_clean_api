import type { Config } from 'jest';

export default async (): Promise<Config> => {
  return {
    verbose: true,
    preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  };
};