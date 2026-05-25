---
version: 0.3.0
name: vidtory-brandos
description: |
  Generate brand materials and service advertising visuals via Vidtory BAPI.
  Specialized in packaging, logos, corporate banners, and service conceptual art.
  Uses gemini-3.1-flash-image-preview for high-fidelity text/vectors.
  Optimized for parallel execution to generate 4-8 design concepts concurrently.
argument-hint: "generate-image --prompt <prompt> [--aspectRatio <ratio>] [--resolution <1K|2K|4K>]"
allowed-tools: Bash
---

# Vidtory Brandos (Thương Hiệu & Dịch Vụ)

Phân hệ `vidtory-brandos` chuyên phục vụ các yêu cầu tạo tài nguyên thương hiệu (logo, bao bì sản phẩm, poster quảng cáo) và hình ảnh minh họa cho các dịch vụ (SaaS, tài chính, bảo hiểm, tư vấn).

Chúng ta sử dụng mô hình **`gemini-3.1-flash-image-preview`** vì khả năng hiển thị chữ (typography) cực tốt và nét vẽ vector sắc sảo.

---

## Hướng Dẫn Tối Ưu Giải Quyết Painpoint Doanh Nghiệp

### 1. Cấu Hình Đồng Bộ Nhận Diện (Brand Kit & Style Consistency)
Để giải quyết tình trạng **lệch màu sắc và phong cách thương hiệu** khi sinh hàng loạt ảnh, hãy luôn đưa các tham số cấu hình này vào prompt:
- **Bảng màu (Color Palette)**: Chỉ định mã màu cụ thể kèm sắc thái màu. Ví dụ: `"emerald green and brushed copper accent color scheme"`, `"teal blue (#008080) and white minimalist brand palette"`.
- **Phong cách nghệ thuật đồng nhất (Art Direction)**: Đảm bảo chọn 1 phong cách xuyên suốt cho bộ ảnh. Ví dụ: `"isometric 3D vector illustration"`, `"flat papercut vector art"`, `"clean claymation 3D design"`.

### 2. Hệ Thống Ẩn Dụ Hình Ảnh (Visual Metaphor System for Services)
Để giải quyết bài toán **khó vẽ các dịch vụ vô hình** (SaaS, Bảo hiểm, Tài chính) mà không bị đơn điệu nhàm chán, hãy sử dụng bảng ẩn dụ trực quan dưới đây:

