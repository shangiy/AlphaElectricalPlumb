const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "studio-2955966694-9faa5.firebasestorage.app"
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

/**
 * Cleans filenames based on the patterns in your screenshots.
 * Handles: "Product (2).webp", "Product 2.webp", "Product-1.webp"
 */
const getBaseProductName = (fileName) => {
    return fileName.replace(/\.[^/.]+$/, "") // Remove extension
        .replace(/\s?\(\d+\)$|\s\d+$|-\d+$/g, "") // Remove (2), 2, or -1
        .trim();
};

async function migrateAllAlphaProducts() {
  // All categories identified from your Storage folder screenshots
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
    'Collections' // For the group/collection images
  ];

  for (const cat of categories) {
    console.log(`\n--- 📂 Processing Category: ${cat} ---`);
    const folderPrefix = `product images/${cat}/`;
    
    try {
      const [files] = await bucket.getFiles({ prefix: folderPrefix });
      const productGroups = {};

      files.forEach(file => {
        if (file.name === folderPrefix || file.name.endsWith('/')) return;

        const fileName = file.name.split('/').pop();
        const baseName = getBaseProductName(fileName);

        if (!productGroups[baseName]) productGroups[baseName] = [];
        
        // Construct the public URL for the WebP image
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
        productGroups[baseName].push(publicUrl);
      });

      const productEntries = Object.entries(productGroups);
      console.log(`Found ${productEntries.length} unique products in ${cat}.`);

      for (const [name, urls] of productEntries) {
        // Special case for 'Collections' folder
        const collectionPath = cat === 'Collections' ? 'collections' : 'products';
        
        const querySnapshot = await db.collection(collectionPath)
          .where('name', '==', name)
          .get();

        if (!querySnapshot.empty) {
          // Update existing doc
          await querySnapshot.docs[0].ref.update({
            imageUrls: urls,
            category: cat,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          console.log(`   ✅ Updated: ${name}`);
        } else {
          // Create new doc (This will fill your website with all items)
          await db.collection(collectionPath).add({
            name: name,
            imageUrls: urls,
            category: cat,
            price: 0, 
            description: `High-quality ${name} available at Alpha Electricals & Plumbing Ltd.`,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            inStock: true
          });
          console.log(`   ✨ Created: ${name}`);
        }
      }
    } catch (error) {
      console.error(`   ❌ Error in ${cat}:`, error.message);
    }
  }
  console.log("\n--- 🎉 Alpha Catalog Migration Fully Complete! ---");
}

migrateAllAlphaProducts();