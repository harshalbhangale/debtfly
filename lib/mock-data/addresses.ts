// Mock address data for postcode lookup (simulating CheckIO API)

export interface MockAddress {
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  formatted: string;
}

// Mock address database by postcode
const mockAddressDatabase: Record<string, MockAddress[]> = {
  'SW1A 1AA': [
    {
      line1: 'Buckingham Palace',
      city: 'London',
      postcode: 'SW1A 1AA',
      formatted: 'Buckingham Palace, London, SW1A 1AA',
    },
  ],
  'EC1A 1BB': [
    {
      line1: '10 Downing Street',
      city: 'London',
      postcode: 'EC1A 1BB',
      formatted: '10 Downing Street, London, EC1A 1BB',
    },
  ],
  'M1 1AE': [
    {
      line1: 'Flat 1, 123 Deansgate',
      city: 'Manchester',
      postcode: 'M1 1AE',
      formatted: 'Flat 1, 123 Deansgate, Manchester, M1 1AE',
    },
    {
      line1: 'Flat 2, 123 Deansgate',
      city: 'Manchester',
      postcode: 'M1 1AE',
      formatted: 'Flat 2, 123 Deansgate, Manchester, M1 1AE',
    },
    {
      line1: 'Flat 3, 123 Deansgate',
      city: 'Manchester',
      postcode: 'M1 1AE',
      formatted: 'Flat 3, 123 Deansgate, Manchester, M1 1AE',
    },
  ],
};

// Generate generic addresses for any postcode
function generateGenericAddresses(postcode: string): MockAddress[] {
  const normalizedPostcode = postcode.toUpperCase().trim();
  
  const streetNames = [
    'High Street',
    'Church Road',
    'Station Road',
    'Main Street',
    'Park Avenue',
    'Victoria Road',
    'King Street',
    'Queen Street',
  ];
  
  const cities = ['London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool', 'Bristol', 'Newcastle', 'Sheffield'];
  const randomCity = cities[Math.floor(Math.random() * cities.length)];
  
  return Array.from({ length: 5 }, (_, i) => {
    const streetNumber = Math.floor(Math.random() * 200) + 1;
    const streetName = streetNames[i % streetNames.length];
    const flatNumber = i > 0 ? `, Flat ${i}` : '';
    
    return {
      line1: `${streetNumber} ${streetName}${flatNumber}`,
      city: randomCity,
      postcode: normalizedPostcode,
      formatted: `${streetNumber} ${streetName}${flatNumber}, ${randomCity}, ${normalizedPostcode}`,
    };
  });
}

// Mock API call to fetch addresses by postcode
export async function fetchAddressesByPostcode(postcode: string): Promise<MockAddress[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const normalizedPostcode = postcode.toUpperCase().trim().replace(/\s+/g, ' ');
  
  // Check if we have specific mock data for this postcode
  if (mockAddressDatabase[normalizedPostcode]) {
    return mockAddressDatabase[normalizedPostcode];
  }
  
  // Generate generic addresses
  return generateGenericAddresses(normalizedPostcode);
}

// Validate UK postcode format
export function isValidUKPostcode(postcode: string): boolean {
  const normalizedPostcode = postcode.toUpperCase().trim();
  // UK postcode regex
  const postcodeRegex = /^([A-Z]{1,2}\d{1,2}[A-Z]?)\s?(\d[A-Z]{2})$/;
  return postcodeRegex.test(normalizedPostcode);
}

// Format postcode consistently
export function formatPostcode(postcode: string): string {
  const normalized = postcode.toUpperCase().trim().replace(/\s+/g, '');
  
  // Insert space before last 3 characters
  if (normalized.length >= 5) {
    return `${normalized.slice(0, -3)} ${normalized.slice(-3)}`;
  }
  
  return normalized;
}

