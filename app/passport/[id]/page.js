'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sprout, Shield, CheckCircle2, MapPin, Calendar, Package, Truck } from 'lucide-react';

export default function PassportPage() {
  const params = useParams();
  const passportId = params.id;
  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (passportId) {
      fetchPassport();
    }
  }, [passportId]);

  const fetchPassport = async () => {
    try {
      const response = await fetch(`/api/passport/${passportId}`);
      if (response.ok) {
        const data = await response.json();
        setPassport(data);
      }
    } catch (error) {
      console.error('Error fetching passport:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!passport) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-green-50">
        <Card className="max-w-md p-8 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Passport Not Found</h2>
          <p className="text-gray-600 mb-6">This digital passport does not exist or has been removed.</p>
          <Link href="/">
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
              Go Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              FarmLink Georgia
            </span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-green-600 text-white">
              <Shield className="w-3 h-3 mr-1" />
              Blockchain Verified
            </Badge>
            <h1 className="text-4xl font-bold mb-2">Digital Product Passport</h1>
            <p className="text-gray-600">Complete traceability from farm to table</p>
          </div>

          {/* QR Code */}
          <Card className="border-2 border-green-100 mb-8">
            <CardContent className="p-8 text-center">
              <div className="inline-block p-4 bg-white rounded-2xl shadow-lg mb-4">
                {passport.qrCode && (
                  <Image
                    src={passport.qrCode}
                    alt="QR Code"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">Passport ID</p>
              <p className="font-mono text-sm bg-gray-100 px-4 py-2 rounded-lg inline-block">
                {passport.passportId}
              </p>
            </CardContent>
          </Card>

          {/* Product Info */}
          <Card className="border-2 border-green-100 mb-8">
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Product Name</p>
                  <p className="font-semibold">{passport.productId?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Category</p>
                  <p className="font-semibold">{passport.productId?.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Farm</p>
                  <p className="font-semibold">{passport.farmId?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <p className="font-semibold">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {passport.farmId?.location}
                  </p>
                </div>
              </div>

              {passport.farmId?.organic && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-700">100% Organic Certified</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Blockchain Verification */}
          <Card className="border-2 border-blue-100 mb-8 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Blockchain Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">Immutable Hash</p>
              <p className="font-mono text-xs bg-white px-4 py-3 rounded-lg break-all border border-blue-200">
                {passport.blockchainHash}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                This product's journey is permanently recorded on the blockchain and cannot be altered.
              </p>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-2 border-green-100">
            <CardHeader>
              <CardTitle>Product Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {passport.timeline && passport.timeline.length > 0 ? (
                  passport.timeline.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                          {event.stage === 'Reserved' && <Package className="w-6 h-6 text-white" />}
                          {event.stage === 'Payment' && <CheckCircle2 className="w-6 h-6 text-white" />}
                          {event.stage === 'Growing' && <Sprout className="w-6 h-6 text-white" />}
                          {event.stage === 'Harvested' && <CheckCircle2 className="w-6 h-6 text-white" />}
                          {event.stage === 'Delivered' && <Truck className="w-6 h-6 text-white" />}
                        </div>
                        {index < passport.timeline.length - 1 && (
                          <div className="w-0.5 h-16 bg-green-200 my-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-lg">{event.stage}</h4>
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(event.date).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-1">{event.description}</p>
                        <p className="text-sm text-gray-500">Verified by: {event.verifiedBy}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No timeline events recorded yet.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <Link href="/marketplace">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                Browse More Farms
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
