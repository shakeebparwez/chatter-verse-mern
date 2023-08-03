const cloudinary = require("cloudinary").v2;
          
cloudinary.config({ 
  cloud_name: 'dt8mrgufo', 
  api_key: '767258833781374', 
  api_secret: '0QfCQlYFl_nJO2zwKTPsq0Otlfg',
});

module.exports = cloudinary;