-- Add payment_details column to rebate_requests table
ALTER TABLE rebate_requests 
ADD COLUMN payment_details TEXT;

-- Add comment to describe the column
COMMENT ON COLUMN rebate_requests.payment_details IS 'Venmo username or PayPal email for payment processing';
