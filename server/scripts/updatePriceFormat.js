import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updatePriceFormat() {
  try {
    console.log('Starting price format update...');
    
    // Get all properties
    const properties = await prisma.property.findMany({
      select: {
        id: true,
        price: true,
        title: true
      }
    });
    
    console.log(`Found ${properties.length} properties to update`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const property of properties) {
      try {
        // Check if price is already in the new format
        if (typeof property.price === 'string' && property.price.includes(' ')) {
          console.log(`Property "${property.title}" already has correct format: ${property.price}`);
          skippedCount++;
          continue;
        }
        
        // Convert numeric price to new format
        const numericPrice = parseFloat(property.price);
        
        if (isNaN(numericPrice)) {
          console.log(`Property "${property.title}" has invalid price: ${property.price}`);
          skippedCount++;
          continue;
        }
        
        let newPrice;
        if (numericPrice >= 10000000) {
          // Convert to Crore
          newPrice = `${(numericPrice / 10000000).toFixed(2)} CR`;
        } else if (numericPrice >= 100000) {
          // Convert to Lakh
          newPrice = `${(numericPrice / 100000).toFixed(2)} LAKH`;
        } else {
          // Keep as is for smaller amounts
          newPrice = `${numericPrice.toFixed(2)} LAKH`;
        }
        
        // Update the property
        await prisma.property.update({
          where: { id: property.id },
          data: { price: newPrice }
        });
        
        console.log(`Updated "${property.title}": ${property.price} -> ${newPrice}`);
        updatedCount++;
        
      } catch (error) {
        console.error(`Error updating property "${property.title}":`, error);
        skippedCount++;
      }
    }
    
    console.log(`\nUpdate completed!`);
    console.log(`Updated: ${updatedCount} properties`);
    console.log(`Skipped: ${skippedCount} properties`);
    
  } catch (error) {
    console.error('Error in price format update:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updatePriceFormat()
  .then(() => {
    console.log('Price format update completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Price format update failed:', error);
    process.exit(1);
  }); 