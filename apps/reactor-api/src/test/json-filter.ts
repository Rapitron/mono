export type JsonFilter<T = any> = (value: T) => boolean;

export const JsonFilters = {
    query: <T = any, TT = any>(selector: (value: T) => TT, operator: JsonFilter<TT>) => (value: T) => operator(selector(value)),
    and: <T = any>(...operators: JsonFilter<T>[]) => (value: T) => operators.every(criteria => criteria(value)),
    or: <T = any>(...operators: JsonFilter<T>[]) => (value: T) => operators.some(criteria => criteria(value)),
    not: <T = any>(operator: JsonFilter<T>) => (value: T) => !operator(value),
    equals: <T = any>(criteria: any) => (value: T) => value === criteria || String(value).toLowerCase() === String(criteria).toLowerCase(),
    contains: <T = any>(criteria: any) => (value: T) => value === criteria || String(value).toLowerCase().includes(String(criteria).toLowerCase()),
    starts: <T = any>(criteria: any) => (value: T) => value === criteria || String(value).toLowerCase().startsWith(String(criteria).toLowerCase()),
    ends: <T = any>(criteria: any) => (value: T) => value === criteria || String(value).toLowerCase().endsWith(String(criteria).toLowerCase()),
    greater: <T = any>(criteria: any) => (value: T) => typeof value === 'string' && String(value).length > String(criteria).length || typeof value === 'number' && Number(value) > Number(criteria) || value instanceof Date && value > new Date(criteria),
    less: <T = any>(criteria: any) => (value: T) => typeof value === 'string' && String(value).length < String(criteria).length || typeof value === 'number' && Number(value) < Number(criteria) || value instanceof Date && value < new Date(criteria),
};

export const JsonFilterOperators = {
    query: JsonFilters.query,
    and: (arg: any[], options: JsonFilterOptions) => JsonFilters.and(...arg.map(arg => jsonFilter(arg, { ...options, operator: 'and' }))),
    or: (arg: any[], options: JsonFilterOptions) => JsonFilters.or(...arg.map(arg => jsonFilter(arg, { ...options, operator: 'or' }))),
    not: (arg: any, options: JsonFilterOptions) => JsonFilters.not(jsonFilter(arg, options)),
    equals: JsonFilters.equals,
    contains: JsonFilters.contains,
    starts: JsonFilters.starts,
    ends: JsonFilters.ends,
    greater: JsonFilters.greater,
    less: JsonFilters.less
};

export type JsonFilterOptions = { operator?: 'or' | 'and', operators?: { [operator: string]: (arg: any) => (value: any) => boolean } };

export function jsonFilter(filter: any, options: JsonFilterOptions = {}): JsonFilter {
    const option = Object.assign({ operator: 'and', operators: {} }, options);
    const filters: JsonFilter[] = [];
    for (const property in filter) {
        if (property.startsWith('$')) {
            filters.push(({ ...JsonFilterOperators, ...option.operators })[property.substring(1)](filter[property], option));
        } else {
            filters.push(JsonFilters.query(item => item[property], jsonFilter(filter[property], option)));
        }
    }
    return option.operator === 'and' ? JsonFilters.and(...filters) : JsonFilters.or(...filters);
}
