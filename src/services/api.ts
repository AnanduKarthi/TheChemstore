import { Job, Product } from '../types';
import { jobs } from '../data/jobs';
import { products } from '../data/products';

// These functions return dummy data but simulate an async API layer
export const getJobs = async (): Promise<Job[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(jobs);
    }, 500);
  });
};

export const getProducts = async (): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products);
    }, 500);
  });
};
