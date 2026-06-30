const Restaurant = require('../models/Restaurant.model');
const AgentSession = require('../models/AgentSession.model');

/**
 * MVP scraper: queries internal Restaurant collection by cuisine.
 * Level 2+ will replace/extend this with real external scraping , abhi ke liyeh hum internal DB se hi scrape karenge.
 */
const runScraperAgent = async (bookingId, cuisine) => {
  // 1. Create the AgentSession to track this run
  const session = await AgentSession.create({
    bookingId,
    status: 'SEARCHING'
  });

  try {
    // 2. "Scrape" — for MVP, query our own DB
    const matches = await Restaurant.find({
      cuisine: { $regex: cuisine, $options: 'i' }
    }).limit(5);

    // 3. Record results, even if empty
    session.scrapedRestaurants = matches.map(r => ({
      restaurantId: r._id,
      name: r.name,
      phone: r.phone,
      rating: r.rating
    }));

    if (matches.length === 0) {
      session.status = 'FAILED';
      await session.save();
      return { success: false, sessionId: session._id, message: 'No matching restaurants found' };
    }

    // Status moves to CALLING — handoff point to BullMQ/caller agent next
    session.status = 'CALLING';
    await session.save();

    return { success: true, sessionId: session._id, matches: session.scrapedRestaurants };
  } catch (err) {
    session.status = 'FAILED';
    await session.save();
    throw err;
  }
};

module.exports = { runScraperAgent };