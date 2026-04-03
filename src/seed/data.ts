export const librariesSeed = [
  {
    _id: '65f100000000000000000001',
    name: 'Central Library',
    location: 'New York',
  },
  {
    _id: '65f100000000000000000002',
    name: 'West Coast Library',
    location: 'San Francisco',
  },
  {
    _id: '65f100000000000000000003',
    name: 'European Library',
    location: 'Berlin',
  },
];

export const usersSeed = [
  {
    username: 'admin',
    password: 'password123',
    country: 'US',
    libraries: ['65f100000000000000000001', '65f100000000000000000002'],
    role: 'admin' as const,
  },
  {
    username: 'reader_uk',
    password: 'password123',
    country: 'UK',
    libraries: ['65f100000000000000000003'],
    role: 'user' as const,
  },
];

export const booksSeed = [
  {
    title: 'Distributed Systems in Practice',
    author: 'John Miller',
    authorCountry: 'US',
    publishedDate: new Date('1999-01-01'),
    pages: 700,
    library: '65f100000000000000000001',
  },
  {
    title: 'Modern API Design',
    author: 'Anne Clark',
    authorCountry: 'CA',
    publishedDate: new Date('2018-04-10'),
    pages: 420,
    library: '65f100000000000000000001',
  },
  {
    title: 'Legacy Architectures',
    author: 'Robert Stone',
    authorCountry: 'US',
    publishedDate: new Date('1980-05-20'),
    pages: 300,
    library: '65f100000000000000000002',
  },
  {
    title: 'London Tales',
    author: 'Emma Scott',
    authorCountry: 'UK',
    publishedDate: new Date('2005-09-15'),
    pages: 450,
    library: '65f100000000000000000003',
  },
];
