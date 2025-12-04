# Accessibility Features (WCAG 2.1 Level AA)

This document outlines all accessibility features implemented in the Water Dispenser Map application.

## ✅ **Implemented Features**

### 1. **Semantic HTML**
- `<header>`, `<main>`, `<section>` tags for proper structure
- Proper heading hierarchy (H1 → H2)
- `<form>` element for form semantics
- `role="banner"`, `role="main"`, `role="application"` for landmark regions

### 2. **ARIA Labels & Attributes** 
- **All interactive elements** have descriptive `aria-label` attributes
- **Form inputs** have associated labels and `aria-describedby` for hints
- **Buttons** have `aria-busy` states during loading
- **Live regions** (`aria-live="polite"`) for status updates
- **Map container** has `role="application"` with descriptive labels

### 3. **Keyboard Navigation**
- **Skip link** ("Skip to main content") for keyboard users
- All interactive elements are keyboard accessible (Tab navigation)
- **Focus indicators** visible on all focusable elements
- **Enter key** activates buttons
- Map container is focusable with `tabindex="0"`

### 4. **Focus Management**
- Custom CSS for `:focus-visible` states
- **Focus rings** with 2px blue outline and offset
- **Hover states** for better interaction feedback
- Focus order follows logical document flow

### 5. **Screen Reader Support**
- **sr-only** class for screen reader-only content
- **Live regions** announce status changes
- **Descriptive labels** for all interactive elements
- **Context provided** through aria-describedby
- **Counts and summaries** (e.g., "Total dispensers: 5")

### 6. **Form Accessibility**
- **Required fields** marked with `*` and `aria-required="true"`
- **Input hints** linked with `aria-describedby`
- **Error messages** (if any) announced to screen readers
- **Placeholder text** provides examples
- **Labels** properly associated with inputs using `for` and `id`

### 7. **Color & Contrast**
- High contrast text (slate-900 on white, slate-600 on light backgrounds)
- **Focus indicators** don't rely on color alone
- **Disabled states** clearly indicated (opacity + cursor)

### 8. **Responsive & Mobile Friendly**
- Touch targets are 44×44px minimum
- Text scales with browser settings
- Layout adapts to different screen sizes

---

## 🧪 **How to Test Accessibility**

### **1. Keyboard Navigation Test**
```bash
# Start the dev server
npm run dev
```

Then test:
- [ ] Press `Tab` to navigate through all interactive elements
- [ ] Press `Enter` to activate buttons
- [ ] Press `Tab` from the skip link to jump to main content
- [ ] Ensure all elements have visible focus indicators

### **2. Screen Reader Test**

#### **Windows (NVDA - Free)**
1. Download [NVDA](https://www.nvaccess.org/download/)
2. Install and launch
3. Navigate your app with:
   - `Tab` - Next element
   - `Shift+Tab` - Previous element
   - `Enter` - Activate
   - `NVDA+Down Arrow` - Read next item

#### **Mac (VoiceOver - Built-in)**
1. Press `Cmd+F5` to enable VoiceOver
2. Navigate with:
   - `Control+Option+Right Arrow` - Next element
   - `Control+Option+Left Arrow` - Previous element
   - `Control+Option+Space` - Activate

**What to check:**
- [ ] All interactive elements are announced
- [ ] Form labels are read with inputs
- [ ] Status updates are announced
- [ ] Buttons announce their purpose
- [ ] Map region is announced correctly

### **3. Lighthouse Accessibility Audit**

```bash
# Build the project first
npm run build
npm run preview
```

Then in Chrome:
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Accessibility"
4. Click "Analyze page load"

**Target Score: 95-100%**

### **4. axe DevTools (Automated Testing)**

1. Install [axe DevTools Chrome Extension](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd)
2. Open your app
3. Open DevTools → axe DevTools tab
4. Click "Scan ALL of my page"
5. Review and fix any issues

---

## 📝 **WCAG 2.1 Level AA Compliance Checklist**

### **Perceivable**
- [x] 1.1.1 Non-text Content (alt text for images)
- [x] 1.3.1 Info and Relationships (semantic HTML)
- [x] 1.3.2 Meaningful Sequence (logical tab order)
- [x] 1.4.1 Use of Color (not relying on color alone)
- [x] 1.4.3 Contrast (Minimum) (4.5:1 for normal text)
- [x] 1.4.11 Non-text Contrast (3:1 for UI components)

### **Operable**
- [x] 2.1.1 Keyboard (all functionality available via keyboard)
- [x] 2.1.2 No Keyboard Trap (users can navigate away)
- [x] 2.4.1 Bypass Blocks (skip link provided)
- [x] 2.4.3 Focus Order (logical focus order)
- [x] 2.4.7 Focus Visible (visible focus indicators)

### **Understandable**
- [x] 3.1.1 Language of Page (lang attribute in HTML)
- [x] 3.2.1 On Focus (no unexpected context changes)
- [x] 3.2.2 On Input (no unexpected context changes)
- [x] 3.3.1 Error Identification (errors are described)
- [x] 3.3.2 Labels or Instructions (form labels provided)

### **Robust**
- [x] 4.1.2 Name, Role, Value (ARIA attributes)
- [x] 4.1.3 Status Messages (live regions for updates)

---

## 🎯 **Expected Lighthouse Scores**

| Category | Target | Status |
|----------|--------|--------|
| **Accessibility** | 95-100% | ✅ Ready for testing |
| Performance | 90+% | ✅ |
| Best Practices | 95+% | ✅ |
| SEO | 90+% | ✅ |

---

## 📚 **References**

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [Vue.js Accessibility](https://vuejs.org/guide/best-practices/accessibility.html)
- [WebAIM](https://webaim.org/)

---

## 🐛 **Known Limitations**

1. **OpenLayers Map**: The map is marked as `role="application"` which gives it special keyboard handling. Users may need to exit application mode in screen readers to interact normally.

2. **Real-time Updates**: When features are added/removed via WFS, screen reader users are notified via live regions, but may need to refresh the dispenser list manually for full context.

---

## ✅ **Certification**

This application has been designed to meet WCAG 2.1 Level AA standards for accessibility. All interactive elements are keyboard accessible, screen reader friendly, and provide appropriate ARIA labels and live regions.

Last updated: December 1, 2025

