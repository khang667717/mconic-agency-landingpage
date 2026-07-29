# 🔍 Hướng Dẫn: Tìm CSS Cho Phần HTML

**Mục đích:** Khi bạn thấy 1 element trên website, biết tìm kiếm CSS để chỉnh sửa.

---

## 🎯 4 Cách Tìm Kiếm

### Cách 1: Dùng Browser DevTools (Nhanh Nhất) ⭐

#### Bước 1: Mở DevTools
```
Bấm: F12 (hoặc Ctrl+Shift+I)
hoặc: Right-click → Inspect
```

#### Bước 2: Chọn phần tử muốn xem
```
Bấn icon picker (góc trái, trông như chuột):
  🖱️ ← cái này

Klik vào element trên website mà bạn muốn xem CSS
```

#### Bước 3: Xem CSS bên phải
```
Right panel sẽ hiển thị:
- Class names
- CSS rules applied
- Box model (padding, margin, border)
```

**Ví dụ:**
```
<div class="tier--recommended">
    ↓ (inspect)
.tier--recommended {
    box-shadow: var(--shadow-pop-green);
    border: 3px solid var(--green);
}
```

✅ **Ngay lập tức biết class là `.tier--recommended`**  
✅ **Biết file CSS nào:** Hover vào file name → hiển thị đường dẫn

---

### Cách 2: Tìm Từ HTML (Khi Biết Class Name)

#### Bước 1: Mở insurance.html
```
Vào thư mục project
Mở file: insurance.html
```

#### Bước 2: Tìm kiếm class
```
Bấm: Ctrl+F (Find)
Gõ: tier--recommended

Nó sẽ highlight tất cả chỗ dùng class này
```

#### Bước 3: Xem HTML structure
```html
<div class="tier tier-gold tier--recommended">
    <div class="tier__badge">...</div>
    <div class="tier__head">...</div>
    ...
</div>
```

✅ **Thấy được class name**  
✅ **Thấy được HTML structure**

---

### Cách 3: Tìm Từ CSS (Khi Biết Tên Class)

#### Bước 1: Mở file CSS tương ứng
```
Nếu về insurance page → css/insurance.css
Nếu về main page → css/style.css
Nếu về layout → css/layout.css
Nếu về components → css/components.css
Nếu về base → css/base.css
```

#### Bước 2: Tìm kiếm class
```
Bấm: Ctrl+F (Find)
Gõ: .tier--recommended

Nó sẽ hiển thị tất cả CSS rules cho class này
```

#### Bước 3: Xem CSS
```css
.tier--recommended {
    position: relative;
    transform: scale(1.08) !important;
    z-index: 5;
    box-shadow: var(--shadow-pop-green) !important;
    border: 3px solid var(--green) !important;
}

.tier--recommended::before {
    content: "ĐỀ XUẤT CHO BẠN";
    background: var(--green);
    ...
}
```

✅ **Thấy được tất cả rules**  
✅ **Có thể sửa ngay**

---

### Cách 4: Dùng VSCode Search (Toàn Project)

#### Bước 1: Mở VSCode
```
Mở project folder
```

#### Bước 2: Global Search
```
Bấm: Ctrl+Shift+F (Search everywhere)
Gõ: tier--recommended

Nó sẽ hiển thị:
- File HTML nào dùng class này
- File CSS nào định nghĩa class này
```

#### Bước 3: Click vào kết quả
```
Nó sẽ nhảy đến file + dòng code đó
```

✅ **Nhanh chóng tìm mọi reference**

---

## 📋 Ví Dụ Thực Tế

### Scenario: Muốn chỉnh box shadow của thẻ recommend

#### Bước 1: Dùng DevTools
```
1. F12 → mở DevTools
2. Click picker 🖱️
3. Click vào thẻ recommend trên website
4. Right panel hiển thị CSS
```

**Kết quả:**
```
Class: .tier--recommended
CSS file: css/insurance.css (dòng 386)
Property: box-shadow: var(--shadow-pop-green)
```

#### Bước 2: Mở CSS file
```
Vào: css/insurance.css
Ctrl+G → dòng 386
```

#### Bước 3: Tìm class
```
Ctrl+F → .tier--recommended
```

#### Bước 4: Sửa CSS
```css
.tier--recommended {
    box-shadow: var(--shadow-pop-green);  ← sửa ở đây
}
```

✅ **Hoàn tất!**

---

## 🔗 HTML → CSS Mapping

### Cách CSS liên kết với HTML

#### 1. **Class Selector** (`.` tại đầu)
```html
<!-- HTML -->
<div class="tier--recommended">...</div>
```

```css
/* CSS */
.tier--recommended {
    color: red;
}
```

#### 2. **ID Selector** (`#` tại đầu)
```html
<!-- HTML -->
<form id="quoteForm">...</form>
```

```css
/* CSS */
#quoteForm {
    border: 2px solid blue;
}
```

#### 3. **Element Selector** (tag name)
```html
<!-- HTML -->
<button>Submit</button>
```

```css
/* CSS */
button {
    background: green;
}
```

#### 4. **Descendant Selector** (nesting)
```html
<!-- HTML -->
<div class="quote-card">
    <button>Submit</button>
</div>
```

```css
/* CSS */
.quote-card button {
    background: blue;
}
```

#### 5. **Pseudo-class** (`:hover`, `:focus`, etc)
```html
<!-- HTML -->
<button class="btn">Click</button>
```

```css
/* CSS */
.btn:hover {
    background: darkblue;
}
```

