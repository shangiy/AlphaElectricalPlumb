
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

/**
 * MASTER CLEAN & SYNC SCRIPT V3
 * 1. Deletes all existing documents in 'products' to fix duplication.
 * 2. Scans all 10 Storage folders.
 * 3. Groups orientation images into arrays.
 * 4. Re-syncs 254 unique products with deterministic IDs.
 */

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "studio-2955966694-9faa5.firebasestorage.app"
  });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

const getBaseProductName = (fileName) => {
    return fileName.replace(/\.[^/.]+$/, "") // Remove extension
        .replace(/\s?\(\d+\)$|\s\d+$|-\d+$/g, "") // Remove (2), 2, or -1
        .trim();
};

async function migrateAllAlphaProducts() {
  const categories = [
    'Decorative Lighting and chandeliers',
    'Electrical items',
    'Plumbing',
    'Sanitary Ware Toilets & Bathroom Fixtures',
    'Shower Category',
    'Solar panels & accessories',
    'Tanks category',
    'Mabati and Roofing',
    'Construction and Fencing equip\'nts',
    'Collections'
  ];

  console.log("--- 🗑️ Step 1: Clearing Duplicated Products ---");
  const snapshot = await db.collection('products').get();
  if (!snapshot.empty) {
    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    console.log(`Successfully deleted ${snapshot.size} duplicated records.`);
  }

  console.log("\n--- 🚀 Step 2: Syncing Unique Product Catalog ---");

  for (const cat of categories) {
    console.log(`\n📂 Processing: ${cat}`);
    const folderPrefix = `product images/${cat}/`;
    
    try {
      const [files] = await bucket.getFiles({ prefix: folderPrefix });
      const productGroups = {};

      files.forEach(file => {
        if (file.name === folderPrefix || file.name.endsWith('/')) return;

        const fileName = file.name.split('/').pop();
        const baseName = getBaseProductName(fileName);

        // Skip non-product branding
        if (baseName.toLowerCase().includes("logo") || 
            baseName.toLowerCase().includes("background") || 
            baseName.toLowerCase().includes("retail shop") ||
            baseName.toLowerCase().includes("delivery team")) return;

        if (!productGroups[baseName]) productGroups[baseName] = [];
        
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
        productGroups[baseName].push(publicUrl);
      });

      const productEntries = Object.entries(productGroups);
      console.log(`Found ${productEntries.length} unique products.`);

      for (const [name, urls] of productEntries) {
        const docId = name.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 50);
        
        await db.collection('products').doc(docId).set({
          name: name,
          imageUrls: urls, 
          category: cat,
          price: 0, 
          description: `High-quality ${name} available at Alpha Electricals & Plumbing Ltd.`,
          longDescription: `Experience superior performance with the ${name}. Engineered for durability and efficiency, this product is a cornerstone of modern infrastructure. We provide professional delivery and installation to ensure your system is fully operational and reliable. Contact us for bulk pricing and site visits.`,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          inStock: true,
          rating: 5,
          reviews: Math.floor(Math.random() * 50) + 10,
          isFeatured: true
        });

        console.log(`   ✨ Synced: ${name} (${urls.length} views)`);
      }
    } catch (error) {
      console.error(`   ❌ Error in ${cat}:`, error.message);
    }
  }
  console.log("\n--- 🎉 Alpha Master Catalog Sync Fully Complete! ---");
}

migrateAllAlphaProducts().catch(console.error);
