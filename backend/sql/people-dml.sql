-- DML examples for the Person table.
-- These statements demonstrate basic CRUD operations for people.

-- CREATE
INSERT INTO Person (name, role)
VALUES ('Carlos Mendoza', 'QA Tester');

-- READ
SELECT id, name, role
FROM Person
ORDER BY name ASC;

-- UPDATE
UPDATE Person
SET role = 'Senior QA Tester'
WHERE name = 'Carlos Mendoza';

-- DELETE
DELETE FROM Person
WHERE name = 'Carlos Mendoza';