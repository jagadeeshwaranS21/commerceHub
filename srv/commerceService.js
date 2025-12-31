export default (srv) => {
    
    srv.on("findCurrentUser", async (req) => {
        const { code } = req.data;
        let user = await SELECT.one
            .from('Users')
            .where({ customerCode: code });
        // let cart = await SELECT.one.from('Cart').where({ user_ID: user.ID, status: 'ACTIVE' });
        // let cartItems = await SELECT.from('CartItem').where({ cart_ID: cart.ID });
        // console.log(cart);
        // console.log(cartItems);
        if (!user) {
            req.error(404, "User not found");
        }
        return {
            customerCode: user.customerCode,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar,
            phoneNumber: user.phoneNumber
        }
    });

    // srv.on("addToCart", async (req) => {
    //     const { productCode, quantity, userCode } = req.data;
    //     let user = await SELECT.one
    //         .from('Users')
    //         .where({ customerCode: userCode });
    //     let cart = await SELECT.one.from('Cart').where({ user_ID: user.ID, status: 'ACTIVE' });
    //     // let cartItems = await SELECT.from('CartItem').where({cart_ID:cart.ID});
    //     if (!cart) {
    //        let data =  {
    //             "cartCode": "CART-1001",
    //                 "status": "ACTIVE",
    //                     "user_ID": "4e2265db-6b88-4768-9bd3-11f1e271ccfd"
    //         }
    //         let cartNum = data.cartCode.split("-")[1];

    //     }
    // });
    srv.on("findCurrentUserCart", async (req) => {
        const { code } = req.data;
        let user = await SELECT.one.from('Users').where({ customerCode: code });
        let currentCart = await SELECT.one.from('Cart').where({ user_ID: user.ID, status: 'ACTIVE' });
        let cartEntries = await SELECT.from('CartItem').where({ cart_ID: currentCart.ID });
        let cartItem = await Promise.all(cartEntries.map(async (ele) => {
            let product = await SELECT.one.from('ProductVariant', ele.variant_ID);
            return {
                quantity: ele.quantity,
                unitPrice: ele.unitPrice,
                totalPrice: ele.totalPrice,
                currency: ele.currency,
                product
            }
        }));
        return {
            cartCode: currentCart.cartCode,
            status: currentCart.status,
            cartItem
        };
    });
}