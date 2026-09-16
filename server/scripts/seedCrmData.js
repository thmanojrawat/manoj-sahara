import mongoose from "mongoose";
import "dotenv/config";
import connectDB from "../config/mongodb.js";
import Vendor from "../models/Vendor.js";
import Broker from "../models/Broker.js";
import CrmProperty from "../models/CrmProperty.js";
import Listing from "../models/Listing.js";
import Client from "../models/Client.js";
import Lead from "../models/Lead.js";
import CrmBooking from "../models/CrmBooking.js";

async function seed() {
  console.log("Connecting to MongoDB Atlas...");

  await connectDB();

  console.log("Connected to MongoDB.");

  // ==========================================
  // 1. SEED VENDORS
  // ==========================================

  const vendorData = [
    {
      name: "Pradeep Sureka",
      companyName: "PS Group Developers",
      phone: "+91 98301 11222",
      email: "pradeep.sureka@psgroup.in",
      address: "1003 EM Bypass, Park Circus",
      city: "Kolkata",
      locality: "Park Circus",
      status: "active",
      notes:
        "Leading residential and commercial luxury developer in East India",
    },
    {
      name: "Sushil Mohta",
      companyName: "Merlin Projects Ltd",
      phone: "+91 98302 22333",
      email: "sushil.mohta@merlinprojects.com",
      address: "Merlin Oxford, 22 Prince Anwar Shah Road",
      city: "Kolkata",
      locality: "Tollygunge",
      status: "active",
      notes:
        "Premier Kolkata developer known for residential and commercial projects",
    },
    {
      name: "Harshavardhan Neotia",
      companyName: "Ambuja Neotia Group",
      phone: "+91 98303 33444",
      email: "neotia@ambujaneotia.com",
      address: "Ecospace Business Park, New Town",
      city: "Kolkata",
      locality: "New Town",
      status: "active",
      notes:
        "Established developer with major residential and commercial projects",
    },
    {
      name: "Rahul Saraf",
      companyName: "Forum Projects",
      phone: "+91 98304 44555",
      email: "rahul.saraf@forumprojects.in",
      address: "4/1 Elgin Road",
      city: "Kolkata",
      locality: "Ballygunge",
      status: "active",
      notes:
        "Established Kolkata real estate developer and property investor",
    },
    {
      name: "Debabrata Roy",
      companyName: "Roy Heritage Properties",
      phone: "+91 98305 55666",
      email: "debabrata.roy@royheritage.com",
      address: "12/A Burdwan Road, Alipore",
      city: "Kolkata",
      locality: "Alipore",
      status: "active",
      notes:
        "Boutique property owner specializing in premium residential properties",
    },
  ];

  const vendorDocs = [];

  for (const v of vendorData) {
    let doc = await Vendor.findOne({ phone: v.phone });

    if (!doc) {
      doc = await Vendor.create(v);
      console.log(`[Seed] Created Vendor: ${doc.name}`);
    } else {
      doc.set(v);
      await doc.save();
      console.log(`[Seed] Updated Vendor: ${doc.name}`);
    }

    vendorDocs.push(doc);
  }

  // ==========================================
  // 2. SEED BROKERS
  // ==========================================

  const brokerData = [
    {
      name: "Rajesh Sengupta",
      companyName: "Sengupta Prime Realty",
      phone: "+91 98310 11001",
      email: "rajesh@senguptarealty.com",
      specialization: ["New Town", "Rajarhat", "Chinar Park"],
      city: "Kolkata",
      locality: "New Town",
      experience: 12,
      status: "active",
      notes:
        "Specialist in luxury high-rises and IT corridor residential properties",
    },
    {
      name: "Priya Mukherjee",
      companyName: "Mukherjee & Associates",
      phone: "+91 98310 22002",
      email: "priya.m@mukherjeerealty.com",
      specialization: ["Ballygunge", "Alipore", "Lake Town"],
      city: "Kolkata",
      locality: "Ballygunge",
      experience: 9,
      status: "active",
      notes:
        "Specialist in premium South and Central Kolkata residential properties",
    },
    {
      name: "Anirban Roy",
      companyName: "Heritage City Homes",
      phone: "+91 98310 33003",
      email: "anirban@heritagecityhomes.com",
      specialization: ["Salt Lake", "Sector V", "Howrah"],
      city: "Kolkata",
      locality: "Salt Lake",
      experience: 15,
      status: "active",
      notes:
        "Commercial and residential property advisor across Kolkata metropolitan region",
    },
    {
      name: "Debolina Ghosh",
      companyName: "Metro Habitat Realtors",
      phone: "+91 98310 44004",
      email: "debolina@metrohabitat.in",
      specialization: ["Tollygunge", "Garia", "New Alipore", "Shalimar"],
      city: "Kolkata",
      locality: "Tollygunge",
      experience: 7,
      status: "active",
      notes:
        "Residential property specialist focused on metro-connected neighborhoods",
    },
    {
      name: "Sourav Ganguly Associates",
      companyName: "Bengal Property Advisory",
      phone: "+91 98310 55005",
      email: "sourav@bengalproperty.com",
      specialization: ["New Alipore", "Alipore", "EM Bypass"],
      city: "Kolkata",
      locality: "New Alipore",
      experience: 18,
      status: "active",
      notes:
        "Premium property brokerage catering to corporate executives and NRIs",
    },
  ];

  const brokerDocs = [];

  for (const b of brokerData) {
    let doc = await Broker.findOne({ phone: b.phone });

    if (!doc) {
      doc = await Broker.create(b);
      console.log(`[Seed] Created Broker: ${doc.name}`);
    } else {
      doc.set(b);
      await doc.save();
      console.log(`[Seed] Updated Broker: ${doc.name}`);
    }

    brokerDocs.push(doc);
  }

  // ==========================================
  // 3. SEED 12 PROPERTIES
  // ==========================================

  const propertyData = [
    // ==========================================
    // 1. NIRMALA NEVADA
    // ==========================================
    {
      title: "4 BHK Flat For Sale in Nirmala Nevada, Lake Town, Kolkata",

      description:
        "Explore this 4 BHK apartment in Lake Town to buy or invest in Kolkata city. The flat has a prime location within Nirmala Nevada. This Dec '26 property in Lake Town can be availed at a price of ₹1.16 Cr. The project is RERA approved and WBRERA/P/NOR/2023/000628 is the RERA number. Properties in Nirmala Nevada are available in 2, 3 and 4 BHK configurations.",

      propertyType: "Apartment",
      status: "available",

      city: "Kolkata",
      locality: "Lake Town",
      address: "Nirmala Nevada, Lake Town, Kolkata",

      price: 11600000,
      priceType: "sale",

      area: 1771,

      bedrooms: 4,
      bathrooms: 3,
      parking: 2,

      furnishing: "unfurnished",

      amenities: [
        "RERA Approved",
        "Balcony",
        "Developer: Nirmala Group",
      ],

      images: [
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h300_w450/2024/08/21/Project-Photo-5-Nevada-Kolkata-5389101_897_1600_300_450.jpg",
          isPrimary: true,
        },
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h310_w462/2024/08/21/Project-Photo-1-Nevada-Kolkata-5389101_410_1440_310_462.jpg",
        },
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h310_w462/2024/08/21/Project-Photo-11-Nevada-Kolkata-5389101_649_1600_310_462.jpg",
        },
      ],

      vendorIdx: 0,
      brokerIdx: 0,

      published: true,
    },

    // ==========================================
    // 2. ARCH STARWOOD
    // ==========================================
    {
      title: "3 BHK 1480 Sqft Flat For Sale Chinar Park, Kolkata",

      description:
        "An elegant 3 BHK flat located in Chinar Park, Kolkata is now available for sale. This residence is part of the Arch Starwood project. Located in Chinar Park, this ready-to-move apartment is available at a price of ₹1.50 Cr. The property includes power backup, reserved parking, security, service/goods lift, air conditioning, intercom facility and RO water system. HIRA/P/NOR/2019/000342 is the RERA number of the project.",

      propertyType: "Apartment",
      status: "available",

      city: "Kolkata",
      locality: "Chinar Park",
      address: "Arch Starwood, Chinar Park, Kolkata",

      price: 15000000,
      priceType: "sale",

      area: 1480,

      bedrooms: 3,
      bathrooms: 3,
      parking: 0,

      furnishing: "unfurnished",

      amenities: [
        "RERA Approved",
        "2 Balconies",
        "1 Study Room",
        "Developer: Arch Group",
      ],

      images: [
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h310_w462/2025/04/21/Project-Photo-87-Arch-Starwood-Kolkata-5089399_1125_2000_310_462.jpg",
          isPrimary: true,
        },
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h300_w450/Project-Photo-8-Starwood-Kolkata-5089399_800_600_300_450.jpg",
        },
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h310_w462/2025/04/21/Project-Photo-95-Arch-Starwood-Kolkata-5089399_1440_810_310_462.jpg",
        },
      ],

      vendorIdx: 0,
      brokerIdx: 0,

      published: true,
    },

    // ==========================================
    // 3. URBAN GREENS
    // ==========================================
    {
      title: "3 BHK 1250 Sqft Flat For Sale Rajarhat, Kolkata",

      description:
        "Urban Greens Phase 2 in Rajarhat is an upcoming housing society in Kolkata East. The project offers apartments for sale and includes facilities such as swimming pool, gymnasium and clubhouse. Brought to you by Loharuka Group, the project is spread over approximately 2.68 acres with around 300 units across 5 towers and 9 floors.",

      propertyType: "Apartment",
      status: "available",

      city: "Kolkata",
      locality: "Rajarhat",
      address: "Loharuka Urban Greens Phase 2, Rajarhat, Kolkata",

      price: 12400000,
      priceType: "sale",

      area: 1250,

      bedrooms: 3,
      bathrooms: 2,
      parking: 1,

      furnishing: "semi-furnished",

      amenities: [
        "RERA Approved",
        "1 Balcony",
        "1 Covered Parking",
        "Developer: Loharuka Group",
        "Swimming Pool",
        "Gymnasium",
        "Club House",
      ],

      images: [
        {
          url: "https://img.staticmb.com/mbphoto/property/cropped_images/ver2/XIwvQlc61t8ZIpanz4mAnTVN99A9dcpX6kwYURgK32ejB1QEvBRq/Photo_h300_w450/83718169_8_hatsAppImage20260310at3.23.29PM2_300_450.jpeg",
          isPrimary: true,
        },
        {
          url: "https://img.staticmb.com/mbphoto/property/cropped_images/ver2/XIwvQlc61t8ZIpanz4mAnTVN99A9dcpX6kwYURgK32ejB1QEvBRq/Photo_h300_w450/83718169_3_hatsAppImage20260310at3.23.26PM2_300_450.jpeg",
        },
        {
          url: "https://img.staticmb.com/mbphoto/property/cropped_images/ver2/XIwvQlc61t8ZIpanz4mAnTVN99A9dcpX6kwYURgK32ejB1QEvBRq/Photo_h300_w450/83718169_10_hatsAppImage20260310at3.23.25PM1_300_450.jpeg",
        },
      ],

      vendorIdx: 0,
      brokerIdx: 0,

      published: true,
    },

    // ==========================================
    // 4. SHRIJI CELLESTA
    // ==========================================
    {
      title: "3 BHK 1177 Sqft Flat For Sale Lake Town, Kolkata",

      description:
        "Multistorey apartment for sale in Lake Town, Kolkata. The property belongs to Shriji Cellesta and offers a 3 BHK configuration. The apartment is available at approximately ₹1.57 Cr. The project is RERA approved and WBRERA/P/NOR/2024/001451 is the RERA number. The project offers 3 and 4 BHK configurations.",

      propertyType: "Apartment",
      status: "available",

      city: "Kolkata",
      locality: "Lake Town",
      address: "Shriji Cellesta, Lake Town, Kolkata",

      price: 15700000,
      priceType: "sale",

      area: 1177,

      bedrooms: 3,
      bathrooms: 3,
      parking: 0,

      furnishing: "unfurnished",

      amenities: [
        "RERA Approved",
        "1 Balcony",
        "Developer: Shriji Group",
      ],

      images: [
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h300_w450/2024/07/15/Project-Photo-4-Cellesta-Kolkata-5422269_457_800_300_450.jpg",
          isPrimary: true,
        },
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h310_w462/2024/07/15/Project-Photo-1-Cellesta-Kolkata-5422269_410_1440_310_462.jpg",
        },
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h310_w462/2024/07/15/Project-Photo-4-Cellesta-Kolkata-5422269_457_800_310_462.jpg",
        },
      ],

      vendorIdx: 0,
      brokerIdx: 1,

      published: true,
    },

    // ==========================================
    // 5. NIRMALA JADE
    // ==========================================
    {
      title: "4 BHK 2701 Sqft Flat For Sale Bangur Avenue, Kolkata",

      description:
        "At Jade, enjoy stunning views with various integrated amenities. A new 4 BHK apartment is available for sale in Bangur Avenue, Kolkata. The price is tentative and indicates the base price only, excluding additional charges. Please contact us for further details and a site visit.",

      propertyType: "Apartment",
      status: "available",

      city: "Kolkata",
      locality: "Bangur Avenue",
      address: "Nirmala Jade, Bangur Avenue, Kolkata",

      price: 28700000,
      priceType: "sale",

      area: 2701,

      bedrooms: 4,
      bathrooms: 4,
      parking: 0,

      furnishing: "unfurnished",

      amenities: [
        "RERA Approved",
        "2 Balconies",
        "Developer: Nirmala Group",
      ],

      images: [
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h300_w450/2024/06/11/Project-Photo-5-Jade-Kolkata-5417357_667_1200_300_450.jpg",
          isPrimary: true,
        },
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h310_w462/2024/06/11/Project-Photo-11-Jade-Kolkata-5417357_600_1200_310_462.jpg",
        },
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h310_w462/2024/06/11/Project-Photo-1-Jade-Kolkata-5417357_410_1440_310_462.jpg",
        },
      ],

      vendorIdx: 0,
      brokerIdx: 1,

      published: true,
    },

    // ==========================================
    // 6. PS SANSARA
    // ==========================================
    {
      title: "3 BHK 1593 Sqft Flat For Sale in PS Sansara, Howrah, Kolkata",

      description:
        "This spacious 3 BHK apartment is available for sale in Howrah, Kolkata. The flat is housed in PS Sansara and is available at approximately ₹3.27 Cr. The project is RERA approved and WBRERA/P/HOW/2024/001857 is the RERA number. The project offers 3, 4 and 5 BHK configurations.",

      propertyType: "Apartment",
      status: "available",

      city: "Kolkata",
      locality: "Howrah",
      address: "PS Sansara, Howrah, Kolkata",

      price: 32700000,
      priceType: "sale",

      area: 1593,

      bedrooms: 3,
      bathrooms: 4,
      parking: 0,

      furnishing: "unfurnished",

      amenities: [
        "RERA Approved",
        "1 Balcony",
        "Developer: PS Group",
      ],

      images: [
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h300_w450/2024/10/21/Project-Photo-4-Sansara-Kolkata-5424227_696_1567_300_450.jpg",
          isPrimary: true,
        },
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h310_w462/2024/10/21/Project-Photo-11-Sansara-Kolkata-5424227_588_1323_310_462.jpg",
        },
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h310_w462/2024/10/21/Project-Photo-1-Sansara-Kolkata-5424227_410_1440_310_462.jpg",
        },
      ],

      vendorIdx: 0,
      brokerIdx: 2,

      published: true,
    },

    // ==========================================
    // 7. PRIMARC AADVIKA
    // ==========================================
    {
      title: "3 BHK 1550 Sqft Flat For Sale Howrah, Kolkata",

      description:
        "This modern 3 BHK property is situated in Howrah, Kolkata. The flat is situated within Primarc Aadvika and includes one covered car parking space. The property is available at approximately ₹2.58 Cr. The project is RERA approved under WBRERA/P/HOW/2025/003467 and offers 3, 4 and 5 BHK configurations.",

      propertyType: "Apartment",
      status: "available",

      city: "Kolkata",
      locality: "Howrah",
      address: "Primarc Aadvika, Howrah, Kolkata",

      price: 25800000,
      priceType: "sale",

      area: 1550,

      bedrooms: 3,
      bathrooms: 3,
      parking: 1,

      furnishing: "unfurnished",

      amenities: [
        "RERA Approved",
        "Zero Brokerage",
        "1 Covered Parking",
        "Developer: Primarc Projects Private Limited",
      ],

      images: [
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h0_w320/ver2/XIwvQlc61t8ZIpanz4mAnjUxp40gdasuDy9J7kL7Xabv7O5aO84/Project-Photo-3-Primarc-Aadvika-Kolkata-5439287_1140_1487_0_320.jpg",
          isPrimary: true,
        },
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h0_w320/ver2/XIwvQlc61t8ZIpanz4mAnjUxp40gdasuDy9J7kL7Xabv7O5aO84/Project-Photo-4-Primarc-Aadvika-Kolkata-5439287_1431_1496_0_320.jpg",
        },
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h0_w320/ver2/XIwvQlc61t8ZIpanz4mAnjUxp40gdasuDy9J7kL7Xabv7O5aO84/Project-Photo-11-Primarc-Aadvika-Kolkata-5439287_1434_1496_0_320.jpg",
        },
      ],

      vendorIdx: 0,
      brokerIdx: 2,

      published: true,
    },

    // ==========================================
    // 8. EDEN DEVPRAYAG
    // ==========================================
    {
      title: "3 BHK 1565 Sqft Flat For Sale Shalimar, Kolkata",

      description:
        "A well-positioned 3 BHK flat in Shalimar, Kolkata. One covered parking space is available with this apartment. The under-construction apartment is available at approximately ₹1.70 Cr. Its possession date is Dec '30. The project is RERA approved under WBRERA/P/HOW/2025/003782 and offers 3, 4 and 5 BHK configurations.",

      propertyType: "Apartment",
      status: "available",

      city: "Kolkata",
      locality: "Shalimar",
      address: "Eden Devprayag, Shalimar, Kolkata",

      price: 17000000,
      priceType: "sale",

      area: 1565,

      bedrooms: 3,
      bathrooms: 3,
      parking: 1,

      furnishing: "unfurnished",

      amenities: [
        "RERA Approved",
        "2 Balconies",
        "1 Covered Parking",
        "Developer: Eden Realty Ventures Private Limited",
        "Kids Play Area",
      ],

      images: [
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h300_w450/2026/03/16/Project-Photo-12-Eden-Devprayag-Pravah-Kolkata-5446413_960_1728_300_450.jpg",
          isPrimary: true,
        },
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h310_w462/2026/06/26/Project-Photo-28-Eden-Devprayag-Pravah-Kolkata-5446413_410_1440_310_462.jpg",
        },
      ],

      vendorIdx: 0,
      brokerIdx: 3,

      published: true,
    },

    // ==========================================
    // 9. GODREJ BLUE
    // ==========================================
    {
      title: "3 BHK 2088 Sqft Flat For Sale in Godrej Blue, New Alipore, Kolkata",

      description:
        "This premium 3 BHK flat is available for sale in New Alipore, Kolkata. It enjoys a prime location within Godrej Blue. The apartment is available at approximately ₹3.11 Cr. The project is RERA approved under WBRERA/P/KOL/2024/002211 and offers 3 and 4 BHK configurations.",

      propertyType: "Apartment",
      status: "available",

      city: "Kolkata",
      locality: "New Alipore",
      address: "Godrej Blue, New Alipore, Kolkata",

      price: 31100000,
      priceType: "sale",

      area: 2088,

      bedrooms: 3,
      bathrooms: 3,
      parking: 0,

      furnishing: "unfurnished",

      amenities: [
        "RERA Approved",
        "3 Balconies",
        "Developer: Godrej Properties Ltd.",
      ],

      images: [
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h300_w450/2026/02/18/Project-Photo-6-GODREJ-BLUE-Kolkata-5425233_821_872_300_450.jpg",
          isPrimary: true,
        },
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h310_w462/2024/12/09/Project-Photo-1-GODREJ-BLUE-Kolkata-5425233_410_1440_310_462.jpg",
        },
      ],

      vendorIdx: 0,
      brokerIdx: 4,

      published: true,
    },

    // ==========================================
    // 10. TATA 88 EAST
    // ==========================================
    {
      title: "3 BHK 1709 Sqft Flat For Sale Alipore, Kolkata",

      description:
        "88 East is located in the heart of Alipore, one of the prestigious locales in Kolkata. At 43 storeys, 88 East is one of the tallest residential towers in the area. The property combines luxury residential living with landscaped gardens and premium architectural design.",

      propertyType: "Apartment",
      status: "available",

      city: "Kolkata",
      locality: "Alipore",
      address: "TATA 88 East, Alipore, Kolkata",

      price: 51600000,
      priceType: "sale",

      area: 1709,

      bedrooms: 3,
      bathrooms: 3,
      parking: 2,

      furnishing: "unfurnished",

      amenities: [
        "RERA Approved",
        "1 Balcony",
        "2 Covered Parking",
        "1 Servant Room",
        "Developer: TATA Housing Development Company Ltd.",
      ],

      images: [
        {
          url: "https://img.staticmb.com/mbphoto/property/cropped_images/ver2/XIwvQlc61t8ZIpanz4mAnjVO-dQ9dch54Wg-PmKgz4Bof74ASitS/Photo_h300_w450/82064917_5_013e47560220d05ae65resize_300_450.jpg",
          isPrimary: true,
        },
        {
          url: "https://img.staticmb.com/mbphoto/property/cropped_images/ver2/XIwvQlc61t8ZIpanz4mAnjVO-dQ9dch54Wg-PmKgz4Bof74ASitS/Photo_h300_w450/82064917_2__300_450.jpg",
        },
        {
          url: "https://img.staticmb.com/mbphoto/property/cropped_images/ver2/XIwvQlc61t8ZIpanz4mAnjVO-dQ9dch54Wg-PmKgz4Bof74ASitS/Photo_h300_w450/82064917_3_f5e436a9a1c514c7f3f_300_450.jpg",
        },
      ],

      vendorIdx: 0,
      brokerIdx: 4,

      published: true,
    },

    // ==========================================
    // 11. BELANI NPR SANCTUARY
    // ==========================================
    {
      title: "3 BHK 1874 Sqft Flat For Sale in Belani NPR Sanctuary, Tollygunge, Kolkata",

      description:
        "A spacious 3 BHK flat is offered for sale in Tollygunge, Kolkata. The apartment is located in Belani NPR Sanctuary and is available at approximately ₹3.02 Cr. The project is RERA approved under WBRERA/P/KOL/2023/000463 and offers 3, 4 and 5 BHK configurations.",

      propertyType: "Apartment",
      status: "available",

      city: "Kolkata",
      locality: "Tollygunge",
      address: "Belani NPR Sanctuary, Tollygunge, Kolkata",

      price: 30200000,
      priceType: "sale",

      area: 1874,

      bedrooms: 3,
      bathrooms: 2,
      parking: 0,

      furnishing: "unfurnished",

      amenities: [
        "RERA Approved",
        "1 Balcony",
        "Developer: Belani NPR Projects",
      ],

      images: [
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h300_w450/2022/03/22/Project-Photo-12-Sanctuary-Kolkata-5327123_1200_1600_300_450.jpg",
          isPrimary: true,
        },
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h310_w462/2022/04/12/Project-Photo-29-Sanctuary-Kolkata-5327123_345_1366_310_462.jpg",
        },
      ],

      vendorIdx: 1,
      brokerIdx: 3,

      published: true,
    },

    // ==========================================
    // 12. MERLIN AVANA
    // ==========================================
    {
      title: "3 BHK 1067 Sqft Flat For Sale Tollygunge, Kolkata",

      description:
        "The 3 BHK apartment is located in a well-connected area of Tollygunge. This residence is part of the Merlin Avana project. The apartment is available at approximately ₹1 Cr with possession scheduled for Dec '27. The project is RERA approved under WBRERA/P/KOL/2023/000418 and offers 2, 3 and 4 BHK configurations.",

      propertyType: "Apartment",
      status: "available",

      city: "Kolkata",
      locality: "Tollygunge",
      address: "Merlin Avana, Tollygunge, Kolkata",

      price: 10000000,
      priceType: "sale",

      area: 1067,

      bedrooms: 3,
      bathrooms: 3,
      parking: 0,

      furnishing: "unfurnished",

      amenities: [
        "RERA Approved",
        "2 Balconies",
        "Developer: Merlin Group",
      ],

      images: [
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h300_w450/2022/07/26/Project-Photo-18-Merlin-Avana-Kolkata-5333199_600_800_300_450.jpg",
          isPrimary: true,
        },
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h310_w462/2022/07/26/Project-Photo-20-Merlin-Avana-Kolkata-5333199_600_800_310_462.jpg",
        },
        {
          url: "https://img.staticmb.com/mbimages/project/Photo_h310_w462/2022/07/26/Project-Photo-1-Merlin-Avana-Kolkata-5333199_345_1366_310_462.jpg",
        },
      ],

      vendorIdx: 1,
      brokerIdx: 3,

      published: true,
    },
  ];

  // ==========================================
  // PROPERTY UPSERT / UPDATE
  // ==========================================

  const propertyDocs = [];

  for (const p of propertyData) {
    const { vendorIdx, brokerIdx, ...propertyFields } = p;

    const vendorId = vendorDocs[vendorIdx]?._id;
    const brokerId = brokerDocs[brokerIdx]?._id;

    if (!vendorId || !brokerId) {
      console.log(
        `[Seed] Missing vendor/broker for property: ${p.title}`
      );
      continue;
    }

    let doc = await CrmProperty.findOne({
      title: p.title,
    });

    if (!doc) {
      doc = await CrmProperty.create({
        ...propertyFields,
        vendor: vendorId,
        broker: brokerId,
      });

      console.log(`[Seed] Created Property: ${doc.title}`);
    } else {
      doc.set({
        ...propertyFields,
        vendor: vendorId,
        broker: brokerId,
      });

      await doc.save();

      console.log(`[Seed] Updated Property: ${doc.title}`);
    }

    propertyDocs.push(doc);
  }

  // ==========================================
  // 4. SEED LISTINGS
  // ==========================================
  //
  // IMPORTANT:
  // Every listing is generated directly from the
  // matching property.
  //
  // Therefore listing title, price and images
  // cannot become mismatched.
  // ==========================================

  const listingDocs = [];

  for (let i = 0; i < propertyDocs.length; i++) {
    const prop = propertyDocs[i];

    const slug = prop.title
      .toLowerCase()
      .replace(/₹/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    let listing = await Listing.findOne({
      property: prop._id,
    });

    const listingData = {
      property: prop._id,

      title: prop.title,

      description: prop.description,

      listingType:
        prop.priceType === "rent" ? "rent" : "sale",

      status: "active",

      published: true,

      featured: i < 6,

      slug,

      listedPrice: prop.price,

      publicImages: prop.images,

      publishedAt: new Date(),
    };

    if (!listing) {
      listing = await Listing.create(listingData);

      console.log(
        `[Seed] Created Listing: ${listing.title}`
      );
    } else {
      listing.set(listingData);

      await listing.save();

      console.log(
        `[Seed] Updated Listing: ${listing.title}`
      );
    }

    listingDocs.push(listing);
  }

  // ==========================================
  // 5. SEED CLIENTS
  // ==========================================

  const clientData = [
    {
      name: "Abhishek Chattopadhyay",
      phone: "+91 98320 01111",
      email: "abhishek.chatterjee@gmail.com",
      city: "Kolkata",
      locality: "Rajarhat",

      requirementNotes:
        "Looking for a 3 BHK apartment in Rajarhat or Chinar Park with modern amenities.",

      budget: {
        min: 12000000,
        max: 18000000,
      },

      interestedIn: "buy",

      source: "website",

      status: "active",

      notes:
        "IT professional looking for a family residence near New Town and Rajarhat.",
    },

    {
      name: "Sneha Roy Chowdhury",
      phone: "+91 98320 02222",
      email: "sneha.rc@outlook.com",
      city: "Kolkata",
      locality: "Lake Town",

      requirementNotes:
        "Looking for a premium 3 or 4 BHK apartment in Lake Town.",

      budget: {
        min: 14000000,
        max: 22000000,
      },

      interestedIn: "buy",

      source: "website",

      status: "active",

      notes:
        "Family buyer interested in premium Lake Town residences.",
    },

    {
      name: "Vikram Singhania",
      phone: "+91 98320 03333",
      email: "vikram.singhania@singhaniaexports.com",
      city: "Kolkata",
      locality: "Alipore",

      requirementNotes:
        "Interested in premium luxury apartments in Alipore and New Alipore.",

      budget: {
        min: 30000000,
        max: 60000000,
      },

      interestedIn: "buy",

      source: "website",

      status: "active",

      notes:
        "Business owner looking for a premium South Kolkata residence.",
    },

    {
      name: "Arindam Dutta",
      phone: "+91 98320 04444",
      email: "arindam.dutta@yahoo.com",
      city: "Kolkata",
      locality: "Tollygunge",

      requirementNotes:
        "Looking for a 3 BHK apartment in Tollygunge close to metro connectivity.",

      budget: {
        min: 9000000,
        max: 18000000,
      },

      interestedIn: "buy",

      source: "website",

      status: "active",

      notes:
        "Banking professional searching for a metro-connected family home.",
    },

    {
      name: "Kasturi Banerjee",
      phone: "+91 98320 05555",
      email: "kasturi.b@rediffmail.com",
      city: "Kolkata",
      locality: "Howrah",

      requirementNotes:
        "Looking for a spacious 3 BHK apartment in Howrah with parking.",

      budget: {
        min: 15000000,
        max: 35000000,
      },

      interestedIn: "buy",

      source: "website",

      status: "active",

      notes:
        "Family buyer interested in new residential developments in Howrah.",
    },
  ];

  const clientDocs = [];

  for (const c of clientData) {
    let doc = await Client.findOne({
      phone: c.phone,
    });

    if (!doc) {
      doc = await Client.create(c);

      console.log(
        `[Seed] Created Client: ${doc.name}`
      );
    } else {
      doc.set(c);

      await doc.save();

      console.log(
        `[Seed] Updated Client: ${doc.name}`
      );
    }

    clientDocs.push(doc);
  }

  // ==========================================
  // 6. SEED LEADS
  // ==========================================

  // Property indexes:
  //
  // 0 = Nirmala Nevada
  // 1 = Arch Starwood
  // 2 = Urban Greens
  // 3 = Shriji Cellesta
  // 4 = Nirmala Jade
  // 5 = PS Sansara
  // 6 = Primarc Aadvika
  // 7 = Eden Devprayag
  // 8 = Godrej Blue
  // 9 = TATA 88 East
  // 10 = Belani NPR Sanctuary
  // 11 = Merlin Avana

  const leadData = [
    {
      name: "Abhishek Chattopadhyay",
      phone: "+91 98320 01111",
      email: "abhishek.chatterjee@gmail.com",

      source: "Website Inquiry",

      message:
        "Interested in visiting the Urban Greens Phase 2 property with family.",

      requirement:
        "3 BHK apartment in Rajarhat",

      budget: 16000000,

      propertyType: "Apartment",

      preferredLocation: "Rajarhat",

      propertyIdx: 2,

      brokerIdx: 0,

      status: "Qualified",

      priority: "High",
    },

    {
      name: "Sneha Roy Chowdhury",
      phone: "+91 98320 02222",
      email: "sneha.rc@outlook.com",

      source: "Website Inquiry",

      message:
        "Please share floor plan and project details for the Lake Town apartment.",

      requirement:
        "3-4 BHK apartment in Lake Town",

      budget: 20000000,

      propertyType: "Apartment",

      preferredLocation: "Lake Town",

      propertyIdx: 3,

      brokerIdx: 1,

      status: "Site Visit",

      priority: "High",
    },

    {
      name: "Vikram Singhania",
      phone: "+91 98320 03333",
      email: "vikram.singhania@singhaniaexports.com",

      source: "Website Inquiry",

      message:
        "Interested in premium luxury apartments in Alipore and would like to schedule a private visit.",

      requirement:
        "3 BHK premium apartment in Alipore",

      budget: 55000000,

      propertyType: "Apartment",

      preferredLocation: "Alipore",

      propertyIdx: 9,

      brokerIdx: 4,

      status: "Negotiation",

      priority: "High",
    },

    {
      name: "Arindam Dutta",
      phone: "+91 98320 04444",
      email: "arindam.dutta@yahoo.com",

      source: "Website Inquiry",

      message:
        "Can we schedule a private site visit at one of the Tollygunge properties?",

      requirement:
        "3 BHK apartment in Tollygunge",

      budget: 17000000,

      propertyType: "Apartment",

      preferredLocation: "Tollygunge",

      propertyIdx: 11,

      brokerIdx: 3,

      status: "Contacted",

      priority: "Medium",
    },

    {
      name: "Kasturi Banerjee",
      phone: "+91 98320 05555",
      email: "kasturi.b@rediffmail.com",

      source: "Website Inquiry",

      message:
        "Looking for details about new residential projects in Howrah including parking and payment schedule.",

      requirement:
        "3 BHK apartment in Howrah",

      budget: 30000000,

      propertyType: "Apartment",

      preferredLocation: "Howrah",

      propertyIdx: 6,

      brokerIdx: 2,

      status: "New",

      priority: "Medium",
    },
  ];

  for (const l of leadData) {
    const property = propertyDocs[l.propertyIdx];
    const broker = brokerDocs[l.brokerIdx];

    if (!property || !broker) {
      console.log(
        `[Seed] Skipping lead because property/broker is missing: ${l.name}`
      );

      continue;
    }

    const listing = listingDocs.find(
      (item) =>
        item.property?.toString() ===
        property._id.toString()
    );

    if (!listing) {
      console.log(
        `[Seed] Listing not found for lead: ${l.name}`
      );

      continue;
    }

    let doc = await Lead.findOne({
      phone: l.phone,
      message: l.message,
    });

    const leadPayload = {
      name: l.name,
      phone: l.phone,
      email: l.email,

      source: l.source,

      message: l.message,

      requirement: l.requirement,

      budget: l.budget,

      propertyType: l.propertyType,

      preferredLocation: l.preferredLocation,

      property: property._id,

      listing: listing._id,

      assignedBroker: broker._id,

      status: l.status,

      priority: l.priority,
    };

    if (!doc) {
      doc = await Lead.create(leadPayload);

      console.log(
        `[Seed] Created Lead for: ${doc.name}`
      );
    } else {
      doc.set(leadPayload);

      await doc.save();

      console.log(
        `[Seed] Updated Lead for: ${doc.name}`
      );
    }
  }

  // ==========================================
  // 7. SEED BOOKINGS
  // ==========================================

  const bookingData = [
    {
      bookingNumber: "BOK-2026-001",

      clientIdx: 0,

      propertyIdx: 2,

      brokerIdx: 0,

      unitNumber: "Tower 2, Unit 1402",

      bookingDate: new Date("2026-02-15"),

      amount: 1000000,

      totalAgreementValue: 18500000,

      bookingAmountPaid: 1000000,

      status: "confirmed",

      paymentStatus: "Paid",

      paymentMethod: "NEFT / RTGS",

      notes:
        "Initial booking advance received for Urban Greens Phase 2.",
    },

    {
      bookingNumber: "BOK-2026-002",

      clientIdx: 1,

      propertyIdx: 3,

      brokerIdx: 1,

      unitNumber: "Tower A, Flat 1204",

      bookingDate: new Date("2026-02-28"),

      amount: 1500000,

      totalAgreementValue: 15700000,

      bookingAmountPaid: 1500000,

      status: "confirmed",

      paymentStatus: "Paid",

      paymentMethod: "Bank Transfer",

      notes:
        "Initial reservation amount received for Shriji Cellesta.",
    },

    {
      bookingNumber: "BOK-2026-003",

      clientIdx: 3,

      propertyIdx: 11,

      brokerIdx: 3,

      unitNumber: "Block B, Flat 804",

      bookingDate: new Date("2026-03-05"),

      amount: 500000,

      totalAgreementValue: 10000000,

      bookingAmountPaid: 500000,

      status: "pending",

      paymentStatus: "Pending",

      paymentMethod: "Cheque Deposit",

      notes:
        "Cheque received and awaiting clearance for Merlin Avana.",
    },
  ];

  for (const bk of bookingData) {
    const client = clientDocs[bk.clientIdx];
    const property = propertyDocs[bk.propertyIdx];
    const broker = brokerDocs[bk.brokerIdx];

    if (!client || !property || !broker) {
      console.log(
        `[Seed] Skipping booking because related data is missing: ${bk.bookingNumber}`
      );

      continue;
    }

    const listing = listingDocs.find(
      (item) =>
        item.property?.toString() ===
        property._id.toString()
    );

    if (!listing) {
      console.log(
        `[Seed] Listing not found for booking: ${bk.bookingNumber}`
      );

      continue;
    }

    let doc = await CrmBooking.findOne({
      bookingNumber: bk.bookingNumber,
    });

    const bookingPayload = {
      bookingNumber: bk.bookingNumber,

      client: client._id,

      clientName: client.name,

      clientPhone: client.phone,

      clientEmail: client.email,

      property: property._id,

      propertyName: property.title,

      listing: listing._id,

      broker: broker._id,

      brokerName: broker.name,

      unitNumber: bk.unitNumber,

      bookingDate: bk.bookingDate,

      amount: bk.amount,

      totalAgreementValue: bk.totalAgreementValue,

      bookingAmountPaid: bk.bookingAmountPaid,

      status: bk.status,

      paymentStatus: bk.paymentStatus,

      paymentMethod: bk.paymentMethod,

      notes: bk.notes,
    };

    if (!doc) {
      doc = await CrmBooking.create(
        bookingPayload
      );

      console.log(
        `[Seed] Created Booking: ${doc.bookingNumber}`
      );
    } else {
      doc.set(bookingPayload);

      await doc.save();

      console.log(
        `[Seed] Updated Booking: ${doc.bookingNumber}`
      );
    }
  }

  // ==========================================
  // FINAL SUMMARY
  // ==========================================

  console.log("\n==========================================");
  console.log("SAHARA CRM SEED COMPLETED");
  console.log("==========================================");

  console.log(`Vendors: ${vendorDocs.length}`);
  console.log(`Brokers: ${brokerDocs.length}`);
  console.log(`Properties: ${propertyDocs.length}`);
  console.log(`Listings: ${listingDocs.length}`);
  console.log(`Clients: ${clientDocs.length}`);
  console.log(`Leads: ${leadData.length}`);
  console.log(`Bookings: ${bookingData.length}`);

  console.log("==========================================\n");

  await mongoose.disconnect();

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);

  process.exit(1);
});