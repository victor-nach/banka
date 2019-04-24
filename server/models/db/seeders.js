import dotenv from 'dotenv';
import helper from '../../utils/helper';

dotenv.config();
let seedersQuery;

if (process.env.NODE_ENV === 'production') {
  seedersQuery = `
INSERT INTO users ( email, first_name, last_name, hashed_password, type,  is_admin)
VALUES ('admin@gmail.com', 'admin', 'admin', '${helper.hashPassword('password')}', 'staff', true ),
       ('staff@gmail.com', 'staff', 'staff', '${helper.hashPassword('password')}', 'staff', false),
       ('user@gmail.com', 'user', 'user', '${helper.hashPassword('password')}', 'client', false);
`;
}
if (process.env.NODE_ENV === 'test') {
  seedersQuery = `
    INSERT INTO users ( email, first_name, last_name, hashed_password, type,  is_admin)
    VALUES ('chrisewu@gmail.com', 'chris', 'ewu', '${helper.hashPassword('chrisewu')}', 'staff', true );
    
    INSERT INTO users ( email, first_name, last_name, hashed_password, type)
    VALUES ('arjenofukwu@gmail.com', 'arjen', 'ofukwu', '${helper.hashPassword('flyingdutch')}', 'staff');
        
    INSERT INTO users ( email, first_name, last_name, hashed_password)
    VALUES ('mesutnyemaka@gmail.com', 'nyemaka', 'mesut', '${helper.hashPassword('wenger')}'),
           ('cecewilliams@gmail.com', 'cece', 'williams', '${helper.hashPassword('tennis')}'),
           ('johndoe@gmail.com', 'john', 'doe', '${helper.hashPassword('jonjon')}');
        
    INSERT INTO accounts (account_number, owner, type, status, balance)
    VALUES (1234567801, 3, 'savings', 'draft', 123121.00),
           (1234567802, 4, 'current', 'active', 100000.00),
           (1234567803, 1, 'savings', 'dormant', 18661.113),
           (1234567804, 3, 'savings', 'active', 5000.00),
           (1234567805, 3, 'savings', 'active', 5000.00);

    INSERT INTO transactions (type, account_number, cashier_id, amount, old_balance, new_balance)
    VALUES ('credit', 1234567802, 2, 100000.00, 20000.00, 120000.00),
           ('credit', 1234567804, 2, 5000.00, 25000.00, 30000.00),   
           ('debit', 1234567804, 2, 30000.00, 2000.00, 28000.00),
           ('dedit', 1234567802, 2, 120000.00, 30000.00, 90000.00);
`;
}

const seeders = seedersQuery;
export default seeders;
