export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};