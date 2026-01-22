using {commerce.db as db} from '../db/schema';

service CommerceService {
    @cds.redirection.target
    entity Products         as projection on db.Product;

    entity PromotedProducts as
        projection on db.Product {
            *
        }
        where
            isPromoted = true;

    entity Categories       as projection on db.Category;
    entity ProductVariants  as projection on db.ProductVariant;
    entity Stocks           as projection on db.Stock;
    entity Warehouses       as projection on db.Warehouse;
    entity Carts            as projection on db.Cart;
    entity CartItems        as projection on db.CartItem;
    entity ProductCategory  as projection on db.ProductCategory;
    entity Users            as projection on db.Users;

    entity OfferBanner      as
        projection on db.OfferBanner {
            *
        }
        where
            isCarousel = false;

    entity CarouselBanner   as
        projection on db.OfferBanner {
            *
        }
        where
            isCarousel = true;

    action addToCart(productCode: String, quantity: Integer, userID: String);
    action checkout(userID: String);
    action findLocation(address: LocationRequest) returns array of String;
}

type LocationRequest {
    street     : String;
    city       : String;
    state      : String;
    country    : String;
    postalcode : String;
    amenity    : String;
}
