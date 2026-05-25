# Vidtory Creative AI Skills

Hệ thống **Vidtory Creative AI Skills** là bộ kỹ năng (Skills) chuyên nghiệp dành cho AI Agents, được tối ưu hóa để tương tác với **Vidtory BAPI**. Hệ thống giúp các doanh nghiệp, thương hiệu thời trang, và nhà bán hàng TMĐT tự động hóa quy trình thiết kế hình ảnh, sản xuất video unboxing, catwalk thời trang, và tạo các video quảng cáo TVC chất lượng cao với chi phí tối ưu.

---

## 🚀 Cơ Chế Xử Lý Song Song Tối Ưu Thời Gian (Parallel Processing Strategy)

Để mang lại trải nghiệm tốt nhất và tối ưu hóa thời gian chờ đợi của khách hàng, Vidtory Creative Skills áp dụng cơ chế **gửi hàng loạt yêu cầu song song (Parallel Request/Batching)**. 

Thay vì sinh tuần tự từng ảnh hoặc video khiến quy trình thử-sai (trial-and-error) kéo dài và gây sốt ruột cho người dùng, cơ chế này khởi tạo đồng thời nhiều phương án thiết kế (concepts), nhiều góc chụp, góc quay, hoặc các sắc tộc/giới tính người mẫu khác nhau trong cùng một thời điểm. Chỉ sau một lần đợi duy nhất (dưới 10-15 giây), khách hàng sẽ có ngay một bộ sưu tập tùy chọn phong phú, chất lượng cao để so sánh và lựa chọn. Cách tiếp cận này giúp tối ưu hóa triệt để hiệu năng của Vidtory BAPI, đảm bảo khách hàng luôn nhận được giá trị tối đa và cảm thấy an tâm về chi phí sử dụng tài nguyên một cách minh bạch, hiệu quả nhất.


---

## 📂 Cấu Trúc Hệ Thống Phân Hệ Nghiệp Vụ

Hệ thống được tái cơ cấu theo 3 phân hệ nghiệp vụ kinh doanh chính:

```
Vidtory-Skill/
├── README.md
├── .gitignore
├── skills-lock.json
└── .agents/
    └── skills/
        ├── vidtory-cli.js           # Shared CLI Core (Upload, TTS, Polling)
        ├── vidtory-brandos/
        │   └── SKILL.md             # Phân hệ Thương hiệu & Dịch vụ
        ├── vidtory-fashion/
        │   └── SKILL.md             # Phân hệ Thời trang & VTON
        ├── vidtory-ecom/
        │   └── SKILL.md             # Phân hệ Sàn TMĐT & Affiliate Video
        └── vidtory-soul-id/
            └── characters.json      # Database nhân vật đồng nhất khuôn mặt
```

### 1. 🏢 Phân hệ `vidtory-brandos` (Thương hiệu & Dịch vụ)
*   **Mô hình chủ lực**: `gemini-3.1-flash-image-preview` (tối ưu hóa vẽ văn bản, logo, đường nét vector sắc sảo).
*   **Tính năng cốt lõi**:
    *   **Brand Kit Configuration**: Đồng bộ bảng màu thương hiệu (Color Palette) và phong cách mỹ thuật (isometric, flat art) chống lệch tông.
    *   **Visual Metaphor System**: Quy đổi các dịch vụ vô hình (SaaS, Bảo hiểm, Tài chính) thành hình ảnh ẩn dụ 3D nghệ thuật.
    *   **Typography Rule**: Bọc chữ hiển thị trên nhãn mác bao bì trong dấu nháy đơn (`'TEXT'`) giúp kết xuất chữ chuẩn xác 100%.

### 2. 👗 Phân hệ `vidtory-fashion` (Thời trang & Người mẫu AI)
*   **Mô hình chủ lực**: `/generative-core/image` kết hợp `sampleCharacterUrl` và `veo-3.1-fast-generate-001`.
*   **Tính năng cốt lõi**:
    *   **Garment-Fit VTON**: Thử trang phục phẳng lên dáng người mẫu AI mà không làm méo mó, biến dạng phom dáng vải gốc.
    *   **Outfit Style Archetypes**: Công thức phối đồ và phụ kiện chuẩn stylist (Quiet Luxury, Streetwear, Workwear).
    *   **Veo Physics**: Từ khóa điều hướng chuyển động vật lý của vải (độ rũ, tung bay tự nhiên) trong video catwalk.
    *   **Face Consistency**: Giữ nhất quán khuôn mặt người mẫu qua database nhân vật cục bộ (`characters.json`).

