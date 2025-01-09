import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Star, Clock, Car } from 'lucide-react';

const CarWashListings = () => {
  const [carWashes, setCarWashes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarWashes = async () => {
      try {
        const response = await fetch('/api/car-washes'); // Your API endpoint
        const data = await response.json();
        setCarWashes(data);
      } catch (err) {
        setError('Failed to load car wash data');
      } finally {
        setLoading(false);
      }
    };

    fetchCarWashes();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {carWashes.map((carWash) => (
          <Card key={carWash.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="text-xl font-bold truncate">{carWash.name}</span>
                <div className="flex items-center">
                  {[...Array(Math.floor(carWash.rating))].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                <span className="text-gray-600">{carWash.address}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">{carWash.phone}</span>
              </div>
              
              {carWash.hours && (
                <div className="flex items-start space-x-2">
                  <Clock className="w-5 h-5 text-gray-500 mt-1" />
                  <div className="text-sm text-gray-600">
                    <div>Today: {carWash.hours[new Date().toLocaleString('en-us', {weekday: 'long'}).toLowerCase()]}</div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mt-4">
                {carWash.services?.map((service, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-4 mt-4">
                {carWash.features?.parking && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Car className="w-4 h-4 mr-1" />
                    Parking
                  </div>
                )}
                {carWash.features?.creditCards && (
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <line x1="2" y1="10" x2="22" y2="10" />
                    </svg>
                    Cards
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CarWashListings;