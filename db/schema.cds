namespace commerce.db;

using {cuid} from '@sap/cds/common';

entity Product : cuid {
    code          : String(50) @assert.unique;
    name          : String(255);
    description   : String(1000);

    brand         : String(100);
    imageUrl      : String;
    basePrice     : Decimal(13, 2);
    categories    : Association to many ProductCategory
                        on categories.product = $self;
    averageRating : Double     @assert.range : [
        0.0,
        5.0
    ];
    variants      : Composition of many ProductVariant
                        on variants.product = $self;
    isActive      : Boolean default true;
    isPromoted    : Boolean default true;
    currency      : String(3) default 'USD';
    createdAt     : Timestamp  @cds.on.insert: $now;
    updatedAt     : Timestamp  @cds.on.insert: $now  @cds.on.update: $now;
}

entity ProductVariant : cuid {
    sku           : String(80) @assert.unique;

    product       : Association to Product;
    name          : String;
    averageRating : Double     @assert.range : [
        0.0,
        5.0
    ];
    price         : Decimal(13, 2);
    currency      : String(3) default 'USD';
    description   : String;
    imageUrl      : String;

    stocks        : Association to many Stock
                        on stocks.variant = $self;
    isActive      : Boolean default true;

    createdAt     : Timestamp  @cds.on.insert: $now;
    updatedAt     : Timestamp  @cds.on.insert: $now  @cds.on.update: $now;
}

entity Address : cuid {
    user        : Association to one Users;

    addressType : String enum {
        SHIPPING;
        BILLING;
    };

    line1       : String(255);
    line2       : String(255);

    city        : String(100);
    district    : String(100);
    state       : String(100);
    postalCode  : String(20);
    country     : String(3) default 'USD';

    phoneNumber : String(20);

    isDefault   : Boolean default false;

    createdAt   : Timestamp  @cds.on.insert: $now;
    updatedAt   : Timestamp  @cds.on.insert: $now  @cds.on.update: $now;
}


entity Category : cuid {
    code        : String(50) @assert.unique;
    name        : String(255);
    description : String(500);

    parent      : Association to Category;
    children    : Composition of many Category
                      on children.parent = $self;
    products    : Association to many ProductCategory
                      on products.category = $self;
    isActive    : Boolean default true;

    createdAt   : Timestamp  @cds.on.insert: $now;
    updatedAt   : Timestamp  @cds.on.insert: $now  @cds.on.update: $now;
}


@assert.unique: {productCategory: [
    product,
    category
]}
entity ProductCategory : cuid {
    product  : Association to Product;
    category : Association to Category;
}

entity Warehouse : cuid {
    code      : String(50) @assert.unique;
    name      : String(255);

    city      : String(100);
    country   : String(100);
    stocks    : Association to many Stock
                    on stocks.warehouse = $self;
    isActive  : Boolean default true;

    createdAt : Timestamp  @cds.on.insert: $now;
    updatedAt : Timestamp  @cds.on.insert: $now  @cds.on.update: $now;
}

@assert.unique: {stockVariant: [
    variant,
    warehouse
]}
entity Stock : cuid {
    variant   : Association to ProductVariant;
    warehouse : Association to Warehouse;

    quantity  : Integer;

    createdAt : Timestamp  @cds.on.insert: $now;
    updatedAt : Timestamp  @cds.on.insert: $now  @cds.on.update: $now;
}

entity Cart : cuid {
    cartCode    : String(50) @assert.unique;

    items       : Composition of many CartItem
                      on items.cart = $self;

    status      : String enum {
        ACTIVE;
        CHECKED_OUT;
        ABANDONED;
    } default 'ACTIVE';
    subtotal    : Decimal(15, 2);

    taxAmount   : Decimal(15, 2);

    shippingFee : Decimal(15, 2);

    @Core.Computed
    @readonly
    grandTotal  : Decimal(15, 2) = taxAmount + subtotal + shippingFee;
    user        : Association to one Users;
    expiresAt   : Timestamp;
    createdAt   : Timestamp  @cds.on.insert: $now;
    updatedAt   : Timestamp  @cds.on.insert: $now  @cds.on.update: $now;
}

@assert.unique: {cartVariant: [
    cart,
    variant
]}
entity CartItem : cuid {
    cart       : Association to one Cart;

    variant    : Association to one ProductVariant;

    quantity   : Integer;
    unitPrice  : Decimal(13, 2);

    @Core.Computed
    @readonly
    totalPrice : Decimal(13, 2) = unitPrice * quantity;
    currency   : String(3) default 'USD';

    createdAt  : Timestamp  @cds.on.insert: $now;
    updatedAt  : Timestamp  @cds.on.insert: $now  @cds.on.update: $now;

}

entity Users : cuid {
    customerCode : String;
    email        : String(255) @assert.unique;
    addresses    : Association to many Address
                       on addresses.user = $self;
    phoneNumber  : String(20);
    avatar       : String;
    firstName    : String(100);
    lastName     : String(100);
    password     : String(255);
    isActive     : Boolean default true;
    carts        : Association to many Cart
                       on carts.user = $self;
    createdAt    : Timestamp   @cds.on.insert: $now;
    updatedAt    : Timestamp   @cds.on.insert: $now  @cds.on.update: $now;
}

entity OfferBanner : cuid {
    bannerUrl  : String;
    isCarousel : Boolean default true;
}

type StockStatus : String enum {
    INSTOCK;
    LOWSTOCK;
    OUTOFSTOCK;
}

entity Orders : cuid {
    orderCode       : String(50) @assert.unique;

    items           : Composition of many OrderItem
                          on items.order = $self;

    status          : String enum {
        CREATED;
        PAID;
        PROCESSING;
        SHIPPED;
        DELIVERED;
        CANCELLED;
        RETURNED;
        REFUNDED;
    } default 'CREATED';

    paymentStatus   : String enum {
        PENDING;
        AUTHORIZED;
        PAID;
        FAILED;
        REFUNDED;
    } default 'PENDING';

    subtotal        : Decimal(15, 2);

    taxAmount       : Decimal(15, 2);

    shippingFee     : Decimal(15, 2);

    grandTotal      : Decimal(15, 2);

    currency        : String(3) default 'USD';
    paymentMethod   : String;
    shippingAddress : Association to Address;
    billingAddress  : Association to Address;
    user            : Association to one Users;
    createdAt       : Timestamp  @cds.on.insert: $now;
    updatedAt       : Timestamp  @cds.on.insert: $now  @cds.on.update: $now;
}

@assert.unique: {orderVariant: [
    order,
    variant
]}
entity OrderItem : cuid {
    order      : Association to one Orders;

    variant    : Association to one ProductVariant;

    quantity   : Integer;
    unitPrice  : Decimal(13, 2);

    @Core.Computed
    @readonly
    totalPrice : Decimal(13, 2) = unitPrice * quantity;
    currency   : String(3) default 'USD';

    createdAt  : Timestamp  @cds.on.insert: $now;
    updatedAt  : Timestamp  @cds.on.insert: $now  @cds.on.update: $now;

}
