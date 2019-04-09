import Helpers from '../../utils/helper';

const users = [
  {
    id: 1,
    email: 'chrisewu@gmail.com',
    firstname: 'Chris',
    lastname: 'ewu',
    type: 'staff',
    isAdmin: true,
    hashedPassword: Helpers.hashPassword('chrisewu'),
  },
  {
    id: 2,
    email: 'arjenofukwu@gmail.com',
    firstname: 'Arjen',
    lastname: 'ofukwu',
    type: 'staff',
    isAdmin: false,
    hashedPassword: Helpers.hashPassword('arjen'),
  },
  {
    id: 3,
    email: 'cecewilliams@gmail.com',
    firstname: 'cece',
    lastname: 'williams',
    type: 'staff',
    isAdmin: false,
    hashedPassword: Helpers.hashPassword('tennis'),
  },
  {
    id: 4,
    email: 'mesutnyemaka@gmail.com',
    firstname: 'Mesut',
    lastname: 'nyemaka',
    type: 'client',
    isAdmin: false,
    hashedPassword: Helpers.hashPassword('wenger'),
  },
];

export default users;
