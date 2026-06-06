const socket = io();
let state = null;
let isInitialized = false;

const elements = {
  connectionStatus: document.getElementById('connectionStatus'),
  syncText: document.getElementById('syncText'),
  titleInput: document.getElementById('titleInput'),
  dateInput: document.getElementById('dateInput'),
  shiftInput: document.getElementById('shiftInput'),
  lostTimeStartInput: document.getElementById('lostTimeStartInput'),
  lostTimeEndInput: document.getElementById('lostTimeEndInput'),
  lostTimeReasonInput: document.getElementById('lostTimeReasonInput'),
  foremanInput: document.getElementById('foremanInput'),
  hsesInput: document.getElementById('hsesInput'),
  checkerInput: document.getElementById('checkerInput'),
  logoInput: document.getElementById('logoInput'),
  clearLogoBtn: document.getElementById('clearLogoBtn'),
  resetStateBtn: document.getElementById('resetStateBtn'),
  addBreakdownBtn: document.getElementById('addBreakdownBtn'),
  addEquipmentBtn: document.getElementById('addEquipmentBtn'),
  breakdownList: document.getElementById('breakdownList'),
  equipmentList: document.getElementById('equipmentList'),
  infoText: document.getElementById('infoText')
};

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
  equipmentList: [],
  breakdownList: []
};

const ZONES = Array.from({ length: 14 }, (_, i) => `Z${i + 1}`);
const PREDEFINED_UNITS = [
  { code: 'VR 020', label: 'VR 020 (Vibro)', category: 'VR', defaultJob: 'Compacting' },
  { code: 'BD 013', label: 'BD 013 (Bulldozer)', category: 'BD', defaultJob: 'Scraping' },
  { code: 'DT B530', label: 'DT B530 (Dump Truck)', category: 'DT', defaultJob: 'Dumpingan' },
  { code: 'DT A20', label: 'DT A20 (Dump Truck)', category: 'DT', defaultJob: 'Dumpingan' },
  { code: 'DT B226', label: 'DT B226 (Dump Truck)', category: 'DT', defaultJob: 'Dumpingan' },
  { code: 'WT 014', label: 'WT 014 (Water Truck)', category: 'WT', defaultJob: 'Watering' },
  { code: 'WT 019', label: 'WT 019 (Water Truck)', category: 'WT', defaultJob: 'Watering' },
  { code: 'PC 390', label: 'PC 390 (Excavator)', category: 'PC', defaultJob: 'Pot Hole dan Drenaise' },
  { code: 'PC 392', label: 'PC 392 (Excavator)', category: 'PC', defaultJob: 'Drainase dan Loading Material' },
  { code: 'PC 391', label: 'PC 391 (Breaker)', category: 'PC', defaultJob: 'Breaker Quarry' },
  { code: 'GR 020', label: 'GR 020 (Grader)', category: 'GR', defaultJob: 'Scraping, Laminating dan Drainase' }
];

const updateServerState = () => {
  if (!state) return;
  socket.emit('updateState', state);
};

const setStatus = (connected) => {
  if (connected) {
    elements.connectionStatus.classList.remove('offline');
    elements.connectionStatus.classList.add('online');
    elements.connectionStatus.textContent = 'Online';
    elements.syncText.textContent = 'Realtime terhubung. Semua perubahan disebarkan ke pengguna lain.';
  } else {
    elements.connectionStatus.classList.remove('online');
    elements.connectionStatus.classList.add('offline');
    elements.connectionStatus.textContent = 'Offline';
    elements.syncText.textContent = 'Menunggu koneksi Socket.io...';
  }
};

const safeImageUrl = (value) => {
  if (!value) return null;
  if (value.startsWith('http') || value.startsWith('/')) return value;
  return `/${value}`;
};

const renderForm = () => {
  if (!state) return;
  elements.titleInput.value = state.headerData.title;
  elements.dateInput.value = state.headerData.date;
  elements.shiftInput.value = state.headerData.shift;
  elements.lostTimeStartInput.value = state.headerData.lostTimeStart;
  elements.lostTimeEndInput.value = state.headerData.lostTimeEnd;
  elements.lostTimeReasonInput.value = state.headerData.lostTimeReason;
  elements.foremanInput.value = state.manpower.foreman;
  elements.hsesInput.value = state.manpower.hses;
  elements.checkerInput.value = state.manpower.checker;
};

