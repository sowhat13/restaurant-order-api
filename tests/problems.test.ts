import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app';

//PROBLEM 2
describe('GET /api/restaurant/problem2', () => {
  it('should return 5 nearest restaurants with specified keyword', async () => {
    // Assuming you have mock data or a way to set up test data
    const keyword = 'lahmacun';
    const coordinates = [39.93, 32.85]; // Replace with test coordinates

    const response = await request(app)
      .get('/api/restaurant/problem2')
      .query({ keyword, coordinates });
    expect(response.status).to.equal(200);
    expect(response.body.data).to.be.an('array');
    expect(response.body.data.length).to.be.at.most(5); // Ensure maximum 5 restaurants are returned
    console.log(response.body.data);

  });
});

//PROBLEM 3
describe('POST /api/restaurant/problem3', () => {
  it('should send restaurant name, category name, and menu items.', async () => {
    // Assuming you have mock data or a way to set up test data
    const restaurantName = 'Voco Fast Food'; // Replace with test data
    const categoryName = 'Main Course'; // Replace with test data
    const menuItems = [
      {
        name: 'Küçük boy peynirli pizza',
        description: 'Küçük boy peynirli pizza açıklaması',
        price: 50,
        picture: 'peynirli-pizza.jpg',
      },
      {
        name: 'Orta boy mantarlı pizza',
        description: 'Orta boy mantarlı pizza açıklaması',
        price: 100,
        picture: 'mantarli-pizza.jpg',
      },
      {
        name: 'Hamburger',
        description: 'Hamburger açıklaması',
        price: 120,
        picture: 'hamburger.jpg',
      },
    ];

    const response = await request(app)
      .post('/api/restaurant/problem3')
      .send({ restaurantName, categoryName, menuItems });

    expect(response.status).to.equal(200);
    expect(response.body.data).to.be.an('array');
    expect(response.body.data.length).to.be.at.least(3);

    console.log(response.body.data);
    // Add more assertions based on what you expect the response to be
  });
});

//PROBLEM 4

describe('GET /api/restaurant/problem4', () => {
  it('should return last 20 man made order review and they should be sorted by age', async () => {
    const gender = "man"
    const limit = 20
    const page = 1

    const response = await request(app)
      .get('/api/restaurant/problem4')
      .query({ gender, limit, page });

    expect(response.status).to.equal(200);
    expect(response.body.data).to.be.an('array');
    expect(response.body.data.length).to.be.at.most(limit);

    //expect data to be sorted by age
    expect(response.body.data[0].userProfileId.age).to.be.at.least(response.body.data[1].userProfileId.age);
    expect(response.body.data[1].userProfileId.age).to.be.at.least(response.body.data[2].userProfileId.age);
    expect(response.body.data[0].userProfileId.gender).to.be.equal(gender)

  });
});

//PROBLEM 5

describe('GET /api/restaurant/problem5', () => {
  it('It gives restaurants above 4 rating that serve fast food or ev yemekleri in their categories or have the word fast in their description.', async () => {
    const response = await request(app)
      .get('/api/restaurant/problem5');
    expect(response.status).to.equal(200);
    expect(response.body.data).to.be.an('array');
    expect(response.body.data[0]).to.satisfy(function(restaurant: any) {
      return restaurant.description.includes('fast') || restaurant.categories.some((category: any) => {
        return category === 'Fast Food' || category === 'Ev Yemekleri'
      })
    });

  });
});

//PROBLEM 6

describe('GET /api/restaurant/problem6', () => {
  it('It gives restaurants sorted by average rating', async () => {
    const limit = 20
    const page = 1
    const response = await request(app)
      .get('/api/restaurant/problem6')
      .query({ limit, page });
      console.log(response.body, response.body.data.length)
    expect(response.status).to.equal(200);
    expect(response.body.data.length).to.be.at.most(limit);
    expect(response.body.data).to.be.an('array');
   

  });
});