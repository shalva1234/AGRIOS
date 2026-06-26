'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sprout, MapPin, Star, Search, Filter, Leaf, CheckCircle2, ArrowRight } from 'lucide-react';

export default function MarketplacePage() {
  const [farms, setFarms] = useState([]);
  const [filteredFarms, setFilteredFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [organicFilter, setOrganicFilter] = useState(false);

  useEffect(() => {
    fetchFarms();
  }, []);

  useEffect(() => {
    filterFarms();
  }, [farms, searchQuery, regionFilter, organicFilter]);

  const fetchFarms = async () => {
    try {
      const response = await fetch('/api/farms');
      if (response.ok) {
        const data = await response.json();
        setFarms(data);
      }
    } catch (error) {
      console.error('Error fetching farms:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFarms = () => {
    let filtered = [...farms];

    if (searchQuery) {
      filtered = filtered.filter(
        (farm) =>
          farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          farm.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (regionFilter !== 'all') {
      filtered = filtered.filter((farm) => farm.region === regionFilter);
    }

    if (organicFilter) {
      filtered = filtered.filter((farm) => farm.organic);
    }

    setFilteredFarms(filtered);
  };

  const regions = ['all', 'Kakheti', 'Imereti', 'Guria', 'Samegrelo', 'Adjara'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-green-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              FarmLink Georgia
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/ai-assistant">
              <Button variant="ghost">AI Assistant</Button>
            </Link>
            <Link href="/auth?mode=login">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-12 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4">
              Discover Local{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Organic Farms
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse verified farms and reserve your fresh harvest
            </p>
          </motion.div>

          {/* Search and Filters */}
          <Card className="border-2 border-green-100 shadow-lg">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      placeholder="Search farms, locations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region === 'all' ? 'All Regions' : region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant={organicFilter ? 'default' : 'outline'}
                  className={organicFilter ? 'bg-green-600 hover:bg-green-700' : ''}
                  onClick={() => setOrganicFilter(!organicFilter)}
                >
                  <Leaf className="w-4 h-4 mr-2" />
                  Organic Only
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Farms Grid */}
      <section className="pb-20 px-4">
        <div className="container mx-auto">
          <div className="mb-6 text-gray-600">
            Showing {filteredFarms.length} {filteredFarms.length === 1 ? 'farm' : 'farms'}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredFarms.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFarms.map((farm, index) => (
                <motion.div
                  key={farm._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/farm/${farm._id}`}>
                    <Card className="overflow-hidden border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-xl cursor-pointer group h-full">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={farm.images?.[0] || 'https://images.pexels.com/photos/32065199/pexels-photo-32065199.jpeg'}
                          alt={farm.name}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {farm.organic && (
                          <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                            <Leaf className="w-3 h-3 mr-1" />
                            Organic
                          </Badge>
                        )}
                        {farm.verified && (
                          <Badge className="absolute top-3 left-3 bg-blue-600 text-white">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{farm.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              {farm.location}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{farm.rating?.toFixed(1) || '5.0'}</span>
                            <span className="text-gray-500">({farm.totalReviews || 0})</span>
                          </div>
                          <div className="text-gray-600">
                            {farm.yearsOfExperience || 10}+ years
                          </div>
                        </div>

                        {farm.products && farm.products.length > 0 && (
                          <div className="mb-4">
                            <div className="text-sm text-gray-600 mb-2">Available Products:</div>
                            <div className="flex flex-wrap gap-2">
                              {farm.products.slice(0, 3).map((product) => (
                                <Badge key={product._id} variant="outline" className="text-xs">
                                  {product.name}
                                </Badge>
                              ))}
                              {farm.products.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{farm.products.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                          View Farm
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Sprout className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-gray-600">No Farms Found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setRegionFilter('all');
                  setOrganicFilter(false);
                }}
              >
                Clear Filters
              </Button>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
