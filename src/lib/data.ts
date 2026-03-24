


import type { Product, Category, MockUser, Transaction, CarouselCategory } from './types';
import { db } from './firebase';
import { collection, getDocs, doc, getDoc, writeBatch } from 'firebase/firestore';

export const allProductsData: Omit<Product, 'id'>[] = [
  // This is the initial data for seeding only. The app will read from Firestore.
  { name: 'Ample Light', price: 2500, images: ['/Ample Light.png'], description: 'A beautiful and bright ample light with several modes.', longDescription: 'A beautiful and bright ample light, perfect for any room in your house.', category: 'lighting-electrical', rating: 4.5, reviews: 10, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, barcode: 'ALPHA-ELEC-001', colors: ['White', 'Silver'], isFeatured: true, unit: 'item' },
  { name: 'Artistic Lights', price: 3300, images: ['/exquisite chandelier.jpg'], description: 'Unique and stylish artistic lights.', longDescription: 'A collection of unique and stylish artistic lights to make a statement in any room.', category: 'lighting-electrical', rating: 4.6, reviews: 15, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, isFeatured: true, unit: 'item' },
  { name: 'Electric Cable', price: 30, images: ['/Electric cable per roll.jpg'], unit: 'meter', wholesale: { quantity: 100, price: 3000, unit: 'roll' }, description: 'High-quality electric wiring cable.', longDescription: 'High-quality and durable electric wiring cable, available per meter or in a 100m roll for wholesale pricing.', category: 'lighting-electrical', rating: 4.9, reviews: 50, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, colors: ['Black', 'Red', 'Blue', 'Green'], isFeatured: true },
  { name: 'WarmLight wall bracket', price: 1900, images: ['/WarmLight wall bracket.jpg'], description: 'An elegant warm light wall bracket.', longDescription: 'An elegant warm light wall bracket that provides a cozy and inviting ambiance.', category: 'lighting-electrical', rating: 4.5, reviews: 22, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, colors: ['Silver'], isFeatured: true, unit: 'item' },
  { 
    name: 'Kentank 2000L', 
    price: 15000, 
    images: ['/kentank 2000l.png'], 
    description: 'A best-selling 2000L Kentank, renowned for its superior durability. This tank is crafted from high-quality, food-grade material, ensuring your water remains safe and clean.', 
    longDescription: 'Our most popular 2000L Kentank is the perfect solution for reliable domestic water storage. Manufactured from UV-stabilized, food-grade polyethylene, it prevents algae growth and withstands harsh weather conditions, guaranteeing a long-lasting supply of safe water for your family.', 
    category: 'tanks', 
    rating: 4.7, 
    reviews: 45,
    reviewsList: [
        { id: 'rev-1', author: 'Jane D.', rating: 5, comment: 'Excellent quality tank. Very sturdy and the delivery was fast. Highly recommend!', date: '2023-10-15', avatarUrl: '/profile-images/avatar1.png' },
        { id: 'rev-2', author: 'John K.', rating: 4, comment: 'Good tank for the price. The size is perfect for my family. Installation was straightforward.', date: '2023-09-22', avatarUrl: '/profile-images/avatar2.png' },
        { id: 'rev-3', author: 'Mary A.', rating: 5, comment: 'I am very happy with this purchase. Alpha Electricals provided great customer service.', date: '2023-09-18', avatarUrl: '/profile-images/avatar3.png' },
    ],
    seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, 
    colors: ['Black', 'Green'], 
    unit: 'item' 
  },
  { name: 'Kentank 3000L', price: 10000, images: ['/kentanks 3000L.png'], description: 'A large 3000L Kentank for ample water storage. Ideal for both residential and commercial use, providing a dependable water supply.', longDescription: 'Secure your water supply with the large 3000L Kentank, perfect for bigger households or commercial properties. Its robust, UV-stabilized construction ensures longevity and protects your water from the elements, providing peace of mind.', category: 'tanks', rating: 4.8, reviews: 30, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, colors: ['Black', 'Green'], unit: 'item' },
  { name: 'Water Tank', price: 6500, images: ['/cuboidTank.PNG'], description: 'A modern, space-saving cuboid water tank. Its unique shape is perfect for maximizing storage in tight spaces.', longDescription: 'This cuboid water tank is the ultimate solution for urban living or areas where space is a premium. Its clever design allows for easy installation in corners or narrow spaces without compromising on capacity, making it both practical and stylish.', category: 'tanks', rating: 4.5, reviews: 20, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, colors: ['White'], unit: 'item' },
  { name: 'Septic Tank', price: 20000, images: ['/septic Tank.png'], description: 'A highly reliable and robust septic tank for efficient wastewater management. Built with high-strength materials to ensure long-term performance.', longDescription: 'Invest in a worry-free wastewater solution with our reliable and robust septic tank. Engineered for maximum efficiency and durability, it provides an environmentally safe and long-lasting system for your property.', category: 'tanks', rating: 4.9, reviews: 55, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, colors: ['Black'], unit: 'item' },
  { name: 'Reservoir Tank', price: 5000, images: ['/plastic-tank.png'], description: 'A versatile plastic reservoir tank for a wide range of water storage needs. Lightweight, corrosion-resistant, and easy to handle.', longDescription: 'This versatile plastic reservoir is your go-to for various water storage applications, from agricultural use to emergency supplies. Its lightweight yet durable construction makes it easy to transport and install, while its corrosion-resistant properties ensure a long service life.', category: 'tanks', rating: 4.4, reviews: 15, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Top Tank 1500L', price: 4500, images: ['/top tank 1500L.png'], description: 'A compact and affordable 1500L Top Tank. An excellent choice for smaller households or as a supplementary water source.', longDescription: 'The 1500L Top Tank offers an excellent balance of capacity and a compact footprint, making it ideal for smaller households. Made with high-quality, durable plastic, it provides a reliable and affordable water storage solution.', category: 'tanks', rating: 4.6, reviews: 28, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Tank 2000L', price: 5000, images: ['/top tank.png'], description: 'A standard 2000L Top Tank that delivers exceptional value and reliability. Perfect for everyday domestic water storage needs.', longDescription: 'Meet your family\'s daily water needs with the standard 2000L Top Tank. This tank is a household favorite, known for its outstanding value, durability, and reliable performance in all conditions.', category: 'tanks', rating: 4.7, reviews: 35, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Rainwater Harvesting Tank', price: 8000, images: ['/rainwater-tank.png'], description: 'An eco-friendly tank specifically designed for efficient rainwater harvesting. Start conserving water and saving money on your bills.', longDescription: 'Embrace sustainability with our specialized rainwater harvesting tank. It\'s an eco-friendly solution designed to efficiently collect and store rainwater, reducing your reliance on municipal water and lowering your utility bills.', category: 'tanks', rating: 4.8, reviews: 40, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Lamp Assorted Chandelier MarbleMark', price: 4800, images: ['/Lamp Assorted Chandelier MarbleMark.png'], description: 'A stylish chandelier with assorted marble-marked lamps.', longDescription: 'This beautiful chandelier features an assortment of lamps with a unique MarbleMark finish, creating a sophisticated and modern centerpiece for any room.', category: 'decor', rating: 4.7, reviews: 25, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Golden Chandelier', price: 3500, images: ['/golden chandelier.png'], description: 'An elegant golden chandelier for a luxurious touch.', longDescription: 'An elegant golden chandelier for a luxurious touch. Perfect for dining rooms, living rooms, and grand entryways. Features high-quality crystals and a durable gold-finish frame.', category: 'decor', rating: 4.8, reviews: 22, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Rugged Chandelier', price: 5000, images: ['/rugged chandelier.png'], description: 'A stylish rugged chandelier with a modern design.', longDescription: 'A stylish rugged chandelier with a modern design. Its unique industrial look adds character to any space. Made with high-quality materials for longevity.', category: 'decor', rating: 4.7, reviews: 19, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Decorative Square Lights', price: 2800, images: ['/square lights.png'], description: 'Modern and sleek decorative square lights.', longDescription: 'Modern and sleek decorative square lights that provide a minimalist aesthetic. Energy-efficient LED technology ensures bright light with low power consumption.', category: 'decor', rating: 4.6, reviews: 31, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Birds Lights', price: 1900, images: ['/birds lights.png'], description: 'Whimsical bird-shaped decorative lights.', longDescription: 'Add a touch of nature and whimsy to your room with these charming bird-shaped lights. Perfect for nurseries, bedrooms, or any space that needs a creative flair.', category: 'decor', rating: 4.9, reviews: 40, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Pinkish Sink', price: 3000, images: ['/pinkish sink.png'], description: 'A chic and modern pinkish sink.', longDescription: 'Make a bold statement in your bathroom with this chic and modern pinkish sink. Made from high-quality ceramic, it is both durable and stylish.', category: 'decor', rating: 4.5, reviews: 15, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Bathroom Makeover Sink', price: 7500, images: ['/Bathroom makeOver Sink.png'], description: 'Complete sink unit for a bathroom makeover.', longDescription: 'A complete sink and vanity unit to instantly upgrade your bathroom. Includes a modern basin, faucet, and storage cabinet. Easy to install.', category: 'decor', rating: 4.8, reviews: 25, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Monkey Lights', price: 4000, images: ['/monkey lights.png'], description: 'Playful and unique monkey-themed lights.', longDescription: 'Bring a sense of fun and adventure to your decor with these playful monkey-themed lights. A great conversation starter and a unique piece of functional art.', category: 'decor', rating: 4.7, reviews: 18, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Golden Layers Chandelier', price: 4000, images: ['/golden layers.jpg'], description: 'A stunning chandelier with golden layers.', longDescription: 'This stunning chandelier features multiple golden layers that create a captivating light effect. A perfect statement piece for modern and classic interiors.', category: 'decor', rating: 4.8, reviews: 19, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'PinkOval Frencia Toilet', price: 8500, images: ['/PinkOval Frencia toilet.jpg'], description: 'A unique pink oval frencia toilet.', longDescription: 'Add a splash of color and unique style to your bathroom with this pink oval frencia toilet. Combines a distinctive look with modern, water-saving functionality.', category: 'decor', rating: 4.6, reviews: 12, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Designer single-Unit Toilet', price: 29500, images: ['/Designer singleUnit toilet.jpg'], description: 'A high-end designer single-unit toilet.', longDescription: 'Experience luxury with this high-end designer single-unit toilet. Its seamless design and premium features offer superior comfort and performance.', category: 'decor', rating: 5, reviews: 8, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Striped Chandelier', price: 8000, images: ['/Striped Chandelier.jpg'], description: 'A modern chandelier with a striped design.', longDescription: 'This modern chandelier features a unique striped design that makes it a focal point in any room. Provides ample lighting while being a work of art.', category: 'decor', rating: 4.7, reviews: 14, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Decor large Chandelier', price: 14500, images: ['/Decor large Chandelier.jpg'], description: 'A large and impressive decorative chandelier.', longDescription: 'Make a grand statement with this large decorative chandelier. Its intricate design and impressive size are perfect for spaces with high ceilings.', category: 'decor', rating: 4.9, reviews: 20, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'classic chandelier', price: 2500, images: ['/classic chandelier.png'], description: 'A timeless and classic chandelier.', longDescription: 'This timeless chandelier brings classic elegance to any home. Its graceful design and warm light create a welcoming atmosphere.', category: 'decor', rating: 4.6, reviews: 45, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Stylish mirror', price: 2000, images: ['/Stylish mirror.jpg'], description: 'A stylish mirror to enhance your decor.', longDescription: 'Enhance your decor with this stylish mirror. Its modern frame and high-quality reflection make it a perfect addition to any room, from entryways to bathrooms.', category: 'decor', rating: 4.5, reviews: 33, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: '5-Lamp Chandelier General', price: 5100, images: ['/5 Lamp Chandelier General.png'], description: 'A general-purpose 5-lamp chandelier.', longDescription: 'A versatile 5-lamp chandelier that provides ample light and fits well in a variety of settings. A practical and stylish lighting solution.', category: 'lighting-electrical', rating: 4.7, reviews: 28, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'hexagonal decor light', price: 3800, images: ['/hexagonal decor light.jpg'], description: 'A modern hexagonal decorative light fixture.', longDescription: 'This modern decorative light features a trendy hexagonal design. It can be used alone or grouped together to create a custom lighting installation.', category: 'lighting-electrical', rating: 4.8, reviews: 15, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Round smart mirror', price: 4500, images: ['/Round smart mirror.jpg'], description: 'A round smart mirror with LED lighting.', longDescription: 'Upgrade your bathroom with this round smart mirror. It features integrated LED lighting with adjustable brightness and an anti-fog function.', category: 'decor', rating: 4.9, reviews: 25, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Stunning mirror', price: 1000, images: ['/Stunning mirror.jpg'], description: 'A stunning mirror with a unique frame.', longDescription: 'This stunning mirror features a unique and eye-catching frame that makes it a piece of wall art. Perfect for adding a decorative touch to any space.', category: 'decor', rating: 4.7, reviews: 30, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Ceiling 3mode light', price: 6500, images: ['/Ceiling 3mode light.jpg'], description: 'A ceiling light with 3 different light modes.', longDescription: 'This versatile ceiling light offers three different light modes (e.g., warm, cool, and neutral) to suit any mood or occasion. Sleek, modern, and energy-efficient.', category: 'lighting-electrical', rating: 4.8, reviews: 22, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'square toilet', price: 29000, images: ['/square toilet.jpg'], description: 'A modern, geometric square toilet.', longDescription: 'This toilet features a bold, geometric square design for a distinctly modern bathroom. Includes a soft-close seat and efficient dual-flush system.', category: 'decor', rating: 4.9, reviews: 10, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Designer sink', price: 3500, images: ['/Designer sink.jpg'], description: 'A designer sink with a unique shape.', longDescription: 'This designer sink stands out with its unique shape and high-quality finish. It serves as a functional sculpture for your bathroom countertop.', category: 'decor', rating: 4.7, reviews: 18, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'plumbing pipe', price: 200, unit: 'meter', images: ['/ppr pipes.png'], description: 'High-quality plumbing pipes.', longDescription: 'Durable and reliable plumbing pipes suitable for a variety of residential and commercial applications. Available per meter or in bulk rolls.', category: 'plumbing', rating: 4.8, reviews: 80, seller: { name: 'Alpha Electricals', id: 'seller-alpha' } },
  { name: 'PPR elbows', price: 100, images: ['/pipe elbows.png'], description: 'Durable PPR elbows for pipe fitting.', longDescription: 'High-quality PPR elbows for changing pipe direction. Designed for a secure, leak-proof fit.', category: 'plumbing', rating: 4.9, reviews: 150, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: '20mm Bend SWAMI', price: 10, images: ['/20mm Bend SWAMI.png', '/20mm Bend SWAMI..png'], description: 'A 20mm pipe bend for plumbing applications.', longDescription: 'A high-quality 20mm pipe bend from SWAMI, designed for durable and leak-proof plumbing connections. Essential for navigating corners in pipework.', category: 'plumbing', rating: 4.9, reviews: 300, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, barcode: '16386', isFeatured: false, unit: 'item' },
  { name: 'Tee PPR connector', price: 50, images: ['/Tee PPR connector.png'], description: 'A reliable Tee PPR connector.', longDescription: 'A T-shaped connector for joining three pipes. Made from high-grade PPR for durability and heat resistance.', category: 'plumbing', rating: 4.9, reviews: 200, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'plumbing valve', price: 1500, images: ['/ppr pipe fittings.png'], description: 'A robust valve for plumbing systems.', longDescription: 'A durable plumbing valve to control water flow. Features easy operation and a long service life.', category: 'plumbing', rating: 4.7, reviews: 95, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'PPR pipe roll', price: 8000, images: ['/100m PPR roll.png'], description: 'A 100m roll of PPR pipe.', longDescription: 'A 100-meter roll of flexible and durable PPR pipe, suitable for large-scale plumbing installations.', category: 'plumbing', rating: 4.8, reviews: 60, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'roll' },
  { name: 'HDPE 100M PIPE PN6 50mm', price: 12000, images: ['/HDPE 100M PIPE.jpg'], description: '100m of 50mm HDPE pipe.', longDescription: 'High-density polyethylene pipe, 100 meters long and 50mm in diameter, suitable for high-pressure applications.', category: 'plumbing', rating: 4.9, reviews: 40, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'roll' },
  { name: 'PVC Waste Pipes 6 In', price: 3500, images: ['/PVC Waste Pipes 6 In .jpg'], description: '6-inch PVC pipes for waste management.', longDescription: 'Durable 6-inch PVC pipes designed for waste and drainage systems. Resistant to chemicals and corrosion.', category: 'plumbing', rating: 4.6, reviews: 70, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Danco Hosepipe', price: 20, images: ['/Danco Hosepipe.jpg'], unit: 'meter', wholesale: { quantity: 100, price: 2000, unit: 'roll'}, description: 'A flexible and durable Danco hosepipe.', longDescription: 'A high-quality hosepipe from Danco, perfect for gardening and other outdoor uses. Kink-resistant and built to last. Available per meter or in 100m rolls.', category: 'plumbing', rating: 4.5, reviews: 85, seller: { name: 'Alpha Electricals', id: 'seller-alpha' } },
  { name: 'Pillar Water tap', price: 1500, images: ['/Pillar taps.jpg'], description: 'A classic pillar water tap.', longDescription: 'A classic and elegant pillar tap with a chrome finish. Easy to install and use, suitable for any bathroom or kitchen.', category: 'plumbing', rating: 4.7, reviews: 110, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Sensor taps with On Off touchpad', price: 8000, images: ['/Sensor taps with On Off touchpad.Jpg'], description: 'Modern sensor taps with a touchpad.', longDescription: 'A touchless sensor tap for improved hygiene. Features a convenient on/off touchpad for manual operation.', category: 'plumbing', rating: 4.9, reviews: 55, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Bathroom wall decor and accessory', price: 560, images: ['/Bathroom wall decor and accessory.jpg'], description: 'Stylish bathroom wall accessory.', longDescription: 'A stylish and functional accessory for your bathroom wall, perfect for holding towels or other items.', category: 'plumbing', rating: 4.4, reviews: 130, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'standing Sink', price: 5800, images: ['/standing Sink.png'], description: 'A modern freestanding sink.', longDescription: 'A stylish freestanding sink that makes a statement in any bathroom. Made from high-quality ceramic.', category: 'plumbing', rating: 4.7, reviews: 65, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Square sink', price: 6500, images: ['/Square sink.jpg'], description: 'A geometric square sink.', longDescription: 'A modern sink with a sharp, geometric design. Perfect for contemporary bathrooms.', category: 'plumbing', rating: 4.8, reviews: 75, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'grey sink', price: 4500, images: ['/grey sink.png'], description: 'A stylish sink in a grey finish.', longDescription: 'A chic and modern sink in a trendy grey finish. We also offer installation services for an additional fee.', category: 'plumbing', rating: 4.6, reviews: 90, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'toilet designs', price: 2500, images: ['/toilet designs.jpg'], description: 'Decorative toilet seat designs.', longDescription: 'A variety of decorative toilet seat designs to add a personal touch to your bathroom.', category: 'plumbing', rating: 4.5, reviews: 120, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Black round shower head', price: 7500, images: ['/Black round shower head.jpg'], description: 'A sleek black round shower head.', longDescription: 'A modern, oversized round shower head in a matte black finish for a luxurious shower experience.', category: 'plumbing', rating: 4.9, reviews: 88, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Black n-type WaterTap', price: 6500, images: ['/Black n-type tap.jpg'], description: 'An elegant black n-type water tap.', longDescription: 'An elegant water tap with a unique N-type design and a stylish matte black finish.', category: 'plumbing', rating: 4.8, reviews: 92, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Black elegant watertap', price: 2500, images: ['/Black elegant watertap.jpg'], description: 'A stylish and elegant black water tap.', longDescription: 'A sleek and minimalist water tap in matte black, perfect for modern kitchens and bathrooms.', category: 'plumbing', rating: 4.7, reviews: 115, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Double sink with tap', price: 11000, images: ['/Double sink with tap.jpg'], description: 'A practical double sink with a tap.', longDescription: 'A spacious and practical double sink for your kitchen, complete with a modern tap. Made from durable stainless steel.', category: 'plumbing', rating: 4.8, reviews: 105, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Ironsheet Mabati', price: 1200, images: ['/red-roofing.png', '/i3248384242630508828.png', '/Ironsheet_Mabati.jpg', '/Roofing Nails.png'], description: 'Durable ironsheet mabati for roofing.', longDescription: 'High-quality, galvanized ironsheet mabati designed to withstand harsh weather conditions. Available per meter.', category: 'roofing', rating: 4.8, reviews: 150, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'meter' },
  { name: 'MDF & Chipboard', price: 5400, images: ['/MDF & chipboard.png'], description: 'Versatile MDF and chipboard sheets.', longDescription: 'High-quality MDF and chipboard sheets suitable for a variety of construction and furniture-making applications.', category: 'roofing', rating: 4.6, reviews: 95, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'sheet' },
  { name: 'Stylish Granites', price: 1500, images: ['/stylish granites.png'], description: 'Stylish granites for countertops.', longDescription: 'Elegant and durable granite slabs, perfect for creating stunning kitchen countertops and bathroom vanities. Available per square meter.', category: 'roofing', rating: 4.9, reviews: 75, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'sq. meter' },
  { name: 'Easy Installation Fence', price: 4500, images: ['/green fencing.png'], description: 'Easy-to-install fencing solution.', longDescription: 'A complete fencing solution that is easy to install. Ideal for garden perimeters and property boundaries. Available per roll.', category: 'roofing', rating: 4.6, reviews: 65, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'roll' },
  { name: 'Manhole Covers', price: 2500, images: ['/manhole covers.png'], description: 'Heavy-duty manhole covers.', longDescription: 'Heavy-duty and secure manhole covers for various applications. Designed for durability and safety.', category: 'roofing', rating: 4.8, reviews: 90, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Gutter Systems', price: 1800, images: ['/rainwater gutters.png'], description: 'Complete rainwater gutter systems.', longDescription: 'Efficient and durable gutter systems to manage rainwater and protect your building\'s foundation. Includes all necessary fittings.', category: 'roofing', rating: 4.7, reviews: 110, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'meter' },
  { name: 'Dynamic Sink', price: 3200, images: ['/dynamic sink.png'], description: 'A dynamic and modern utility sink.', longDescription: 'A versatile and modern utility sink, suitable for laundry rooms, workshops, or outdoor kitchens. Made from high-impact materials.', category: 'roofing', rating: 4.5, reviews: 50, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Durable Countertops', price: 2000, images: ['/durable countertops.png'], description: 'Highly durable countertops for various uses.', longDescription: 'Highly durable and scratch-resistant countertops, perfect for high-traffic areas like kitchens and workshops. Available per square meter.', category: 'roofing', rating: 4.8, reviews: 85, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'sq. meter' },
  { name: 'Yale Door Locks 4L-22934', price: 9095, images: ['/yale door locks  4L-22934-LS.png'], description: 'High-security Yale door locks.', longDescription: 'Ensure your property is secure with this high-security Yale door lock, model 4L-22934. Known for its reliability and anti-pick features.', category: 'roofing', rating: 4.9, reviews: 130, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Union Locks 4L-22934-LS', price: 9095, images: ['/4L-22934-LS union.png'], description: 'Dependable Union brand door locks.', longDescription: 'A dependable and robust Union door lock, model 4L-22934-LS. Provides excellent security for residential and commercial properties.', category: 'roofing', rating: 4.9, reviews: 125, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Aesthetic Lights', price: 1200, images: ['/aesthetic Light.png'], description: 'Beautiful aesthetic lights.', longDescription: 'Beautiful aesthetic lights to create the perfect mood in any room.', category: 'lighting-electrical', rating: 4.7, reviews: 40, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'Crystal Chandelier', price: 1500, images: ['/crystall chanderlier.png'], description: 'Elegant crystal chandelier.', longDescription: 'An elegant crystal chandelier that adds a touch of class to your home.', category: 'lighting-electrical', rating: 4.8, reviews: 35, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'curvy blue light', price: 3500, images: ['/curvy blue light.jpg'], description: 'A modern ceiling light with a curvy design.', longDescription: 'A modern ceiling light with a unique curvy blue design.', category: 'lighting-electrical', rating: 4.6, reviews: 25, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'IFLUX WATER HEATER SWITCH Minimalist WHITE 45A', price: 415, oldPrice: 435, images: ['/IFLUXsocket.png'], description: 'A minimalist 45A water heater switch from IFLUX.', longDescription: 'A high-quality and reliable 45A water heater switch from IFLUX, featuring a clean, minimalist white design that blends seamlessly into modern interiors.', category: 'lighting-electrical', rating: 4.9, reviews: 180, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, barcode: '16496', isFeatured: false, unit: 'item' },
  { name: 'IFLUX Water Heater Switch (gold)', price: 555, images: ['/IFLUX WATER HEATER SWITCH 45 Amp (gold).png'], description: '45 Amp water heater switch in gold.', longDescription: 'A stylish and reliable 45 Amp water heater switch from IFLUX in a gold finish.', category: 'lighting-electrical', rating: 4.8, reviews: 75, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: '2FT vellmax Flat Tube 25w', price: 490, images: ['/2FT vellmax Flat Tube 25w.png'], description: 'A 2ft, 25w flat tube light.', longDescription: 'A 2-foot, 25-watt flat tube light from Vellmax, providing bright and efficient lighting.', category: 'lighting-electrical', rating: 4.7, reviews: 90, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: '20W Vellmax Tracklight', price: 1200, images: ['/tracklight-vellmax-20w.png'], description: 'A sleek 20W tracklight from Vellmax.', longDescription: 'A sleek and powerful 20W LED tracklight from Vellmax, perfect for accent lighting and highlighting features in any modern space. Easy to install and adjust.', category: 'lighting-electrical', rating: 4.8, reviews: 45, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, barcode: 'ALPHA-ELEC-TRCK-01', unit: 'item' },
  { name: 'TLAC ELECTRIC BOOSTER PUMP DCM190', price: 19800, images: ['/TLAC ELECTRIC BOOSTER PUMP DCM190.jpg'], description: 'A powerful electric booster pump.', longDescription: 'The TLAC DCM190 electric booster pump ensures consistent water pressure throughout your home.', category: 'lighting-electrical', rating: 4.9, reviews: 60, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: '3 GANG IFLUX  FLOUR SERIES SWH3G2-14', price: 360, images: ['/3 GANG IFLUX  FLOUR SERIES SWH3G2-14.png'], description: 'A 3-gang switch from the IFLUX Flour series.', longDescription: 'A stylish and durable 3-gang switch from the IFLUX Flour series, model SWH3G2-14.', category: 'lighting-electrical', rating: 4.8, reviews: 120, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'IFLUX 2 GANG SWITCH', price: 250, images: ['/IFLUX 2 GANG SWITCH.png'], description: 'A 2-gang switch from IFLUX.', longDescription: 'A reliable and easy-to-install 2-gang switch from IFLUX.', category: 'lighting-electrical', rating: 4.8, reviews: 130, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: '45A IFLUX WATER HEATER SWITCH', price: 415, images: ['/45A IFLUX WATER HEATER SWITCH.png'], description: 'A 45A water heater switch.', longDescription: 'A standard 45A water heater switch from IFLUX, built for safety and durability.', category: 'lighting-electrical', rating: 4.9, reviews: 100, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, unit: 'item' },
  { name: 'IFLUX 1 GANG SWITCH', price: 150, images: ['/IFLUX 1 GANG SWITCH.png'], description: 'A 1-gang switch from IFLUX.', longDescription: 'A simple and effective 1-gang switch from IFLUX.', category: 'lighting-electrical', rating: 4.8, reviews: 200, seller: { name: 'Alpha Electricals', 'id': 'seller-alpha' }, unit: 'item' },
  { name: 'Tronic 1gang switch', price: 250, images: ['/Tronic 1gang switch.jpg'], description: 'A 1-gang switch from Tronic.', longDescription: 'A high-quality 1-gang switch from Tronic, known for its sleek design.', category: 'lighting-electrical', rating: 4.7, reviews: 180, seller: { name: 'Alpha Electricals', 'id': 'seller-alpha' }, unit: 'item' },
  { name: 'Tronic 2 gang switch', price: 360, images: ['/Tronic 2 gang switch.jpg'], description: 'A 2-gang switch from Tronic.', longDescription: 'A durable and stylish 2-gang switch from Tronic.', category: 'lighting-electrical', rating: 4.7, reviews: 160, seller: { name: 'Alpha Electricals', 'id': 'seller-alpha' }, unit: 'item' },
  { name: 'Tronic 3Gang switch', price: 450, images: ['/Tronic 3Gang switch.jpg'], description: 'A 3-gang switch from Tronic.', longDescription: 'A versatile 3-gang switch from Tronic, perfect for any room.', category: 'lighting-electrical', rating: 4.7, reviews: 140, seller: { name: 'Alpha Electricals', 'id': 'seller-alpha' }, unit: 'item' },
  { name: 'Tronic 4 gang switch', price: 150, images: ['/Tronic 4 gang switch.jpg'], description: 'A 4-gang switch from Tronic.', longDescription: 'A 4-gang switch from Tronic, offering control over multiple light sources.', category: 'lighting-electrical', rating: 4.7, reviews: 125, seller: { name: 'Alpha Electricals', 'id': 'seller-alpha' }, unit: 'item' },
  { name: '4FT EARTHROD', price: 280, images: ['/4FT EARTHROD.jpg'], description: 'A 4-foot copper earthrod.', longDescription: 'A 4-foot copper earthrod for effective electrical grounding.', category: 'lighting-electrical', rating: 4.9, reviews: 250, seller: { name: 'Alpha Electricals', 'id': 'seller-alpha' }, unit: 'item' },
  { name: '3 GANG IFLUX  FLOUR SERIES SWH3G2-14 (Black)', price: 360, images: ['/3 GANG IFLUX  FLOUR SERIES SWH3G2-14.jpg'], description: 'A 3-gang switch in black.', longDescription: 'A sleek, black 3-gang switch from the IFLUX Flour series.', category: 'lighting-electrical', rating: 4.8, reviews: 110, seller: { name: 'Alpha Electricals', 'id': 'seller-alpha' }, unit: 'item' },
  { name: '300w New Streetlight 58300', price: 8000, images: ['/300w New Streetlight 58300 .jpg'], description: 'A 300W new model streetlight.', longDescription: 'A powerful 300W streetlight, model 58300, for excellent outdoor illumination.', category: 'lighting-electrical', rating: 4.9, reviews: 80, seller: { name: 'Alpha Electricals', 'id': 'seller-alpha' }, unit: 'item' },
  { name: '3w WarmWhite FAME V-LIKE HOME WWHT PENDANT', price: 4050, images: ['/3w WarmWhite FAME V-LIKE shaped HOME PENDANT.png'], description: 'A stylish 3w V-Like home pendant light.', longDescription: 'A stylish and energy-efficient 3-watt WarmWhite FAME V-LIKE HOME WWHT PENDANT light. Perfect for modern home interiors.', category: 'lighting-electrical', rating: 4.8, reviews: 65, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, barcode: '16466', unit: 'item' },
  { name: 'PPR MALE ADAPTOR 50MM*1/2', price: 280, images: ['/PPR MALE ADAPTOR 50MM (half inche).jpg'], description: 'A durable PPR male adaptor for 50mm pipes.', longDescription: 'A high-quality PPR male adaptor for connecting 50mm pipes to 1/2 inch threaded fittings. Ensures a secure, leak-proof connection in plumbing systems.', category: 'plumbing', rating: 4.8, reviews: 120, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, barcode: 'PPR-MA-50', isFeatured: false, unit: 'item' },
  { name: 'Full Bora 4" moshefa', price: 3000, images: ['/moshefa 4" Full Bora-arial.png', '/moshefa 4" Full Bora.png'], description: 'A complete 4" moshefa toilet cistern mechanism.', longDescription: 'A complete "Full Bora" 4-inch moshefa toilet cistern internal mechanism. Includes flush valve and fill valve for a full replacement or upgrade.', category: 'plumbing', rating: 4.7, reviews: 95, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, barcode: 'FB-CIST-4', isFeatured: false, unit: 'item' },
  { name: '2L Classic water bottle', price: 1315, oldPrice: 1370, images: ['/2L Classic water bottle.png'], description: 'A classic 2-liter water bottle, durable and perfect for daily hydration.', longDescription: 'A classic 2-liter water bottle, durable and perfect for daily hydration. Comes with a secure cap and a convenient handle.', category: 'decor', rating: 4.6, reviews: 88, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, barcode: '16414', isFeatured: false, unit: 'item' },
  { name: '2 Pin Connectors Optonica PETOM', price: 300, oldPrice: 350, images: ['/2 Pin Connectors Optonica PETOM.png', '/2 Pin Connectors Optonica PETOM..png'], description: 'Reliable 2-pin connectors from Optonica PETOM.', longDescription: 'A pack of reliable and easy-to-use 2-pin electrical connectors from Optonica PETOM. Ensures a safe and secure connection for your wiring projects.', category: 'lighting-electrical', rating: 4.7, reviews: 150, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, barcode: '16352', isFeatured: false, unit: 'item' },
  { name: 'KS1010 – 4 Way Concealed Brass Shower Mixer – Shower & Tap', price: 11640, images: ['/KS1010 – 4 Way Concealed Brass Shower Mixer – Shower & Tap.png', '/KS1010 – 4 Way Concealed Brass Shower Mixer – Shower & Tap, 2.png', '/KS1010 – 4 Way Concealed Brass Shower Mixer – Shower & Tap 3.png'], description: 'A 4-way concealed brass shower mixer.', longDescription: 'The KS1010 is a 4-way concealed brass shower mixer, combining both shower and tap functions in one elegant, space-saving unit.', category: 'plumbing', rating: 4.9, reviews: 60, seller: { name: 'Alpha Electricals', id: 'seller-alpha' }, barcode: '2186484', isFeatured: false, unit: 'item' },
];
  
export const categories: Category[] = [
    { id: 'tanks', name: 'Tanks' },
    { id: 'plumbing', name: 'Plumbing' },
    { id: 'lighting-electrical', name: 'Lighting & Electrical' },
    { id: 'decor', name: 'Home & Decor' },
    { id: 'roofing', name: 'Roofing & Construction' },
];

export const carouselCategories: CarouselCategory[] = [
    { id: 'tanks', name: 'Tanks', href: '/tanks', image: '/kentank 2000l.png'},
    { id: 'plumbing', name: 'Plumbing', href: '/plumbing', image: '/ppr pipes.png'},
    { id: 'lighting', name: 'Lighting & Electrical', href: '/lighting', image: '/decor lighting design.png'},
    { id: 'decor', name: 'Home & Decor', href: '/decor', image: '/square lights.png'},
    { id: 'roofing', name: 'Roofing & Construction', href: '/roofing', image: '/roof 2.png'},
];

let allUsers: MockUser[] = [
  { id: 'user-1', name: 'Admin User', username: 'admin', email: 'admin@example.com', password: 'adminpassword', role: 'admin', avatarUrl: '/ample-light-product.jpg', signedUp: '2023-01-15T10:00:00Z', lastSeen: '2023-10-26T12:00:00Z', orders: 15, visitDuration: 25 },
  { id: 'user-2', name: 'Staff User', username: 'staff', email: 'staff@example.com', password: 'staffpassword', role: 'staff', avatarUrl: 'https://placehold.co/100x100.png', signedUp: '2023-02-20T11:30:00Z', lastSeen: '2023-10-25T18:45:00Z', orders: 8, visitDuration: 15 },
  { id: 'user-3', name: 'Charlie Brown', username: 'charlieb', email: 'charlie@example.com', password: 'password123', role: 'user', signedUp: '2023-03-10T09:00:00Z', lastSeen: '2023-10-26T09:30:00Z', orders: 3, visitDuration: 10 },
  { id: 'user-4', name: 'Diana Miller', username: 'dianam', email: 'diana@example.com', password: 'password123', role: 'user', signedUp: '2023-04-05T14:00:00Z', lastSeen: '2023-10-26T14:20:00Z', orders: 0, visitDuration: 5 },
  { id: 'user-5', name: 'Ethan Davis', username: 'ethand', email: 'ethan@example.com', password: 'password123', role: 'user', signedUp: '2023-05-22T16:00:00Z', lastSeen: '2023-10-22T10:10:00Z', orders: 20, visitDuration: 45 },
];

let allTransactions: Transaction[] = [
  { id: 'txn-1', customerName: 'Admin User', email: 'admin@example.com', amount: 15000, date: '2023-10-25T14:48:00Z', status: 'Completed', productName: 'Kentank 2000L' },
  { id: 'txn-2', customerName: 'Staff User', email: 'staff@example.com', amount: 3300, date: '2023-10-24T10:20:00Z', status: 'Completed', productName: 'Artistic Lights' },
  { id: 'txn-3', customerName: 'Charlie Brown', email: 'charlie@example.com', amount: 7500, date: '2023-10-26T09:35:00Z', status: 'Pending', productName: 'Bathroom Makeover Sink' },
  { id: 'txn-4', customerName: 'Ethan Davis', email: 'ethan@example.com', amount: 1200, date: '2023-10-21T11:00:00Z', status: 'Failed', productName: 'Ironsheet Mabati' },
  { id: 'txn-5', customerName: 'Admin User', email: 'admin@example.com', amount: 8000, date: '2023-09-15T18:00:00Z', status: 'Completed', productName: 'Rainwater Harvesting Tank' },
];

export const availableAvatars: { url: string; alt: string }[] = [
  { url: '/profile-images/richard-kinyungu.jpg', alt: 'Richard Kinyungu' },
  { url: '/profile-images/peter-karanja.jpg', alt: 'Peter Karanja' },
  { url: '/profile-images/miriam-njeri.jpg', alt: 'Miriam Njeri' },
  { url: '/profile-images/val.jpg', alt: 'Val' },
  { url: '/profile-images/shangi.jpg', alt: 'Shangi' },
  { url: '/profile-images/avatar1.png', alt: 'Avatar 1' },
  { url: '/profile-images/avatar2.png', alt: 'Avatar 2' },
  { url: '/profile-images/avatar3.png', alt: 'Avatar 3' },
  { url: '/profile-images/avatar4.png', alt: 'Avatar 4' },
  { url: '/profile-images/avatar5.png', alt: 'Avatar 5' },
  { url: '/profile-images/avatar6.png', alt: 'Avatar 6' },
  { url: '/profile-images/avatar7.png', alt: 'Avatar 7' },
  { url: '/profile-images/avatar8.png', alt: 'Avatar 8' },
];


let hasSeeded = false;

export async function seedProducts() {
  if (hasSeeded) return;

  try {
    const productsCollection = collection(db, "products");
    const snapshot = await getDocs(productsCollection);
    
    if (snapshot.empty) {
      console.log('Firestore is empty. Seeding initial products...');
      const batch = writeBatch(db);
      allProductsData.forEach((product) => {
        const docRef = doc(productsCollection);
        batch.set(docRef, product);
      });
      await batch.commit();
      console.log('Seeding complete.');
    } else {
      console.log('Firestore already contains data. Skipping seed.');
    }
    hasSeeded = true;
  } catch (error) {
    console.error("Error seeding products (may be due to security rules, this is okay for local dev):", error);
    hasSeeded = true;
  }
}

// Public function to get all products. Now handled by ProductProvider.
// Kept for other potential uses, but pages should use the provider.
export async function getProducts(): Promise<Product[]> {
  try {
    const productsCollection = collection(db, "products");
    const snapshot = await getDocs(productsCollection);
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    }
  } catch (error) {
    console.warn(`Could not fetch from Firestore, falling back to local data. Error: ${error}`);
  }
  
  // Fallback to local data
  return allProductsData.map((p, index) => ({
      ...p,
      id: `local-${p.name.replace(/\s+/g, '-')}-${index}`
  }));
}


// ---- Mock Data Functions ----
// These functions simulate database interactions for users and transactions.

export async function getCategories(): Promise<Category[]> {
  // In a real app, this might be fetched from a 'categories' collection in Firestore
  // For now, we return the local constant.
  return Promise.resolve(categories);
}

export async function getUsers(): Promise<MockUser[]> {
  return Promise.resolve(allUsers);
}

export async function getUserByEmail(email: string): Promise<MockUser | undefined> {
  return Promise.resolve(allUsers.find(user => user.email === email));
}

export async function signUpUser(userData: { name: string; username: string; email: string; password?: string, avatarUrl?: string }): Promise<MockUser> {
    const existingUser = allUsers.find(u => u.email === userData.email);
    if (existingUser) {
        throw new Error("User with this email already exists.");
    }
    
    const newUser: MockUser = {
        id: `user-${allUsers.length + 1}`,
        ...userData,
        role: 'user', // default role
        signedUp: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        orders: 0,
        visitDuration: 0,
    };
    allUsers.push(newUser);
    return Promise.resolve(newUser);
}


export async function getTransactions(): Promise<Transaction[]> {
  return Promise.resolve(allTransactions);
}

export function getLightingProducts() {
  return allProductsData.filter(product => product.category === 'lighting-electrical');
}
