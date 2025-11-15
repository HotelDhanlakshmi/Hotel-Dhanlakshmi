const mongoose = require('mongoose');
const { Schema } = mongoose;

const bannerSchema = new Schema({
  /**
   * The only required field is the URL to the image.
   */
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required']
  },
  /**
   * A "click link" for the banner. Optional.
   * If you don't want the banner to be clickable, you can remove this.
   */
  link: {
    type: String,
    default: '/menu'
  },
  /**
   * Lets the admin hide a banner without deleting it.
   */
  isActive: {
    type: Boolean,
    default: true,
    index: true 
  },
  /**
   * Controls the order of the slides.
   */
  sortOrder: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;