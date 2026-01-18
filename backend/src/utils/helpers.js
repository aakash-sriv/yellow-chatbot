export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
export const generateId = () => {
    return Math.random().toString(36).substring(2, 15);
};
//# sourceMappingURL=helpers.js.map