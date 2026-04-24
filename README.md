# ✈️ Havalimanı Kapı Atama Sistemi

Kısıt Tatmini (CSP) ve geri izleme araması kullanarak havalimanı kapı atama problemini çözen, sonuçları etkileşimli bir React arayüzüyle görselleştiren tam yığın bir web uygulaması.

---

## Genel Bakış

Verilen bir uçuş ve kapı kümesi için bu sistem, her uçuşu uygun bir kapıya otomatik olarak atar:

- Çakışan iki uçuş aynı kapıyı paylaşamaz
- Her uçak, kapının boyut kapasitesine uygun olmalıdır

Ayrıca bir tarama çizgisi algoritması kullanarak **gereken minimum kapı sayısını** hesaplar (aralık grafiğinin kromatik sayısını bulmaya eşdeğerdir).

---

## Teknoloji Yığını

| Katman | Teknoloji |
|---|---|
| Backend | Python, FastAPI |
| Frontend | React (Vite), Bootstrap |
| Algoritma | CSP Geri İzleme, Tarama Çizgisi |
| Veri | JSON senaryo dosyaları |

---

## Proje Yapısı

```
├── backend/
│   ├── main.py          # FastAPI uygulaması ve /solve uç noktası
│   ├── models.py        # Pydantic modelleri (Flight, Gate)
│   ├── solver.py        # CSP geri izleme + tarama çizgisi algoritması
│   ├── utils.py         # Zaman ayrıştırma, çakışma ve boyut uyum yardımcıları
│   └── data/
│       ├── airport_data.json    # Senaryo 1: Normal
│       ├── airport_data_2.json  # Senaryo 2: Yoğun Saatler
│       └── airport_data_3.json  # Senaryo 3: Kısıtlı Kapılar
│
└── frontend/
    ├── src/
    │   ├── App.jsx              # Kök bileşen, senaryo seçici, sekmeler
    │   ├── components/
    │   │   ├── AssignmentTable  # Uçuş-kapı atama veri tablosu
    │   │   ├── GanttView        # Kapı kullanımının zaman çizelgesi/Gantt görünümü
    │   │   └── ConflictMatrix   # Görsel uçuş çakışma matrisi
    │   ├── hooks/
    │   │   └── useAssignments   # Veri çekme kancası
    │   └── utils/
    │       └── gantt.js         # Gantt grafiği veri oluşturucu
    └── ...
```

---

## Nasıl Çalışır?

### 1. Kısıt Tatmini (CSP)

Çözücü, uçuşlara tek tek kapı atamak için **özyinelemeli geri izleme** kullanır. Her atamadan önce iki kısıt kontrol edilir:

- **Boyut kısıtı** — Uçak boyutu, kapının maksimum kapasitesini geçmemelidir (`Küçük ≤ Orta ≤ Büyük`)
- **Çakışma kısıtı** — Aynı kapıdaki iki uçuşun yer süreleri çakışamaz

Bir uçuş için geçerli kapı bulunamazsa, algoritma geri izar ve önceki bir uçuş için farklı bir atama dener.

### 2. Minimum Kapı Sayısı (Tarama Çizgisi)

Gereken minimum kapı sayısı, uçuş yer sürelerini aralık olarak ele alıp eş zamanlı uçuşların maksimum sayısını bularak hesaplanır — bu, aralık grafiğinin kromatik sayısını bulmaya eşdeğerdir. Olay tabanlı bir tarama ile O(n log n) sürede gerçekleştirilir.

### 3. Veri Modelleri

```python
Flight (Uçuş):  flight_id, arrival, departure, aircraft_size, airline
Gate (Kapı):    gate_id, max_size, terminal
```

Süreler `SS:DD` formatındadır. Uçak ve kapı boyutları `Small (Küçük)`, `Medium (Orta)` veya `Large (Büyük)` olarak belirtilir.

---

## API

### `GET /solve`

Seçilen senaryo üzerinde CSP çözücüyü çalıştırır ve kapı atamalarını döndürür.

**Sorgu Parametreleri**

| Parametre | Tür | Varsayılan | Açıklama |
|---|---|---|---|
| `scenario` | `string` | `airport_data.json` | Çözülecek senaryo dosyasının adı |

**Başarılı Yanıt**

```json
{
  "status": "success",
  "chromatic_number": 4,
  "total_flights": 10,
  "total_gates": 6,
  "assignments": [
    {
      "flight_id": "FL001",
      "gate_id": "G1",
      "terminal": "A",
      "arrival": "08:00",
      "departure": "10:00",
      "aircraft_size": "Large",
      "airline": "Delta"
    }
  ]
}
```

**Hata Yanıtı (geçerli çözüm bulunamadı)**

```
HTTP 422 — Geçerli atama bulunamadı. Gereken minimum kapı sayısı: N
```

---

## Başlarken

### Backend

```bash
cd backend
pip install fastapi uvicorn pydantic

python main.py
# Sunucu http://localhost:8000 adresinde çalışır
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Uygulama http://localhost:5173 adresinde çalışır
```

`main.py` dosyasındaki backend CORS ayarlarının frontend'inizin kaynağını içerdiğinden emin olun.

---

## Senaryolar

| Senaryo | Açıklama |
|---|---|
| **Senaryo 1: Normal** | Standart günlük uçuş programı |
| **Senaryo 2: Yoğun** | Çok sayıda çakışan uçuşla yoğun trafik dönemi |
| **Senaryo 3: Kısıtlı** | Boyut kısıtlamalarıyla sınırlı kapı kullanılabilirliği |

---

## Frontend Görünümleri

- **Veri Tablosu** — Uçuş detayları, kapı ve terminal bilgilerini içeren tam atama sonuçları
- **Gantt Grafiği** — Gün boyunca kapı kullanımını gösteren zaman çizelgesi görünümü
- **Çakışma Matrisi** — Hangi uçuşların yer sürelerinin çakıştığını vurgulayan görsel matris

---

## Dağıtım

Frontend **Netlify** üzerinde dağıtılmıştır (`https://flight-csp.netlify.app`). `main.py` dosyasındaki backend CORS yapılandırması, bu kaynaktan gelen isteklere ve yerel geliştirme için `localhost:3000` ile `localhost:5173` adreslerine izin vermektedir.
