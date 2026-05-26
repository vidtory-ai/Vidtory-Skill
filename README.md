# Vidtory Creative AI Skills — Cánh Tay Nối Dài Cho AI Agent Của Bạn

> 💡 **Anh em nào cần cánh tay nối dài cho Agent của mình thì thử dùng bộ Skill này nhé.** 
> Hỗ trợ tự động hóa hoàn toàn quy trình sản xuất **Bulk Ads/Video**, thử nghiệm thoải mái các kịch bản **Hook 3s đầu, CTA, unboxing, catwalk** cho các chiến dịch TMĐT, Thương hiệu hoặc Tiếp thị liên kết (Affiliate).

Bộ kỹ năng (Skills) chuyên nghiệp này được thiết kế và tối ưu hóa riêng biệt để tương tác với **Vidtory BAPI**. Nó cho phép các AI Agents (như Claude Code, Cursor, Windsurf, Codex, v.v.) tự động gọi API sinh ảnh, video chất lượng cao và audio thuyết minh chỉ bằng các dòng lệnh đơn giản.

---

## 🚀 Các Use Cases Điển Hình (Thử Nghiệm Thoải Mái Bulk Ads/Video, Hook, CTA)

### 1. 🧪 Thử Nghiệm Hàng Loạt Kịch Bản UGC Hook & CTA (Affiliate Creators)
*   **Vấn đề**: Việc quay dựng thử-sai (A/B testing) nhiều kịch bản Hook 3s hoặc nút kêu gọi CTA rất mất thời gian.
*   **Giải pháp**: Gửi đồng thời nhiều yêu cầu sinh video unboxing/hành động khác nhau và lồng tiếng nói thuyết minh tiếng Việt tương ứng. Nhờ **Cơ chế Xử lý Song song (Parallel Requests)**, bạn sẽ nhận được 5-10 phương án video Hook/CTA chỉ sau dưới 15 giây để đăng tải và đo lường hiệu quả.

### 2. 👗 Thử Đồ Ảo (VTON) & Nhất Quán Khuôn Mặt Người Mẫu (Fashion Brands)
*   Mặc thử quần áo phẳng lên dáng người mẫu ảo mà không làm méo mó, biến dạng phom dáng vải gốc (`Garment-Fit VTON`).
*   Duy trì khuôn mặt người mẫu đồng nhất qua nhiều bối cảnh khác nhau (London street, minimal studio, cafe) bằng database nhân vật cục bộ (`characters.json`), không cần train LoRA tốn kém.

### 3. 📦 Sinh Trọn Bộ Ảnh Sàn TMĐT Đồng Bộ (Amazon A+ / Shopify Listings)
*   Sinh song song trọn bộ 5 ảnh sản phẩm (Ảnh nền trắng, Flatlay phụ kiện, Lifestyle bối cảnh thực tế, Extreme Close-up chất liệu) với góc chiếu sáng studio (`catalog studio lighting`) và chất liệu bệ đỡ đồng bộ hoàn hảo.

### 4. 🎬 Quy Trình Tự Động Sản Xuất TVC 60s Hệ Keyframe
*   Tự động lên Storyboard 12 cảnh, sinh song song 24 job (12 video, 12 audio thoại), tự động căn chỉnh thời lượng khớp khít theo tốc độ nói tiếng Việt chuẩn (2.5 từ/giây), tự động nối và lồng nhạc nền hoàn thiện qua FFmpeg.

---

## 📂 Cấu Trúc Hệ Thống

```
Vidtory-Skill/
├── README.md                # Tài liệu hướng dẫn chung
├── .claude/
│   └── settings.json        # Cấu hình mở chặn mạng sandbox cho Claude Code
├── tools-schema.json        # Định nghĩa JSON Schema (OpenAI/Codex Function Calling)
├── vidtory-mcp-server.js    # Model Context Protocol (MCP) Server (Cursor/Windsurf)
└── .agents/
    └── skills/
        ├── vidtory-cli.js   # CLI Core dùng chung
        ├── vidtory-brandos/ # Phân hệ Thương hiệu & Dịch vụ (Gemini 3.1)
        │   ├── SKILL.md     # Hướng dẫn chi tiết cho Agent
        │   └── vidtory-cli.js
        ├── vidtory-fashion/ # Phân hệ Thời trang & VTON (Veo & Face-ID)
        │   ├── SKILL.md
        │   └── vidtory-cli.js
        └── vidtory-ecom/    # Phân hệ Sàn TMĐT & Affiliate Video
            ├── SKILL.md
            └── vidtory-cli.js
```

---

## 🛠️ Hướng Dẫn Tích Hợp Cho AI Agents (3 Chuẩn Đóng Gói)

### 1. Chuẩn `SKILL.md` (Cho Claude Code, Antigravity)
AI Agent khi làm việc trong các thư mục phân hệ sẽ tự động đọc hiểu file `SKILL.md` và thực thi các câu lệnh CLI tương ứng.
*   **Ví dụ gọi sinh ảnh thương hiệu**:
    ```bash
    node vidtory-cli.js generate-image --prompt "Professional perfume bottle design" --aspectRatio 1:1
    ```

### 2. Chuẩn MCP Server (Cho Cursor, Windsurf, Claude Desktop)
Cấu hình MCP Server stdio giúp phơi bày các công cụ sinh media thành các Native Tools trực tiếp trong AI Client hoặc IDE của bạn.

#### Cài đặt tự động qua Smithery (Khuyên dùng cho Claude Desktop):
```bash
npx -y @smithery/cli@latest install @vidtory-ai/skill --client claude
```

#### Cấu hình thủ công trong MCP Settings:
```json
{
  "mcpServers": {
    "vidtory-creative": {
      "command": "node",
      "args": ["/path/to/Vidtory-Skill/vidtory-mcp-server.js"],
      "env": {
        "VIDTORY_API_KEY": "your-api-key"
      }
    }
  }
}
```

### 3. Chuẩn JSON Schema (Cho Codex, LangChain, AutoGen)
Sử dụng file định nghĩa mẫu **`tools-schema.json`** ở thư mục gốc để copy-paste trực tiếp cấu hình Function Calling vào mã nguồn Python/NodeJS của Agent của bạn.

---

## 🌐 Tài Liệu Tích Hợp API BAPI Trực Tiếp (Direct API Reference)

Nếu bạn hoặc các tác nhân AI của bạn cần tương tác trực tiếp với Vidtory BAPI qua giao thức HTTP (ví dụ: dùng `curl`), hãy tuân thủ cấu hình sau:

### 1. Thông Tin Chung
*   **Base URL**: `https://bapi.vidtory.net`
*   **Header Xác Thực**: `x-api-key: <your-api-key>` (Tuyệt đối **KHÔNG** sử dụng `Authorization: Bearer`).

### 2. API Tải Ảnh/Video Lên (Media Upload)
*   **HTTP Method**: `POST`
*   **Path**: `/media/upload` (Tuyệt đối **KHÔNG** dùng `/upload`).
*   **Content-Type**: `multipart/form-data`
*   **Body Parameters**:
    *   `file` (Kiểu tệp tin, chứa dữ liệu ảnh/video cần upload).
*   **Ví dụ Curl**:
    ```bash
    curl -X POST "https://bapi.vidtory.net/media/upload" \
      -H "x-api-key: $VIDTORY_API_KEY" \
      -F "file=@/mnt/user-data/uploads/image.png"
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
