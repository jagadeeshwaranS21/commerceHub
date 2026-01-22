import { executeHttpRequest } from '@sap-cloud-sdk/http-client';
import { getDestination } from '@sap-cloud-sdk/connectivity';

export default (srv) => {

    srv.on("addToCart", async (req) => {
        const { productCode, quantity, userID } = req.data;
        console.log(productCode, quantity, userID);
        let user = await SELECT.one.from('Users', userID);

        let cart = await SELECT.one.from('Cart').where({ user_ID: user.ID, status: 'ACTIVE' });

        if (!cart) {
            const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
            const rand = Math.floor(1000 + Math.random() * 9000);
            const cartCode = `CART-${today}-${rand}`;
            let cartData = {
                "cartCode": cartCode,
                "status": "ACTIVE",
                "user_ID": userID,
            }
            await INSERT.into("Cart").entries(cartData);
            cart = await SELECT.one.from('Cart').where({ user_ID: user.ID, status: 'ACTIVE' });
            console.log(cart);
        }
        const product = await SELECT.one.from("ProductVariant", productCode);
        let existingItem = await SELECT.one.from("CartItem").where({ cart_ID: cart.ID, variant_ID: productCode });
        console.log(existingItem);
        console.log("existingItem");
        if (existingItem) {
            existingItem.quantity = existingItem.quantity + quantity;
            await UPDATE('CartItem').set(existingItem).where({ ID: existingItem.ID });
        } else {
            const cartItem = {
                cart_ID: cart.ID,
                quantity: quantity,
                unitPrice: product.price,
                variant_ID: product.ID
            }
            await INSERT.into("CartItem").entries(cartItem);
        }
        return cart.ID;
    });

    srv.after("addToCart", async (cartId) => {
        console.log("Add to cart After");
        let cartItem = await SELECT.from('CartItem').where({ cart_ID: cartId });
        console.log(cartItem);
        let subtotal = cartItem.reduce((sum, curr) => {
            sum += curr.totalPrice;
            return sum;
        }, 0);
        await UPDATE("Cart")
            .set({
                subtotal,
                shippingFee: 10,
                taxAmount: 10
            })
            .where({ ID: cartId });
    })

    srv.on("submitOrder", async (req) => {
        const { userID } = req.data;
        const cart = await SELECT.one.from("Cart").where({ user_ID: userID, status: 'ACTIVE' });
        const cartItems = await SELECT.from("CartItem").where({ cart_ID: cart.ID });
        console.log("Cart Items", cartItems);
        console.log("Cart", cart);
        const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
        const rand = Math.floor(1000 + Math.random() * 9000);
        const orderCode = `ORDER-${today}-${rand}`;
        const newOrder = {
            orderCode, subtotal: cart.subtotal, taxAmount: cart.taxAmount
            , shippingFee: cart.shippingFee, grandTotal: cart.grandTotal
            , user_ID: userID
        };
        console.log("New Order", newOrder);
        await INSERT.into("Orders").entries(newOrder);
        const order = await SELECT.one.from("Orders").where({ orderCode: orderCode });
        console.log("Saved Order", order);
        const orderItem = cartItems.map((item) => {
            let orderItem = {
                order_ID: order.ID,
                variant_ID: item.variant_ID,
                quantity: item.quantity,
                unitPrice: item.unitPrice
            }
            return orderItem
        });
        await INSERT.into("OrderItem").entries(orderItem);
    });

    srv.on("findLocation", async (req) => {
        const address = req.data.address;
        if(!address || address=={}){
            return {err: "Request data is empty",
                requestData:address}
        }
        let destination;

        try {
            destination = await getDestination({
                destinationName: 'nominatim'
            });
        } catch (err) {
            console.error("Destination error", err);
            return {
                message: err.message,
                err: "Failed to get destination"
            };
        }

        try {
            const response = await executeHttpRequest(destination, {
                method: 'GET',
                url: '/search',
                params: {
                    ...address,
                    format: "jsonv2"
                },
                headers: {
                    'User-Agent': 'CAP-App'
                }
            });

            return response.data;

        } catch (err) {
            console.error("HTTP error", err);
            return {
                message: err.message,
                err: "Failed to get response from Nominatim",
                requestData:address
            };
        }
    });

}