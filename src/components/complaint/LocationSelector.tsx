import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { suratZones, getWardsByZone, getAreasByWard, Zone, Ward, Area } from '@/data/suratData';
import { MapPin } from 'lucide-react';

interface LocationSelectorProps {
  selectedZone: string;
  selectedWard: string;
  selectedArea: string;
  onZoneChange: (zoneId: string) => void;
  onWardChange: (wardId: string) => void;
  onAreaChange: (areaId: string) => void;
}

export function LocationSelector({
  selectedZone,
  selectedWard,
  selectedArea,
  onZoneChange,
  onWardChange,
  onAreaChange,
}: LocationSelectorProps) {
  const [wards, setWards] = useState<Ward[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);

  useEffect(() => {
    if (selectedZone) {
      const zoneWards = getWardsByZone(selectedZone);
      setWards(zoneWards);
      // Reset ward and area if zone changes
      if (!zoneWards.find(w => w.id === selectedWard)) {
        onWardChange('');
        onAreaChange('');
        setAreas([]);
      }
    } else {
      setWards([]);
      setAreas([]);
    }
  }, [selectedZone]);

  useEffect(() => {
    if (selectedWard) {
      const wardAreas = getAreasByWard(selectedWard);
      setAreas(wardAreas);
      // Reset area if ward changes
      if (!wardAreas.find(a => a.id === selectedArea)) {
        onAreaChange('');
      }
    } else {
      setAreas([]);
    }
  }, [selectedWard]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <MapPin className="h-4 w-4 text-accent" />
        <span>Surat Municipal Corporation Area</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Zone Selection */}
        <div className="space-y-2">
          <Label htmlFor="zone">Zone *</Label>
          <Select value={selectedZone} onValueChange={onZoneChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Zone" />
            </SelectTrigger>
            <SelectContent>
              {suratZones.map((zone) => (
                <SelectItem key={zone.id} value={zone.id}>
                  <span className="flex items-center gap-2">
                    <span className="text-xs bg-accent/10 text-accent px-1.5 py-0.5 rounded">
                      {zone.code}
                    </span>
                    {zone.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ward Selection */}
        <div className="space-y-2">
          <Label htmlFor="ward">Ward *</Label>
          <Select 
            value={selectedWard} 
            onValueChange={onWardChange}
            disabled={!selectedZone}
          >
            <SelectTrigger>
              <SelectValue placeholder={selectedZone ? "Select Ward" : "Select Zone first"} />
            </SelectTrigger>
            <SelectContent>
              {wards.map((ward) => (
                <SelectItem key={ward.id} value={ward.id}>
                  <span className="flex items-center gap-2">
                    <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                      {ward.code}
                    </span>
                    {ward.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Area Selection */}
        <div className="space-y-2">
          <Label htmlFor="area">Area / Locality</Label>
          <Select 
            value={selectedArea} 
            onValueChange={onAreaChange}
            disabled={!selectedWard}
          >
            <SelectTrigger>
              <SelectValue placeholder={selectedWard ? "Select Area (Optional)" : "Select Ward first"} />
            </SelectTrigger>
            <SelectContent>
              {areas.map((area) => (
                <SelectItem key={area.id} value={area.id}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
