import { useState } from 'react';
import { IoClose, IoCard, IoCalendar, IoLockClosed } from 'react-icons/io5';
import './CheckoutModal.css';

function CheckoutModal({ isOpen, onClose, onPurchase, totalAmount, itemCount }) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: 'US'
  });
  
  const [cardType, setCardType] = useState('');
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Credit card type detection
  const detectCardType = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    
    if (/^4/.test(cleanNumber)) return 'visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'amex';
    if (/^6(?:011|5)/.test(cleanNumber)) return 'discover';
    if (/^(?:2131|1800|35\d{3})/.test(cleanNumber)) return 'jcb';
    
    return '';
  };

  // Luhn algorithm for credit card validation
  const validateCardNumber = (number) => {
    const cleanNumber = number.replace(/\s/g, '');
    
    if (!/^\d+$/.test(cleanNumber)) return false;
    
    let sum = 0;
    let shouldDouble = false;
    
    // Loop through digits from right to left
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i));
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const cleanValue = value.replace(/\s/g, '');
    const cardType = detectCardType(cleanValue);
    
    if (cardType === 'amex') {
      // American Express: 4-6-5 format
      return cleanValue.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    } else {
      // Other cards: 4-4-4-4 format
      return cleanValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
  };

  // Format expiry date MM/YY
  const formatExpiryDate = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue.length >= 2) {
      return cleanValue.substring(0, 2) + '/' + cleanValue.substring(2, 4);
    }
    return cleanValue;
  };

  // Validate expiry date
  const validateExpiryDate = (date) => {
    const [month, year] = date.split('/');
    if (!month || !year) return false;
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const cardMonth = parseInt(month);
    const cardYear = parseInt(year);
    
    if (cardMonth < 1 || cardMonth > 12) return false;
    if (cardYear < currentYear) return false;
    if (cardYear === currentYear && cardMonth < currentMonth) return false;
    
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      const detectedType = detectCardType(value);
      setCardType(detectedType);
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    } else if (name === 'cardholderName') {
      formattedValue = value.replace(/[^a-zA-Z\s]/g, '');
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Card number validation
    if (!formData.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = 'Invalid card number';
    }

    // Expiry date validation
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!validateExpiryDate(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid or expired date';
    }

    // CVV validation
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }

    // Cardholder name validation
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Process the purchase
      await onPurchase();
      
      // Close modal
      onClose();
    } catch (error) {
      console.error('Payment failed:', error);
      setErrors({ general: 'Payment processing failed. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="checkout-modal-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="checkout-modal-header">
          <h2>Complete Your Purchase</h2>
          <button className="close-btn" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        <div className="checkout-modal-content">
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-line">
              <span>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-line total">
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="checkout-form">
            {errors.general && (
              <div className="error-message general-error">{errors.general}</div>
            )}

            <div className="form-section">
              <h4><IoCard /> Payment Information</h4>
              
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <div className="card-input-container">
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={cardType === 'amex' ? 17 : 19}
                    className={errors.cardNumber ? 'error' : ''}
                  />
                  {cardType && <span className="card-type">{cardType.toUpperCase()}</span>}
                </div>
                {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate"><IoCalendar /> Expiry Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={errors.expiryDate ? 'error' : ''}
                  />
                  {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cvv"><IoLockClosed /> CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength={4}
                    className={errors.cvv ? 'error' : ''}
                  />
                  {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="cardholderName">Cardholder Name</label>
                <input
                  type="text"
                  id="cardholderName"
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={errors.cardholderName ? 'error' : ''}
                />
                {errors.cardholderName && <span className="error-text">{errors.cardholderName}</span>}
              </div>
            </div>

            <div className="checkout-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button 
                type="submit" 
                className={`purchase-btn ${isProcessing ? 'processing' : ''}`}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Purchase $${totalAmount.toFixed(2)}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CheckoutModal;
