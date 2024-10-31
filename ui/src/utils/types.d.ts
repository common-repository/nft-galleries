export type AnyFunction = (...args: any) => any;

export type Provider<Type = any> = () => Type;

export type PromiseProvider<Type = any> = Provider<Promise<Type>>;

export type Mapper<From = any, To = From> = (arg: From) => To;

export type ObjectMap<Keys extends string, Type = any> = {
    [k in Keys]: Type;
}

type RecursivePartial<T> = {
    [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
        T[P] extends object ? RecursivePartial<T[P]> :
            T[P];
};
