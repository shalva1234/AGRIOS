'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Sprout,
  Users,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Star,
  Calendar,
  ArrowRight,
  Search,
  Leaf,
  Heart,
  CheckCircle2,
  Package,
  Truck,
  Award,
} from 'lucide-react';

export default function HomePage() {
  const [farms, setFarms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const response = await fetch('/api/farms');
      if (response.ok) {
        const data = await response.json();
        setFarms(data.slice(0, 6)); // Show top 6 farms
      }
    } catch (error) {
      console.error('Error fetching farms:', error);
    } finally {
      setLoading(false);
    }
  };

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
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/marketplace" className="text-gray-700 hover:text-green-600 transition-colors">
              ბაზარი
            </Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-green-600 transition-colors">
              როგორ მუშაობს
            </Link>
            <Link href="/ai-assistant" className="text-gray-700 hover:text-green-600 transition-colors">
              AI ასისტენტი
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-green-600 transition-colors">
              ჩვენს შესახებ
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth?mode=login">
              <Button variant="ghost" className="hidden md:inline-flex">შესვლა</Button>
            </Link>
            <Link href="/auth?mode=register">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                დაწყება
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-6 bg-green-100 text-green-700 hover:bg-green-100">
                <Leaf className="w-3 h-3 mr-1" />
                ფერმიდან მაგიდამდე, გარანტირებული სიახლე
              </Badge>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                დაჯავშნეთ თქვენი{' '}
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  ეკოლოგიურად სუფთა მოსავალი
                </span>{' '}
                ზრდამდე
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                დაუკავშირდით პირდაპირ ადგილობრივ ფერმერებს. წინასწარ შეუკვეთეთ ახალი, ორგანული, პესტიციდებისგან თავისუფალი საკვები.
                მხარი დაუჭირეთ მდგრად ფერმერობას და უზრუნველყავით თქვენი ოჯახის ჯანმრთელობა.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/marketplace">
                  <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg px-8 py-6">
                    <Sprout className="w-5 h-5 mr-2" />
                    დაჯავშნეთ მოსავალი
                  </Button>
                </Link>
                <Link href="/become-farmer">
                  <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 text-lg px-8 py-6">
                    <Users className="w-5 h-5 mr-2" />
                    გახდი ფერმერი
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-green-600">500+</div>
                  <div className="text-sm text-gray-600">დამოწმებული ფერმა</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">10K+</div>
                  <div className="text-sm text-gray-600">კმაყოფილი მომხმარებელი</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">100%</div>
                  <div className="text-sm text-gray-600">ორგანული გარანტია</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.pexels.com/photos/8657202/pexels-photo-8657202.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  alt="ქართველი ოჯახი ახალი ბოსტნეულით"
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">ახალი ქართული ფერმებიდან</h3>
                  <p className="text-white/90">მოყვანილი ზრუნვით, მიწოდებული ნდობით</p>
                </div>
              </div>

              {/* Floating cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 w-48"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">დაცული გადახდა</div>
                    <div className="text-xs text-gray-500">თქვენი ფული უსაფრთხოდ</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 w-48"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">100% Organic</div>
                    <div className="text-xs text-gray-500">Certified farms</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700">
              მარტივი პროცესი
            </Badge>
            <h2 className="text-4xl font-bold mb-4">როგორ მუშაობს</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ფერმიდან თქვენს მაგიდამდე 6 მარტივი ნაბიჯით
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-200 via-green-400 to-green-600 transform -translate-x-1/2" />

            <div className="space-y-12">
              {[
                {
                  icon: Search,
                  title: 'Browse Farmers',
                  description: 'Explore verified organic farms in your region',
                  image: 'https://images.pexels.com/photos/30269788/pexels-photo-30269788.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                },
                {
                  icon: Package,
                  title: 'Reserve Products',
                  description: 'Select and pre-order your favorite vegetables, fruits, and more',
                  image: 'https://images.pexels.com/photos/11509871/pexels-photo-11509871.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                },
                {
                  icon: ShieldCheck,
                  title: 'Secure Payment',
                  description: 'Payment held safely in escrow until delivery',
                  image: 'https://images.unsplash.com/photo-1556559214-9d7db920d2eb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwzfHxmYW1pbHklMjB2ZWdldGFibGVzfGVufDB8fHxncmVlbnwxNzgyNDU5MzgwfDA&ixlib=rb-4.1.0&q=85',
                },
                {
                  icon: Sprout,
                  title: 'Farmer Grows',
                  description: 'Track real-time growing progress with photos and updates',
                  image: 'https://images.pexels.com/photos/32065199/pexels-photo-32065199.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                },
                {
                  icon: CheckCircle2,
                  title: 'Quality Inspection',
                  description: 'Our team verifies organic standards and quality',
                  image: 'https://images.pexels.com/photos/7457020/pexels-photo-7457020.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                },
                {
                  icon: Truck,
                  title: 'Fresh Delivery',
                  description: 'Receive your harvest fresh from the farm',
                  image: 'https://images.pexels.com/photos/30269788/pexels-photo-30269788.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`lg:grid lg:grid-cols-2 gap-8 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <Card className="border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-lg">
                      <CardContent className="p-8">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <step.icon className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <div className="text-sm text-green-600 font-semibold mb-1">
                              Step {index + 1}
                            </div>
                            <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                            <p className="text-gray-600">{step.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''} hidden lg:block`}>
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                      <Image
                        src={step.image}
                        alt={step.title}
                        width={500}
                        height={300}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Farms */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700">
              დამოწმებული ფერმერები
            </Badge>
            <h2 className="text-4xl font-bold mb-4">რჩეული ფერმები</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              დაუკავშირდით სანდო ადგილობრივ ფერმერებს, რომლებიც ზრდიან ორგანულ პროდუქტებს
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : farms.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {farms.map((farm, index) => (
                <motion.div
                  key={farm._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/farm/${farm._id}`}>
                    <Card className="overflow-hidden border-2 border-green-100 hover:border-green-300 transition-all hover:shadow-xl cursor-pointer group">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={farm.images?.[0] || 'https://images.pexels.com/photos/32065199/pexels-photo-32065199.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'}
                          alt={farm.name}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {farm.organic && (
                          <Badge className="absolute top-3 right-3 bg-green-600 text-white">
                            <Leaf className="w-3 h-3 mr-1" />
                            Organic Certified
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
                          {farm.profileImage && (
                            <Image
                              src={farm.profileImage}
                              alt="Farmer"
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-full border-2 border-green-200"
                            />
                          )}
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
                            <div className="text-sm text-gray-600 mb-2">ხელმისაწვდომია:</div>
                            <div className="flex flex-wrap gap-2">
                              {farm.products.slice(0, 3).map((product) => (
                                <Badge key={product._id} variant="outline" className="text-xs">
                                  {product.name}
                                </Badge>
                              ))}
                              {farm.products.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{farm.products.length - 3} მეტი
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}

                        <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                          ნახეთ ფერმა
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
              <Sprout className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">ჯერ არ არის ფერმები</h3>
              <p className="text-gray-600 mb-6">გახდით პირველი, ვინც დაარეგისტრირებს თავის ფერმას!</p>
              <Link href="/become-farmer">
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                  დაარეგისტრირეთ თქვენი ფერმა
                </Button>
              </Link>
            </Card>
          )}

          <div className="text-center mt-12">
            <Link href="/marketplace">
              <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50">
                ყველა ფერმის ნახვა
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">რატომ აირჩიოთ FarmLink?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ყველაზე სანდო პლატფორმა, რომელიც აკავშირებს ფერმერებსა და მომხმარებლებს
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: 'დაცული გადახდა',
                description: 'თქვენი ფული უსაფრთხოდ ინახება მიწოდების დადასტურებამდე',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: Leaf,
                title: '100% ორგანული',
                description: 'ყველა ფერმა დამოწმებულია ორგანული სერტიფიკატით',
                color: 'from-green-500 to-green-600',
              },
              {
                icon: TrendingUp,
                title: 'თვალყურის დევნება',
                description: 'რეალურ დროში განახლებები თქვენი მოსავლის ზრდაზე',
                color: 'from-emerald-500 to-emerald-600',
              },
              {
                icon: Award,
                title: 'ხარისხის გარანტია',
                description: 'რეგულარული ინსპექტირება და ხარისხის შემოწმება',
                color: 'from-teal-500 to-teal-600',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-2 border-gray-100 hover:border-green-200 transition-all hover:shadow-lg h-full">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-green-600 to-emerald-600">
        <div className="container mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              მზად ხართ უზრუნველყოთ თქვენი ახალი მოსავალი?
            </h2>
            <p className="text-xl mb-8 text-green-50 max-w-2xl mx-auto">
              შეუერთდით ათასობით ოჯახს, რომლებიც სარგებლობენ ახალი, ორგანული პროდუქტებით პირდაპირ ადგილობრივი ფერმებიდან
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace">
                <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 text-lg px-8 py-6">
                  ბაზრის დათვალიერება
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/ai-assistant">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                  გამოსცადეთ AI ასისტენტი
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">FarmLink Georgia</span>
              </div>
              <p className="text-gray-400">
                ვაკავშირებთ ფერმერებს მომხმარებლებთან ჯანსაღი, მდგრადი მომავლისთვის.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">პლატფორმა</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/marketplace" className="hover:text-white transition-colors">ბაზარი</Link></li>
                <li><Link href="/how-it-works" className="hover:text-white transition-colors">როგორ მუშაობს</Link></li>
                <li><Link href="/ai-assistant" className="hover:text-white transition-colors">AI ასისტენტი</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">ფერმერებისთვის</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/become-farmer" className="hover:text-white transition-colors">გახდი ფერმერი</Link></li>
                <li><Link href="/farmer-dashboard" className="hover:text-white transition-colors">პანელი</Link></li>
                <li><Link href="/resources" className="hover:text-white transition-colors">რესურსები</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">მხარდაჭერა</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/faq" className="hover:text-white transition-colors">ხშირი კითხვები</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">დაგვიკავშირდით</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">პირობები</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FarmLink Georgia. ყველა უფლება დაცულია.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