#### 6. **Pseudo-element** (`::before`, `::after`)
```html
<!-- HTML -->
<div class="tier--recommended"></div>
```

```css
/* CSS */
.tier--recommended::before {
    content: "ĐỀ XUẤT";
}
```

---

## 🎓 Checklist: Khi Muốn CHỈNH CSS

### Bước 1: Xác định Element
- [ ] Dùng DevTools inspect (F12)
- [ ] Tìm class name hoặc ID

### Bước 2: Tìm File CSS
- [ ] Dùng Ctrl+Shift+F search
- [ ] Hoặc biết file nào (base, layout, components, style, insurance)

### Bước 3: Tìm CSS Rule
- [ ] Mở file CSS
- [ ] Ctrl+F tìm class name
- [ ] Xem tất cả properties

### Bước 4: Sửa CSS
- [ ] Thay đổi property value
- [ ] Save file
- [ ] Refresh browser (Ctrl+Shift+R)
- [ ] Xem kết quả

### Bước 5: Test
- [ ] Kiểm tra responsive (mobile, tablet, desktop)
- [ ] Kiểm tra hover states
- [ ] Commit code (git)

---

## 🔥 DevTools Tips & Tricks

### Xem tất cả CSS cho 1 element
```
1. F12 → mở DevTools
2. Inspect element
3. Right panel → Styles
4. Scroll xuống xem tất cả rules
```

### Sửa CSS trực tiếp (test trước khi code)
```
1. F12 → DevTools
2. Inspect element
3. Right panel → Styles
4. Double-click property → sửa
5. Enter → xem thay đổi ngay
6. (Không permanent - refresh sẽ reset)
```

### Xem box model (padding, margin, border)
```
1. F12 → DevTools
2. Inspect element
3. Right panel → Computed
4. Scroll → Layout section
5. Xem visual diagram
```

### Xem tất cả element styles
```
1. F12 → DevTools
2. Inspect element
3. Right panel → Styles
4. Xem .layer (cascade):
   - Inherited from ...
   - Overridden by ...
   - Direct styles
```

---

## 📁 Project CSS Structure

```
css/
├── base.css              ← Design system, colors, fonts
│   └── Defines: --red, --green, --ink, fonts
│
├── layout.css            ← Page layouts, grids
│   └── Defines: container, hero, sections
│
├── components.css        ← Reusable components
│   └── Defines: .btn, .form, .modal, .card
│
├── style.css             ← Main page specific styles
│   └── Defines: .services, .faq, .footer, etc
│
└── insurance.css         ← Insurance page specific
    └── Defines: .tier, .quote-card, .result, etc
```

**Khi tìm CSS:**
1. Nếu về màu sắc → xem `base.css` đã
2. Nếu về layout → xem `layout.css`
3. Nếu về button/form → xem `components.css`
4. Nếu về insurance page → xem `insurance.css`
5. Nếu về main page → xem `style.css`

---

## 🎯 Quick Reference - Tìm CSS Nhanh

| Muốn tìm | Cách làm |
|---------|---------|
| **CSS cho 1 element** | F12 → Inspect → Right panel |
| **Tất cả rules cho 1 class** | Ctrl+Shift+F → Search class name |
| **Element nào dùng class này** | Ctrl+Shift+F → Search class name |
| **CSS override** | DevTools → Styles → xem strikethrough |
| **Responsive breakpoints** | CSS → Search `@media` |
| **Animation** | CSS → Search `@keyframes` |
| **Variable value** | Search `--color-name` → base.css |

---

## 💡 Thực Hành: Ví Dụ Chỉnh Thẻ Recommend

### Bài tập: Chỉnh màu chữ trong "ĐỀ XUẤT CHO BẠN"

#### Step 1: Inspect
```
F12 → Picker → Click label "ĐỀ XUẤT CHO BẠN"
```

#### Step 2: Tìm class
```
DevTools hiển thị:
.tier--recommended::before
```

#### Step 3: Mở CSS file
```
Ctrl+Shift+F → .tier--recommended::before
→ Mở css/insurance.css dòng 390
```

#### Step 4: Xem CSS
```css
.tier--recommended::before {
    content: "ĐỀ XUẤT CHO BẠN";
    background: var(--green);
    color: #FFF;           ← màu chữ
    font-size: 0.65rem;
    ...
}
```

#### Step 5: Sửa
```css
color: #FFF;  →  color: #000;  (đổi thành đen)
```

#### Step 6: Save & test
```
Ctrl+S → Refresh browser → Xem kết quả
```

✅ **Xong!**

---

## 🚀 Pro Tips

### 1. Dùng CSS Variables
```css
/* base.css */
:root {
    --green: #2E7D32;
    --red: #D32F2F;
}

/* insurance.css */
.tier {
    background: var(--green);  ← tính nhất quán
}
```

### 2. Dùng Comments
```css
/* ============ INSURANCE TIER CARDS ============ */
.tier { ... }
.tier--recommended { ... }
```

Dễ tìm hơn khi Ctrl+F

### 3. Group CSS theo section
```css
/* HERO SECTION */
.hero { ... }
.hero__title { ... }

/* QUOTE FORM */
.quote-card { ... }
.quote-card__actions { ... }
```

### 4. Dùng BEM naming
```
.block              ← main container
.block__element     ← child element
.block--modifier    ← variation

Ví dụ:
.tier                   ← main card
.tier__badge           ← child badge
.tier--recommended     ← variation (recommended)
```

---

**Giờ bạn có thể tự tin tìm & sửa CSS!** 🎉

---

**Tip cuối:** Khi bạn bế tắc, luôn thử DevTools trước!
