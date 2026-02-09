import streamlit as st
import folium
from streamlit_folium import st_folium
from streamlit_js_eval import get_geolocation # Library baru untuk GPS nyata
import pandas as pd
import random

# --- KONFIGURASI HALAMAN ---
st.set_page_config(
    page_title="GeoRisk",
    page_icon="🌋",
    layout="wide"
)

# --- STYLE CSS KUSTOM ---
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        color: #1E3A8A;
        text-align: center;
        margin-bottom: 1rem;
    }
    
    /* CSS untuk Kartu Risiko (Tidak Diubah) */
    .risk-score-high {
        background-color: #FEE2E2;
        padding: 20px;
        border-radius: 10px;
        border-left: 5px solid #DC2626;
        color: #991B1B;
    }
    .risk-score-medium {
        background-color: #FEF3C7;
        padding: 20px;
        border-radius: 10px;
        border-left: 5px solid #D97706;
        color: #92400E;
    }
    .risk-score-low {
        background-color: #D1FAE5;
        padding: 20px;
        border-radius: 10px;
        border-left: 5px solid #059669;
        color: #065F46;
    }
    
    /* Menyembunyikan tombol default streamlit-js-eval agar lebih rapi */
    div[data-testid="stButton"] button {
        width: 100%;
    }

    /* --- CUSTOM NAVIGATION MENU STYLE --- */
    
    /* 1. Menyembunyikan lingkaran radio button bawaan */
    [data-testid="stSidebar"] [data-testid="stRadio"] label > div:first-child {
        display: none;
    }

    /* 2. Mengatur gaya dasar untuk setiap item menu */
    [data-testid="stSidebar"] [data-testid="stRadio"] label {
        padding: 10px 15px;
        margin-bottom: 8px;
        border-radius: 8px;
        transition: all 0.3s ease;
        cursor: pointer;
        border: 1px solid transparent; /* Border transparan default */
    }

    /* 3. Efek Hover (Saat mouse di atas menu) */
    [data-testid="stSidebar"] [data-testid="stRadio"] label:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    /* 4. Efek Selected (Saat menu dipilih) - Faded Shadow Box */
    /* Menggunakan selector :has() untuk mendeteksi input yang dicentang di dalamnya */
    [data-testid="stSidebar"] [data-testid="stRadio"] label:has(input:checked) {
        background-color: #FFFFFF; /* Latar belakang putih */
        color: #1E3A8A; /* Warna teks biru tua */
        font-weight: bold;
        /* Bayangan Pudar (Faded Shadow) */
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05);
        border: 1px solid #E5E7EB; /* Border tipis halus */
        transform: translateX(5px); /* Sedikit geser ke kanan agar dinamis */
    }

