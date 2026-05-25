---
version: 0.3.0
name: vidtory-ecom
description: |
  Generate e-commerce physical product listing cards (Amazon A+) and affiliate marketing
  short-form videos via Vidtory BAPI.
  Uses gemini-3.1-flash-image-preview for listing cards, veo-3.1-fast-generate-001
  for promotional videos, and eleven_v3 for audio TTS voiceovers.
argument-hint: "generate-image|generate-video|generate-audio [params]"
allowed-tools: Bash
---

# Vidtory Ecom (Sàn TMĐT & Video Affiliate)

Phân hệ `vidtory-ecom` chuyên phục vụ cho các nhà bán hàng sản phẩm vật lý (e-commerce) và những người sáng tạo nội dung tiếp thị liên kết (Affiliate Marketers). Phân hệ này tập trung vào 2 tác vụ chính: **Tạo trọn bộ ảnh Listing sàn TMĐT** và **Sản xuất Video Affiliate Thuyết Minh (Script-to-Video)**.

---

## Hướng Dẫn Tối Ưu Giải Quyết Painpoint Thương Mại Điện Tử

### 1. Đồng Bộ Ánh Sáng & Góc Quay Cho Bộ Ảnh (A+ Listing Sets)
Để giải quyết lỗi **lệch màu sắc sản phẩm và hướng ánh sáng** giữa các bức ảnh trong cùng một bộ Amazon A+/Shopify Listing, hãy luôn cố định các thông số kỹ thuật này trong prompt của mọi thẻ ảnh:
- **Hướng sáng cố định**: Luôn mô tả `"directional soft studio light, catalog studio lighting, clean soft ambient shadows"`.
- **Đồng bộ bối cảnh**: Khi đổi góc chụp, giữ nguyên chất liệu bệ đỡ và phông nền. Ví dụ:
  - *Lifestyle*: `"placed on a light marble bathroom countertop, in use, bright morning sun, background blurred"`
  - *Whats in box*: `"flatlay on a light marble surface, top down view"`

### 2. Tâm Lý Học UGC & Kịch Bản Thuyết Minh (Affiliate Psychology)
Để giải quyết bài toán **kịch bản sáo rỗng và giọng đọc thiếu thuyết phục**, hãy áp dụng bộ khung kịch bản UGC (User Generated Content) chuẩn:
- **Cấu trúc kịch bản 3 phân cảnh**:
  1.  **Hook (3s đầu)**: Đưa ra vấn đề/nỗi đau trực tiếp. Ví dụ: *"Răng ố vàng, hôi miệng dù đánh răng ngày 2 lần?"*
  2.  **Tính năng & Trải nghiệm (Solution)**: Cho thấy sản phẩm giải quyết vấn đề đó thế nào. Ví dụ: *"Bàn chải rung siêu âm này sẽ lấy đi mọi mảng bám cứng đầu nhất."*
  3.  **Kêu gọi hành động (CTA)**: Giữ chân người mua bấm link. Ví dụ: *"Ưu đãi 50% chỉ có trong giỏ hàng hôm nay!"*
- **Ánh xạ giọng đọc tương thích cảm xúc**:
  *   *Mỹ phẩm, Đồ làm đẹp (Cần gần gũi, tỉ tê)*: Chọn giọng **Ngan** (`a3AkyqGG4v8Pg7SWQ0Y3`) - Bubbly & Authentic hoặc **Trang** (`HAAKLJlaJeGl18MKHYeg`) - Soft & Peaceful.
  *   *Công nghệ, Đồ gia dụng (Cần tin cậy, rõ ràng)*: Chọn giọng **Tuan** (`9EE00wK5qV6tPtpQIxvy`) - Friendly & Calm hoặc **Tung Dang** (`1d5Bb0SMBPB10Gx6iQeu`) - Northern Warm.

### 3. Đồng Bộ Thời Lượng Khớp Video-Audio (Timing Alignment)
Để giải quyết lỗi **lệch pha thời gian** (video unboxing 4s nhưng tiếng thuyết minh đọc hết 6s):
- **Công thức ước lượng**: Tốc độ nói tiếng Việt tự nhiên là **130-150 từ/phút**, tương đương trung bình **2.5 từ mỗi giây**.
- **Quy tắc kịch bản**:
  *   *Video phân cảnh 4 giây*: Giới hạn kịch bản thuyết minh tối đa **10 từ**.
  *   *Video phân cảnh 6 giây*: Giới hạn kịch bản thuyết minh tối đa **15 từ**.
  *   *Video phân cảnh 8 giây*: Giới hạn kịch bản thuyết minh tối đa **20 từ**.