const renderBreakdown = () => {
  elements.breakdownList.innerHTML = '';
  if (!state.breakdownList.length) {
    elements.breakdownList.innerHTML = '<div class="notice">Tidak ada item Breakdown/Standby. Tambahkan untuk mulai sinkronisasi.</div>';
    return;
  }
  state.breakdownList.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'list-card';
    const imageUrl = safeImageUrl(item.image);
    card.innerHTML = `
      ${imageUrl ? `<img src="${imageUrl}" alt="${item.unitCode}" onerror="this.style.display='none'" />` : ''}
      <div class="card-row">
        <strong>${item.unitCode}</strong>
        <button class="btn btn-danger small" data-action="delete-breakdown" data-id="${item.id}">Hapus</button>
      </div>
      <label>Keterangan</label>
      <input type="text" value="${item.note || ''}" data-action="update-breakdown-note" data-id="${item.id}" />
      <label>Status</label>
      <select class="status-select" data-action="update-breakdown-status" data-id="${item.id}">
        <option value="Breakdown" ${item.status === 'Breakdown' ? 'selected' : ''}>BREAKDOWN</option>
        <option value="Standby" ${item.status === 'Standby' ? 'selected' : ''}>STANDBY</option>
      </select>
      <label>Upload Gambar</label>
      <input type="file" accept="image/*" data-action="upload-breakdown-image" data-id="${item.id}" />
    `;
    elements.breakdownList.appendChild(card);
  });
};

const renderEquipment = () => {
  elements.equipmentList.innerHTML = '';
  if (!state.equipmentList.length) {
    elements.equipmentList.innerHTML = '<div class="notice">Tidak ada unit aktif. Tambahkan unit untuk memulai.</div>';
    return;
  }
  state.equipmentList.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'list-card';
    const imageUrl = safeImageUrl(item.image);
    card.innerHTML = `
      ${imageUrl ? `<img src="${imageUrl}" alt="${item.unitCode}" onerror="this.style.display='none'" />` : ''}
      <div class="card-row">
        <strong>${item.unitCode}</strong>
        <button class="btn btn-danger small" data-action="delete-equipment" data-id="${item.id}">Hapus</button>
      </div>
      <label>Pekerjaan</label>
      <input type="text" value="${item.pekerjaan}" data-action="update-equipment-job" data-id="${item.id}" />
      <label>Deskripsi</label>
      <input type="text" value="${item.description || ''}" data-action="update-equipment-description" data-id="${item.id}" />
      <label>Zona Tercover</label>
      <div class="zone-grid">
        ${ZONES.map((zone) => {
          const selected = item.zones && item.zones.includes(zone);
          return `<button class="zone-button ${selected ? 'zone-active' : ''}" data-action="toggle-zone" data-id="${item.id}" data-zone="${zone}">${zone}</button>`;
        }).join('')}
      </div>
      <label>Upload Gambar</label>
      <input type="file" accept="image/*" data-action="upload-equipment-image" data-id="${item.id}" />
    `;
    elements.equipmentList.appendChild(card);
  });
};

const renderAll = () => {
  renderForm();
  renderBreakdown();
  renderEquipment();
  document.getElementById('infoText').textContent = 'Data tersinkron antar pengguna. Setiap update akan langsung dikirim ke backend dan disebarkan ke semua koneksi aktif.';
};

const mergeState = (newState) => {
  state = newState;
  renderAll();
};

const createInitialData = () => {
  state = { ...defaultState };
  updateServerState();
};

const handleRemoteState = (incoming) => {
  if (!incoming) return;
  state = incoming;
  renderAll();
};

const submitState = () => {
  updateServerState();
};

const uploadImageToServer = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('/upload-image', { method: 'POST', body: formData });
  if (!response.ok) {
    throw new Error('Upload gagal');
  }
  const result = await response.json();
  return result.url;
};

const addBreakdownItem = () => {
  const newId = `bd-${Date.now()}`;
  state.breakdownList.push({
    id: newId,
    unitCode: 'DT B226',
    type: 'DT',
    status: 'Breakdown',
    note: '',
    image: null
  });
  renderBreakdown();
  submitState();
};

const addEquipmentItem = () => {
  const newId = `eq-${Date.now()}`;
  const defaultUnit = PREDEFINED_UNITS[0];
  state.equipmentList.push({
    id: newId,
    area: 'A',
    unitCode: defaultUnit.code,
    type: defaultUnit.category,
    pekerjaan: defaultUnit.defaultJob,
    description: '',
    zones: [],
    image: null
  });
  renderEquipment();
  submitState();
};

const resetState = () => {
  if (!confirm('Reset semua data ke nilai awal?')) return;
  state = JSON.parse(JSON.stringify(defaultState));
  renderAll();
  submitState();
};

