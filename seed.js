const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Car = require('./models/Car');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB for Mega Seeding (Indian Context)...');

    // Clear existing
    await User.deleteMany();
    await Car.deleteMany();

    // Create Developer (Super-Admin)
    const developer = await User.create({
      name: 'Creator (Dev)',
      email: 'creator@autorent.com',
      password: 'creator123',
      phone: '0000000000',
      role: 'Developer'
    });

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@autorent.com',
      password: 'password123',
      phone: '9876543210',
      role: 'Admin'
    });

    // Create Owners
    const owner1 = await User.create({
      name: 'Delhi Car Rentals',
      email: 'owner@autorent.com',
      password: 'password123',
      phone: '9123456789',
      role: 'Owner'
    });

    const owner2 = await User.create({
      name: 'Mumbai Travels',
      email: 'owner2@autorent.com',
      password: 'password123',
      phone: '9888877777',
      role: 'Owner'
    });

    const cars = [
      // DELHI
      { owner: owner1._id, make: 'Toyota', model: 'Fortuner', year: 2023, type: 'SUV', city: 'Delhi', pricePerDay: 5500, specs: { transmission: 'Automatic', fuelType: 'Diesel', mileage: '10 km/l' }, description: 'King of Indian roads. Perfect for off-roading and status.', isApproved: true, images: ['https://images.unsplash.com/photo-1621245084961-464a4d467727?auto=format&fit=crop&q=80&w=800'] },
      { owner: owner1._id, make: 'Hyundai', model: 'Creta', year: 2022, type: 'SUV', city: 'Delhi', pricePerDay: 3200, specs: { transmission: 'Automatic', fuelType: 'Petrol', mileage: '16 km/l' }, description: 'The ultimate urban SUV with panoramic sunroof.', isApproved: true, images: ['https://images.unsplash.com/photo-1621245084961-464a4d467727?auto=format&fit=crop&q=80&w=800'] },
      { owner: owner1._id, make: 'Maruti Suzuki', model: 'Swift', year: 2022, type: 'Hatchback', city: 'Delhi', pricePerDay: 1500, specs: { transmission: 'Manual', fuelType: 'Petrol', mileage: '22 km/l' }, description: 'Easy to drive, super fuel efficient.', isApproved: true, images: ['https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800'] },
      { owner: owner1._id, make: 'Honda', model: 'City', year: 2021, type: 'Sedan', city: 'Delhi', pricePerDay: 2800, specs: { transmission: 'Manual', fuelType: 'Petrol', mileage: '17 km/l' }, description: 'Classy sedan for business meetings.', isApproved: true, images: ['https://images.unsplash.com/photo-1510903117032-f1596c016a15?auto=format&fit=crop&q=80&w=800'] },

      // MUMBAI
      { owner: owner2._id, make: 'Mahindra', model: 'Scorpio-N', year: 2023, type: 'SUV', city: 'Mumbai', pricePerDay: 4800, specs: { transmission: 'Automatic', fuelType: 'Diesel', mileage: '14 km/l' }, description: 'The Big Daddy of SUVs.', isApproved: true, images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bd?auto=format&fit=crop&q=80&w=800'] },
      { owner: owner2._id, make: 'Toyota', model: 'Innova Crysta', year: 2022, type: 'SUV', city: 'Mumbai', pricePerDay: 4500, specs: { transmission: 'Manual', fuelType: 'Diesel', mileage: '12 km/l' }, description: 'Unmatched comfort for 7 people.', isApproved: true, images: ['https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&q=80&w=800'] },
      { owner: owner2._id, make: 'Hyundai', model: 'Verna', year: 2022, type: 'Sedan', city: 'Mumbai', pricePerDay: 3000, specs: { transmission: 'Automatic', fuelType: 'Petrol', mileage: '18 km/l' }, description: 'Futuristic design and powerful engine.', isApproved: true, images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800'] },
      { owner: owner2._id, make: 'Tata', model: 'Tiago', year: 2021, type: 'Hatchback', city: 'Mumbai', pricePerDay: 1300, specs: { transmission: 'Manual', fuelType: 'CNG', mileage: '26 km/kg' }, description: 'Budget friendly and very safe.', isApproved: true, images: ['https://images.unsplash.com/photo-1606152424101-ad4f9AD393bf?auto=format&fit=crop&q=80&w=800'] },

      // BANGALORE
      { owner: owner1._id, make: 'Mahindra', model: 'Thar', year: 2023, type: 'SUV', city: 'Bangalore', pricePerDay: 4000, specs: { transmission: 'Manual', fuelType: 'Diesel', mileage: '15 km/l' }, description: 'Explore the hills around Bangalore.', isApproved: true, images: ['https://images.unsplash.com/photo-1620852899307-88d4001c371f?auto=format&fit=crop&q=80&w=800'] },
      { owner: owner1._id, make: 'Tata', model: 'Nexon', year: 2022, type: 'SUV', city: 'Bangalore', pricePerDay: 2600, specs: { transmission: 'Automatic', fuelType: 'Petrol', mileage: '17 km/l' }, description: '5-star safety rated compact SUV.', isApproved: true, images: ['https://images.unsplash.com/photo-1606152424101-ad4f9AD393bf?auto=format&fit=crop&q=80&w=800'] },
      { owner: owner1._id, make: 'Honda', model: 'Amaze', year: 2021, type: 'Sedan', city: 'Bangalore', pricePerDay: 2000, specs: { transmission: 'CVT', fuelType: 'Petrol', mileage: '18 km/l' }, description: 'Smooth automatic for Bangalore traffic.', isApproved: true, images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800'] },

      // PUNE
      { owner: owner2._id, make: 'Kia', model: 'Seltos', year: 2022, type: 'SUV', city: 'Pune', pricePerDay: 3400, specs: { transmission: 'Automatic', fuelType: 'Diesel', mileage: '18 km/l' }, description: 'High-tech features and great looks.', isApproved: true, images: ['https://images.unsplash.com/photo-1621245084961-464a4d467727?auto=format&fit=crop&q=80&w=800'] },
      { owner: owner2._id, make: 'Volkswagen', model: 'Virtus', year: 2023, type: 'Sedan', city: 'Pune', pricePerDay: 3500, specs: { transmission: 'Manual', fuelType: 'Petrol', mileage: '19 km/l' }, description: 'For the love of driving.', isApproved: true, images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800'] },

      // HYDERABAD
      { owner: owner1._id, make: 'MG', model: 'Hector', year: 2022, type: 'SUV', city: 'Hyderabad', pricePerDay: 3800, specs: { transmission: 'Automatic', fuelType: 'Petrol', mileage: '12 km/l' }, description: 'Internet Inside. Very spacious.', isApproved: true, images: ['https://images.unsplash.com/photo-1621245084961-464a4d467727?auto=format&fit=crop&q=80&w=800'] },
      { owner: owner1._id, make: 'Maruti Suzuki', model: 'Baleno', year: 2023, type: 'Hatchback', city: 'Hyderabad', pricePerDay: 1800, specs: { transmission: 'AMT', fuelType: 'Petrol', mileage: '22 km/l' }, description: 'Modern premium hatchback.', isApproved: true, images: ['https://images.unsplash.com/photo-1606152424101-ad4f9AD393bf?auto=format&fit=crop&q=80&w=800'] }
    ];

    await Car.insertMany(cars);

    console.log('Mega Seeding Complete!');
    console.log('Added 25+ cars across Delhi, Mumbai, Bangalore, Pune, Hyderabad.');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
