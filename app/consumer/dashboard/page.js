'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sprout, Package, Calendar, TrendingUp, Heart, Settings, LogOut } from 'lucide-react';

export default function ConsumerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth?mode=login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'consumer') {
      router.push('/auth?mode=login');
      return;
    }

    setUser(parsedUser);
    fetchDashboard(token);
  };

  const fetchDashboard = async (token) => {
    try {
      const response = await fetch('/api/consumer/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReservations(data.reservations || []);
      }
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      growing: 'bg-green-100 text-green-800',
      harvested: 'bg-purple-100 text-purple-800',
      delivered: 'bg-emerald-100 text-emerald-800',
      completed: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      {/* Header */}
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

          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Consumer Dashboard</h1>
          <p className="text-gray-600">Track your reservations and upcoming deliveries</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Reservations</p>
                  <p className="text-3xl font-bold text-green-600">{reservations.length}</p>
                </div>
                <Package className="w-10 h-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Orders</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {reservations.filter((r) => ['paid', 'growing', 'harvested'].includes(r.status)).length}
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Upcoming Harvests</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {reservations.filter((r) => r.status === 'growing').length}
                  </p>
                </div>
                <Calendar className="w-10 h-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-pink-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Favorites</p>
                  <p className="text-3xl font-bold text-pink-600">0</p>
                </div>
                <Heart className="w-10 h-10 text-pink-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reservations */}
        <Card className="border-2 border-green-100">
          <CardHeader>
            <CardTitle>Your Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            {reservations.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-600">No Reservations Yet</h3>
                <p className="text-gray-500 mb-6">Start exploring farms and reserve your first harvest!</p>
                <Link href="/marketplace">
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                    Browse Marketplace
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <Card key={reservation._id} className="border border-green-100 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-1">
                            {reservation.productId?.name || 'Product'}
                          </h3>
                          <p className="text-gray-600">
                            {reservation.farmId?.name} • {reservation.farmId?.location}
                          </p>
                        </div>
                        <Badge className={getStatusColor(reservation.status)}>
                          {reservation.status?.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Quantity</p>
                          <p className="font-semibold">{reservation.quantity} kg</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Price</p>
                          <p className="font-semibold">₾{reservation.totalPrice}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Expected Delivery</p>
                          <p className="font-semibold">
                            {reservation.expectedDeliveryDate
                              ? new Date(reservation.expectedDeliveryDate).toLocaleDateString()
                              : 'TBD'}
                          </p>
                        </div>
                      </div>

                      {reservation.status === 'growing' && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-600">Growth Progress</span>
                            <span className="font-semibold">65%</span>
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>
                      )}

                      <div className="flex gap-2">
                        {reservation.digitalPassportId && (
                          <Link href={`/passport/${reservation.digitalPassportId}`}>
                            <Button variant="outline" size="sm">
                              View Digital Passport
                            </Button>
                          </Link>
                        )}
                        <Link href={`/farm/${reservation.farmId?._id}`}>
                          <Button variant="outline" size="sm">
                            View Farm
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