### 3. 🛒 Phân hệ `vidtory-ecom` (Sàn TMĐT & Video Affiliate)
*   **Mô hình chủ lực**: `/generative-core/image` (batching tạo card), `/generative-core/video` (Veo), và `/generative-core/audio` (ElevenLabs).
*   **Tính năng cốt lõi**:
    *   **A+ Listing Sets**: Tạo trọn bộ ảnh sàn TMĐT đồng bộ góc chụp và hướng chiếu sáng studio.
    *   **UGC Scripting Psychology**: Cấu trúc kịch bản UGC giữ chân người xem (Hook 3s -> Painpoint -> Solution -> CTA) kèm ánh xạ giọng đọc thích hợp.
    *   **Timing Alignment**: Công thức đồng bộ độ dài ký tự thoại thuyết minh khớp khít thời lượng video (tốc độ đọc trung bình 2.5 từ/giây).
    *   **No-BGM Rule**: Tuyệt đối không sinh nhạc nền vào các tệp phân cảnh lẻ để tránh vấp nhạc khi ghép nối video dài.

---

## 🛠️ Hướng Dẫn CLI Xử Lý Core (`vidtory-cli.js`)

Tập lệnh CLI dùng để kết nối trực tiếp với API của Vidtory.

### Khai báo API Key:
```bash
export VIDTORY_API_KEY="your-api-key"
```

### Các Lệnh Gọi Chính:
```bash
# 1. Tạo nhân vật mới lưu cục bộ (Face-ID)
node .agents/skills/vidtory-cli.js character-create \
  --name "lily" \
  --image ./lily_portrait.png \
  --prompt "a beautiful asian female model in her 20s"

# 2. Sinh ảnh thời trang đồng nhất khuôn mặt Lily
node .agents/skills/vidtory-cli.js generate-image \
  --prompt "High fashion portrait of model wearing a premium coat" \
  --soulId "lily" \
  --aspectRatio 3:4

# 3. Sinh giọng đọc thuyết minh (TTS) tiếng Việt
node .agents/skills/vidtory-cli.js generate-audio \
  --prompt "Hộp quà mỹ phẩm cao cấp siêu xịn sò cho các nàng!" \
  --voiceId "a3AkyqGG4v8Pg7SWQ0Y3" # Giọng đọc Ngan

# 4. Sinh video unboxing (Veo)
node .agents/skills/vidtory-cli.js generate-video \
  --prompt "A close up of cosmetic jar being opened, slow motion" \
  --refImageUrl ./cosmetic_jar.png \
  --aspectRatio 9:16 --duration 5
```

---

## 🎬 Kiến Trúc Sản Xuất Video TVC 60s Tự Động

Để sản xuất các video marketing dài có giá trị thương mại lớn (TVC, video unboxing 60s có lồng tiếng thuyết minh và nhạc nền), hệ thống sử dụng một script điều khiển tự động (`scratch/generate-tvc-60s.js`):

1.  **Storyboard Planning**: Lên kịch bản gồm 12 phân cảnh ngắn (mỗi cảnh 5 giây).
2.  **Parallel Requests**: Gửi đồng thời 24 API calls (12 video, 12 audio thoại) trong nền để tối ưu hóa thời gian xử lý.
3.  **Timing Sync Engine**: Tự động đo đạc độ dài âm thanh và điều chỉnh khớp nối thời lượng video.
4.  **FFmpeg Assembly**: 
    *   Mux (ghép) audio + video của từng cảnh lẻ.
    *   Concatenate (nối) 12 phân cảnh lẻ thành chuỗi video 60s.
    *   Download nhạc nền BGM độc lập và lồng dưới toàn bộ video, điều chỉnh giảm âm lượng nhạc nền (-15dB) nhỏ hơn âm thoại thuyết minh để tránh bị cắt giật cục nhạc.

---

## 🌐 Tài Liệu Tích Hợp API BAPI Trực Tiếp (Direct API Reference)

Nếu bạn hoặc các tác nhân AI (AI Agents) của bạn cần tương tác trực tiếp với Vidtory BAPI qua giao thức HTTP (ví dụ: dùng `curl` hoặc các thư viện request), hãy tuân thủ chính xác các cấu hình sau:

### 1. Thông Tin Chung
*   **Base URL**: `https://bapi.vidtory.net`
*   **Header Xác Thực**: Sử dụng `x-api-key: <your-api-key>` (Tuyệt đối **KHÔNG** sử dụng `Authorization: Bearer`).

### 2. API Tải Ảnh/Video Lên (Media Upload)
*   **HTTP Method**: `POST`
*   **Path**: `/media/upload` (Tuyệt đối **KHÔNG** dùng `/upload`).
*   **Content-Type**: `multipart/form-data`
*   **Body Parameters**:
    *   `file` (Kiểu tệp tin, chứa dữ liệu ảnh/video cần upload).
*   **Ví dụ Curl chính xác**:
    ```bash
    curl -X POST "https://bapi.vidtory.net/media/upload" \
      -H "x-api-key: $VIDTORY_API_KEY" \
      -F "file=@/mnt/user-data/uploads/1779716203802_image.png"
    ```
*   **Phản hồi mẫu thành công**:
    ```json
    {
      "success": true,
      "data": {
        "id": "media-uuid",
        "url": "https://b2b.vidtory.net/..."
      }
    }
    ```

