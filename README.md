<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RESOURCES ID - Daily Activity Maintenance</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <style>
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        
        .animate-slideIn {
            animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        @media print {
            .print\:hidden {
                display: none !important;
            }
            body {
                background: white;
            }
            #print-area {
                box-shadow: none;
                border: none;
                max-width: 100%;
            }
        }

        /* Custom Tailwind colors */
        .bg-slate-955 { background-color: #0f172a; }
        .border-slate-850 { border-color: #1a202c; }
        .bg-slate-955\/10 { background-color: rgba(15, 23, 42, 0.1); }
        .text-red-655 { color: #dc2626; }
        .bg-red-655 { background-color: #dc2626; }
        .bg-red-650 { background-color: #991b1b; }
        .bg-red-750 { background-color: #7f1d1d; }
        .bg-blue-650 { background-color: #1e40af; }
        .text-red-655\/10 { color: rgba(220, 38, 38, 0.1); }
        .border-red-500\/30 { border-color: rgba(239, 68, 68, 0.3); }
        .bg-yellow-600 { background-color: #ca8a04; }
        .text-yellow-500 { color: #eab308; }
        .bg-emerald-600 { background-color: #16a34a; }
        .text-emerald-700 { color: #15803d; }
        .text-emerald-900 { color: #065f46; }
        .bg-emerald-50\/45 { background-color: rgba(240, 253, 250, 0.45); }
        .border-emerald-200 { border-color: #dcfce7; }
        .text-emerald-600 { color: #16a34a; }
        .bg-red-50\/45 { background-color: rgba(254, 242, 242, 0.45); }
        .border-red-200 { border-color: #fecaca; }
        .text-red-900 { color: #7f1d1d; }
        .text-red-600 { color: #dc2626; }
        .text-blue-700 { color: #1d4ed8; }
        .bg-blue-50\/20 { background-color: rgba(239, 246, 255, 0.2); }
        .ring-1 { box-shadow: inset 0 0 0 1px currentColor; }
        .ring-blue-200 { --tw-ring-color: #bfdbfe; }
        .aspect-square { aspect-ratio: 1 / 1; }
        .text-xxs { font-size: 0.625rem; }
    </style>
</head>
<body class="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
    
    <!-- Toast Notification -->
    <div id="notification" class="hidden fixed bottom-5 right-5 z-50 bg-slate-955 border border-slate-700 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-slideIn">
        <span id="notificationDot" class="w-3 h-3 rounded-full bg-emerald-500"></span>
        <p id="notificationText" class="text-sm font-bold"></p>
    </div>

    <!-- HEADER NAVIGATION -->
    <header class="bg-slate-955 border-b border-slate-850 px-6 py-4 flex flex-wrap justify-between items-center sticky top-0 z-40 shadow-lg print:hidden">
        <div class="flex items-center space-x-3 mb-2 sm:mb-0">
            <div class="bg-white p-1 rounded-xl shadow-md flex items-center justify-center">
                <img id="headerLogo" class="h-9 w-auto max-w-[120px] object-contain rounded hidden" alt="Logo">
                <span id="logoFallback" class="text-xs font-black text-slate-950 tracking-wider px-2 py-1">RES.ID</span>
            </div>
            <div>
                <h1 class="text-lg font-black tracking-wider text-white flex items-center">
                    RESOURCES ID <span class="ml-2 text-[10px] bg-red-655/10 text-red-400 border border-red-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest">Portal Maintenance</span>
                </h1>
                <p class="text-xs text-slate-400">Dashboard Pengelolaan & Dokumentasi Lapangan RESOURCES ID</p>
            </div>
        </div>

        <div class="flex flex-wrap items-center gap-2">
            <button id="tabInputBtn" class="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 bg-red-655 text-white shadow-lg shadow-red-600/20 tab-btn" data-tab="input">
                ⚙️ <span>1. Pengaturan Manual & Gambar</span>
            </button>
            <button id="tabDashboardBtn" class="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 flex items-center gap-2 bg-slate-800/80 text-slate-300 hover:bg-slate-700 tab-btn" data-tab="dashboard">
                📊 <span>2. Hasil Live Dashboard</span>
            </button>

            <span class="w-px h-6 bg-slate-800 mx-2 hidden md:inline"></span>
            
            <button onclick="exportToExcel()" class="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors flex items-center gap-1.5 text-xs font-bold" title="Ekspor ke Excel CSV">
                📊 <span class="hidden lg:inline">Ekspor Excel</span>
            </button>
            
            <button onclick="handleExportPNG()" class="p-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-500 transition-colors flex items-center gap-1.5 text-xs font-bold" title="Ekstrak Gambar Dashboard (PNG)">
                🖼️ <span class="hidden lg:inline">Unduh PNG</span>
            </button>

            <button onclick="handleExportPDF()" class="p-2.5 bg-red-650 text-white rounded-xl hover:bg-red-750 transition-colors flex items-center gap-1.5 text-xs font-bold" title="Ekstrak Dokumen Laporan (PDF)">
                📄 <span class="hidden lg:inline">Unduh PDF</span>
            </button>

            <button onclick="handlePrint()" class="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors flex items-center gap-1.5 text-xs font-bold" title="Cetak Laporan / Simpan PDF Browser">
                🖨️ <span class="hidden lg:inline">Cetak</span>
            </button>
        </div>
    </header>

    <!-- MAIN CONTENT -->
    <main class="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto grid grid-cols-1 gap-6">

        <!-- TAB 1: INPUT & PENGATURAN -->
        <div id="tab-input" class="tab-content space-y-6 animate-fadeIn print:hidden">
            
            <!-- FORM HEADER INFO -->
            <div class="bg-slate-955 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <h2 class="text-lg font-black tracking-wider text-white border-b border-slate-800 pb-3 flex items-center justify-between">
                    <span class="flex items-center gap-2">⬆️ A. HEADER INFORMASI UMUM & LOGO</span>
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div class="col-span-1 md:col-span-2">
                        <label class="block text-xxs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Judul Laporan</label>
                        <input type="text" id="titleInput" value="DAILY ACTIVITY MAINTENANCE RESOURCES ID" class="w-full bg-slate-900 border border-slate-700 focus:border-red-500 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-red-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-xxs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Tanggal Kegiatan</label>
                        <input type="date" id="dateInput" value="2026-05-31" class="w-full bg-slate-900 border border-slate-700 focus:border-red-500 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-red-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-xxs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Shift Kerja</label>
                        <select id="shiftInput" class="w-full bg-slate-900 border border-slate-700 focus:border-red-500 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-red-500 outline-none">
                            <option value="Day">Day</option>
                            <option value="Night">Night</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
                    <div>
                        <label class="block text-xxs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Lost Time (Mulai)</label>
                        <input type="time" id="lostTimeStartInput" value="08:00" class="w-full bg-slate-900 border border-slate-700 focus:border-red-500 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-red-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-xxs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Lost Time (Selesai)</label>
                        <input type="time" id="lostTimeEndInput" value="13:00" class="w-full bg-slate-900 border border-slate-700 focus:border-red-500 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-red-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-xxs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Alasan Lost Time</label>
                        <input type="text" id="lostTimeReasonInput" value="Jalan Licin" placeholder="Contoh: Jalan Licin" class="w-full bg-slate-900 border border-slate-700 focus:border-red-500 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-red-500 outline-none">
                    </div>
                    <div>
                        <label class="block text-xxs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Unggah Logo Perusahaan</label>
                        <div class="flex items-center gap-3">
                            <label class="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-dashed border-slate-600 rounded-xl py-2 px-3 text-xs text-slate-300 font-semibold cursor-pointer transition-colors">
                                📤 <span id="logoUploadText">Unggah Logo</span>
                                <input type="file" id="logoUpload" accept="image/*" class="hidden">
                            </label>
                            <button id="removeLogo" class="text-red-500 hover:text-red-400 font-bold text-xxs uppercase tracking-wider hidden">❌ Hapus</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- MANPOWER SECTION -->
            <div class="bg-slate-955 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 class="text-lg font-black tracking-wider text-emerald-400 border-b border-slate-800 pb-3 flex items-center gap-2">
                    👥 B. MANPOWER IN SITE (HIJAU)
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label class="block text-xxs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Foreman (Jumlah)</label>
                        <div class="flex items-center space-x-2">
                            <input type="number" id="foremanInput" min="0" value="3" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white">
                            <span class="text-xs text-slate-400">Orang</span>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xxs font-extrabold text-slate-400 uppercase tracking-widest mb-2">HSES (Jumlah)</label>
                        <div class="flex items-center space-x-2">
                            <input type="number" id="hsesInput" min="0" value="2" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white">
                            <span class="text-xs text-slate-400">Orang</span>
                        </div>
                    </div>
                    <div>
                        <label class="block text-xxs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Checker/Flagman (Jumlah)</label>
                        <div class="flex items-center space-x-2">
                            <input type="number" id="checkerInput" min="0" value="2" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white">
                            <span class="text-xs text-slate-400">Orang</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- BREAKDOWN SECTION -->
            <div class="bg-slate-955 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div class="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h3 class="text-lg font-black tracking-wider text-yellow-400 flex items-center gap-2">
                        ⚠️ C. UNIT BREAKDOWN / STANDBY (KUNING)
                    </h3>
                    <button onclick="addBreakdown()" class="bg-yellow-600 hover:bg-yellow-500 text-slate-950 px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-transform active:scale-95">
                        ➕ Tambah Unit
                    </button>
                </div>

                <div id="breakdownContainer" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Breakdown items will be inserted here -->
                </div>
            </div>

            <!-- EQUIPMENT BY AREA -->
            <div class="bg-slate-955 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                <h3 class="text-lg font-black tracking-wider text-blue-400 border-b border-slate-800 pb-3 flex items-center gap-2">
                    🚚 D. LOG AKTIVITAS ALAT PER AREA (BIRU)
                </h3>

                <div id="areaContainer" class="space-y-6">
                    <!-- Area sections will be inserted here -->
                </div>
            </div>
        </div>

        <!-- TAB 2: DASHBOARD VIEW -->
        <div id="tab-dashboard" class="tab-content space-y-6 animate-fadeIn text-slate-900 hidden">
            
            <!-- Control Alert -->
            <div class="bg-slate-955 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between shadow-md print:hidden text-slate-100">
                <div class="flex items-center gap-3">
                    <div class="bg-amber-500/10 p-2.5 rounded-xl text-amber-400">⚡</div>
                    <div>
                        <h4 class="font-bold text-sm">Pratinjau Dokumen Siap Cetak & Ekspor</h4>
                        <p class="text-xs text-slate-400 mt-0.5">Halaman ini mengoptimalkan resolusi super tajam (Anti-Blur) untuk output cetak, PDF, atau PNG.</p>
                    </div>
                </div>
            </div>

            <!-- PRINT AREA -->
            <div id="print-area" class="bg-white p-8 rounded-2xl shadow-2xl border border-slate-200 mx-auto max-w-none w-full min-h-[210mm] flex flex-col justify-between font-sans">
                
                <!-- Header Laporan -->
                <div class="flex justify-between items-center border-b-2 border-slate-900 pb-4 mb-6">
                    <div class="flex items-center gap-4">
                        <div id="printLogo" class="bg-slate-900 text-white p-3 rounded-xl font-black text-xs tracking-wider">RESOURCES ID</div>
                        <div>
                            <h2 id="printTitle" class="text-lg font-black uppercase tracking-tight text-slate-900">DAILY ACTIVITY MAINTENANCE RESOURCES ID</h2>
                            <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Laporan Harian Lapangan - Unit Maintenance & Infrastruktur</p>
                        </div>
                    </div>
                    <div class="text-right border border-slate-300 rounded-xl p-3 bg-slate-50 min-w-[220px]">
                        <div class="grid grid-cols-2 gap-x-2 gap-y-1 font-medium text-slate-700 text-xs">
                            <span class="text-slate-400 font-bold uppercase text-[9px] text-left">Tanggal:</span>
                            <span id="printDate" class="font-bold text-slate-900 text-right">2026-05-31</span>
                            <span class="text-slate-400 font-bold uppercase text-[9px] text-left">Shift:</span>
                            <span id="printShift" class="font-bold text-slate-900 text-right">Day</span>
                        </div>
                    </div>
                </div>

                <!-- Kondisi Lapangan & Manpower -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs">
                    <div class="border border-red-200 bg-red-50/45 rounded-xl p-3 flex items-start gap-3">
                        <div class="text-red-600 text-xl mt-0.5">⚠️</div>
                        <div>
                            <h4 class="font-bold text-red-900 uppercase text-[10px] tracking-wide">Lost Time Kendala Lapangan</h4>
                            <p id="printLostTime" class="font-bold text-slate-800 mt-0.5">08:00 - 13:00 (Jalan Licin)</p>
                        </div>
                    </div>

                    <div class="border border-emerald-200 bg-emerald-50/45 rounded-xl p-3 flex items-start gap-3">
                        <div class="text-emerald-600 text-xl mt-0.5">👥</div>
                        <div>
                            <h4 class="font-bold text-emerald-900 uppercase text-[10px] tracking-wide">Manpower Pengawas Lapangan</h4>
                            <div class="flex gap-4 mt-1 font-bold text-slate-800">
                                <div>Foreman: <span id="printForeman" class="text-emerald-700 font-black">3</span></div>
                                <div>HSES: <span id="printHSES" class="text-emerald-700 font-black">2</span></div>
                                <div>Checker: <span id="printChecker" class="text-emerald-700 font-black">2</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- STAT CARDS -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <div class="p-2 bg-blue-50 text-blue-600 rounded-lg">🚚</div>
                        <div>
                            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unit Aktif</p>
                            <p id="statActiveUnits" class="text-lg font-black text-slate-900">0 <span class="text-xs font-normal text-slate-500">Unit</span></p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <div class="p-2 bg-red-50 text-red-600 rounded-lg">⚠️</div>
                        <div>
                            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Breakdown</p>
                            <p id="statBreakdown" class="text-lg font-black text-slate-900">0 <span class="text-xs font-normal text-slate-500">Unit</span></p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <div class="p-2 bg-emerald-50 text-emerald-600 rounded-lg">👥</div>
                        <div>
                            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Manpower</p>
                            <p id="statManpower" class="text-lg font-black text-slate-900">0 <span class="text-xs font-normal text-slate-500">Orang</span></p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <div class="p-2 bg-indigo-50 text-indigo-600 rounded-lg">📍</div>
                        <div>
                            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Zona Tercover</p>
                            <p id="statZones" class="text-lg font-black text-slate-900">0 <span class="text-xs font-normal text-slate-500">Zona</span></p>
                        </div>
                    </div>
                </div>

                <!-- ZONE MAP GRID -->
                <div class="p-4 bg-white border border-slate-200 rounded-xl shadow-sm mb-6">
                    <h3 class="text-xs font-extrabold text-[#006432] tracking-wider uppercase mb-3 flex items-center gap-2">
                        📍 Peta Alokasi Digital Zona Operasional (Z1 - Z14)
                    </h3>
                    <div id="zoneMapGrid" class="grid grid-cols-2 md:grid-cols-7 gap-2">
                        <!-- Zone cards will be inserted here -->
                    </div>
                </div>

                <!-- EQUIPMENT LISTING -->
                <div id="equipmentListingContainer" class="space-y-8">
                    <!-- Equipment areas will be inserted here -->
                </div>

                <!-- BREAKDOWN LISTING -->
                <div class="space-y-3 pt-2">
                    <div class="px-4 py-2 rounded-xl border border-slate-300 flex justify-between items-center" style="background-color: #DCDCDC">
                        <h3 class="text-xs font-black tracking-wider text-slate-900 flex items-center gap-1.5 uppercase">
                            ⚠️ Unit Breakdown & Standby Lapangan
                        </h3>
                        <span id="breakdownCountBadge" class="text-[10px] font-extrabold text-slate-700 uppercase bg-white/70 px-2 py-0.5 rounded-lg border border-slate-300">0 Unit Kendala</span>
                    </div>
                    
                    <div id="breakdownListingContainer" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <!-- Breakdown items will be inserted here -->
                    </div>
                </div>
            </div>
        </div>
    </main>

    <script>
        // ============ STATE MANAGEMENT ============
        const state = {
            headerData: {
                title: "DAILY ACTIVITY MAINTENANCE RESOURCES ID",
                date: "2026-05-31",
                shift: "Day",
                lostTimeStart: "08:00",
                lostTimeEnd: "13:00",
                lostTimeReason: "Jalan Licin"
            },
            companyLogo: null,
            manpower: {
                foreman: 3,
                hses: 2,
                checker: 2
            },
            equipmentList: [
                { id: 'eq1', area: 'A', unitCode: 'VR 020', type: 'VR', pekerjaan: 'Compacting', description: 'Compacting Z1', zones: ['Z1', 'Z3'], image: 'VR020.jpeg' },
                { id: 'eq2', area: 'A', unitCode: 'BD 013', type: 'BD', pekerjaan: 'Scraping', description: 'Scraping Z1', zones: ['Z1', 'Z3'], image: 'BD013.jpeg' },
                { id: 'eq3', area: 'A', unitCode: 'WT 014', type: 'WT', pekerjaan: 'Watering', description: 'Water', zones: ['Z3'], image: 'WT014.jpeg' },
                { id: 'eq4', area: 'A', unitCode: 'GR 020', type: 'GR', pekerjaan: 'Scraping, Laminating dan Drainase', description: 'Scraping Jalan', zones: ['Z3'], image: 'GR20.jpeg' },
                { id: 'eq5', area: 'A', unitCode: 'DT A20', type: 'DT', pekerjaan: 'Dumpingan', description: 'Dumpingan Material', zones: ['Z3'], image: 'DT A20.jpeg' },
                { id: 'eq6', area: 'B', unitCode: 'PC 390', type: 'PC', pekerjaan: 'Pot Hole dan Drenaise', description: 'Pot Hole Z10', zones: ['Z10', 'Z9'], image: 'PC390.jpg' },
                { id: 'eq7', area: 'B', unitCode: 'PC 392', type: 'PC', pekerjaan: 'Drainase dan Loading Material', description: 'Loading Material Quarry', zones: ['Z9'], image: 'PC 392.jpeg' },
                { id: 'eq8', area: 'B', unitCode: 'PC 391', type: 'PC', pekerjaan: 'Breaker Quarry', description: 'Breaker Quarry Batu', zones: ['Z10'], image: 'PC 391.jpeg' }
            ],
            breakdownList: [
                { id: 'bd1', unitCode: 'DT B226', type: 'DT', status: 'Breakdown', note: 'Engine Overheat / Hydr. Leak', image: 'DT530.jpeg' },
                { id: 'bd2', unitCode: 'BD 011', type: 'BD', status: 'Breakdown', note: 'Track Link Slip', image: 'BD013.jpeg' },
                { id: 'bd3', unitCode: 'GR 015', type: 'GR', status: 'Breakdown', note: 'Hydraulic Hose Rupture', image: 'GR20.jpeg' },
                { id: 'bd4', unitCode: 'PC 320', type: 'PC', status: 'Breakdown', note: 'Swing Motor Weak', image: 'PC390.jpg' }
            ]
        };

        const PREDEFINED_UNITS = [
            { code: 'VR 020', label: 'VR 020 (Vibro)', category: 'VR', defaultJob: 'Compacting', image: 'VR020.jpeg' },
            { code: 'BD 013', label: 'BD 013 (Bulldozer)', category: 'BD', defaultJob: 'Scraping', image: 'BD013.jpeg' },
            { code: 'DT B530', label: 'DT B530 (Dump Truck)', category: 'DT', defaultJob: 'Dumpingan', image: 'DT530.jpeg' },
            { code: 'DT A20', label: 'DT A20 (Dump Truck)', category: 'DT', defaultJob: 'Dumpingan', image: 'DT A20.jpeg' },
            { code: 'DT B226', label: 'DT B226 (Dump Truck)', category: 'DT', defaultJob: 'Dumpingan', image: 'DT530.jpeg' },
            { code: 'WT 014', label: 'WT 014 (Water Truck)', category: 'WT', defaultJob: 'Watering', image: 'WT014.jpeg' },
            { code: 'WT 019', label: 'WT 019 (Water Truck)', category: 'WT', defaultJob: 'Watering', image: 'WT014.jpeg' },
            { code: 'PC 390', label: 'PC 390 (Excavator)', category: 'PC', defaultJob: 'Pot Hole dan Drenaise', image: 'PC390.jpg' },
            { code: 'PC 392', label: 'PC 392 (Excavator)', category: 'PC', defaultJob: 'Drainase dan Loading Material', image: 'PC 392.jpeg' },
            { code: 'PC 391', label: 'PC 391 (Breaker)', category: 'PC', defaultJob: 'Breaker Quarry', image: 'PC 391.jpeg' },
            { code: 'GR 020', label: 'GR 020 (Grader)', category: 'GR', defaultJob: 'Scraping, Laminating dan Drainase', image: 'GR20.jpeg' }
        ];

        const ZONES = Array.from({ length: 14 }, (_, i) => `Z${i + 1}`);

        // ============ TOAST NOTIFICATION ============
        function showToast(message, type = 'success') {
            const notif = document.getElementById('notification');
            const notifDot = document.getElementById('notificationDot');
            const notifText = document.getElementById('notificationText');
            
            notifText.textContent = message;
            
            if (type === 'success') {
                notifDot.className = 'w-3 h-3 rounded-full bg-emerald-500';
            } else if (type === 'info') {
                notifDot.className = 'w-3 h-3 rounded-full bg-blue-500';
            } else {
                notifDot.className = 'w-3 h-3 rounded-full bg-red-500';
            }
            
            notif.classList.remove('hidden');
            setTimeout(() => notif.classList.add('hidden'), 4000);
        }

        // ============ TAB SWITCHING ============
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tab = this.dataset.tab;
                document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
                document.getElementById(`tab-${tab}`).classList.remove('hidden');
                
                document.querySelectorAll('.tab-btn').forEach(b => {
                    b.classList.remove('bg-red-655', 'text-white', 'shadow-lg', 'shadow-red-600/20');
                    b.classList.add('bg-slate-800/80', 'text-slate-300', 'hover:bg-slate-700');
                });
                this.classList.remove('bg-slate-800/80', 'text-slate-300', 'hover:bg-slate-700');
                this.classList.add('bg-red-655', 'text-white', 'shadow-lg', 'shadow-red-600/20');
                
                if (tab === 'dashboard') {
                    renderDashboard();
                }
            });
        });

        // ============ INPUT LISTENERS ============
        document.getElementById('titleInput').addEventListener('change', e => state.headerData.title = e.target.value);
        document.getElementById('dateInput').addEventListener('change', e => state.headerData.date = e.target.value);
        document.getElementById('shiftInput').addEventListener('change', e => state.headerData.shift = e.target.value);
        document.getElementById('lostTimeStartInput').addEventListener('change', e => state.headerData.lostTimeStart = e.target.value);
        document.getElementById('lostTimeEndInput').addEventListener('change', e => state.headerData.lostTimeEnd = e.target.value);
        document.getElementById('lostTimeReasonInput').addEventListener('change', e => state.headerData.lostTimeReason = e.target.value);
        document.getElementById('foremanInput').addEventListener('change', e => state.manpower.foreman = parseInt(e.target.value) || 0);
        document.getElementById('hsesInput').addEventListener('change', e => state.manpower.hses = parseInt(e.target.value) || 0);
        document.getElementById('checkerInput').addEventListener('change', e => state.manpower.checker = parseInt(e.target.value) || 0);

        // ============ LOGO UPLOAD ============
        document.getElementById('logoUpload').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    showToast("Ukuran logo terlalu besar. Maksimal 2MB.", "error");
                    return;
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                    state.companyLogo = reader.result;
                    document.getElementById('headerLogo').src = reader.result;
                    document.getElementById('headerLogo').classList.remove('hidden');
                    document.getElementById('logoFallback').classList.add('hidden');
                    document.getElementById('logoUploadText').textContent = 'Ubah Logo';
                    document.getElementById('removeLogo').classList.remove('hidden');
                    showToast("Logo Perusahaan berhasil diperbarui!", "success");
                };
                reader.readAsDataURL(file);
            }
        });

        document.getElementById('removeLogo').addEventListener('click', () => {
            state.companyLogo = null;
            document.getElementById('headerLogo').classList.add('hidden');
            document.getElementById('logoFallback').classList.remove('hidden');
            document.getElementById('logoUploadText').textContent = 'Unggah Logo';
            document.getElementById('removeLogo').classList.add('hidden');
            showToast("Logo dihapus", "info");
        });

        // ============ BREAKDOWN MANAGEMENT ============
        function addBreakdown() {
            const newId = 'bd-' + Date.now();
            state.breakdownList.push({
                id: newId,
                unitCode: 'DT B226',
                type: 'DT',
                status: 'Breakdown',
                note: 'Engine Overheat / Hydr. Leak',
                image: 'DT530.jpeg'
            });
            renderBreakdownList();
            showToast("Unit breakdown ditambahkan.", "success");
        }

        function renderBreakdownList() {
            const container = document.getElementById('breakdownContainer');
            container.innerHTML = '';
            
            if (state.breakdownList.length === 0) {
                container.innerHTML = '<p class="text-xs text-slate-500 italic py-2 text-center col-span-2">Nihil Breakdown. Semua unit dalam keadaan prima.</p>';
                return;
            }

            state.breakdownList.forEach(item => {
                const html = `
                    <div class="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row gap-4 items-center">
                        <div class="relative w-full sm:w-28 h-24 bg-slate-955 rounded-xl overflow-hidden border border-slate-700 flex-shrink-0 group">
                            <div class="w-full h-full bg-slate-800 flex items-center justify-center text-xs font-mono p-1 break-all text-center text-slate-300">${item.image}</div>
                            <label class="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity">
                                📷 <span class="text-[10px] text-white">Upload</span>
                                <input type="file" accept="image/*" onchange="handleImageUpload('${item.id}', 'breakdown', event)" class="hidden">
                            </label>
                        </div>
                        <div class="flex-1 w-full grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[10px] text-slate-400 font-extrabold uppercase">Kode Unit</label>
                                <input type="text" value="${item.unitCode}" onchange="state.breakdownList.find(b => b.id === '${item.id}').unitCode = this.value" class="w-full bg-slate-955 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold">
                            </div>
                            <div>
                                <label class="block text-[10px] text-slate-400 font-extrabold uppercase">Status</label>
                                <select onchange="state.breakdownList.find(b => b.id === '${item.id}').status = this.value; renderBreakdownList()" class="w-full bg-slate-955 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold outline-none focus:border-blue-500">
                                    <option value="Breakdown" ${item.status === 'Breakdown' ? 'selected' : ''}>BREAKDOWN</option>
                                    <option value="Standby" ${item.status === 'Standby' ? 'selected' : ''}>STANDBY</option>
                                </select>
                            </div>
                            <div class="col-span-2">
                                <label class="block text-[10px] text-slate-400 font-extrabold uppercase">Keterangan Rusak</label>
                                <input type="text" value="${item.note}" onchange="state.breakdownList.find(b => b.id === '${item.id}').note = this.value" class="w-full bg-slate-955 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
                            </div>
                            <div class="col-span-2 flex justify-end">
                                <button onclick="deleteBreakdown('${item.id}')" class="text-red-500 hover:text-red-400 flex items-center gap-1 text-xs font-semibold">🗑️ Hapus</button>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += html;
            });
        }

        function deleteBreakdown(id) {
            state.breakdownList = state.breakdownList.filter(item => item.id !== id);
            renderBreakdownList();
            showToast("Unit breakdown dihapus.", "info");
        }

        function handleImageUpload(id, listType, e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    showToast("Ukuran gambar terlalu besar. Batas maksimal adalah 5MB.", "error");
                    return;
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (listType === 'equipment') {
                        const eq = state.equipmentList.find(item => item.id === id);
                        if (eq) eq.image = reader.result;
                        showToast("Gambar dokumentasi berhasil diperbarui!", "success");
                    } else if (listType === 'breakdown') {
                        const bd = state.breakdownList.find(item => item.id === id);
                        if (bd) bd.image = reader.result;
                        renderBreakdownList();
                        showToast("Gambar breakdown berhasil diperbarui!", "success");
                    }
                };
                reader.readAsDataURL(file);
            }
        }

        // ============ EQUIPMENT MANAGEMENT ============
        function renderEquipmentAreas() {
            const container = document.getElementById('areaContainer');
            container.innerHTML = '';
            
            const areas = [
                { code: 'A', name: 'AREA 4.2' },
                { code: 'B', name: 'AREA PT.BNN' },
                { code: 'C', name: 'AREA 2.7' }
            ];

            areas.forEach(area => {
                const areaEquipments = state.equipmentList.filter(e => e.area === area.code);
                const html = `
                    <div class="border border-slate-800 rounded-xl p-4 bg-slate-900/40 space-y-4">
                        <div class="flex justify-between items-center border-b border-slate-800 pb-2">
                            <h4 class="text-sm font-bold text-white flex items-center gap-2">📍 ${area.name}</h4>
                            <button onclick="addEquipment('${area.code}')" class="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-transform active:scale-95">
                                ➕ Tambah Alat
                            </button>
                        </div>
                        <div id="area-${area.code}" class="space-y-4">
                            ${areaEquipments.length === 0 ? '<p class="text-xs text-slate-500 italic py-2 text-center">Belum ada unit yang didaftarkan di area ini.</p>' : ''}
                        </div>
                    </div>
                `;
                container.innerHTML += html;
                
                const areaContainer = document.getElementById(`area-${area.code}`);
                if (areaEquipments.length > 0) {
                    areaContainer.innerHTML = '';
                    areaEquipments.forEach(item => {
                        const equipmentHTML = createEquipmentCard(item);
                        areaContainer.innerHTML += equipmentHTML;
                    });
                }
            });
        }

        function createEquipmentCard(item) {
            return `
                <div class="p-4 bg-slate-955 border border-slate-800 rounded-xl flex flex-col gap-4">
                    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div class="relative w-20 h-20 bg-slate-900 rounded-lg overflow-hidden border border-slate-700 flex-shrink-0 group mx-auto sm:mx-0">
                            <div class="w-full h-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-400 font-mono p-1 text-center break-all">${item.image.startsWith('data:') ? 'Uploaded' : item.image}</div>
                            <label class="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity">
                                📷 <span class="text-[9px] text-white">Upload</span>
                                <input type="file" accept="image/*" onchange="handleImageUpload('${item.id}', 'equipment', event)" class="hidden">
                            </label>
                        </div>
                        <div class="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label class="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">Kode Unit</label>
                                <select onchange="handleUnitCodeChange('${item.id}', this.value)" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold outline-none focus:border-blue-500">
                                    ${PREDEFINED_UNITS.map(u => `<option value="${u.code}" ${u.code === item.unitCode ? 'selected' : ''}>${u.label}</option>`).join('')}
                                </select>
                            </div>
                            <div>
                                <label class="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">Pekerjaan</label>
                                <input type="text" value="${item.pekerjaan}" disabled class="w-full bg-slate-900/40 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 italic">
                            </div>
                            <div>
                                <label class="block text-[10px] text-slate-400 font-extrabold uppercase mb-1">Deskripsi</label>
                                <input type="text" value="${item.description || ''}" onchange="state.equipmentList.find(e => e.id === '${item.id}').description = this.value" placeholder="Keterangan tambahan..." class="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500">
                            </div>
                        </div>
                        <button onclick="deleteEquipment('${item.id}')" class="text-red-500 hover:text-red-400 p-1.5 self-end sm:self-center">🗑️</button>
                    </div>
                    <div>
                        <label class="block text-[10px] text-slate-400 font-extrabold uppercase mb-1.5">Zona Kerja Alat:</label>
                        <div class="flex flex-wrap gap-1">
                            ${ZONES.map(zone => {
                                const isSelected = (item.zones || []).includes(zone);
                                return `<button onclick="toggleZone('${item.id}', '${zone}')" class="px-2 py-1 rounded text-[10px] font-bold transition-all ${isSelected ? 'bg-blue-650 text-white shadow-sm' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}">${zone}</button>`;
                            }).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        function addEquipment(areaCode) {
            const newId = 'eq-' + Date.now();
            const defaultUnit = PREDEFINED_UNITS[0];
            state.equipmentList.push({
                id: newId,
                area: areaCode,
                unitCode: defaultUnit.code,
                type: defaultUnit.category,
                pekerjaan: defaultUnit.defaultJob,
                description: '',
                zones: [],
                image: defaultUnit.image
            });
            renderEquipmentAreas();
            const areaNames = { 'A': '4.2', 'B': 'PT.BNN', 'C': '2.7' };
            showToast(`Unit ditambahkan ke Area ${areaNames[areaCode]}`, 'success');
        }

        function handleUnitCodeChange(id, codeValue) {
            const matchedUnit = PREDEFINED_UNITS.find(u => u.code === codeValue);
            if (matchedUnit) {
                const eq = state.equipmentList.find(item => item.id === id);
                if (eq) {
                    eq.unitCode = matchedUnit.code;
                    eq.type = matchedUnit.category;
                    eq.pekerjaan = matchedUnit.defaultJob;
                    eq.image = matchedUnit.image;
                    renderEquipmentAreas();
                }
            }
        }

        function deleteEquipment(id) {
            state.equipmentList = state.equipmentList.filter(item => item.id !== id);
            renderEquipmentAreas();
            showToast("Unit berhasil dihapus.", "info");
        }

        function toggleZone(id, zone) {
            const eq = state.equipmentList.find(item => item.id === id);
            if (eq) {
                if ((eq.zones || []).includes(zone)) {
                    eq.zones = eq.zones.filter(z => z !== zone);
                } else {
                    eq.zones.push(zone);
                }
                renderEquipmentAreas();
            }
        }

        // ============ DASHBOARD RENDERING ============
        function formatDateIndo(dateStr) {
            if (!dateStr) return '';
            const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
            const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
            try {
                const date = new Date(dateStr);
                const dayName = days[date.getDay()];
                const day = date.getDate();
                const month = months[date.getMonth()];
                const year = date.getFullYear();
                return `${dayName}, ${day} ${month} ${year}`;
            } catch {
                return dateStr;
            }
        }

        function renderDashboard() {
            // Update header info
            document.getElementById('printTitle').textContent = state.headerData.title;
            document.getElementById('printDate').textContent = formatDateIndo(state.headerData.date);
            document.getElementById('printShift').textContent = state.headerData.shift;
            document.getElementById('printLostTime').textContent = `${state.headerData.lostTimeStart} - ${state.headerData.lostTimeEnd} (${state.headerData.lostTimeReason || 'Tidak Ada Alasan'})`;
            
            // Manpower
            document.getElementById('printForeman').textContent = state.manpower.foreman;
            document.getElementById('printHSES').textContent = state.manpower.hses;
            document.getElementById('printChecker').textContent = state.manpower.checker;

            const totalManpower = state.manpower.foreman + state.manpower.hses + state.manpower.checker;
            
            // Logo
            if (state.companyLogo) {
                document.getElementById('printLogo').innerHTML = `<img src="${state.companyLogo}" alt="Logo" class="h-14 w-auto max-w-[180px] object-contain">`;
            }

            // Stats
            document.getElementById('statActiveUnits').innerHTML = `${state.equipmentList.length} <span class="text-xs font-normal text-slate-500">Unit</span>`;
            document.getElementById('statBreakdown').innerHTML = `${state.breakdownList.length} <span class="text-xs font-normal text-slate-500">Unit</span>`;
            document.getElementById('statManpower').innerHTML = `${totalManpower} <span class="text-xs font-normal text-slate-500">Orang</span>`;

            // Zone allocation
            const zoneAllocations = {};
            ZONES.forEach(z => { zoneAllocations[z] = []; });
            state.equipmentList.forEach(eq => {
                if (eq.zones && Array.isArray(eq.zones)) {
                    eq.zones.forEach(z => {
                        if (zoneAllocations[z]) {
                            zoneAllocations[z].push(eq.unitCode);
                        }
                    });
                }
            });

            const activeZonesCount = Object.values(zoneAllocations).filter(units => units.length > 0).length;
            document.getElementById('statZones').innerHTML = `${activeZonesCount} <span class="text-xs font-normal text-slate-500">Zona</span>`;

            // Zone map
            const zoneMapGrid = document.getElementById('zoneMapGrid');
            zoneMapGrid.innerHTML = '';
            ZONES.forEach(zone => {
                const unitsInZone = zoneAllocations[zone] || [];
                const isCurrentActive = unitsInZone.length > 0;
                const zoneHTML = `
                    <div class="p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[75px] ${isCurrentActive ? 'border-blue-400 bg-blue-50/20 ring-1 ring-blue-200 shadow-sm' : 'border-slate-200 bg-white'}">
                        <div class="flex justify-between items-center mb-1.5">
                            <span class="text-sm font-black ${isCurrentActive ? 'text-blue-700' : 'text-slate-900'}">${zone}</span>
                            <span class="text-[8px] font-bold text-slate-400 bg-slate-100 rounded px-1">${unitsInZone.length} Unit</span>
                        </div>
                        <div class="flex flex-wrap gap-1">
                            ${isCurrentActive ? unitsInZone.map((unit, idx) => `<span class="bg-blue-600 text-white font-extrabold text-[8px] h-5 px-1.5 inline-flex items-center justify-center rounded shadow-sm leading-none select-none">${unit}</span>`).join('') : '<span class="text-[9px] text-slate-400 italic">Standby/Nihil</span>'}
                        </div>
                    </div>
                `;
                zoneMapGrid.innerHTML += zoneHTML;
            });

            // Equipment listing
            const equipmentListingContainer = document.getElementById('equipmentListingContainer');
            equipmentListingContainer.innerHTML = '';
            
            const areas = [
                { code: 'A', name: 'AREA 4.2' },
                { code: 'B', name: 'AREA PT.BNN' },
                { code: 'C', name: 'AREA 2.7' }
            ];

            areas.forEach((area, areaIdx) => {
                const list = state.equipmentList.filter(e => e.area === area.code);
                const areaHTML = `
                    <div class="space-y-3">
                        <div class="px-4 py-2 rounded-xl border border-slate-300 flex justify-between items-center" style="background-color: #DCDCDC">
                            <h3 class="text-xs font-black tracking-wider text-slate-900 flex items-center gap-1.5 uppercase">
                                📍 ${area.name} - Log Dokumentasi Operasional Alat
                            </h3>
                            <span class="text-[10px] font-extrabold text-slate-700 uppercase bg-white/70 px-2 py-0.5 rounded-lg border border-slate-300">
                                ${list.length} Unit Aktif
                            </span>
                        </div>
                        <div id="area-listing-${area.code}" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            ${list.length === 0 ? '<p class="text-xs text-slate-400 italic pl-3 py-1 col-span-4">Nihil aktivitas alat yang terekam di area ini.</p>' : ''}
                        </div>
                    </div>
                `;
                equipmentListingContainer.innerHTML += areaHTML;

                const areaListing = document.getElementById(`area-listing-${area.code}`);
                list.forEach((item, idx) => {
                    const cardHTML = `
                        <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
                            <div class="relative aspect-square w-full bg-slate-100 overflow-hidden">
                                <div class="absolute top-2.5 left-2.5 bg-slate-900/85 text-white font-extrabold text-[9px] rounded-lg px-2 py-1 z-10">#${idx + 1}</div>
                                <img src="${item.image}" alt="${item.unitCode}" class="w-full h-full object-cover" onerror="this.style.display='none'">
                            </div>
                            <div class="p-3.5 space-y-2 flex-1 flex flex-col justify-between text-xs">
                                <div>
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="inline-flex items-center justify-center bg-blue-600 text-white text-[11px] font-black h-7 px-3 rounded-lg shadow-sm tracking-wide leading-none select-none">${item.unitCode}</span>
                                        <span class="inline-flex items-center justify-center bg-slate-100 text-slate-500 text-[10px] font-bold h-7 px-2 rounded border border-slate-200 leading-none select-none">${item.type}</span>
                                    </div>
                                    <h4 class="font-extrabold text-slate-900 leading-snug tracking-tight">${item.pekerjaan}</h4>
                                    ${item.description ? `<p class="text-slate-500 text-[10px] leading-snug mt-1"><span class="font-semibold text-slate-700">Note:</span> ${item.description}</p>` : ''}
                                </div>
                                ${item.zones && item.zones.length > 0 ? `
                                    <div class="pt-2 border-t border-slate-100 flex flex-wrap gap-1 items-center">
                                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">ZONA:</span>
                                        ${item.zones.map(z => `<span class="inline-flex items-center justify-center bg-blue-50 text-blue-700 text-[10px] font-black h-6 px-2.5 rounded-md border border-blue-200 leading-none select-none">${z}</span>`).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `;
                    areaListing.innerHTML += cardHTML;
                });
            });

            // Breakdown listing
            document.getElementById('breakdownCountBadge').textContent = `${state.breakdownList.length} Unit Kendala`;
            const breakdownListingContainer = document.getElementById('breakdownListingContainer');
            breakdownListingContainer.innerHTML = '';

            if (state.breakdownList.length === 0) {
                breakdownListingContainer.innerHTML = '<p class="text-xs text-slate-400 italic pl-3 py-1 col-span-2">Nihil - Seluruh unit beroperasi normal tanpa kendala mekanikal.</p>';
            } else {
                state.breakdownList.forEach((item) => {
                    const isStandby = item.status === 'Standby';
                    const borderColor = isStandby ? 'border-cyan-200' : 'border-amber-200';
                    const bgColor = isStandby ? 'bg-cyan-50/20' : 'bg-amber-50/20';
                    const statusBgColor = isStandby ? 'bg-cyan-100 text-cyan-800' : 'bg-red-100 text-red-800';
                    const bdHTML = `
                        <div class="border ${borderColor} ${bgColor} rounded-xl p-3 flex gap-3 text-xs">
                            <div class="w-20 h-20 bg-slate-100 border border-slate-200 rounded-lg overflow-hidden flex-shrink-0 font-mono text-[8px] flex items-center justify-center p-1 break-all text-slate-400">
                                ${item.image.startsWith('data:') ? 'Custom Upload' : item.image}
                            </div>
                            <div class="flex-1 flex flex-col justify-center">
                                <div class="flex justify-between items-center">
                                    <span class="font-black text-slate-900 text-sm">${item.unitCode}</span>
                                    <span class="${statusBgColor} text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">${item.status}</span>
                                </div>
                                <p class="text-slate-700 font-medium mt-1.5 text-[11px] bg-white border ${isStandby ? 'border-cyan-100' : 'border-amber-100'} p-1.5 rounded-lg">
                                    <span class="font-bold ${isStandby ? 'text-cyan-800' : 'text-amber-800'}">Keterangan: </span> ${item.note || "Overheat / Leak"}
                                </p>
                            </div>
                        </div>
                    `;
                    breakdownListingContainer.innerHTML += bdHTML;
                });
            }
        }

        // ============ EXPORT FUNCTIONS ============
        function exportToExcel() {
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += `DAILY ACTIVITY MAINTENANCE RESOURCES ID\r\n`;
            csvContent += `Tanggal,${state.headerData.date}\r\n`;
            csvContent += `Shift,${state.headerData.shift}\r\n`;
            csvContent += `Lost Time,${state.headerData.lostTimeStart} - ${state.headerData.lostTimeEnd} (${state.headerData.lostTimeReason})\r\n\r\n`;
            
            const areas = [
                { code: 'A', name: 'AREA 4.2' },
                { code: 'B', name: 'AREA PT.BNN' },
                { code: 'C', name: 'AREA 2.7' }
            ];

            areas.forEach(ar => {
                csvContent += `${ar.name} - LOG AKTIVITAS\r\n`;
                const list = state.equipmentList.filter(e => e.area === ar.code);
                if (list.length === 0) {
                    csvContent += `No Activity Recorded\r\n`;
                } else {
                    csvContent += `No,Kode Unit,Pekerjaan,Zona Operasi,Deskripsi Opsional\r\n`;
                    list.forEach((item, index) => {
                        const zoneStr = (item.zones || []).join(" & ") || "-";
                        csvContent += `${index + 1},${item.unitCode},${item.pekerjaan},${zoneStr},${item.description || '-'}\r\n`;
                    });
                }
                csvContent += `\r\n`;
            });

            csvContent += `UNIT BREAKDOWN & STANDBY\r\n`;
            csvContent += `No,Kode Unit,Status,Keterangan Kendala\r\n`;
            state.breakdownList.forEach((item, index) => {
                csvContent += `${index + 1},${item.unitCode},${item.status},${item.note}\r\n`;
            });
            csvContent += `\r\n`;

            csvContent += `MANPOWER IN SITE\r\n`;
            csvContent += `Foreman,${state.manpower.foreman} Orang\r\n`;
            csvContent += `HSES,${state.manpower.hses} Orang\r\n`;
            csvContent += `Checker/Flagman,${state.manpower.checker} Orang\r\n`;

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Laporan_Hauling_RESOURCES_ID_${state.headerData.date}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast("Berhasil mengekspor data ke file Excel CSV!", "success");
        }

        async function handleExportPNG() {
            showToast("Sedang mengekstrak Gambar resolusi tinggi (Super Sharp)...", "info");
            try {
                const element = document.getElementById("print-area");
                const originalStyle = element.style.cssText;
                element.style.width = "1200px";
                
                const canvas = await html2canvas(element, {
                    useCORS: true,
                    allowTaint: true,
                    scale: 3.5,
                    backgroundColor: "#ffffff",
                    logging: false,
                    letterRendering: true,
                    scrollX: 0,
                    scrollY: -window.scrollY
                });
                
                element.style.cssText = originalStyle;
                
                const dataUrl = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.download = `RESOURCES_ID_Dashboard_${state.headerData.date}.png`;
                link.href = dataUrl;
                link.click();
                showToast("Gambar PNG beresolusi tajam berhasil diunduh!", "success");
            } catch (error) {
                console.error("Gagal membuat gambar:", error);
                showToast("Gagal mengekstrak Gambar tajam.", "error");
            }
        }

        async function handleExportPDF() {
            showToast("Sedang menyusun Dokumen PDF Kualitas Tinggi...", "info");
            try {
                const element = document.getElementById("print-area");
                const originalStyle = element.style.cssText;
                element.style.width = "1200px";
                element.style.minHeight = "auto";
                
                const canvas = await html2canvas(element, {
                    useCORS: true,
                    allowTaint: true,
                    scale: 3.5,
                    backgroundColor: "#ffffff",
                    logging: false,
                    letterRendering: true
                });
                
                element.style.cssText = originalStyle;
                
                const imgData = canvas.toDataURL("image/png");
                const { jsPDF } = window.jspdf;
                
                const pdf = new jsPDF("l", "mm", "a4");
                const pdfWidth = 297;
                const pdfHeight = 210;
                
                const imgWidth = pdfWidth - 10;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                const xOffset = 5;
                const yOffset = Math.max(5, (pdfHeight - imgHeight) / 2);
                
                pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight, undefined, 'FAST');
                pdf.save(`RESOURCES_ID_Laporan_${state.headerData.date}.pdf`);
                showToast("Dokumen PDF berhasil diunduh dengan teks tajam!", "success");
            } catch (error) {
                console.error("Gagal membuat PDF:", error);
                showToast("Gagal menyusun PDF tajam.", "error");
            }
        }

        function handlePrint() {
            window.print();
        }

        // ============ INIT ============
        renderBreakdownList();
        renderEquipmentAreas();
    </script>
</body>
</html>
