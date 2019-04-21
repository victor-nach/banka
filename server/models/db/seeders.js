import dotenv from 'dotenv';

dotenv.config();
let seedersQuery;

if (process.env.NODE_ENV === 'production') {
  seedersQuery = `
INSERT INTO users ( email, first_name, last_name, hashed_password, type,  is_admin)
VALUES ('admin@gmail.com', 'admin', 'admin', 'password', 'staff', true ),
       ('staff@gmail.com', 'staff', 'staff', 'password', 'staff', false),
       ('user@gmail.com', 'user', 'user', 'password', 'client', false);
`;
}
if (process.env.NODE_ENV === 'test') {
  seedersQuery = `
    INSERT INTO users ( email, first_name, last_name, hashed_password, type,  is_admin)
    VALUES ('chrisewu@gmail.com', 'chris', 'ewu', 'password', 'staff', true );
    
    INSERT INTO users ( email, first_name, last_name, hashed_password, type)
    VALUES ('arjenofukwu@gmail.com', 'arjen', 'ofukwu', 'password', 'staff');
        
    INSERT INTO users ( email, first_name, last_name, hashed_password)
    VALUES ('nyemakamesut@gmail.com', 'nyemaka', 'mesut', 'password'),
           ('cecewilliams@gmail.com', 'cece', 'williams', 'password'),
           ('johndoe@gmail.com', 'john', 'doe', 'password');
        
    INSERT INTO accounts (account_number, owner, type, status, balance)
    VALUES (1234567801, 3, 'savings', 'draft', 123121.00),
           (1234567802, 4, 'current', 'active', 129051.00),
           (1234567803, 3, 'savings', 'dormant', 18661.113),
           (1234567804, 5, 'savings', 'active', 956431.00);

    INSERT INTO transactions (type, account_number, cashier_id, old_balance, new_balance)
    VALUES ('credit', 1234567802, 2, 129000.567, 129051.00),
           ('dedit', 1234567804, 2, 978000, 956431.00);
`;
}

const seeders = seedersQuery;
export default seeders;
