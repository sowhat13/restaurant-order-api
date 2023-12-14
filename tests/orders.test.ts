import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app';

import RestaurantPlace from '../src/models/restaurantPlace';
import RestaurantGeneral from '../src/models/restaurantGeneral';
import UserProfile from '../src/models/userProfile';
import Order from '../src/models/order';
import OrderReview from '../src/models/orderReview';
import Food from '../src/models/food';

const randomFoodFromMenu = (menu: any[]) => {
    const randomIndex = Math.floor(Math.random() * menu.length);
    return Food.findById(menu[randomIndex].foods[Math.floor(Math.random() * menu[randomIndex].foods.length)]);
}


describe('Creating Fake Order and Order Review Data', () => {
    it('should create fake orders and order reviews successfully', async () => {

        const createdOrders: any[] = [];
        const createdOrderReviews: any[] = [];

        const allRestaurantPlaces = await request(app)
            .get('/api/restaurant/allPlaces')
            .expect(200)
            .then((response) => response.body.data);


        for (let i = 0; i < allRestaurantPlaces.length; i++) {

            const restaurantPlace = allRestaurantPlaces[i];

            const randomItems: any = []
            let totalPrice = 0;
            for (let j = 0; j < 3; j++) {
                if (restaurantPlace.menu) {
                    const randomFood = await randomFoodFromMenu(restaurantPlace.menu)
                    totalPrice += randomFood.price;
                    const randomItem = {
                        foodId: randomFood._id,
                        quantity: Math.floor(Math.random() * (5 - 1 + 1)) + 1,
                    };
                    randomItems.push(randomItem);
                }
            }
            for (let x = 0; x < 50; x++) {
                const randomUserProfile: any[] = await UserProfile.aggregate([{ $sample: { size: 1 } }])
                const randomUser = randomUserProfile[0];
                const randomRating = Math.floor(Math.random() * (5 - 3 + 1) + 3); // Random rating between 2 and 5
                const randomComment = 'This is a comment ' + [i] + ' ' + [x];
                const orderData = {
                    restaurantPlaceId: restaurantPlace._id,
                    userProfileId: randomUser._id, 
                    items: randomItems,
                    deliveryAddress: randomUser.selectedAddress,
                    totalPrice: totalPrice,
                    isDelivered: true,
                };
                const createdOrder = await Order.create(orderData);

                const orderReviewData = {
                    orderId: createdOrder._id,
                    userProfileId: randomUser._id,
                    restaurantPlaceId: restaurantPlace._id,
                    rating: randomRating,
                    comment: randomComment,
                };

                const createdOrderReview = await OrderReview.create(orderReviewData);

                createdOrders.push(createdOrder);
                createdOrderReviews.push(createdOrderReview);
            }


        }

        // Log the created orders and order reviews
      
        expect(createdOrders).to.have.lengthOf(5000);
        expect(createdOrderReviews).to.have.lengthOf(5000);
    }).timeout(180000); // Adjust timeout as needed
});