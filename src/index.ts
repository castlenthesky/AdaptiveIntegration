import config from './config';

export async function randBetween(min: number, max: number): Promise<number> {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

console.log('Hello World');
