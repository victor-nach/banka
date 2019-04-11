import Helpers from '../../utils/helper';

const users = [
  {
    id: 1,
    email: 'chrisewu@gmail.com',
    firstName: 'Chris',
    lastName: 'ewu',
    type: 'staff',
    isAdmin: true,
    hashedPassword: Helpers.hashPassword('chrisewu'),
  },
  {
    id: 2,
    email: 'arjenofukwu@gmail.com',
    firstName: 'Arjen',
    lastName: 'ofukwu',
    type: 'staff',
    isAdmin: false,
    hashedPassword: Helpers.hashPassword('flyingdutch'),
  },
  {
    id: 3,
    email: 'cecewilliams@gmail.com',
    firstName: 'cece',
    lastName: 'williams',
    type: 'staff',
    isAdmin: false,
    hashedPassword: Helpers.hashPassword('tennis'),
  },
  {
    id: 4,
    email: 'mesutnyemaka@gmail.com',
    firstName: 'Mesut',
    lastName: 'nyemaka',
    type: 'client',
    isAdmin: false,
    hashedPassword: Helpers.hashPassword('wenger'),
  },
];

export default users;
