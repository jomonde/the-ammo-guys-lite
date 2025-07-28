export const popularCalibers = [
  { id: '9mm', name: '9mm Luger', description: 'The most popular handgun caliber' },
  { id: '223', name: '.223 Remington', description: 'Popular AR-15 caliber' },
  { id: '556', name: '5.56x45mm NATO', description: 'Standard NATO rifle round' },
  { id: '45acp', name: '.45 ACP', description: 'Classic handgun caliber' },
  { id: '308', name: '.308 Winchester', description: 'Popular hunting and precision round' },
  { id: '762x39', name: '7.62x39mm', description: 'AK-47 platform standard' },
  { id: '40sw', name: '.40 S&W', description: 'Law enforcement favorite' },
  { id: '12ga', name: '12 Gauge', description: 'Versatile shotgun shell' },
  { id: '300blk', name: '300 Blackout', description: 'Great for suppressed fire' },
  { id: '6arc', name: '6mm ARC', description: 'Modern precision round' },
];

export const useCases = [
  { id: 'range', name: 'Range Shooting', description: 'Regular target practice' },
  { id: 'defense', name: 'Home Defense', description: 'Personal and home protection' },
  { id: 'hunting', name: 'Hunting', description: 'Big game and varmint' },
  { id: 'competition', name: 'Competition', description: 'Sport shooting events' },
];

export const subscriptionTiers = [
  {
    id: 'basic',
    name: 'Basic',
    price: 50,
    description: 'Start building your stockpile',
    features: ['Up to 2 calibers', 'Bi-weekly or monthly', 'Basic support'],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 100,
    description: 'For regular shooters',
    features: ['Up to 4 calibers', 'Monthly shipments', 'Priority support'],
    popular: true,
  },
  {
    id: 'heavy',
    name: 'Heavy',
    price: 200,
    description: 'For serious enthusiasts',
    features: ['Unlimited calibers', 'Weekly or bi-weekly', '24/7 support', 'Free shipping'],
  },
];
