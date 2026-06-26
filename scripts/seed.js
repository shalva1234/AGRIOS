// Run this script to seed demo data: node scripts/seed.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'farmlink_georgia';

// Connect to MongoDB
await mongoose.connect(MONGO_URL, { dbName: DB_NAME });

console.log('Connected to MongoDB');

// Define schemas inline
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
  phone: String,
  address: String,
  preferenceTags: [String],
}, { timestamps: true });

const FarmSchema = new mongoose.Schema({
  farmerId: mongoose.Schema.Types.ObjectId,
  name: String,
  location: String,
  region: String,
  description: String,
  story: String,
  totalLand: Number,
  images: [String],
  profileImage: String,
  organic: Boolean,
  verified: Boolean,
  rating: Number,
  totalReviews: Number,
  yearsOfExperience: Number,
  badges: [String],
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  farmId: mongoose.Schema.Types.ObjectId,
  name: String,
  category: String,
  description: String,
  availableQuantity: Number,
  unit: String,
  pricePerUnit: Number,
  season: String,
  expectedHarvestDate: Date,
  plantingDate: Date,
  images: [String],
  organic: Boolean,
  tags: [String],
  growthProgress: Number,
  available: Boolean,
}, { timestamps: true });

const HarvestRecordSchema = new mongoose.Schema({
  farmId: mongoose.Schema.Types.ObjectId,
  crop: String,
  season: String,
  year: Number,
  plantingDate: Date,
  harvestDate: Date,
  yieldKg: Number,
  quality: String,
  conditions: String,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Farm = mongoose.models.Farm || mongoose.model('Farm', FarmSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const HarvestRecord = mongoose.models.HarvestRecord || mongoose.model('HarvestRecord', HarvestRecordSchema);

// Clear existing data
await User.deleteMany({});
await Farm.deleteMany({});
await Product.deleteMany({});
await HarvestRecord.deleteMany({});

console.log('Cleared existing data');

// Create users
const hashedPassword = await bcrypt.hash('password123', 10);

const admin = await User.create({
  email: 'admin@farmlink.ge',
  password: hashedPassword,
  name: 'Admin User',
  role: 'admin',
  phone: '+995 555 123456',
});

const consumer1 = await User.create({
  email: 'consumer@example.com',
  password: hashedPassword,
  name: 'Test Consumer',
  role: 'consumer',
  phone: '+995 555 987654',
  preferenceTags: ['organic', 'vegetables', 'fruits'],
});

const farmers = [];
const farmerData = [
  {
    email: 'giorgi@farmlink.ge',
    name: 'გიორგი ბერიძე',
    region: 'Kakheti',
    location: 'თელავი, კახეთი',
    farmName: "გიორგის ორგანული ფერმა",
    story: 'მესამე თაობის ფერმერი, სპეციალიზირებული ორგანულ ბოსტნეულსა და ღვინის ყურძენში',
    yearsOfExperience: 15,
  },
  {
    email: 'nino@farmlink.ge',
    name: 'ნინო ჭიტაძე',
    region: 'Imereti',
    location: 'ქუთაისი, იმერეთი',
    farmName: "ნინოს ხილის ბაღი",
    story: 'ეძღვნება პრემიუმ ორგანული ხილის მოყვანას ტრადიციული ქართული მეთოდების გამოყენებით',
    yearsOfExperience: 12,
  },
  {
    email: 'levan@farmlink.ge',
    name: 'ლევან გვასალია',
    region: 'Guria',
    location: 'ოზურგეთი, გურია',
    farmName: "ლევანის კენკროვანი ფერმა",
    story: 'სპეციალიზირებული ორგანულ კენკრით და თაფლში პესტიციდებისგან თავისუფალი ველებიდან',
    yearsOfExperience: 8,
  },
];

for (const data of farmerData) {
  const farmer = await User.create({
    email: data.email,
    password: hashedPassword,
    name: data.name,
    role: 'farmer',
    phone: '+995 555 111222',
  });
  farmers.push({ user: farmer, ...data });
}

console.log('Created users');

// Create farms with products
const farms = [];

for (let i = 0; i < farmers.length; i++) {
  const farmerData = farmers[i];
  
  const farm = await Farm.create({
    farmerId: farmerData.user._id,
    name: farmerData.farmName,
    location: farmerData.location,
    region: farmerData.region,
    description: `პრემიუმ ორგანული ფერმა ${farmerData.region}-ში, რომელიც ზრდის სეზონურ პროდუქტებს`,
    story: farmerData.story,
    totalLand: Math.floor(Math.random() * 20) + 5,
    images: [
      'https://images.pexels.com/photos/34282798/pexels-photo-34282798.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      'https://images.pexels.com/photos/20000996/pexels-photo-20000996.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    ],
    profileImage: 'https://images.pexels.com/photos/8657202/pexels-photo-8657202.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    organic: true,
    verified: true,
    rating: 4.5 + Math.random() * 0.5,
    totalReviews: Math.floor(Math.random() * 50) + 10,
    yearsOfExperience: farmerData.yearsOfExperience,
    badges: ['ორგანული სერტიფიცირებული', 'ოქროს სტანდარტი', 'პლატფორმის მიერ დამოწმებული'],
  });
  
  farms.push(farm);
}

console.log('Created farms');

// Create products for each farm
const productTemplates = [
  // Vegetables
  { name: 'Organic Tomatoes', category: 'Vegetables', season: 'Summer', unit: 'kg', pricePerUnit: 8 },
  { name: 'Cucumbers', category: 'Vegetables', season: 'Summer', unit: 'kg', pricePerUnit: 6 },
  { name: 'Bell Peppers', category: 'Vegetables', season: 'Summer', unit: 'kg', pricePerUnit: 10 },
  { name: 'Zucchini', category: 'Vegetables', season: 'Spring', unit: 'kg', pricePerUnit: 7 },
  { name: 'Eggplant', category: 'Vegetables', season: 'Summer', unit: 'kg', pricePerUnit: 9 },
  { name: 'Lettuce', category: 'Vegetables', season: 'Spring', unit: 'kg', pricePerUnit: 12 },
  
  // Fruits
  { name: 'Organic Apples', category: 'Fruits', season: 'Autumn', unit: 'kg', pricePerUnit: 15 },
  { name: 'Pears', category: 'Fruits', season: 'Autumn', unit: 'kg', pricePerUnit: 14 },
  { name: 'Cherries', category: 'Fruits', season: 'Summer', unit: 'kg', pricePerUnit: 25 },
  { name: 'Plums', category: 'Fruits', season: 'Summer', unit: 'kg', pricePerUnit: 12 },
  { name: 'Peaches', category: 'Fruits', season: 'Summer', unit: 'kg', pricePerUnit: 18 },
  
  // Berries
  { name: 'Strawberries', category: 'Berries', season: 'Spring', unit: 'kg', pricePerUnit: 30 },
  { name: 'Blueberries', category: 'Berries', season: 'Summer', unit: 'kg', pricePerUnit: 35 },
  { name: 'Raspberries', category: 'Berries', season: 'Summer', unit: 'kg', pricePerUnit: 32 },
  { name: 'Blackberries', category: 'Berries', season: 'Summer', unit: 'kg', pricePerUnit: 28 },
  
  // Others
  { name: 'Free-range Eggs', category: 'Eggs', season: 'All Year', unit: 'dozen', pricePerUnit: 10 },
  { name: 'Raw Honey', category: 'Honey', season: 'Summer', unit: 'kg', pricePerUnit: 45 },
  { name: 'Organic Cheese', category: 'Dairy', season: 'All Year', unit: 'kg', pricePerUnit: 40 },
];

for (const farm of farms) {
  // Each farm gets 5-8 random products
  const numProducts = Math.floor(Math.random() * 4) + 5;
  const selectedProducts = productTemplates
    .sort(() => 0.5 - Math.random())
    .slice(0, numProducts);
  
  for (const template of selectedProducts) {
    const plantDate = new Date();
    plantDate.setMonth(plantDate.getMonth() - 2);
    
    const harvestDate = new Date();
    harvestDate.setMonth(harvestDate.getMonth() + 2);
    
    await Product.create({
      farmId: farm._id,
      name: template.name,
      category: template.category,
      description: `Fresh organic ${template.name.toLowerCase()} grown without pesticides`,
      availableQuantity: Math.floor(Math.random() * 500) + 100,
      unit: template.unit,
      pricePerUnit: template.pricePerUnit,
      season: template.season,
      expectedHarvestDate: harvestDate,
      plantingDate: plantDate,
      images: [
        'https://images.pexels.com/photos/11509871/pexels-photo-11509871.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      ],
      organic: true,
      tags: ['organic', 'fresh', 'local', 'seasonal'],
      growthProgress: Math.floor(Math.random() * 40) + 40, // 40-80%
      available: true,
    });
  }
}

console.log('Created products');

// Create harvest records for AI predictions
for (const farm of farms) {
  const crops = ['Tomatoes', 'Cucumbers', 'Apples', 'Berries', 'Peppers'];
  const seasons = ['Spring', 'Summer', 'Autumn'];
  const years = [2022, 2023, 2024];
  
  for (const year of years) {
    for (const season of seasons) {
      const crop = crops[Math.floor(Math.random() * crops.length)];
      
      await HarvestRecord.create({
        farmId: farm._id,
        crop,
        season,
        year,
        plantingDate: new Date(year, 2, 15),
        harvestDate: new Date(year, 5, 20),
        yieldKg: Math.floor(Math.random() * 3000) + 1000,
        quality: ['Excellent', 'Good', 'Very Good'][Math.floor(Math.random() * 3)],
        conditions: 'Favorable weather, adequate rainfall, good soil conditions',
      });
    }
  }
}

console.log('Created harvest records');

console.log('\n=================================');
console.log('Seed completed successfully!');
console.log('=================================');
console.log('\nTest accounts:');
console.log('Admin: admin@farmlink.ge / password123');
console.log('Consumer: consumer@example.com / password123');
console.log('Farmer 1: giorgi@farmlink.ge / password123');
console.log('Farmer 2: nino@farmlink.ge / password123');
console.log('Farmer 3: levan@farmlink.ge / password123');
console.log('\n=================================\n');

mongoose.connection.close();
