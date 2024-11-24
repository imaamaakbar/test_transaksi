const generateInvNumber = async () => {
    const prefix = 'INV';
    const timestamp = Date.now(); 
    const randomDigits = Math.floor(1000 + Math.random() * 9000); 
    return `${prefix}-${timestamp}-${randomDigits}`;
  };

module.exports ={ generateInvNumber}