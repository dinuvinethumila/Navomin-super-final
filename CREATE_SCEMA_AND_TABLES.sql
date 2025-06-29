DROP DATABASE IF EXISTS NAVOMIN_SUPER;
CREATE DATABASE IF NOT EXISTS NAVOMIN_SUPER;
USE NAVOMIN_SUPER;

-- User Table
CREATE TABLE User (
    User_ID INT PRIMARY KEY AUTO_INCREMENT,
    First_Name VARCHAR(50),
    Last_Name VARCHAR(50),
    Email VARCHAR(100) UNIQUE,
    Password VARCHAR(255),
    Phone_Number VARCHAR(20)
);

-- Cart Table
CREATE TABLE Cart (
    Cart_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT,
    IS_ACTIVE BOOLEAN DEFAULT 1,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE SET NULL
);

-- Pre_Order Table
CREATE TABLE Pre_Order (
    Pre_Order_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT,
    Half_Paid BOOLEAN,
    Estimated_Total DECIMAL(10,2),
    Pickup_Date DATE,
    Pickup_Time TIME,
    Status VARCHAR(100),
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE SET NULL
);

-- Credit_Profile Table
CREATE TABLE Credit_Profile (
    CreditProfile_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT,
    Balance DECIMAL(10,2),
    Customer_Name VARCHAR(100),
    Phone_Number VARCHAR(20),
    Reminder_Sent BOOLEAN,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE SET NULL
);

-- Credit Payment Tracking Table
CREATE TABLE Credit_Payment (
    CreditPayment_ID INT PRIMARY KEY AUTO_INCREMENT,
    CreditProfile_ID INT,
    Payment_Amount DECIMAL(10,2),
    Payment_Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CreditProfile_ID) REFERENCES Credit_Profile(CreditProfile_ID) ON DELETE CASCADE
);

-- Order Table
CREATE TABLE Order_Table (
    Order_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT,
    Pickup_Time TIME,
    Status VARCHAR(50),
    Total_Amount DECIMAL(10,2) DEFAULT 0,
    Payment_Status VARCHAR(50) DEFAULT 'Unpaid',
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE SET NULL
);

-- Category Table
CREATE TABLE Category (
    Category_ID INT PRIMARY KEY AUTO_INCREMENT,
    Category_Name VARCHAR(100)
);

-- Product_Category Table
CREATE TABLE Product_Category (
    ProductCategory_ID INT PRIMARY KEY AUTO_INCREMENT,
    Category_ID INT,
    ProductCategory_Name VARCHAR(100),
    FOREIGN KEY (Category_ID) REFERENCES Category(Category_ID) ON DELETE CASCADE
);

-- Product Table
CREATE TABLE Product (
    Product_ID VARCHAR(20) PRIMARY KEY,
    ProductCategory_ID INT,
    Product_Name VARCHAR(100),
    Product_Description TEXT,
    FOREIGN KEY (ProductCategory_ID) REFERENCES Product_Category(ProductCategory_ID) ON DELETE CASCADE
);

-- Size Table
CREATE TABLE Product_Size (
    Size_ID INT PRIMARY KEY AUTO_INCREMENT,
    Product_ID VARCHAR(20),
    Price DECIMAL(10,2),
    Size VARCHAR(50),
    Stock INT,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE
);

-- Product Image Table
CREATE TABLE Product_Image (
    Image_ID INT PRIMARY KEY AUTO_INCREMENT,
    Product_ID VARCHAR(20),
    Image_Link TEXT,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE
);

-- Order_Item Table with Total_Amount per item
CREATE TABLE Order_Item (
    OrderItem_ID INT PRIMARY KEY AUTO_INCREMENT,
    Order_ID INT,
    Product_ID VARCHAR(20),
    Size_ID INT,
    Quantity INT,
    Total_Amount DECIMAL(10,2),
    FOREIGN KEY (Order_ID) REFERENCES Order_Table(Order_ID) ON DELETE CASCADE,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE,
    FOREIGN KEY (Size_ID) REFERENCES Product_Size(Size_ID) ON DELETE CASCADE
);

-- Pre_Order_Item Table
CREATE TABLE Pre_Order_Item (
    Pre_Order_Item_ID INT PRIMARY KEY AUTO_INCREMENT,
    Pre_Order_ID INT,
    Ingredients TEXT,
    Product_ID VARCHAR(20),
    Size_ID INT,
    Quantity INT,
    FOREIGN KEY (Pre_Order_ID) REFERENCES Pre_Order(Pre_Order_ID) ON DELETE CASCADE,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE,
    FOREIGN KEY (Size_ID) REFERENCES Product_Size(Size_ID) ON DELETE CASCADE
);