### 4. Quy Tắc Âm Thanh Cảnh Lẻ: Chỉ Chứa Tiếng Nói & Tiếng Động Foley (SFX), Không Có Nhạc Nền (No BGM)
Để giải quyết lỗi **nhạc nền bị vấp, giật cục** khi ghép nối các clip ngắn 5s-8s thành TVC dài:
- **Nguyên tắc cốt lõi**: Âm thanh sinh ra từ các cuộc gọi API riêng lẻ phải **tuyệt đối không chứa nhạc nền (BGM)**. Chỉ chứa giọng thoại thuần (clean voiceover) và hiệu ứng âm thanh (sound effects - SFX) chân thực nếu cần.
- **Cách áp dụng**: Nhạc nền (BGM) sẽ là **Optional** và chỉ được lồng duy nhất **1 tệp chạy suốt từ đầu đến cuối** ở bước ghép nối video (FFmpeg/CapCut) hoàn thiện TVC, thay vì nhúng vào từng tệp âm thanh cảnh lẻ.

---


## 1. Thiết Kế Bộ Ảnh Sàn TMĐT (Amazon A+ / Shopify Listings)

Hệ thống sẽ chạy song song các cuộc gọi API để sinh ra toàn bộ các thẻ ảnh TMĐT cho sản phẩm thô cùng một lúc (Cơ chế Xử lý Song song - Parallel Processing) với ánh sáng studio đồng bộ nhằm tối ưu thời gian chờ đợi của nhà bán hàng:


### Các Card Template & Prompt:
*   **main_image (Nền trắng)**: `"Marketplace main listing photo of [product-name], centered, pure solid white background, directional soft studio light, catalog studio lighting, crisp details"`
*   **whats_in_box (Flatlay phụ kiện)**: `"Knolling flatlay of [product-name] and all its included accessories neatly organized on a light marble surface, top down view, directional soft studio light, catalog studio lighting"`
*   **lifestyle (Sử dụng thực tế)**: `"E-commerce lifestyle photography of [product-name] placed on a light marble bathroom countertop, in use, bright morning sun, background blurred, catalog studio lighting"`
*   **detail_shot (Cận cảnh chất liệu)**: `"Macro extreme close up detail shot of [product-name] showing texture and premium materials, shallow depth of field, directional soft studio light"`

### Lệnh chạy đồng thời (Batching):
```bash
node vidtory-cli.js generate-image --prompt "Marketplace main listing photo of electric toothbrush, centered, pure solid white background, directional soft studio light" --refImageUrl ./toothbrush.png --aspectRatio 1:1 &
node vidtory-cli.js generate-image --prompt "Knolling flatlay of electric toothbrush and charger head, neatly organized on a light marble surface, top down view, directional soft studio light" --refImageUrl ./toothbrush.png --aspectRatio 1:1 &
```

---

## 2. Quy Trình Sản Xuất Video Affiliate Thuyết Minh (Script-to-Video)

### Bước 1: Liệt kê danh sách giọng đọc tiếng Việt/Anh để lựa chọn
```bash
node vidtory-cli.js voices-list --language vi
```

### Bước 2: Chia kịch bản và sinh audio thuyết minh (Áp dụng quy tắc Timing)
Sinh audio ngắn khớp thời lượng phân cảnh video đích:
```bash
# Phân cảnh 1 (Dự kiến video 4 giây -> Kịch bản dưới 10 từ)
node vidtory-cli.js generate-audio \
  --prompt "Bàn chải rung siêu âm thế hệ mới chải siêu sạch!" \
  --voiceId 9EE00wK5qV6tPtpQIxvy

# Phân cảnh 2 (Dự kiến video 5 giây -> Kịch bản dưới 12 từ)
node vidtory-cli.js generate-audio \
  --prompt "Ba chế độ chăm sóc răng nướu chuyên sâu hiệu quả." \
  --voiceId 9EE00wK5qV6tPtpQIxvy
```

