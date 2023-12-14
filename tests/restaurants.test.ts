import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app';
import RestaurantGeneral from '../src/models/restaurantGeneral';
import Address from '../src/models/address';
import Food from '../src/models/food';
const descriptions = [
  'Best lahmacun in town',
  'Gourmet food at its best',
  'Great hamburgers',
  "Fast and delicious",
];

const categories = [
  'Italian',
  'Japanese',
  'Mexican',
  'Indian',
  'Turkish',
  'Fast Food',
  'Ev Yemekleri',
];

const menuCategories = [
  { categoryName: 'Appetizers', categoryDescription: 'Starters' },
  { categoryName: 'Main Course', categoryDescription: 'Main Dishes' },
  { categoryName: 'Desserts', categoryDescription: 'Sweet Treats' },
];

const foods = [
  { name: 'Pizza', description: 'Cheese pizza', price: 10, picture: 'pizza-picture-url' },
  { name: 'Burger', description: 'Beef burger', price: 8, picture: 'burger-picture-url' },
  { name: 'Salad', description: 'Caesar salad', price: 6, picture: 'salad-picture-url' },
  { name: 'Ice Cream', description: 'Vanilla ice cream', price: 6, picture: 'ice-cream-picture-url' },

];

describe('Creating 100 Restaurant Data', () => {
  it('should create 100 Restaurant instances successfully', async () => {
    const totalRestaurants = 100;
    const createdRestaurantGenerals: any[] = [];
    const createdRestaurantPlaces: any[] = [];

    for (let i = 0; i < totalRestaurants; i++) {
      const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
      const randomCategories1 = categories[Math.floor(Math.random() * categories.length)];
      const randomCategories2 = categories[Math.floor(Math.random() * categories.length)];

      const restaurantData = {
        name: `Restaurant ${i + 1}`, // Adjust restaurant name generation logic as needed
        description: randomDescription,
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Burger_King_2020.svg/640px-Burger_King_2020.svg.png', // Replace with actual logo URL or use placeholder
        categories: [randomCategories1, randomCategories2],
        // Add other restaurant fields as needed
      };

      if(i === 0) {
        restaurantData.name = 'Voco Fast Food'
        
      }

      const createdRestaurant = await request(app)
        .post('/api/restaurant/create')
        .send(restaurantData);

      expect(createdRestaurant.status).to.equal(200); // Assuming your API returns a 200 status on successful restaurant creation
      createdRestaurantGenerals.push(createdRestaurant);
      //address
      const randomLongitude = (Math.random() * 360) - 180; // Random longitude between -180 and 180
      const randomLatitude = (Math.random() * 180) - 90; // Random latitude between -90 and 90
      const addressData = {
        city: 'City', // Replace with actual city data
        town: 'Town', // Replace with actual town data
        addressLine: '123 Street', // Replace with actual address data
        location: {
          type: 'Point',
          coordinates: [randomLongitude, randomLatitude],
        },
      };
      const createdAddress = await Address.create(addressData);
      // Create random menus for Restaurant Place
      const food1 = foods[Math.floor(Math.random() * foods.length)];
      const foodData1 = {
        name: food1.name, // Replace with actual food name
        description: food1.description, // Replace with actual food description
        price: food1.price, // Replace with actual food price
        picture: food1.picture, // Replace with actual food picture URL
        restaurantPlace: createdRestaurant.body.data._id,
      };
      const createdFood1 = await Food.create(foodData1);
      const food2 = foods[Math.floor(Math.random() * foods.length)];
      const foodData2 = {
        name: food2.name, // Replace with actual food name
        description: food2.description, // Replace with actual food description
        price: food2.price, // Replace with actual food price
        picture: food2.picture, // Replace with actual food picture URL
        restaurantPlace: createdRestaurant.body.data._id,
      };
      const createdFood2 = await Food.create(foodData2);
      const menu = menuCategories.map(category => ({
        categoryName: category.categoryName,
        categoryDescription: category.categoryDescription,
        coverPicture: 'menu-cover-url', // Replace with actual menu cover picture URL
        foods: [createdFood1._id, createdFood2._id],
      }));
      const restaurantPlaceData = {
        restaurantGeneral: createdRestaurant.body.data._id,
        address: createdAddress._id,
        menu,
        // Add other restaurant place fields as needed
      };

      const createdRestaurantPlace = await request(app)
        .post('/api/restaurant/createPlace')
        .send(restaurantPlaceData);
      expect(createdRestaurantPlace.status).to.equal(200);

      RestaurantGeneral.findOneAndUpdate({ _id: createdRestaurant.body.data._id }, { $push: { restaurantPlaces: createdRestaurantPlace.body.data._id } }, { new: true }, (err, doc) => {
        if (err) {
          console.log("Something wrong when updating data!");
        }
      });
      // Push created restaurant place into array
      createdRestaurantPlaces.push(createdRestaurantPlace);
    }

    // Ensure 100 restaurant instances were created
    expect(createdRestaurantPlaces).to.have.lengthOf(totalRestaurants);
    expect(createdRestaurantGenerals).to.have.lengthOf(totalRestaurants);


    // Log the created restaurant places
    console.log('Created Restaurant Place Data with Addresses and Menus:', createdRestaurantGenerals);
  }).timeout(60000); // Adjust timeout as needed
});