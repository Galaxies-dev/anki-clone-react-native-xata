import express from 'express';
import dotenv from 'dotenv';
import { SetsRecord, getXataClient } from './xata';
import { cardsCapitals, cardsProgramming, sets } from './seed_database';

dotenv.config();

const { PORT } = process.env;

const app = express();
app.use(express.json({ limit: '50mb' }));

const client = getXataClient();

// Only for inserting our initial data!
app.get('/init', async (req, res) => {
  const seedSets = sets;
  const seedCardsCapitals = cardsCapitals;
  const seedCardsProgramming = cardsProgramming;

  await client.db.sets.create(seedSets);
  await client.db.cards.create(seedCardsCapitals);
  await client.db.cards.create(seedCardsProgramming);
  return res.json({ success: true });
});

// Create a new set
app.post('/sets', async (req, res) => {
  const { title, description, private: isPrivate, creator, image } = req.body;

  const set = await client.db.sets.create({
    title,
    description,
    private: isPrivate,
    creator,
    image: image ? { base64Content: image, mediaType: 'image/png', enablePublicUrl: true } : null,
  });
  console.log('set: ', set);

  return res.json(set);
});

// Get all sets
app.get('/sets', async (req, res) => {
  const sets = await client.db.sets
    .select(['id', 'title', 'description', 'image', 'cards'])
    .filter({ private: false })
    .getAll();
  return res.json(sets);
});

// Get a single set
app.get('/sets/:id', async (req, res) => {
  const { id } = req.params;
  const set = await client.db.sets.read(id);
  return res.json(set);
});

// Remove a set
app.delete('/sets/:id', async (req, res) => {
  const { id } = req.params;
  const existingSets = await client.db.user_sets.filter({ set: id }).getAll();

  if (existingSets.length > 0) {
    const toDelete = existingSets.map((set: SetsRecord) => set.id);
    await client.db.user_sets.delete(toDelete);
  }
  await client.db.sets.delete(id);

  return res.json({ success: true });
});

// Add a set to user favorites
app.post('/usersets', async (req, res) => {
  const { user, set } = req.body;
  const userSet = await client.db.user_sets.create({
    user,
    set,
  });
  return res.json(userSet);
});

// Get all user sets
app.get('/usersets', async (req, res) => {
  const { user } = req.query;

  const sets = await client.db.user_sets
    .select(['id', 'set.*'])
    .filter({ user: `${user}` })
    .getAll();
  return res.json(sets);
});

// Create a new card
app.post('/cards', async (req, res) => {
  const { set, question, answer } = req.body;
  const card = await client.db.cards.create({
    set,
    question,
    answer,
  });

  if (card) {
    await client.db.sets.update(set, {
      cards: {
        $increment: 1,
      },
    });
  }
  return res.json(card);
});

// Get all cards of a set
app.get('/cards', async (req, res) => {
  const { setid } = req.query;
  const cards = await client.db.cards.select(['*', 'set.*']).filter({ set: setid }).getAll();
  return res.json(cards);
});

// Learn a specific number of cards from a set
app.get('/cards/learn', async (req, res) => {
  const { setid, limit } = req.query;

  const cards = await client.db.cards
    .select(['question', 'answer', 'image'])
    .filter({ set: setid })
    .getAll();

  // Get a random set of cards using limit
  const randomCards = cards
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
    .slice(0, +limit!);

  return res.json(randomCards);
});

// Start learning progress
app.post('/learnings', async (req, res) => {
  const { user, set, cardsTotal, correct, wrong } = req.body;
  const obj = {
    user,
    set,
    cards_total: +cardsTotal,
    cards_correct: +correct,
    cards_wrong: +wrong,
    score: (+correct / +cardsTotal) * 100,
  };
  const learning = await client.db.learnings.create(obj);
  return res.json(learning);
});

// Get user learning progress
app.get('/learnings', async (req, res) => {
  const { user } = req.query;
  const learnings = await client.db.learnings
    .select(['*', 'set.*'])
    .filter({ user: `${user}` })
    .getAll();
  return res.json(learnings);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
