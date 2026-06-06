const path = require('path');
const fs = require('fs');
const express = require('express');
const http = require('http');
const multer = require('multer');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const STATE_FILE = path.join(DATA_DIR, 'state.json');
const UPLOAD_DIR = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const defaultState = {
  headerData: {
    title: 'DAILY ACTIVITY MAINTENANCE RESOURCES ID',
    date: '2026-05-31',
    shift: 'Day',
    lostTimeStart: '08:00',
    lostTimeEnd: '13:00',
    lostTimeReason: 'Jalan Licin'
  },
  companyLogo: null,
  manpower: {
    foreman: 3,
    hses: 2,
    checker: 2
  },
  equipmentList: [
    { id: 'eq1', area: 'A', unitCode: 'VR 020', type: 'VR', pekerjaan: 'Compacting', description: 'Compacting Z1', zones: ['Z1', 'Z3'], image: 'uploads/VR020.jpeg' },
    { id: 'eq2', area: 'A', unitCode: 'BD 013', type: 'BD', pekerjaan: 'Scraping', description: 'Scraping Z1', zones: ['Z1', 'Z3'], image: 'uploads/BD013.jpeg' },
    { id: 'eq3', area: 'A', unitCode: 'WT 014', type: 'WT', pekerjaan: 'Watering', description: 'Water', zones: ['Z3'], image: 'uploads/WT014.jpeg' },
    { id: 'eq4', area: 'A', unitCode: 'GR 020', type: 'GR', pekerjaan: 'Scraping, Laminating dan Drainase', description: 'Scraping Jalan', zones: ['Z3'], image: 'uploads/GR20.jpeg' },
    { id: 'eq5', area: 'A', unitCode: 'DT A20', type: 'DT', pekerjaan: 'Dumpingan', description: 'Dumpingan Material', zones: ['Z3'], image: 'uploads/DT A20.jpeg' },
    { id: 'eq6', area: 'B', unitCode: 'PC 390', type: 'PC', pekerjaan: 'Pot Hole dan Drenaise', description: 'Pot Hole Z10', zones: ['Z10', 'Z9'], image: 'uploads/PC390.jpg' },
    { id: 'eq7', area: 'B', unitCode: 'PC 392', type: 'PC', pekerjaan: 'Drainase dan Loading Material', description: 'Loading Material Quarry', zones: ['Z9'], image: 'uploads/PC 392.jpeg' },
    { id: 'eq8', area: 'B', unitCode: 'PC 391', type: 'PC', pekerjaan: 'Breaker Quarry', description: 'Breaker Quarry Batu', zones: ['Z10'], image: 'uploads/PC 391.jpeg' }
  ],
  breakdownList: [
    { id: 'bd1', unitCode: 'DT B226', type: 'DT', status: 'Breakdown', note: 'Engine Overheat / Hydr. Leak', image: 'uploads/DT530.jpeg' },
    { id: 'bd2', unitCode: 'BD 011', type: 'BD', status: 'Breakdown', note: 'Track Link Slip', image: 'uploads/BD013.jpeg' },
    { id: 'bd3', unitCode: 'GR 015', type: 'GR', status: 'Breakdown', note: 'Hydraulic Hose Rupture', image: 'uploads/GR20.jpeg' },
    { id: 'bd4', unitCode: 'PC 320', type: 'PC', status: 'Breakdown', note: 'Swing Motor Weak', image: 'uploads/PC390.jpg' }
  ]
};

const loadState = () => {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const json = fs.readFileSync(STATE_FILE, 'utf8');
      return JSON.parse(json);
    }
  } catch (error) {
    console.error('Error loading state:', error);
  }
  fs.writeFileSync(STATE_FILE, JSON.stringify(defaultState, null, 2), 'utf8');
  return defaultState;
};

let state = loadState();

const saveState = (newState) => {
  state = newState;
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const key = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
    cb(null, key);
  }
});
const upload = multer({ storage });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOAD_DIR));

app.get('/state', (req, res) => {
  res.json(state);
});

app.post('/upload-image', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imageUrl = `uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

io.on('connection', (socket) => {
  socket.emit('currentState', state);

  socket.on('updateState', (newState) => {
    if (typeof newState === 'object' && newState !== null) {
      saveState(newState);
      socket.broadcast.emit('stateUpdate', state);
      socket.emit('stateUpdate', state);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
