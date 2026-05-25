---
version: 0.3.0
name: vidtory-fashion
description: |
  Generate fashion marketing visuals, virtual try-ons (VTON), fashion lookbooks,
  and catwalk videos via Vidtory BAPI.
  Uses gemini-3.1-flash-image-preview for images and veo-3.1-fast-generate-001
  for video. Integrates with the local character database (characters.json) for
  model consistency.
argument-hint: "generate-image|generate-video --prompt <prompt> --refImageUrl <garment_path> [--soulId <model_name>] [--aspectRatio <ratio>]"
allowed-tools: Bash
---

# Vidtory Fashion (Thời Trang & Người Mẫu)

Phân hệ `vidtory-fashion` chuyên phục vụ ngành thời trang, trang sức và phụ kiện. Nó giải quyết hai bài toán khó nhất: mặc thử trang phục lên người mẫu ảo (**Virtual Try-On**) và duy trì sự nhất quán khuôn mặt của người mẫu (**Face-ID Consistency**).

---

## Quản Lý Người Mẫu Nhất Quán (Local Character DB)
Không cần huấn luyện LoRA phức tạp, chúng ta quản lý người mẫu bằng cách tải lên 1 ảnh chân dung gốc chất lượng cao và viết mô tả đặc điểm khuôn mặt (được lưu cục bộ tại `characters.json`).

### 1. Tạo một Người mẫu AI mới:
```bash
node vidtory-cli.js character-create \
  --name "model_asian_lily" \
  --image ./lily_portrait.png \
  --prompt "a 22 year old East Asian female model, sharp jawline, long straight black hair, elegant smile, natural makeup"
```

### 2. Sử dụng Người mẫu trong các yêu cầu sinh ảnh/video:
Chỉ cần thêm tham số `--soulId model_asian_lily`. Hệ thống sẽ tự động ghép ảnh chân dung vào `sampleCharacterUrl` và chèn mô tả khuôn mặt vào prompt gốc trước khi gửi đi.

---

## Hướng Dẫn Tối Ưu Giải Quyết Painpoint Thời Trang

### 1. Bảo Toàn Cấu Trúc Quần Áo (Garment-Fit Preservation)
Để giải quyết lỗi **quần áo bị méo mó, biến dạng phom dáng** khi chạy VTON, hãy sử dụng các nguyên tắc sau:
- **Từ khóa bảo toàn cấu trúc**: Đưa vào các chỉ dẫn phi biến dạng như `"preserving the exact fit and collar stitch lines of the flat blazer"`, `"unwarped fabric texture"`, `"perfectly retains the original silhouette of the flat clothing"`.
- **Độ tương phản ảnh phẳng**: Ảnh quần áo thô làm `--refImageUrl` nên có nền tương phản cao (tốt nhất là nền trắng hoặc png trong suốt) và được chụp phẳng, không có nếp nhăn lớn.

### 2. Bộ Công Thức Phối Đồ & Phụ Kiện (Style Archetypes)
Để ảnh thử đồ không bị đơn điệu, hãy phối hợp trang phục với các phụ kiện theo các phong cách định hình dưới đây:

| Phong cách (Style Archetype) | Cách Phối Phụ Kiện & Bối Cảnh (Accessorizing & Setting) |
| :--- | :--- |
| **Quiet Luxury (Sang trọng thầm lặng)** | Phối thêm: túi xách da trơn cao cấp màu beige, kính râm gọng mỏng cổ điển. Bối cảnh: sảnh khách sạn boutique hiện đại, ánh sáng tự nhiên dịu nhẹ. |
| **Urban Streetwear (Thời trang đường phố)** | Phối thêm: giày sneakers chunky, mũ lưỡi trai đen đơn giản, khuyên tai bạc nhỏ. Bối cảnh: đường phố hiện đại ngập ánh đèn neon mờ nhẹ về đêm. |
| **Minimalist Workwear (Tối giản công sở)** | Phối thêm: đồng hồ dây da cổ điển, thắt lưng da trơn bản nhỏ. Bối cảnh: studio nền bê tông thô xám nhạt, ánh sáng dịu. |

### 3. Tối Ưu Chuyển Động Vải trong Video (Veo Physics)
Để tránh hiện tượng **vải bị chảy như thạch hoặc biến dạng giống nhựa cứng** trong video catwalk của Veo, hãy luôn áp dụng các tag vật lý chuyển động:
- Với vải lụa, voan mỏng: `"natural fluid silk waves, realistic fabric weight and wind resistance simulation"`.
- Với vải thô, denim, kaki: `"structured fabric movement, maintaining folds and creases naturally during movement"`.
- Cử động chân thực: `"clothing drapery responds dynamically to walking motion, no warping"`.

