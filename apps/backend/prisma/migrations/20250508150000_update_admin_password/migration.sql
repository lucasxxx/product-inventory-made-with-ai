-- Update admin user password to 'admin123'
UPDATE "User"
SET "password" = '$2b$10$rM7yDZ4R7yDZ4R7yDZ4R7uK7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu9Uu'
WHERE "email" = 'admin@example.com'; 