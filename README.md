
# Project: 格斗宝典 (The Combat Bible)

这是一款针对拳馆设计的标准化教学管理 SaaS。核心价值是通过“动作包梯度体系”和“学员反向验证”来确保教学合规率。

## 1. Visual Identity (Design System)

**Theme**: 极致简约风 (Minimalist Professional)

### Color Palette (Tailwind Tokens)
| Semantic Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Background** | `#000000` | 全局背景，禁止使用纯黑以外的深灰做背景 |
| **Surface** | `#1A1A1A` | 卡片、输入框、底层容器 |
| **Primary/Alert** | `#E60012` | 核心操作按钮 (Racing Red)、异常报警、高亮文字 |
| **Text Primary** | `#F2F2F2` | 主标题、正文内容 |
| **Text Secondary**| `#8E8E93` | 副标题、标签、未选中状态 |

### UI Rules
*   **Borders**: 极细描边 `0.5px` (e.g., `border-white/10`).
*   **Corners**: 大圆角 `12px` - `32px` (根据卡片大小适配).
*   **Shadows**: **禁止使用阴影** (No Drop Shadows)，依靠边框和底色区分层级。
*   **Typography**: 
    *   数字/英文标题: `font-oswald` (Oswald) - 硬核、工业感。
    *   中文/正文: `font-inter` (Inter) - 清晰、理性。

---

## 2. Data Architecture (Cloud Schema)

### Collection: `tech_packs` (动作资产)
*   `id`: string
*   `title`: string (e.g., "拳法基础单元")
*   `category`: string (e.g., "站立打击")
*   `levels`: { 
    `l1`: { steps, points, videoUrl }, 
    `l2`: { steps, points, videoUrl }, 
    `l3`: { steps, points, videoUrl } 
    }

### Collection: `lessons` (教学记录)
*   `compliance_status`: 'normal' | 'deviation' (核心字段：偏差状态)
*   `planned_items`: Array (计划教什么)
*   `actual_confirmed_ids`: Array (学员确认教了什么)

---

## 3. Core Logic: Compliance Loop

1.  **Coach Side**: 选择技术包及梯度 (L1-L3) -> 提交教案。
2.  **Student Side (Scheme A)**: 下课后强制弹窗核销。
    *   必须在 `[已教授]` 和 `[未教授]` 之间选择。
3.  **System Logic**:
    *   IF (Student clicks '未教授') -> `Lessons.compliance_status = 'deviation'`.
    *   IF (`compliance_status == 'deviation'`) -> **馆长端首页置顶红色报警**。

---

## 4. Development Workflow

### Icons & Assets
*   使用 Emoji 或 SVG 替代复杂图标，保持轻量。
*   视频资源使用 URL 链接，不直接存储大文件。

### State Management
*   React Functional Components + Hooks.
*   局部状态优先，避免全局 Store 过于复杂。