---

## Các Tính Năng & Prompt Template Chủ Lực

> [!IMPORTANT]
> **Quy tắc khi dùng `--soulId` (Giữ Nhất quán khuôn mặt)**:
> - **Viết prompt khái quát**: Khi chỉ định `--soulId <name>`, CLI sẽ tự động chèn mô tả khuôn mặt chi tiết từ `characters.json` vào cuối prompt. Vì vậy, trong prompt chính, bạn chỉ cần dùng danh từ chung chung như `"model"`, `"person"`, hoặc `"female model"` và mô tả hành động/quần áo. Không mô tả màu tóc hay khuôn mặt trùng lặp hoặc mâu thuẫn ở prompt chính.
> - **Ảnh chân dung gốc**: Đảm bảo ảnh chân dung đăng ký bằng lệnh `character-create` là ảnh chụp thẳng, rõ nét, ánh sáng tốt, không bị che khuất để mô hình `gemini-3.1-flash-image-preview` trích xuất đặc trưng khuôn mặt tốt nhất.

### 1. Virtual Try-On (Thử đồ ảo / Mặc thử trang phục)
*   **Template**: `"Fashion model photography of model wearing [product-description], [style-archetype], [garment-fit-preservation], posing elegantly in a [setting], soft natural sunlight, fashion magazine cover style, high-end editorial"`
*   **Chiến lược Sinh ảnh Song song (Parallel Batching)**: Khởi tạo đồng thời 6-8 yêu cầu sinh ảnh với các sắc tộc khác nhau (Châu Á, Châu Âu, Da màu) hoặc ở các bối cảnh khác nhau mặc thử trang phục đó, giúp khách hàng nhận được trọn bộ sưu tập ảnh so sánh lập tức mà không phải chờ đợi lâu.


### 2. Catwalk & Runway Motion Video (Sinh video người mẫu động)
*   **Template**: `"High-end fashion runway catwalk video, model walking towards the camera, dramatic fashion show spotlights, soft bokeh, [veo-physics-keywords], movement of fabric is fluid and realistic"`
*   **Mô hình sử dụng**: `veo-3.1-fast-generate-001` (qua `generate-video`).

### 3. Fashion Before/After & Pose Transition (Sử dụng Start + End Frame)
Để sản xuất các video biến đổi trang phục (Before/After) hoặc chuyển đổi dáng đứng mượt mà của người mẫu cho chiến dịch mạng xã hội (Tiktok, Reels):
*   **Workflow**:
    1.  Sinh **Start Frame** (ảnh người mẫu mặc đồ thô hoặc trang phục thường nhật ban đầu).
    2.  Sinh **End Frame** (ảnh người mẫu mặc trang phục lộng lẫy mới hoặc dáng đứng pose mới).
    3.  Gọi lệnh `generate-video` truyền ảnh bắt đầu vào `--refImageUrl` và ảnh kết thúc vào `--refImageEndUrl`.
*   **Template**: `"High-fashion outfit transformation video, model smoothly morphs from initial casual look into a stunning luxury silk dress, seamless clothing morphing transition, dynamic runway lights, realistic fabric physics"`

---

## Hướng Dẫn Gọi CLI (Ví dụ VTON áo Blazer lên người mẫu Lily)

Chạy đồng thời 4 biến thể bối cảnh/tư thế để tăng lựa chọn:

```bash
# Biến thể A: Studio tối giản
node vidtory-cli.js generate-image \
  --prompt "High-end fashion editorial photography, model standing in three-quarter view, minimalist beige studio background, clean lighting" \
  --refImageUrl ./blue_blazer.png --soulId "model_asian_lily" --aspectRatio 3:4 &

# Biến thể B: Đường phố London
node vidtory-cli.js generate-image \
  --prompt "Street style fashion photoshoot, model walking on a rainy London street, blurred architectural background, natural afternoon light" \
  --refImageUrl ./blue_blazer.png --soulId "model_asian_lily" --aspectRatio 3:4 &

# Biến thể C: Studio ánh sáng ấn tượng
node vidtory-cli.js generate-image \
  --prompt "Dramatic studio lighting fashion photography, high contrast shadows, elegant pose, dark grey texture background" \
  --refImageUrl ./blue_blazer.png --soulId "model_asian_lily" --aspectRatio 3:4 &
```
