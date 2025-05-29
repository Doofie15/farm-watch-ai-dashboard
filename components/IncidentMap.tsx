
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Incident, Severity } from '../types';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

// Declare google global object
declare var google: any;

interface IncidentMapProps {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onMarkerClick: (incident: Incident) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  highlightSelected?: boolean;
  showControls?: boolean;
}

const getSeverityColor = (severity: Severity): string => {
  switch (severity) {
    case Severity.LOW: return '#10B981'; // emerald-500
    case Severity.MEDIUM: return '#F59E0B'; // amber-500
    case Severity.HIGH: return '#EF4444'; // red-500
    case Severity.CRITICAL: return '#B91C1C'; // red-700
    default: return '#3B82F6'; // blue-500
  }
};

const IncidentMap: React.FC<IncidentMapProps> = ({
  incidents,
  selectedIncident,
  onMarkerClick,
  center = { lat: -33.9249, lng: 18.4241 }, // Cape Town
  zoom = 9,
  className = "h-96",
  highlightSelected = false,
  showControls = true,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const heatmapRef = useRef<any>(null);
  const markerClustererRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);

  const [isApiLoaded, setIsApiLoaded] = useState(window.googleMapsApiLoaded === true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [useClustering, setUseClustering] = useState(true);

  // Effect for Google Maps API load
  useEffect(() => {
    if (window.googleMapsApiLoaded) {
      setIsApiLoaded(true);
      return;
    }
    const handleApiLoad = () => setIsApiLoaded(true);
    window.addEventListener('googleMapsApiLoaded', handleApiLoad);
    return () => window.removeEventListener('googleMapsApiLoaded', handleApiLoad);
  }, []);


  const createMarker = useCallback((incident: Incident, map: any) => {
    const markerColor = getSeverityColor(incident.aiSeverity as Severity);
    const isSelected = highlightSelected && selectedIncident?.id === incident.id;

    return new google.maps.Marker({
      position: { lat: incident.latitude, lng: incident.longitude },
      map: useClustering ? null : map, // Add to map directly if not clustering
      title: `${incident.aiCategory} - ${incident.aiSeverity}`,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: markerColor,
        fillOpacity: 0.9,
        strokeColor: 'white',
        strokeWeight: 1.5,
        scale: isSelected ? 9 : 6,
      },
      zIndex: isSelected ? 1000 : undefined,
    });
  }, [highlightSelected, selectedIncident, useClustering]);

  useEffect(() => {
    if (!isApiLoaded || !mapRef.current) {
        if (!isApiLoaded && window.googleMapsApiLoaded === false) {
             console.error("Google Maps API failed to load or API key is invalid.");
             // Optionally display an error message to the user in the map div
             if(mapRef.current) mapRef.current.innerHTML = '<p class="text-red-500 text-center p-4">Could not load Google Maps. Check API key and network.</p>';
        }
      return;
    }
    
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center: center,
        zoom: zoom,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
      infoWindowRef.current = new google.maps.InfoWindow();
    }

    const map = mapInstanceRef.current;

    // Clear previous markers / clusterer
    if (markerClustererRef.current) {
      markerClustererRef.current.clearMarkers();
    }
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Clear heatmap
    if (heatmapRef.current) {
      heatmapRef.current.setMap(null);
      heatmapRef.current = null;
    }

    if (showHeatmap) {
      const heatmapData = incidents.map(incident => ({
        location: new google.maps.LatLng(incident.latitude, incident.longitude),
        weight: Object.values(Severity).indexOf(incident.aiSeverity as Severity) + 1, // Simple weight
      }));
      if(heatmapData.length > 0) {
        heatmapRef.current = new google.maps.visualization.HeatmapLayer({
          data: heatmapData,
          map: map,
          radius: 20,
          opacity: 0.7,
        });
      }
    } else {
      // Add new markers
      markersRef.current = incidents.map(incident => {
        const marker = createMarker(incident, map);
        
        marker.addListener('click', () => {
          const content = `
            <div style="font-family: sans-serif; font-size: 14px; max-width: 250px;">
              <h3 style="margin: 0 0 5px 0; font-size: 16px; color: #333;">${incident.aiCategory}</h3>
              <p style="margin: 0 0 3px 0; color: #555;"><strong>Severity:</strong> ${incident.aiSeverity}</p>
              <p style="margin: 0 0 3px 0; color: #555;"><strong>Status:</strong> ${incident.status}</p>
              <p style="margin: 0 0 3px 0; color: #555;">${incident.address || 'Location available'}</p>
              <button onclick="document.dispatchEvent(new CustomEvent('viewIncidentDetails', { detail: '${incident.id}' }))" style="margin-top: 8px; padding: 5px 10px; background-color: #10B981; color: white; border: none; border-radius: 4px; cursor: pointer;">View Details</button>
            </div>`;
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(map, marker);
          onMarkerClick(incident); 
        });
        return marker;
      });

      if (useClustering && incidents.length > 0) {
        if (markerClustererRef.current) {
            markerClustererRef.current.clearMarkers(); // ensure old one is cleared
        }
        markerClustererRef.current = new MarkerClusterer({ markers: markersRef.current, map });
      } else {
         markersRef.current.forEach(marker => marker.setMap(map)); // Add markers directly if not clustering
      }
    }
    
    // Handle view adjustments
    if (highlightSelected && selectedIncident && !showHeatmap) {
        map.panTo({ lat: selectedIncident.latitude, lng: selectedIncident.longitude });
        map.setZoom(14);
    } else if (incidents.length > 0 && !highlightSelected && !showHeatmap) {
        const bounds = new google.maps.LatLngBounds();
        incidents.forEach(inc => bounds.extend({ lat: inc.latitude, lng: inc.longitude }));
        if (!bounds.isEmpty()) {
            map.fitBounds(bounds);
        }
    } else if (incidents.length === 0 && !highlightSelected && !showHeatmap) {
        map.setCenter(center);
        map.setZoom(zoom);
    }


  }, [isApiLoaded, incidents, selectedIncident, highlightSelected, center, zoom, onMarkerClick, showHeatmap, useClustering, createMarker]);

  // Listener for custom event from InfoWindow button
  useEffect(() => {
    const handleViewDetails = (event: CustomEvent) => {
      const incidentId = event.detail;
      const incidentToView = incidents.find(inc => inc.id === incidentId);
      if (incidentToView) {
        onMarkerClick(incidentToView);
      }
    };
    // Cast document to any to attach event listener
    (document as any).addEventListener('viewIncidentDetails', handleViewDetails);
    return () => {
      (document as any).removeEventListener('viewIncidentDetails', handleViewDetails);
    };
  }, [incidents, onMarkerClick]);
  
  if (!isApiLoaded && window.googleMapsApiLoaded === false) {
    return <div className={`bg-slate-100 flex items-center justify-center ${className}`}><p className="text-red-600 text-center p-4">Google Maps API could not be loaded. Please verify your API key and network connection.</p></div>;
  }
  if (!isApiLoaded) {
    return <div className={`bg-slate-100 flex items-center justify-center ${className}`}><p className="text-slate-500">Loading map...</p></div>;
  }

  return (
    <div className={`relative ${className}`}>
      {showControls && (
        <div className="absolute top-2 right-2 z-10 bg-white p-2 rounded-md shadow-lg space-y-2 border border-slate-200">
          <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
            <input type="checkbox" checked={showHeatmap} onChange={() => setShowHeatmap(prev => !prev)} className="form-checkbox h-4 w-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"/>
            <span>Heatmap</span>
          </label>
          {!showHeatmap && (
            <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
              <input type="checkbox" checked={useClustering} onChange={() => setUseClustering(prev => !prev)}  className="form-checkbox h-4 w-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"/>
              <span>Clustering</span>
            </label>
          )}
        </div>
      )}
      <div ref={mapRef} className="w-full h-full map-container-google" aria-label="Incident Map"></div>
    </div>
  );
};

export default IncidentMap;