### Bước 3: Sinh video unboxing/catwalk động tương ứng (Áp dụng Động lực học Veo)
```bash
# Video Phân cảnh 1 (Unboxing động sản phẩm - 4 giây)
node vidtory-cli.js generate-video \
  --prompt "Extreme close up of electric toothbrush vibrating, water droplets splashing, slow motion rotation" \
  --refImageUrl ./toothbrush.png --aspectRatio 9:16 --duration 4 &

# Video Phân cảnh 2 (Dùng người mẫu ảo - 5 giây)
node vidtory-cli.js generate-video \
  --prompt "A young woman brushing teeth, smiling in front of bathroom mirror, warm sunlight" \
  --refImageUrl ./bathroom.png --soulId "model_asian_lily" --aspectRatio 9:16 --duration 5 &
```

### Bước 3b: Tạo video mở hộp / biến hình sản phẩm bằng Start + End Frame
Để tạo các video unboxing mở hộp chân thực hoặc biến hình sản phẩm phục vụ quảng cáo:
*   **Workflow**:
    1.  Sinh **Start Frame** (ảnh hộp sản phẩm đóng kín bóng bẩy).
    2.  Sinh **End Frame** (ảnh sản phẩm mở ra hoàn chỉnh bên cạnh vỏ hộp).
    3.  Gọi lệnh `generate-video` truyền ảnh bắt đầu vào `--refImageUrl` và ảnh kết thúc vào `--refImageEndUrl`.
*   **Template**: `"Product unboxing transition, the packaging box smoothly opens to reveal the product inside, slow motion opening animation, realistic physics, soft studio lighting"`

### Bước 4: Hoàn thiện
Kết hợp các tệp Video và tệp Audio đã tạo tương ứng để ghép thành thước phim hoàn chỉnh bằng các công cụ chỉnh sửa video (như CapCut, OpenCut, FFmpeg).

---

## 3. Quy Trình Tạo Thiết Kế Quảng Cáo Sáng Tạo (Creative Ads Image & Video)

Phân hệ `vidtory-ecom` hỗ trợ thiết kế các định dạng quảng cáo sáng tạo (Creative Ads) có tỉ lệ chuyển đổi (CTR/CR) cao cho các nền tảng Facebook, TikTok, Instagram.

### A. Định Dạng Ảnh Quảng Cáo Sáng Tạo (Creative Ads Images)

Các định dạng ảnh quảng cáo có cấu trúc đặc trưng để giữ chân người dùng cuộn tin (stop-scrolling):

1. **Before/After & Split-Screen Ads (Ảnh So Sánh Trước/Sau)**:
   * **Mục tiêu**: Làm nổi bật sự đối lập trực quan giữa nỗi đau (chưa dùng sản phẩm) và kết quả mỹ mãn (sau khi dùng).
   * **Cách thực hiện**: Sinh song song 2 ảnh khác nhau (sử dụng cùng góc chụp) và ghép lại:
     * *Ảnh Before (Bên trái)*: Nền mờ, màu sắc trầm buồn/xám, sản phẩm cũ hỏng hoặc tình trạng lỗi.
     * *Ảnh After (Bên phải)*: Nền sáng rực rỡ, sản phẩm mới cứng, sáng loáng hoặc kết quả da dẻ hoàn hảo.
   * **Prompt Template (Before)**: `"Split-screen layout comparison, left side photo showing [painpoint-visual], dark muted color scheme, realistic textures, highly detailed, raw photorealistic"`
   * **Prompt Template (After)**: `"Split-screen layout comparison, right side photo showing [solution-visual], bright sunny natural lighting, vibrant colors, premium glossy finish, highly detailed, photorealistic"`

2. **Feature Callout Ads (Ảnh Chú Thích Tính Năng)**:
   * **Mục tiêu**: Trình bày trực quan các công dụng vượt trội của sản phẩm trực tiếp trên ảnh bằng mũi tên/đường chỉ dẫn.
   * **Cách thực hiện**: Sinh ảnh sản phẩm góc 3/4 nằm ở một bên hoặc chính giữa, chừa khoảng trống (negative space) rộng rãi ở hai bên trái/phải để ghi chữ chú thích.
   * **Prompt Template**: `"Professional product advertising photo of [product-name], centered, vast empty solid [color] background, clean negative space on left and right for text overlay, studio catalog lighting, crisp details"`

