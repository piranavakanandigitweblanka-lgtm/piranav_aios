// Dashboard status — requirement counts per member
// Update this file when a new requirement goes live

const STATUS = [
  { id: 'hetheesha', name: 'Hetheesha', reqs: 4 },
  { id: 'jakshan',   name: 'Jakshan',   reqs: 2 },
  { id: 'sajeepan',  name: 'Sajeepan',  reqs: 1 },
  { id: 'sonya',     name: 'Sonya',     reqs: 5 },
  { id: 'theekshy',  name: 'Theekshy',  reqs: 4 },
  { id: 'thivajini', name: 'Thivajini', reqs: 4 },
];

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  return res.status(200).json({ ok: true, members: STATUS });
};
