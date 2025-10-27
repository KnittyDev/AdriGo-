'use client';
import { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

interface MapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  markers: Array<{
    position: google.maps.LatLngLiteral;
    title: string;
    description: string;
    icon?: string;
  }>;
}

const MapComponent: React.FC<MapProps> = ({ center, zoom, markers }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry.fill',
            stylers: [
              {
                color: '#f6f7f7'
              }
            ]
          },
          {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [
              {
                color: '#95d0d0'
              }
            ]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry.fill',
            stylers: [
              {
                color: '#ffffff'
              }
            ]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#6c7f7f'
              }
            ]
          },
          {
            featureType: 'road',
            elementType: 'geometry.fill',
            stylers: [
              {
                color: '#f6f7f7'
              }
            ]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [
              {
                color: '#131616'
              }
            ]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER,
        }
      });
      setMap(newMap);
    }
  }, [ref, map, center, zoom]);

  useEffect(() => {
    if (map) {
      // Clear existing markers
      markers.forEach((markerData) => {
        const marker = new google.maps.Marker({
          position: markerData.position,
          map,
          title: markerData.title,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#95d0d0',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
          animation: google.maps.Animation.DROP,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div class="p-2">
              <h3 class="font-bold text-gray-900 text-lg">${markerData.title}</h3>
              <p class="text-gray-600 text-sm mt-1">${markerData.description}</p>
            </div>
          `,
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        // Add hover effect
        marker.addListener('mouseover', () => {
          marker.setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#95d0d0',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          });
        });

        marker.addListener('mouseout', () => {
          marker.setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#95d0d0',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          });
        });
      });
    }
  }, [map, markers]);

  return <div ref={ref} className="w-full h-[600px] rounded-xl" />;
};

const render = (status: Status): React.ReactElement => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="w-full h-[600px] rounded-xl bg-background-light flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading map...</p>
          </div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="w-full h-[600px] rounded-xl bg-background-light flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">map</span>
            <p className="text-text-secondary">Unable to load map</p>
            <p className="text-sm text-gray-500 mt-2">Please check your internet connection</p>
          </div>
        </div>
      );
    default:
      return (
        <div className="w-full h-[600px] rounded-xl bg-background-light flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">map</span>
            <p className="text-text-secondary">Loading map...</p>
          </div>
        </div>
      );
  }
};

interface InteractiveMapProps {
  apiKey: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ apiKey }) => {
  const montenegroCenter = { lat: 42.7087, lng: 19.3744 };
  
  const cityMarkers = [
    {
      position: { lat: 42.4304, lng: 19.2594 },
      title: 'Podgorica',
      description: 'Capital city with full coverage across all areas'
    },
    {
      position: { lat: 42.2784, lng: 18.8395 },
      title: 'Budva',
      description: 'Coastal city with beach access and historic old town'
    },
    {
      position: { lat: 42.4247, lng: 18.7712 },
      title: 'Kotor',
      description: 'Historic bay area with UNESCO World Heritage sites'
    },
    {
      position: { lat: 42.4344, lng: 18.7061 },
      title: 'Tivat',
      description: 'Airport and luxury marina transfers'
    },
    {
      position: { lat: 42.4531, lng: 18.5311 },
      title: 'Herceg Novi',
      description: 'Beautiful coastal town with historic architecture'
    },
    {
      position: { lat: 41.9208, lng: 19.2206 },
      title: 'Ulcinj',
      description: 'Southernmost city with beautiful beaches'
    }
  ];

  // If no API key is provided, show a fallback
  if (!apiKey || apiKey === '') {
    return (
      <div className="w-full h-[600px] rounded-xl bg-background-light flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <span className="material-symbols-outlined text-6xl text-primary mb-4">map</span>
          <h3 className="text-xl font-bold text-text-primary mb-2">Interactive Map</h3>
          <p className="text-text-secondary mb-4">
            To enable the interactive Google Maps, please add your Google Maps API key to the environment variables.
          </p>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Add to your <code className="bg-gray-100 px-1 rounded">.env.local</code> file:</p>
            <code className="text-xs text-gray-800 block">
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
            </code>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Get your API key from{' '}
            <a 
              href="https://console.cloud.google.com/google/maps-apis" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google Cloud Console
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <Wrapper apiKey={apiKey} render={render}>
      <MapComponent 
        center={montenegroCenter} 
        zoom={8} 
        markers={cityMarkers}
      />
    </Wrapper>
  );
};

export default InteractiveMap;