const bindEvents = () => {
  elements.titleInput.addEventListener('change', (e) => {
    state.headerData.title = e.target.value;
    submitState();
  });

  elements.dateInput.addEventListener('change', (e) => {
    state.headerData.date = e.target.value;
    submitState();
  });

  elements.shiftInput.addEventListener('change', (e) => {
    state.headerData.shift = e.target.value;
    submitState();
  });

  elements.lostTimeStartInput.addEventListener('change', (e) => {
    state.headerData.lostTimeStart = e.target.value;
    submitState();
  });

  elements.lostTimeEndInput.addEventListener('change', (e) => {
    state.headerData.lostTimeEnd = e.target.value;
    submitState();
  });

  elements.lostTimeReasonInput.addEventListener('change', (e) => {
    state.headerData.lostTimeReason = e.target.value;
    submitState();
  });

  elements.foremanInput.addEventListener('change', (e) => {
    state.manpower.foreman = parseInt(e.target.value, 10) || 0;
    submitState();
  });

  elements.hsesInput.addEventListener('change', (e) => {
    state.manpower.hses = parseInt(e.target.value, 10) || 0;
    submitState();
  });

  elements.checkerInput.addEventListener('change', (e) => {
    state.manpower.checker = parseInt(e.target.value, 10) || 0;
    submitState();
  });

  elements.logoInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadImageToServer(file);
      state.companyLogo = url;
      submitState();
    } catch (error) {
      alert('Upload logo gagal. Coba lagi.');
    }
  });

  elements.clearLogoBtn.addEventListener('click', () => {
    state.companyLogo = null;
    submitState();
  });

  elements.addBreakdownBtn.addEventListener('click', addBreakdownItem);
  elements.addEquipmentBtn.addEventListener('click', addEquipmentItem);
  elements.resetStateBtn.addEventListener('click', resetState);

  document.body.addEventListener('change', async (event) => {
    const action = event.target.dataset.action;
    if (!action) return;

    const id = event.target.dataset.id;
    const value = event.target.value;

    if (action === 'update-breakdown-note') {
      const item = state.breakdownList.find((entry) => entry.id === id);
      if (item) {
        item.note = value;
        submitState();
      }
    }

    if (action === 'update-breakdown-status') {
      const item = state.breakdownList.find((entry) => entry.id === id);
      if (item) {
        item.status = value;
        submitState();
      }
    }

    if (action === 'update-equipment-job') {
      const item = state.equipmentList.find((entry) => entry.id === id);
      if (item) {
        item.pekerjaan = value;
        submitState();
      }
    }

    if (action === 'update-equipment-description') {
      const item = state.equipmentList.find((entry) => entry.id === id);
      if (item) {
        item.description = value;
        submitState();
      }
    }

    if (action === 'upload-breakdown-image' || action === 'upload-equipment-image') {
      const file = event.target.files[0];
      if (!file) return;
      try {
        const url = await uploadImageToServer(file);
        if (action === 'upload-breakdown-image') {
          const item = state.breakdownList.find((entry) => entry.id === id);
          if (item) item.image = url;
          renderBreakdown();
        } else {
          const item = state.equipmentList.find((entry) => entry.id === id);
          if (item) item.image = url;
          renderEquipment();
        }
        submitState();
      } catch (error) {
        alert('Upload gambar gagal. Coba lagi.');
      }
    }
  });

  document.body.addEventListener('click', (event) => {
    const action = event.target.dataset.action;
    const id = event.target.dataset.id;
    if (action === 'delete-breakdown') {
      state.breakdownList = state.breakdownList.filter((entry) => entry.id !== id);
      renderBreakdown();
      submitState();
    }
    if (action === 'delete-equipment') {
      state.equipmentList = state.equipmentList.filter((entry) => entry.id !== id);
      renderEquipment();
      submitState();
    }
    if (action === 'toggle-zone') {
      const zone = event.target.dataset.zone;
      const item = state.equipmentList.find((entry) => entry.id === id);
      if (item) {
        item.zones = item.zones || [];
        if (item.zones.includes(zone)) {
          item.zones = item.zones.filter((existing) => existing !== zone);
        } else {
          item.zones.push(zone);
        }
        renderEquipment();
        submitState();
      }
    }
  });
};

socket.on('connect', () => {
  setStatus(true);
});

socket.on('disconnect', () => {
  setStatus(false);
});

socket.on('currentState', (incomingState) => {
  handleRemoteState(incomingState);
});

socket.on('stateUpdate', (incomingState) => {
  handleRemoteState(incomingState);
});

const init = () => {
  if (isInitialized) return;
  isInitialized = true;
  setStatus(false);
  bindEvents();
  renderAll();
  fetch('/state')
    .then((res) => res.json())
    .then((data) => {
      state = data;
      renderAll();
    })
    .catch(() => {
      state = defaultState;
      renderAll();
    });
};

window.addEventListener('load', init);
