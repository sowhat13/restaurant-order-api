import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app'; // Replace with the path to your Express app file
import UserProfile from '../src/models/userProfile'; // Import your UserProfile model
import Address from '../src/models/address'; // Import your Address model

describe('Creating 100 users and updating userProfiles with addresses for 100 users', () => {
  it('should create 100 users and update userProfiles with addresses successfully', async () => {
    const totalUsers = 100;
    const usersWithProfileAndAddress: any[] = [];

    for (let i = 0; i < totalUsers; i++) {
      const userData = {
        username: `user${i + 1}`, // Adjust username generation logic as needed
        password: 'ExamplePassword1', // Replace with a valid password
      };

      // Sending a POST request to your signup endpoint to create a user
      const userResponse = await request(app)
        .post('/auth/signup')
        .send(userData);

      expect(userResponse.status).to.equal(200); // Assuming your API returns a 200 status on successful signup

      // Find existing userProfile for the user
      const userProfile = await UserProfile.findOne({ userId: userResponse.body.data.userId });

      if (userProfile) {
        // Update userProfile data (random age, gender, etc.)
        userProfile.age = Math.floor(Math.random() * (100 - 13 + 1)) + 13; // Random age between 13 and 100
        userProfile.gender = Math.random() < 0.5 ? 'man' : 'woman'; // Random gender assignment
        userProfile.profilePicture = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/1200px-User-avatar.svg.png'; 


        // Create an address with random coordinates for the user
        const randomLongitude = (Math.random() * 360) - 180; // Random longitude between -180 and 180
        const randomLatitude = (Math.random() * 180) - 90; // Random latitude between -90 and 90
        const addressData = {
          city: `City ${i + 1}`, // Replace with actual city data
          town: 'Town', // Replace with actual town data
          addressLine: `${i + 1} Street`, // Replace with actual address data
          location: {
            type: 'Point',
            coordinates: [randomLongitude, randomLatitude],
          },
        };

        const address = await Address.create(addressData);

        // Associate the address with the userProfile
        userProfile.addresses.push(address._id);
        userProfile.selectedAddress = address._id;

        await userProfile.save();

        usersWithProfileAndAddress.push({ user: userResponse.body, userProfile, address });
      }
    }

    // Now 'usersWithProfileAndAddress' array contains data of the 100 updated users with their userProfile and associated addresses
    console.log('Users with userProfile and address:', usersWithProfileAndAddress);
  }).timeout(60000); // Adjust timeout as needed
});