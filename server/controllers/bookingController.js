import Booking from "../models/Booking.js";
import Property from "../models/Property.js";
import Agency from "../models/Agency.js";
import transporter from "../config/nodemailer.js";
import stripe from "stripe"

// Internal helper
const checkAvailability = async ({ checkInDate, checkOutDate, property }) => {
  try {
    const bookings = await Booking.find({
      property,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });
    const isAvailable = bookings.length === 0;
    return isAvailable;
  } catch (error) {
    console.log(error.message);
  }
};

// To Check Property availability [POST '/check-availability']
export const checkBookingAvailability = async (req, res) => {
  try {
    const { property, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      property,
    });

    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Create a new Booking [POST '/book']
export const bookingCreate = async (req, res) => {
  try {
    const { property, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user._id;

    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      property,
    });
    if (!isAvailable) {
      return res.json({ success: false, message: "Property is not available" });
    }

    // Get TotalPrice from property
    const propertyData = await Property.findById(property).populate("agency");
    let totalPrice = propertyData.price.rent;

    // Calculate totalprice based on nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    totalPrice *= nights;

    const booking = await Booking.create({
      user,
      property,
      agency: propertyData.agency._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL, // The email we have used fo creating the brevo acc
      to: req.user.email,
      subject: 'Property Booking/Sale',
      html:`
      <h2>Your Booking Details</h2>
      <p>Thank You for your booking! Below are your booing details:</p>
      <ul>
        <li><strong>Booking ID:</strong> ${booking._id}</li>
        <li><strong>Agency Name:</strong> ${propertyData.agency.name}</li>
        <li><strong>Location:</strong> ${propertyData.address}</li>
        <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
        <li><strong>Booking Amount:</strong> ${process.env.CURRENCY || "$"}${booking.totalPrice} for ${nights} nights</li>
      </ul>
      <p>We are excited to welcome you soon.</p>
      <p>Need to change something? Contact us.</p>
      `
    }

    await transporter.sendMail(mailOptions)
    
    res.json({ success: true, message: "Booking Created" });
    
  } catch (error) {
    console.log(error.message)
    res.json({ success: false, message: "Failed to create Booking" });
  }
};


// Get Bookings of Current User [GET '/user']
export const getUserBookings = async (req,res)=>{
  try {
    const user = req.user._id
    const bookings = await Booking.find({user}).populate("property agency").sort({createdAt: -1})
    res.json({success:true, bookings})
    
  } catch (error) {
    res.json({ success: false, message: "Failed to get Bookings" });
  }
}

// Get Bookings for Agency [GET '/agency']
export const getAgencyBookings = async (req,res)=>{
  try {
    const user = req.user._id
    const agency = await Agency.findOne({owner: req.auth.userId})
    if(!agency){
      return res.json({success:false, message:"No Agency found"})
    }
    
    const bookings = await Booking.find({agency: agency._id}).populate("property agency user").sort({createdAt: -1})

    const totalBookings = bookings.length
    const totalRevenue = bookings.reduce((acc, b)=> acc + (b.isPaid ? b.totalPrice : 0), 0)

    res.json({success:true, dashboardData: {totalBookings, totalRevenue, bookings}})

  } catch (error) {
    
    res.json({ success: false, message: "Failed to get Agency Bookings" });
  }
}

// Stripe Payment POST /stripe
export const bookingStripePayment = async (req,res)=>{
  try {
    const {bookingId} = req.body
    const booking = await Booking.findById(bookingId)
    const propertyData = await Property.findById(booking.property).populate("agency");
    const totalPrice = booking.totalPrice
    const {origin} = req.headers

    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {name: propertyData.agency.name},
          unit_amount: totalPrice * 100,
        },
        quantity: 1,
      }
    ]

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/processing/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      metadata: {bookingId}
    })

    res.json({success:true, url:session.url})
  } catch (error) {
    res.json({success:false, message: "Payment Failed"})
  }
}