</style>
""", unsafe_allow_html=True)

# --- MOCKUP DATA ---
def get_mock_risk_data(lat, lon):
    # Logika dummy: Jika koordinat dekat Cisarua/Lembang, risiko tinggi
    # Cisarua approx: -6.79, 107.56
    dist_sq = (lat - (-6.79))**2 + (lon - 107.56)**2
    
    if dist_sq < 0.01: # Radius sangat dekat
        return {
            "level": "TINGGI",
            "score": 8.5,
            "pga": "0.65 g",
            "vs30": "180 m/s (Tanah Lunak)",
            "jarak_sesar": "2.1 km (Sesar Lembang)",
            "litologi": "Qvu (Batuan Gunungapi Muda)",
            "saran": "Konstruksi bangunan wajib tahan gempa standar SNI 1726:2019. Waspada likuifaksi."
        }
    elif dist_sq < 0.05:
        return {
            "level": "SEDANG",
            "score": 5.2,
            "pga": "0.35 g",
            "vs30": "360 m/s (Tanah Sedang)",
            "jarak_sesar": "8.5 km (Sesar Lembang)",
            "litologi": "Ql (Endapan Danau)",
            "saran": "Periksa struktur bangunan. Siapkan jalur evakuasi."
        }
    else:
        return {
            "level": "RENDAH",
            "score": 2.1,
            "pga": "0.15 g",
            "vs30": "760 m/s (Batuan Keras)",
            "jarak_sesar": "> 15 km",
            "litologi": "Tmb (Formasi Batuan Tua)",
            "saran": "Wilayah relatif stabil, tetap waspada gempa megathrust."
        }

# --- HALAMAN UTAMA ---

def main():
    # Header
    st.markdown('<h1 class="main-header">Mitigasi Risiko Gempa Bumi Terintegrasi<br><span style="font-size: 1.2rem; font-weight: normal;">Studi Kasus: Kecamatan Cisarua, Jawa Barat</span></h1>', unsafe_allow_html=True)
    
    # Inisialisasi Session State untuk menyimpan Koordinat (Agar bisa diupdate oleh GPS)
    if 'lat_val' not in st.session_state:
        st.session_state.lat_val = -6.7900
    if 'lon_val' not in st.session_state:
        st.session_state.lon_val = 107.5600

    # Sidebar Navigasi
    with st.sidebar:
        st.image("https://cdn-icons-png.freepik.com/512/17116/17116657.png", width=50) 
        st.title("Analisis Mitigasi Gempa")
        
        # NOTE: Fungsi tetap sama, hanya tampilannya berubah karena CSS di atas
        menu = st.radio("Navigasi Menu", ["Beranda & Latar Belakang", "Peta Analisis Risiko", "Edukasi & Mitigasi"], label_visibility="collapsed")
        
        st.info("**Info PKM-RE:**\nPrototype ini menggunakan data simulasi untuk keperluan demonstrasi proposal.")

    if menu == "Beranda & Latar Belakang":
        col1, col2 = st.columns([2, 1])
        with col1:
            st.write("### Selamat Datang di GeoRisk Dashboard")
            st.write("""
            Platform ini dirancang untuk memberikan informasi risiko gempa bumi secara **real-time** dan **spesifik lokasi** (mikrozonasi).
            Menggunakan pendekatan **Weighted Overlay** dari parameter geofisika:
            """)
            st.markdown("""
            * 🌊 **Peak Ground Acceleration (PGA)**: Percepatan tanah maksimum.
            * 🪨 **Vs30**: Kecepatan gelombang geser (kekerasan tanah).
            * 🌋 **Litologi**: Jenis batuan geologi.
            * 📏 **Jarak Patahan**: Kedekatan dengan Sesar Lembang & Cimandiri.
            """)
        with col2:
            st.write("### Statistik Wilayah")
            st.metric(label="Populasi Cisarua", value="± 80.000 Jiwa")
            st.metric(label="Potensi Mag. Sesar Lembang", value="6.8 Mw", delta="Siaga")

    elif menu == "Peta Analisis Risiko":
        st.write("### 📍 Analisis Mikrozonasi Interaktif")
        st.write("Peta di bawah ini menampilkan integrasi data geofisika. Silakan pilih lokasi untuk analisis detail.")

        # --- MEMBUAT PETA FOLIUM (VISUALISASI SIMBOLIK) ---
        # Menggunakan koordinat dari Session State agar peta bergeser saat GPS aktif
        center_lat = st.session_state.lat_val
        center_lon = st.session_state.lon_val
        
        # 1. Setup Peta Dasar
        m = folium.Map(location=[center_lat, center_lon], zoom_start=9, tiles="OpenStreetMap") # Zoom out sedikit agar Jabar terlihat
        
        # --- Feature Groups (Layer Control) ---
        fg_boundary = folium.FeatureGroup(name="Batas Wilayah Jawa Barat") # LAYER BARU
        fg_faults = folium.FeatureGroup(name="Patahan Aktif (Sesar Lembang)")
        fg_vs30 = folium.FeatureGroup(name="Vs30 (Kondisi Tanah)")
        fg_pga = folium.FeatureGroup(name="Distribusi PGA")
        fg_history = folium.FeatureGroup(name="Kegempaan Historis")

        # --- LAYER BARU: BATAS WILAYAH JAWA BARAT (Garis Putus-putus Biru) ---
        # Koordinat kasar polygon Jawa Barat
        jabar_boundary_coords = [
            [-5.9, 106.7], [-6.2, 106.6], [-6.6, 106.4], # Perbatasan Barat (Banten)
            [-7.0, 106.4], [-7.4, 106.5], [-7.7, 107.0], # Pantai Selatan
            [-7.8, 108.0], [-7.7, 108.6],                # Pantai Selatan
            [-7.3, 108.8], [-6.7, 108.9],                # Perbatasan Timur (Jateng)
            [-6.3, 108.2], [-6.1, 107.8], [-5.9, 107.2], # Pantai Utara
            [-5.9, 106.7]                                # Menutup Loop
        ]
        
        folium.PolyLine(
            locations=jabar_boundary_coords,
            color="blue",
            weight=3,
            opacity=0.6,
            dash_array='10, 10', # Efek garis putus-putus
            tooltip="Batas Administrasi Jawa Barat"
        ).add_to(fg_boundary)

        # 2. Layer Patahan Aktif
        folium.PolyLine(
            locations=[[-6.80, 107.45], [-6.81, 107.70]], 
            color="red", weight=5, opacity=0.8, dash_array='10',
            tooltip="Jalur Sesar Lembang (Aktif)", 
            popup="Sesar Lembang - Potensi Mag: 6.8 Mw"
        ).add_to(fg_faults)

        # 3. Layer Vs30 (Visualisasi Area Poligon)
        folium.Polygon(
            locations=[[-6.78, 107.55], [-6.78, 107.58], [-6.80, 107.58], [-6.80, 107.55]],
            color="orange", fill=True, fill_color="orange", fill_opacity=0.4, weight=1,
            tooltip="Zona Vs30 Rendah (Tanah Lunak)"
        ).add_to(fg_vs30)
        
        folium.Polygon(
            locations=[[-6.80, 107.55], [-6.82, 107.58], [-6.82, 107.52], [-6.80, 107.52]],
            color="green", fill=True, fill_color="green", fill_opacity=0.4, weight=1,
            tooltip="Zona Vs30 Tinggi (Tanah Keras)"
        ).add_to(fg_vs30)

        # 4. Layer PGA (Heatmap Circle Visual)
        folium.Circle(
            location=[-6.805, 107.575], radius=1500,
            color="purple", fill=True, fill_color="purple", fill_opacity=0.3, weight=0,
            tooltip="Zona PGA Tinggi (> 0.5g)"
        ).add_to(fg_pga)

        # 5. Layer Kegempaan Historis
        folium.CircleMarker(
            location=[-6.785, 107.565], radius=6, color="black", fill=True, fill_color="red",
            tooltip="Gempa 2011 (M 3.3)"
        ).add_to(fg_history)
        folium.CircleMarker(
            location=[-6.795, 107.595], radius=8, color="black", fill=True, fill_color="red",
            tooltip="Gempa 2017 (M 4.1)"
        ).add_to(fg_history)

        # 6. MARKER LOKASI USER (Dinamis mengikuti GPS/Input)
        folium.Marker(
            [center_lat, center_lon],
            popup="Lokasi Anda / Titik Analisis",
            icon=folium.Icon(color="blue", icon="user", prefix="fa"),
            tooltip="Lokasi Terpilih"
        ).add_to(m)

        # Tambahkan semua layer ke peta
        fg_boundary.add_to(m) # Menambahkan Batas Wilayah ke Peta
        fg_vs30.add_to(m)
        fg_pga.add_to(m)
        fg_faults.add_to(m)
        fg_history.add_to(m)
        
        folium.LayerControl(collapsed=False).add_to(m)

        # --- RENDER PETA ---
        st_data = st_folium(m, width="100%", height=550)

        st.divider()

        # --- INPUT CONTROLS (DITEMPATKAN DI BAWAH PETA) ---
        st.subheader("🛠️ Panel Input & Analisis")
        
        c1, c2, c3 = st.columns([1, 2, 1])
        
        with c1:
            st.write("**Opsi Lokasi:**")
            # --- FUNGSI GPS NYATA ---
            # Menambahkan label manual karena fungsi tidak menerima argumen label
            st.write("📡 Deteksi Lokasi Saya") 
            # PERBAIKAN: Menghapus argumen 'label' yang menyebabkan error
            gps_data = get_geolocation(component_key='get_loc')
            
            # Jika tombol diklik dan browser memberikan izin lokasi
            if gps_data:
                st.session_state.lat_val = gps_data['coords']['latitude']
                st.session_state.lon_val = gps_data['coords']['longitude']
                st.toast("📍 Lokasi GPS Berhasil Ditemukan!", icon="✅")
                # Halaman akan otomatis rerun dan peta serta input akan terupdate
        
        with c2:
            st.write("**Koordinat Input:**")
            sub_c1, sub_c2 = st.columns(2)
            # Input number terhubung dengan session_state melalui parameter 'key'
            with sub_c1:
                # Menggunakan key untuk sinkronisasi dua arah (GPS -> Input)
                lat_input = st.number_input("Latitude", key="lat_val", format="%.5f", step=0.0001)
            with sub_c2:
                lon_input = st.number_input("Longitude", key="lon_val", format="%.5f", step=0.0001)

        with c3:
            st.write("**Aksi:**")
            analyze_btn = st.button("🔍 Hitung Risiko", type="primary", use_container_width=True)

        # --- LOGIKA HASIL ANALISIS ---
        if analyze_btn:
            st.markdown("---")
            st.subheader("📊 Hasil Analisis Risiko Geofisika")
            
            # Gunakan nilai dari session state/input
            result = get_mock_risk_data(lat_input, lon_input)
            
            # Tentukan CSS class berdasarkan level
            css_class = "risk-score-low"
            if result['level'] == "TINGGI":
                css_class = "risk-score-high"
            elif result['level'] == "SEDANG":
                css_class = "risk-score-medium"

            # Tampilan Kartu Hasil
            st.markdown(f"""
            <div class="{css_class}">
                <h3>Tingkat Risiko: {result['level']} (Skor: {result['score']}/10)</h3>
                <p><strong>Rekomendasi Utama:</strong> {result['saran']}</p>
            </div>
            """, unsafe_allow_html=True)
            
            # Detail Parameter
            col_res1, col_res2, col_res3, col_res4 = st.columns(4)
            col_res1.metric("PGA (Guncangan)", result['pga'])
            col_res2.metric("Vs30 (Kondisi Tanah)", result['vs30'])
            col_res3.metric("Jarak Patahan", result['jarak_sesar'])
            col_res4.metric("Litologi", result['litologi'])
            
            with st.expander("Lihat Perhitungan Teknis (Metodologi)"):
                st.latex(r'''
                RiskIndex = (W_{PGA} \times S_{PGA}) + (W_{Vs30} \times S_{Vs30}) + (W_{Dist} \times S_{Dist})
                ''')
                st.write("Dimana bobot (W) ditentukan berdasarkan AHP (Analytic Hierarchy Process).")

    elif menu == "Edukasi & Mitigasi":
        st.write("### 📚 Ensiklopedia Kebencanaan")
        tab1, tab2 = st.tabs(["Apa itu PGA?", "Prosedur Evakuasi"])
        
        with tab1:
            st.image("https://upload.wikimedia.org/wikipedia/commons/d/d3/Shakemap_Example.jpg", caption="Contoh Peta PGA (USGS)", width=400)
            st.write("""
            **Peak Ground Acceleration (PGA)** adalah ukuran seberapa kuat tanah berguncang saat gempa terjadi. 
            Berbeda dengan Skala Richter yang mengukur energi di pusat gempa, PGA mengukur dampak di lokasi Anda berdiri.
            """)
        
        with tab2:
            st.write("1. **Drop**: Jatuhkan diri ke lantai.")
            st.write("2. **Cover**: Lindungi kepala dan leher (masuk ke bawah meja).")
            st.write("3. **Hold On**: Pegangan pada kaki meja.")

if __name__ == "__main__":
    main()