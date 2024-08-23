CREATE TABLE Subscriptions (
    id SERIAL PRIMARY KEY,
    companyId INT NOT NULL,
    planId VARCHAR(255),
    status BOOLEAN DEFAULT FALSE,
    billingCycleStartDate TIMESTAMP,
    billingCycleEndDate TIMESTAMP,
    price VARCHAR(255),
    stripeSubscriptionId VARCHAR(255),
    createdAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_company
        FOREIGN KEY(companyId) 
        REFERENCES company(id)
);