-- Cart_Item Table
CREATE TABLE Cart_Item (
    Cart_Item_ID INT PRIMARY KEY AUTO_INCREMENT,
    Cart_ID INT,
    Quantity INT,
    Product_ID VARCHAR(20),
    Size_ID INT,
    Category_ID INT,
    FOREIGN KEY (Cart_ID) REFERENCES Cart(Cart_ID) ON DELETE CASCADE,
    FOREIGN KEY (Product_ID) REFERENCES Product(Product_ID) ON DELETE CASCADE,
    FOREIGN KEY (Size_ID) REFERENCES Product_Size(Size_ID) ON DELETE CASCADE,
    FOREIGN KEY (Category_ID) REFERENCES Category(Category_ID) ON DELETE CASCADE
);

-- Owner Table
CREATE TABLE Owner (
    Owner_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(100),
    Email VARCHAR(100),
    Phone_Number VARCHAR(20),
    Password VARCHAR(255)
);

-- Notification Table
CREATE TABLE Notification (
    Notification_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT,
    Owner_ID INT,
    Sent_Date DATETIME,
    Message TEXT,
    Sent_Time TIME,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Owner_ID) REFERENCES Owner(Owner_ID) ON DELETE CASCADE
);

-- Report Table
CREATE TABLE Report (
    Report_ID INT PRIMARY KEY AUTO_INCREMENT,
    Owner_ID INT,
    Start_Date DATE,
    End_Date DATE,
    Generate_Date DATETIME,
    Report_Type VARCHAR(100),
    FOREIGN KEY (Owner_ID) REFERENCES Owner(Owner_ID) ON DELETE CASCADE
);

-- Inquiry Table
CREATE TABLE Inquiry (
    Inquiry_ID INT PRIMARY KEY AUTO_INCREMENT,
    User_ID INT,
    Order_ID INT,
    Message TEXT,
    Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_ID) REFERENCES User(User_ID) ON DELETE CASCADE,
    FOREIGN KEY (Order_ID) REFERENCES Order_Table(Order_ID) ON DELETE CASCADE
);

-- Indexes for Optimization
CREATE INDEX idx_user_email ON User(Email);
CREATE INDEX idx_product_category ON Product(ProductCategory_ID);
CREATE INDEX idx_product_size ON Product_Size(Product_ID);
CREATE INDEX idx_cart_user ON Cart(User_ID);
CREATE INDEX idx_order_user ON Order_Table(User_ID);
CREATE INDEX idx_credit_user ON Credit_Profile(User_ID);

-- Triggers for Total Calculations
DELIMITER $$

CREATE TRIGGER update_order_item_total BEFORE INSERT ON Order_Item
FOR EACH ROW
BEGIN
    SET NEW.Total_Amount = (
        SELECT Price * NEW.Quantity
        FROM Product_Size
        WHERE Product_Size.Size_ID = NEW.Size_ID
        AND Product_Size.Product_ID = NEW.Product_ID
    );
END $$

CREATE TRIGGER update_order_total AFTER INSERT ON Order_Item
FOR EACH ROW
BEGIN
    UPDATE Order_Table
    SET Total_Amount = (
        SELECT SUM(Total_Amount)
        FROM Order_Item
        WHERE Order_ID = NEW.Order_ID
    )
    WHERE Order_ID = NEW.Order_ID;
END $$

DELIMITER ;

INSERT INTO Owner (Name, Email, Phone_Number, Password)
VALUES ('Admin User', 'admin@navomin.com', '0771234567', 'admin123');

delete from Owner where owner_ID=1;


INSERT INTO Owner (Name, Email, Phone_Number, Password)
VALUES (
  'Admin',
  'admin@navomin.com',
  '0771234567',
  '$2b$10$S5/7JgewU3qOmSBZt9c9keW4NyjMxV2uup13qdPy757P.64Eg8BcO'
);


INSERT INTO Category (Category_Name) VALUES 
('Normal'), 
('Pre Order');

INSERT INTO Product_Category (Category_ID, ProductCategory_Name) VALUES 
(1, 'Fruits'),
(1, 'Vegetables'),
(2, 'Buns'),
(2, 'Sweets');