3. **Social Proof & Testimonial Ads (Ảnh Đánh Giá Khách Hàng)**:
   * **Mục tiêu**: Tăng độ tin cậy bằng cách lồng nhận xét/số sao đánh giá của khách hàng.
   * **Cách thực hiện**: Sinh ảnh sản phẩm được sử dụng trong bối cảnh thực tế (lifestyle), tạo góc nghiêng nghệ thuật, chừa không gian trống ở phía trên hoặc phía dưới để chèn ô đánh giá (chat bubble/rating block).
   * **Prompt Template**: `"High-end lifestyle advertising shot of [product-name], placed on [surface], warm natural morning sunlight, shallow depth of field, blurred background, clean upper area for customer testimonial overlay, commercial aesthetic"`

4. **Promo & Discount Banners (Ảnh Banner Khuyến Mãi)**:
   * **Mục tiêu**: Thúc đẩy khách hàng click bằng các chương trình khuyến mãi/deal shock.
   * **Cách thực hiện**: Thiết kế nhãn chữ khuyến mãi nổi bật bằng cách dùng dấu nháy đơn.
   * **Prompt Template**: `"Creative commercial banner for [product-name], featuring a bright red circular tag on the corner with text '50% OFF' in bold white sans-serif typography, placed on a high-contrast modern studio background, dramatic spotlight"`

---

### B. Định Dạng Video Quảng Cáo Sáng Tạo (Creative Video Ads)

Để sản xuất các video quảng cáo chuyển đổi cao (độ dài 15s - 30s), áp dụng các kịch bản và nhịp độ chuyển cảnh sau:

1. **UGC Hook Ad (Video ngắn giữ chân 15s)**:
   * *Cấu trúc*: **3s Hook** (Giật gân/Gây tò mò) -> **7s Demo/Solution** (Tính năng sản phẩm) -> **5s CTA & Offer** (Kêu gọi mua hàng & Khuyến mãi).
   * *Chỉ dẫn tạo*:
     * *Scene 1 (Hook - 3s)*: Tạo cảnh động trực diện hoặc vấn đề (Ví dụ: đổ nước ép lên giày vải để thử chống thấm).
     * *Scene 2 (Demo - 7s)*: Cận cảnh nước trôi tuột đi không bám bẩn.
     * *Scene 3 (CTA - 5s)*: Hiện hộp sản phẩm kèm logo nhãn hàng nổi bật.
   * *Chiến lược CLI*: Gửi song song 3 yêu cầu sinh video ngắn tương ứng với 3 phân cảnh để tối ưu hóa thời gian xử lý của khách hàng.

2. **ASMR Unboxing & Product Demo (Trải nghiệm âm thanh và thị giác)**:
   * *Cấu trúc*: Tập trung vào chuyển động vật lý cực cận (extreme close-up) chân thực, kích thích giác quan người xem.
   * *Mô tả chuyển động Veo*: Sử dụng các động từ mô tả vật lý sắc nét: `"peeling off the protective plastic film slowly"`, `"opening the magnetic cap with a satisfying click"`, `"squeezing the dropper to release a thick gel drop, slow motion"`.

3. **Video Biến Hình / Trước & Sau (Before & After Transition Video)**:
   * *Cách thực hiện*: Sử dụng cơ chế Keyframe Start + End Frame.
     * *Start Frame (Before)*: Bề mặt chưa xử lý hoặc tình trạng cũ (ví dụ: màn hình điện thoại trầy xước và bám vân tay).
     * *End Frame (After)*: Bề mặt sau khi dán cường lực/lau sạch (sáng loáng như mới).
     * *Transition Prompt (Veo)*: `"A hand wiping a microfiber cloth across the scratched screen surface, leaving a clean crystal clear shiny stripe, smooth sweeping motion, realistic reflection"`
     * *Lệnh chạy*:
        ```bash
        node vidtory-cli.js generate-video \
          --prompt "A hand wiping a microfiber cloth across the scratched screen surface, leaving a clean crystal clear shiny stripe" \
          --refImageUrl ./screen_scratched.png \
          --refImageEndUrl ./screen_clean.png \
          --aspectRatio 9:16 --duration 5
        ```
