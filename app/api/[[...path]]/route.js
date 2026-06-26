import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Farm from '@/lib/models/Farm';
import Product from '@/lib/models/Product';
import Reservation from '@/lib/models/Reservation';
import Review from '@/lib/models/Review';
import DigitalPassport from '@/lib/models/DigitalPassport';
import HarvestRecord from '@/lib/models/HarvestRecord';
import { hashPassword, comparePassword, generateToken, getUserFromRequest } from '@/lib/auth';
import { getChatCompletion, getStreamingResponse } from '@/lib/claudeClient';
import { generateQRCode, generatePassportId, generateBlockchainHash } from '@/lib/qrGenerator';

// GET handler
export async function GET(request) {
  const { pathname } = new URL(request.url);
  
  try {
    await connectDB();

    // Root API
    if (pathname === '/api' || pathname === '/api/') {
      return NextResponse.json({ message: 'FarmLink Georgia API - Ready', version: '1.0' });
    }

    // Get all farms
    if (pathname === '/api/farms') {
      const { searchParams } = new URL(request.url);
      const organic = searchParams.get('organic');
      const season = searchParams.get('season');
      const region = searchParams.get('region');
      const category = searchParams.get('category');
      
      let query = { verified: true };
      if (organic === 'true') query.organic = true;
      if (region) query.region = region;
      
      const farms = await Farm.find(query)
        .populate('farmerId', 'name email')
        .sort({ rating: -1 })
        .lean();
      
      // Get products for each farm
      for (let farm of farms) {
        const products = await Product.find({ farmId: farm._id, available: true }).lean();
        farm.products = products;
      }
      
      return NextResponse.json(farms);
    }

    // Get single farm
    if (pathname.startsWith('/api/farms/')) {
      const farmId = pathname.split('/api/farms/')[1];
      const farm = await Farm.findById(farmId).populate('farmerId', 'name email phone').lean();
      
      if (!farm) {
        return NextResponse.json({ error: 'Farm not found' }, { status: 404 });
      }
      
      const products = await Product.find({ farmId: farm._id }).lean();
      const reviews = await Review.find({ farmId: farm._id })
        .populate('consumerId', 'name')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
      
      farm.products = products;
      farm.reviews = reviews;
      
      return NextResponse.json(farm);
    }

    // Get products
    if (pathname === '/api/products') {
      const { searchParams } = new URL(request.url);
      const category = searchParams.get('category');
      const season = searchParams.get('season');
      const organic = searchParams.get('organic');
      
      let query = { available: true };
      if (category) query.category = category;
      if (season) query.season = season;
      if (organic === 'true') query.organic = true;
      
      const products = await Product.find(query)
        .populate('farmId', 'name location organic verified')
        .lean();
      
      return NextResponse.json(products);
    }

    // Get user profile
    if (pathname === '/api/profile') {
      const user = getUserFromRequest(request);
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const userData = await User.findById(user.userId).select('-password').lean();
      return NextResponse.json(userData);
    }

    // Consumer dashboard
    if (pathname === '/api/consumer/dashboard') {
      const user = getUserFromRequest(request);
      if (!user || user.role !== 'consumer') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const reservations = await Reservation.find({ consumerId: user.userId })
        .populate('farmId', 'name location')
        .populate('productId', 'name category images')
        .sort({ createdAt: -1 })
        .lean();
      
      return NextResponse.json({ reservations });
    }

    // Farmer dashboard
    if (pathname === '/api/farmer/dashboard') {
      const user = getUserFromRequest(request);
      if (!user || user.role !== 'farmer') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const farm = await Farm.findOne({ farmerId: user.userId }).lean();
      if (!farm) {
        return NextResponse.json({ error: 'Farm not found' }, { status: 404 });
      }
      
      const reservations = await Reservation.find({ farmId: farm._id })
        .populate('consumerId', 'name email')
        .populate('productId', 'name category')
        .sort({ createdAt: -1 })
        .lean();
      
      const products = await Product.find({ farmId: farm._id }).lean();
      
      const totalIncome = reservations
        .filter(r => r.status === 'completed')
        .reduce((sum, r) => sum + r.farmerAmount, 0);
      
      const pendingIncome = reservations
        .filter(r => r.escrowStatus === 'held')
        .reduce((sum, r) => sum + r.farmerAmount, 0);
      
      return NextResponse.json({
        farm,
        reservations,
        products,
        stats: {
          totalIncome,
          pendingIncome,
          totalReservations: reservations.length,
          activeProducts: products.filter(p => p.available).length,
        },
      });
    }

    // Admin dashboard
    if (pathname === '/api/admin/dashboard') {
      const user = getUserFromRequest(request);
      if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const totalFarms = await Farm.countDocuments();
      const verifiedFarms = await Farm.countDocuments({ verified: true });
      const totalUsers = await User.countDocuments();
      const totalReservations = await Reservation.countDocuments();
      const completedReservations = await Reservation.find({ status: 'completed' }).lean();
      
      const totalRevenue = completedReservations.reduce((sum, r) => sum + r.totalPrice, 0);
      const totalCommission = completedReservations.reduce((sum, r) => sum + r.platformCommission, 0);
      
      const pendingFarms = await Farm.find({ verified: false })
        .populate('farmerId', 'name email')
        .lean();
      
      return NextResponse.json({
        stats: {
          totalFarms,
          verifiedFarms,
          totalUsers,
          totalReservations,
          totalRevenue,
          totalCommission,
        },
        pendingFarms,
      });
    }

    // Get digital passport
    if (pathname.startsWith('/api/passport/')) {
      const passportId = pathname.split('/api/passport/')[1];
      const passport = await DigitalPassport.findOne({ passportId })
        .populate('productId', 'name category images')
        .populate('farmId', 'name location organic verified')
        .populate('reservationId')
        .lean();
      
      if (!passport) {
        return NextResponse.json({ error: 'Passport not found' }, { status: 404 });
      }
      
      return NextResponse.json(passport);
    }

    // Get reviews for a farm
    if (pathname.startsWith('/api/reviews/')) {
      const farmId = pathname.split('/api/reviews/')[1];
      const reviews = await Review.find({ farmId })
        .populate('consumerId', 'name')
        .sort({ createdAt: -1 })
        .lean();
      
      return NextResponse.json(reviews);
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST handler
export async function POST(request) {
  const { pathname } = new URL(request.url);
  
  try {
    await connectDB();
    const body = await request.json();

    // User registration
    if (pathname === '/api/auth/register') {
      const { email, password, name, role } = body;
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }
      
      const hashedPassword = await hashPassword(password);
      const user = await User.create({
        email,
        password: hashedPassword,
        name,
        role: role || 'consumer',
      });
      
      const token = generateToken(user);
      
      return NextResponse.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    }

    // User login
    if (pathname === '/api/auth/login') {
      const { email, password } = body;
      
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      
      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }
      
      const token = generateToken(user);
      
      return NextResponse.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    }

    // Create farm
    if (pathname === '/api/farms') {
      const user = getUserFromRequest(request);
      if (!user || user.role !== 'farmer') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const farm = await Farm.create({
        ...body,
        farmerId: user.userId,
      });
      
      return NextResponse.json(farm);
    }

    // Create product
    if (pathname === '/api/products') {
      const user = getUserFromRequest(request);
      if (!user || user.role !== 'farmer') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const product = await Product.create(body);
      
      return NextResponse.json(product);
    }

    // Create reservation
    if (pathname === '/api/reservations') {
      const user = getUserFromRequest(request);
      if (!user || user.role !== 'consumer') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const { productId, farmId, quantity } = body;
      
      const product = await Product.findById(productId);
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      
      const totalPrice = product.pricePerUnit * quantity;
      const platformCommission = totalPrice * 0.05; // 5%
      const farmerAmount = totalPrice - platformCommission;
      
      const reservation = await Reservation.create({
        consumerId: user.userId,
        farmId,
        productId,
        quantity,
        totalPrice,
        platformCommission,
        farmerAmount,
        status: 'paid',
        escrowStatus: 'held',
        paymentDate: new Date(),
        expectedDeliveryDate: product.expectedHarvestDate,
      });
      
      // Generate digital passport
      const passportId = generatePassportId();
      const qrCode = await generateQRCode(`${process.env.NEXT_PUBLIC_BASE_URL}/passport/${passportId}`);
      const blockchainHash = generateBlockchainHash({
        passportId,
        productId,
        farmId,
        timestamp: Date.now(),
      });
      
      const passport = await DigitalPassport.create({
        passportId,
        productId,
        farmId,
        reservationId: reservation._id,
        qrCode,
        blockchainHash,
        timeline: [
          {
            stage: 'Reserved',
            date: new Date(),
            description: 'Product reserved by consumer',
            verifiedBy: 'FarmLink Platform',
          },
          {
            stage: 'Payment',
            date: new Date(),
            description: 'Payment received and held in escrow',
            verifiedBy: 'FarmLink Escrow System',
          },
        ],
      });
      
      await Reservation.findByIdAndUpdate(reservation._id, {
        digitalPassportId: passportId,
      });
      
      return NextResponse.json({ reservation, passport });
    }

    // Create review
    if (pathname === '/api/reviews') {
      const user = getUserFromRequest(request);
      if (!user || user.role !== 'consumer') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const review = await Review.create({
        ...body,
        consumerId: user.userId,
        verified: true,
      });
      
      // Update farm rating
      const reviews = await Review.find({ farmId: body.farmId });
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      
      await Farm.findByIdAndUpdate(body.farmId, {
        rating: avgRating,
        totalReviews: reviews.length,
      });
      
      return NextResponse.json(review);
    }

    // AI Chat
    if (pathname === '/api/ai/chat') {
      const { messages } = body;
      
      const systemPrompt = {
        role: 'system',
        content: `You are an AI assistant for FarmLink Georgia, an agricultural marketplace platform. Help users with:
        - Finding the right farmers and products
        - Understanding organic farming and seasonal availability
        - Explaining the reservation and escrow system
        - Answering questions about harvest dates and quality
        - Recommending products based on preferences
        Be helpful, friendly, and knowledgeable about sustainable agriculture.`,
      };
      
      const fullMessages = [systemPrompt, ...messages];
      
      try {
        const response = await getStreamingResponse(fullMessages);
        
        // Return streaming response
        return new Response(response.body, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      } catch (error) {
        // Fallback to non-streaming
        const text = await getChatCompletion(fullMessages);
        return NextResponse.json({ content: text });
      }
    }

    // AI Recommendations
    if (pathname === '/api/ai/recommendations') {
      const { season, preferenceTags = [], userId } = body;
      
      // Get available products
      let query = { available: true };
      if (season) query.season = season;
      
      const products = await Product.find(query)
        .populate('farmId', 'name location organic verified')
        .limit(20)
        .lean();
      
      const systemPrompt = {
        role: 'system',
        content: `You are a recommendation engine for agricultural products. Analyze the products and user preferences, then recommend the best options. Return ONLY valid JSON in this exact format:
{
  "recommendations": [
    {
      "productId": "product_id_here",
      "productName": "product name",
      "reason": "brief reason for recommendation",
      "score": 95
    }
  ]
}`,
      };
      
      const userPrompt = {
        role: 'user',
        content: `Season: ${season || 'current'}
Preference tags: ${preferenceTags.join(', ') || 'none'}
Available products: ${JSON.stringify(products.slice(0, 10).map(p => ({
          id: p._id,
          name: p.name,
          category: p.category,
          organic: p.organic,
          farm: p.farmId.name,
        })))}

Recommend top 5 products.`,
      };
      
      try {
        const response = await getChatCompletion([systemPrompt, userPrompt]);
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const recommendations = JSON.parse(jsonMatch[0]);
          return NextResponse.json(recommendations);
        }
        return NextResponse.json({ recommendations: [] });
      } catch (error) {
        console.error('AI Recommendations error:', error);
        return NextResponse.json({ recommendations: [], error: error.message });
      }
    }

    // AI Harvest Predictions
    if (pathname === '/api/ai/predictions') {
      const { crop, region, targetSeason } = body;
      
      // Get historical records
      const records = await HarvestRecord.find({ crop }).limit(20).lean();
      
      const systemPrompt = {
        role: 'system',
        content: `You are an agricultural forecasting assistant. Based on historical harvest data, predict yields. Return ONLY valid JSON:
{
  "expectedYieldKg": 1000,
  "yieldConfidence": 85,
  "expectedWindow": "May-June 2025",
  "factors": ["favorable weather", "good soil conditions"],
  "recommendations": ["plant early", "monitor water"]
}`,
      };
      
      const userPrompt = {
        role: 'user',
        content: `Crop: ${crop}
Region: ${region}
Target season: ${targetSeason}
Historical data: ${JSON.stringify(records.slice(0, 5))}

Predict harvest yield and timing.`,
      };
      
      try {
        const response = await getChatCompletion([systemPrompt, userPrompt]);
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const prediction = JSON.parse(jsonMatch[0]);
          return NextResponse.json(prediction);
        }
        return NextResponse.json({ error: 'Could not generate prediction' });
      } catch (error) {
        console.error('AI Predictions error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT handler
export async function PUT(request) {
  const { pathname } = new URL(request.url);
  
  try {
    await connectDB();
    const body = await request.json();
    const user = getUserFromRequest(request);

    // Update reservation status
    if (pathname.startsWith('/api/reservations/')) {
      const reservationId = pathname.split('/api/reservations/')[1];
      
      const reservation = await Reservation.findByIdAndUpdate(
        reservationId,
        body,
        { new: true }
      );
      
      if (!reservation) {
        return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
      }
      
      // Update digital passport timeline
      if (body.status && reservation.digitalPassportId) {
        const stage = body.status.charAt(0).toUpperCase() + body.status.slice(1);
        await DigitalPassport.findOneAndUpdate(
          { passportId: reservation.digitalPassportId },
          {
            $push: {
              timeline: {
                stage,
                date: new Date(),
                description: `Status updated to ${body.status}`,
                verifiedBy: 'FarmLink Platform',
              },
            },
          }
        );
      }
      
      return NextResponse.json(reservation);
    }

    // Admin: verify farm
    if (pathname.startsWith('/api/admin/farms/')) {
      if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      const farmId = pathname.split('/api/admin/farms/')[1].split('/')[0];
      const farm = await Farm.findByIdAndUpdate(
        farmId,
        { verified: true },
        { new: true }
      );
      
      return NextResponse.json(farm);
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
