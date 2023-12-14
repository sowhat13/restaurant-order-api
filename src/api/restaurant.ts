import express, { Request, Response } from 'express';
import mongoose, { ClientSession } from 'mongoose';
import Food from '../models/food';
import RestaurantPlace from '../models/restaurantPlace';
import RestaurantGeneral from '../models/restaurantGeneral';
import Address from '../models/address';
import OrderReview from '../models/orderReview';
import { create } from 'axios';

const router = express.Router();

//create restaurant

router.post('/create', async (req: any, res: any) => {
    try {
        const { name, description, logo, categories } = req.body;

        if (!name || String(name).length === 0) {
            return res.sendError('Name is required', 400);
        }

        if (!description || String(description).length === 0) {
            return res.sendError('Description is required', 400);
        }

        if (!logo || String(logo).length === 0) {
            return res.sendError('Logo is required', 400);
        }

        if (!categories || categories.length === 0) {
            return res.sendError('Categories is required', 400);
        }

        const restaurantGeneral = await RestaurantGeneral.create({
            name,
            description,
            logo,
            categories
        });

        res.sendSuccess(restaurantGeneral);
    } catch (error: any) {
        res.sendError(error, 500);
    }
});


//create restaurant place

router.post('/createPlace', async (req: any, res: any) => {
    try {
        const { restaurantGeneral, address, menu } = req.body;

        if (!restaurantGeneral || String(restaurantGeneral).length === 0) {
            return res.sendError('Restaurant General is required', 400);
        }

        if (!address || String(address).length === 0) {
            return res.sendError('Address is required', 400);
        }

        if (!menu || menu.length === 0) {
            return res.sendError('Menu is required', 400);
        }

        const restaurantPlace = await RestaurantPlace.create({
            restaurantGeneral,
            address,
            menu
        });

        res.sendSuccess(restaurantPlace);
    } catch (error: any) {
        res.sendError(error, 500);
    }
});

router.get('/allPlaces', async (req: any, res: any) => {
    try {
        const restaurantPlaces = await RestaurantPlace.find().lean().exec();
        res.sendSuccess(restaurantPlaces);
    } catch (error: any) {
        res.sendError(error, 500);
    }
});

router.get('/problem2', async (req: any, res: any) => {
    try {
        const { keyword, coordinates } = req.query;

        if (!keyword || !coordinates) {
            return res.status(400).json({ error: 'Keyword and coordinates are required.' });
        }
        const coords = coordinates.map(parseFloat)

        // Find RestaurantGenerals with the keyword in description
        const restaurantGeneralIds = await RestaurantGeneral.find({ description: { $regex: new RegExp(keyword, 'i') } }).select('_id').lean();
        // Find RestaurantPlaces with the RestaurantGeneralIds
        const restaurantPlaces = await RestaurantPlace.find({ restaurantGeneral: { $in: restaurantGeneralIds } }).populate('restaurantGeneral').populate('address').lean().exec();
        const restaurantPlacesAddressIds = restaurantPlaces.map((restaurantPlace: any) => restaurantPlace.address);
        // Find nearest 5 addresses from the RestaurantPlaces
        const nearestAddresses = await Address.find({
            _id: { $in: restaurantPlacesAddressIds },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: coords,
                    },
                },
            },
        }).select('_id').limit(5);

        const top5RestaurantPlaces: any = []

        nearestAddresses.forEach((address: any) => {
            restaurantPlaces.find((restaurantPlace: any) => {
                if (String(restaurantPlace.address._id) === String(address._id)) {
                    top5RestaurantPlaces.push(restaurantPlace);
                }
            }
            );
        });

        res.sendSuccess(top5RestaurantPlaces);
    } catch (error) {
        res.sendError(error, 500);
    }
});

router.post('/problem3', async (req: Request, res: any) => {
    const { restaurantName, categoryName, menuItems } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const restaurantGeneral = await RestaurantGeneral.findOne({ name: restaurantName }, undefined, { session })
        let foods = []
        const restaurantPlaces = await RestaurantPlace.find({ restaurantGeneral: restaurantGeneral._id }, undefined, { session })
        for (let i = 0; i < restaurantPlaces.length; i++) {
            const foodList = await menuItems.map((menuItem: any) => { return { ...menuItem, restaurantPlace: restaurantPlaces[i]._id } })
            foods = await Food.create(foodList, { session })

            for (let j = 0; j < foods.length; j++) {
                const category = restaurantPlaces[i].menu.find((cat: any) => cat.categoryName === categoryName);
                if (category) {
                    category.foods.push(foods[j]._id);
                } else {
                    throw new Error('Category not found in the restaurant menu.');
                }
            }
            await restaurantPlaces[i].save({ session });

        }

        await session.commitTransaction();
        session.endSession();
        res.sendSuccess(foods);
    } catch (error) {
        console.error('abort transaction', error);
        await session.abortTransaction();
        session.endSession();
        res.sendError(error, 500);
    }
});

router.get('/problem4', async (req: any, res: any) => {
    try {
        const { gender, limit = 20, page = 1 } = req.query;

        const skipCount = (Number(page) - 1) * Number(limit);



        const orderReviews = await OrderReview.aggregate([
            {
                $lookup: {
                    from: "userprofiles",
                    localField: "userProfileId",
                    foreignField: "_id",
                    as: "userProfileId"
                },
            },
            {
                $unwind: "$userProfileId"
            },
            {
                $match: { "userProfileId.gender": gender }
            },
            {
                $sort: { "createdAt": -1 }
            },
            {
                $skip: skipCount
            },
            {
                $limit: Number(limit)
            },
            {
                $project: {
                    _id: 0,
                    orderId: 1,
                    rating: 1,
                    comment: 1,
                    createdAt: 1,
                    userProfileId: {
                        _id: 1,
                        age: 1,
                        gender: 1
                    }
                }
            }
        ])
        const sortedReviews = orderReviews.sort(
            (a: any, b: any) => b.userProfileId.age - a.userProfileId.age
        );
        res.sendSuccess(sortedReviews);
    } catch (error) {
        res.sendError(error, 500);
    }
});

router.get('/problem5', async (req: any, res: any) => {
    try {
        const restaurants: any[] = await RestaurantGeneral.aggregate([
            {
                $match: {
                    $or: [
                        { categories: { $in: ['Fast Food', 'Ev Yemekleri'] } },
                        { description: { $regex: 'fast', $options: 'i' } }
                    ]
                }
            },
            {
                $lookup: {
                    from: "restaurantplaces",
                    localField: "restaurantPlaces",
                    foreignField: "_id",
                    as: "restaurantPlaces"
                }
            },
            {
                $match: {
                    "restaurantPlaces.averageRating": { $gte: 4 }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    categories: 1,
                    description: 1
                }
            }
        ]);

        res.sendSuccess(restaurants);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch filtered restaurants' });
    }
});

router.get('/problem6', async (req: any, res: any) => {

    try {

        const { page = 1, limit = 20 } = req.query;
        const skipCount = (Number(page) - 1) * Number(limit);
        const restaurantPlaces = await RestaurantPlace.find().sort({ averageRating: -1 }).skip(skipCount).populate('restaurantGeneral').limit(Number(limit)).lean().exec();
        res.sendSuccess(restaurantPlaces);
    }catch(error) {
        res.Error(error, 500);
    }

});

export default router;