| Dịch vụ Vô hình | Khái niệm Ẩn dụ Trực quan (Prompt Concept) |
| :--- | :--- |
| **Bảo mật thanh toán / SaaS Security** | Hào quang bảo vệ dạng lưới lục giác neon sáng rực bao quanh chiếc ví/thẻ ngân hàng nổi. Tránh vẽ ổ khóa thô cứng. |
| **Tự động hóa / AI Workflow** | Các luồng sáng vàng và hạt dữ liệu kết nối các bánh răng bằng kính đang tự xoay chuyển trên bệ đá. |
| **Bảo hiểm sức khỏe thông minh** | Hơi ấm dịu nhẹ màu xanh ngọc lam (#4FD1C5) tỏa ra từ bàn tay mở, bao bọc nhẹ nhàng biểu tượng gia đình bằng thủy tinh. |
| **Tài chính / Tăng trưởng kinh tế** | Cây mầm phát triển mọc ra các đồng tiền vàng óng đang đâm chồi từ một thiết bị máy tính bảng hiện đại. |

### 3. Quy Tắc Typography (Font-Style & Căn Lề)
Để giải quyết việc **chữ nhãn mác bị sai font/méo chữ**, hãy áp dụng quy tắc vàng:
1.  **Luôn bọc chữ trong dấu nháy đơn**: Ví dụ `'GLOW'`, `'TALENCY'`.
2.  **Định nghĩa kiểu chữ rõ ràng**:
    *   *Sản phẩm cao cấp, truyền thống*: Dùng `"elegant serif font"`.
    *   *Sản phẩm công nghệ, hiện đại*: Dùng `"bold minimalist geometric sans-serif font"`.
    *   *Sản phẩm handmade, organic*: Dùng `"handwritten cursive brush typography"`.
3.  **Định vị vị trí**: Nêu rõ nhãn nằm ở đâu, ví dụ: `"printed center-aligned on the front label of the bottle"`.

---

## Các Prompt Template Nghiệp Vụ Tối Ưu

### 1. Packaging Design (Thiết kế bao bì, nhãn sản phẩm)
*   **Template**: `"Professional product packaging design of [product], [brand-style - e.g. luxury minimalist], featuring the logo text '[brand-name]' in [font-style] clearly printed center-aligned on the front label, placed on a clean [color] solid background, studio catalog lighting, 3D render, highly detailed"`
*   **Chiến lược Batching**: Thay đổi vật liệu bao bì (Ví dụ: hộp giấy nhám Kraft, nhãn mác ánh kim, chai thủy tinh mờ) để khách hàng chọn chất liệu phù hợp nhất.

### 2. Logo & Corporate Identity (Logo & Nhận diện thương hiệu)
*   **Template**: `"Minimalist vector logo concept for [business-type], clean geometric shape, flat design, white background, SVG style, corporate branding element featuring logo text '[brand-name]' in [font-style] clearly printed, [color-palette] color scheme"`
*   **Chiến lược Batching**: Sinh 4 phương án logo với các cấu trúc hình học khác nhau (Tròn, Khiên bảo vệ, Chữ lồng, v.v.).

### 3. Service Conceptual Illustration (Minh họa cho dịch vụ vô hình)
*   **Template**: `"Modern conceptual illustration for [service-type] service, [visual-metaphor-description], clean high-tech UI overlay elements, [color-palette] color scheme, corporate style, high-end editorial graphic design"`
*   **Chiến lược Batching**: Sinh 4-6 phương án sử dụng các bối cảnh ánh sáng hoặc góc nhìn góc rộng/góc cận để tăng chiều sâu câu chuyện.

### 4. TVC & Motion Graphics (Sử dụng Start + End Frame)
Để sản xuất các ấn phẩm video thương hiệu chất lượng cao (TVC sản phẩm, Motion Graphics logo chuyển cảnh), hãy áp dụng kỹ thuật nối khung hình đầu và cuối (Image-to-Image Interpolation):
*   **Workflow**:
    1.  Sinh/chọn **Start Frame** (ví dụ: ảnh tĩnh sản phẩm thô hoặc bản vẽ phác thảo logo).
    2.  Sinh/chọn **End Frame** (ví dụ: ảnh sản phẩm phát sáng hoàn thiện hoặc logo 3D ánh kim nổi bật).
    3.  Gọi lệnh `generate-video` truyền ảnh bắt đầu vào `--refImageUrl` và ảnh kết thúc vào `--refImageEndUrl`.
*   **Template**: `"Sleek motion graphics transition, glowing vector lines connecting, smoothly morphing into a polished 3D gold metallic logo, modern high-tech corporate style, cinematic camera zoom, fluid particles"`

> [!TIP]
> **Đồng bộ tải ảnh lên (Auto-Upload & Propagation Check)**: Khi truyền đường dẫn tệp cục bộ (ví dụ: `--refImageUrl ./logo.png`), CLI sẽ tự động tải lên và **đợi phản hồi kiểm tra khả năng truy cập (Propagation Check) đạt trạng thái 200 OK** trước khi gửi yêu cầu sinh video. Điều này loại bỏ hoàn toàn việc model worker tải thiếu ảnh hoặc lệch ảnh gốc.

---

## Hướng Dẫn Gọi CLI (Ví dụ tạo 4 Concept Bao bì Nước hoa)

Để tối ưu hóa thời gian chờ đợi cho khách hàng thông qua cơ chế xử lý song song, hãy chạy đồng thời 4 job trong nền:

```bash
# Concept A: Tông màu trầm, sang trọng
node vidtory-cli.js generate-image \
  --prompt "Professional product packaging design of a luxury perfume bottle, minimalist gold accents, featuring logo text 'AURA' on label, dark marble background, studio lighting" \
  --aspectRatio 1:1 --resolution 2K &

# Concept B: Tông màu sáng, tự nhiên
node vidtory-cli.js generate-image \
  --prompt "Professional product packaging design of a luxury perfume bottle, wooden cap, organic shapes, featuring logo text 'AURA' on label, bright sunlit stone background" \
  --aspectRatio 1:1 --resolution 2K &

# Concept C: Phong cách tối giản, hiện đại
node vidtory-cli.js generate-image \
  --prompt "Professional product packaging design of a luxury perfume bottle, clean glass, frosted finish, featuring logo text 'AURA', sage green solid backdrop, soft studio lighting" \
  --aspectRatio 1:1 --resolution 2K &

# Concept D: Phong cách nghệ thuật, siêu thực
node vidtory-cli.js generate-image \
  --prompt "Conceptual design of a luxury perfume bottle, levitating over liquid gold ripples, dramatic high contrast studio lighting, logo text 'AURA'" \
  --aspectRatio 1:1 --resolution 2K &
```

---

## 🌐 Tài Liệu Tích Hợp API BAPI Trực Tiếp (Direct API Reference)

Nếu mô hình cần thực hiện các cuộc gọi API HTTP trực tiếp thay vì thông qua CLI (ví dụ: dùng `curl` hoặc các thư viện request), bắt buộc tuân thủ:
*   **Base URL**: `https://bapi.vidtory.net`
*   **Header Xác Thực**: `x-api-key: <API_KEY>` (Tuyệt đối **KHÔNG** sử dụng `Authorization: Bearer`).
*   **API Upload**: `POST /media/upload` (Tuyệt đối **KHÔNG** dùng `/upload`).
*   **Ví dụ Curl**:
    ```bash
    curl -X POST "https://bapi.vidtory.net/media/upload" \
      -H "x-api-key: $VIDTORY_API_KEY" \
      -F "file=@./image.png"
    ```

