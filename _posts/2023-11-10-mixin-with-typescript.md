---
layout: post
title:  "Adding a CI/CD to the blog"
date:   2021-09-20T18:28:13.117Z
update: 2021-09-20T18:28:13.117Z
categories: general stuff ci-cd
group: typescript code
---
# Here i am again

```typescript
class Sprite {
    name = "";
    x = 0;
    y = 0;

    constructor(name: string) {
        this.name = name;
    }
}
// To get started, we need a type which we'll use to extend
// other classes from. The main responsibility is to declare
// that the type being passed in is a class.

type Constructable = new (...args: any[]) => {};

// This mixin adds a scale property, with getters and setters
// for changing it with an encapsulated private property:

function Scale<TBase extends Constructable>(Base: TBase) {
    return class Scaling extends Base {
        // Mixins may not declare private/protected properties
        // however, you can use ES2020 private fields
        _scale = 1;

        public setScale(scale: number) {
            this._scale = scale;
        }

        get scale(): number {
            return this._scale;
        }
    };
}

function Order<TBase extends Constructable>(Base: TBase) {
    return class Order extends Base {
        // Mixins may not declare private/protected properties
        // however, you can use ES2020 private fields
        _order = 1;

        public setOrder(scale: number) {
            this._order = scale;
        }

        get order(): number {
            return this._order;
        }
    };
}



const EightBitSprite = Order(Scale(Sprite));
const flappySprite = new EightBitSprite("Bird");
flappySprite.setScale(0.8);
console.log(flappySprite.scale);
console.log(flappySprite.order);






type TAIL_TYPE<ARRAY extends any[]> =
    ((...array: ARRAY) => void) extends ((head: infer _HEAD, ...tail: infer TAIL) => void) ? TAIL : never;

type MIXER_TYPE<TEMP, ARRAY extends ((base: any) => any)[]> = ARRAY extends [] ? TEMP : MIXER_TYPE<ReturnType<ARRAY[0]> & TEMP, TAIL_TYPE<ARRAY>>;

function setMixer<TBase, CALLBACKS extends ((base: any) => any)[]>(...args: [TBase, ...CALLBACKS]): MIXER_TYPE<TBase, CALLBACKS> {
    const [base, ...callbacks] = args;
    return <any>callbacks.reduce((current, mix) => mix(current), base);
}





const EightBitSprite2 = setMixer(Sprite, Scale, Order);
const flappySprite2 = new EightBitSprite2("Bird");
flappySprite2.setScale(0.8);
console.log(flappySprite2.scale);
console.log(flappySprite2.order);


function setAsMixerClass<TBase extends Constructable>(Base: TBase) {
    return class Mixer extends Base {
        public static mixin<CALLBACKS extends ((base: any) => any)[]>(...callbacks: CALLBACKS){
            return setAsMixerClass(setMixer<TBase, CALLBACKS>(Base, ...callbacks));
        }
    }
}


const EightBitSprite3 = setAsMixerClass(Sprite).mixin(Scale, Order);
const flappySprite3 = new EightBitSprite3('bird');
flappySprite3.setOrder(5);
console.log(flappySprite3.scale);
console.log(flappySprite3.order);


const EightBitSprite4 = setAsMixerClass(Sprite).mixin(Scale).mixin(Order);
const flappySprite4 = new EightBitSprite3('bird');
flappySprite4.setOrder(5);
console.log(flappySprite4.scale);
console.log(flappySprite4.order);


const EightBitSprite40 = setAsMixerClass(Sprite).mixin(Scale);
const EightBitSprite41 = EightBitSprite40.mixin(Order);
const flappySprite40 = new EightBitSprite41('bird');
flappySprite40.setOrder(5);
console.log(flappySprite40.scale);
console.log(flappySprite40.order);
```









`Type instantiation is excessively deep and possibly infinite.`

```typescript
function setAsMixerClass<MIXER_TYPE<TBase, CALLBACKS>>(Base: MIXER_TYPE<TBase, CALLBACKS>): {
    new (...args: any[]): setAsMixerClass<MIXER_TYPE<TBase, CALLBACKS>>.Mixer;
    prototype: setAsMixerClass<...>.Mixer;
    mixin<CALLBACKS>(...callbacks: CALLBACKS): {
        ...;
    } & MIXER_TYPE<...>;
} & MIXER_TYPE<...>
```







```typescript
const EightBitSprite: {
    new (...args: any[]): Order<{
        new (...args: any[]): Scale<typeof Sprite>.Scaling;
        prototype: Scale<any>.Scaling;
    } & typeof Sprite>.Order;
    prototype: Order<...>.Order;
} & {
    new (...args: any[]): Scale<typeof Sprite>.Scaling;
    prototype: Scale<any>.Scaling;
} & typeof Sprite
```








```typescript
const EightBitSprite2: {
    new (...args: any[]): Order<Constructable>.Order;
    prototype: Order<any>.Order;
} & Constructable & {
    new (...args: any[]): Scale<Constructable>.Scaling;
    prototype: Scale<...>.Scaling;
} & typeof Sprite
```







```typescript
const EightBitSprite3: {
    new (...args: any[]): setAsMixerClass<{
        new (...args: any[]): Order<Constructable>.Order;
        prototype: Order<any>.Order;
    } & Constructable & {
        new (...args: any[]): Scale<...>.Scaling;
        prototype: Scale<...>.Scaling;
    } & typeof Sprite>.Mixer;
    prototype: setAsMixerClass<...>.Mixer;
    mixin<CALLBACKS extends ((base: any) => any)[]>(...callbacks: CALLBACKS): {
        ...;
    } & MIXER_TYPE<...>;
} & {
    ...;
} & Constructable & {
    ...;
} & typeof Sprite
```








```typescript
const EightBitSprite4: {
    new (...args: any[]): setAsMixerClass<{
        new (...args: any[]): Order<Constructable>.Order;
        prototype: Order<any>.Order;
    } & Constructable & {
        new (...args: any[]): Scale<...>.Scaling;
        prototype: Scale<...>.Scaling;
    } & typeof Sprite>.Mixer;
    prototype: setAsMixerClass<...>.Mixer;
    mixin<CALLBACKS extends ((base: any) => any)[]>(...callbacks: CALLBACKS): {
        ...;
    } & MIXER_TYPE<...>;
} & {
    ...;
} & Constructable & {
    ...;
} & typeof Sprite
```







```typescript
const EightBitSprite40: {
    new (...args: any[]): setAsMixerClass<{
        new (...args: any[]): Scale<...>.Scaling;
        prototype: Scale<...>.Scaling;
    } & Constructable & typeof Sprite>.Mixer;
    prototype: setAsMixerClass<...>.Mixer;
    mixin<CALLBACKS extends ((base: any) => any)[]>(...callbacks: CALLBACKS): {
        ...;
    } & MIXER_TYPE<...>;
} & {
    ...;
} & Constructable & typeof Sprite
```







```typescript
const EightBitSprite41: {
    new (...args: any[]): setAsMixerClass<{
        new (...args: any[]): Order<Constructable>.Order;
        prototype: Order<any>.Order;
    } & Constructable & {
        new (...args: any[]): Scale<...>.Scaling;
        prototype: Scale<...>.Scaling;
    } & typeof Sprite>.Mixer;
    prototype: setAsMixerClass<...>.Mixer;
    mixin<CALLBACKS extends ((base: any) => any)[]>(...callbacks: CALLBACKS): {
        ...;
    } & MIXER_TYPE<...>;
} & {
    ...;
} & Constructable & {
    ...;
} & typeof Sprite
```





