interface CarbonData {
  category: string;
  value: number;
  unit: string;
  mode?: string;
  type?: string;
}

export function carbonCalculator(data: CarbonData): number {
  let carbonImpact = 0;
  
  switch (data.category) {
    case 'electricity':
      // Convert kWh to kg CO2
      // Average carbon intensity of electricity: 0.4 kg CO2 per kWh
      carbonImpact = data.value * 0.4;
      break;
      
    case 'transport':
      // Convert distance to kg CO2 based on mode
      if (data.unit === 'mi') {
        // Convert miles to kilometers
        data.value = data.value * 1.60934;
      }
      
      // Emissions in kg CO2 per km
      switch (data.mode) {
        case 'car':
          // Average car: 0.2 kg CO2 per km
          carbonImpact = data.value * 0.2;
          break;
        case 'bus':
          // Bus: 0.1 kg CO2 per km
          carbonImpact = data.value * 0.1;
          break;
        case 'train':
          // Train: 0.05 kg CO2 per km
          carbonImpact = data.value * 0.05;
          break;
        default:
          carbonImpact = data.value * 0.2;
      }
      break;
      
    case 'consumption':
      // Emissions based on consumption type and quantity
      switch (data.type) {
        case 'plastic':
          // Plastic items: 0.5 kg CO2 per item (estimate)
          carbonImpact = data.value * 0.5;
          break;
        case 'meat':
          // Meat consumption: 2 kg CO2 per item (estimate)
          carbonImpact = data.value * 2;
          break;
        case 'water':
          // Water in plastic bottles: 0.2 kg CO2 per item
          carbonImpact = data.value * 0.2;
          break;
        default:
          carbonImpact = data.value * 0.5;
      }
      break;
      
    default:
      // Default to a low value
      carbonImpact = data.value * 0.1;
  }
  
  return carbonImpact;
}