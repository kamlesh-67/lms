# 🎨 LMD Portal - Quick Reference Guide

## 🎹 Keyboard Shortcuts Quick Reference

### Navigation (g + key)
```
g + d  →  Dashboard
g + s  →  Shipments
g + p  →  Pickups
g + t  →  Tracking
g + r  →  Returns
g + o  →  Documents
g + ,  →  Settings
g + a  →  Admin Audit
g + h  →  API History
```

### Actions
```
c      →  Create Shipment
n      →  New Pickup
/      →  Focus Search
```

### UI Controls
```
⌘/Ctrl + k    →  Command Palette
⌘/Ctrl + /    →  Shortcuts Help
⌘/Ctrl + b    →  Toggle Sidebar
⌘/Ctrl + \    →  Toggle Theme
⌘/Ctrl + p    →  Profile
⌘/Ctrl + s    →  Settings
Esc            →  Close Modal
```

---

## 🎨 Color Palette

### Brand Colors
```css
Primary (Navy):    #061359  →  hsl(227 95% 19%)
Secondary (Orange): #ff9400  →  hsl(33 100% 50%)
```

### Status Colors
```css
Success (Green):   hsl(142 76% 36%)
Warning (Orange):  hsl(33 100% 50%)  /* Brand color */
Error (Red):       hsl(0 84% 60%)
Info (Cyan):       hsl(199 89% 48%)
```

### Theme Colors
```css
Navy:    hsl(227 95% 19%)  - Brand primary
Orange:  hsl(33 100% 50%)  - Brand secondary
Green:   hsl(142 76% 36%)  - Nature
Cyan:    hsl(199 89% 48%)  - Ocean
Violet:  hsl(262 83% 58%)  - Royal
Rose:    hsl(347 77% 50%)  - Elegant
Neutral: hsl(0 0% 9%)      - Minimal
```

---

## 📐 Design Tokens

### Spacing
```css
Gap Small:    0.5rem  (gap-2)
Gap Medium:   0.75rem (gap-3)
Gap Large:    1rem    (gap-4)
```

### Border Radius
```css
Default:      0.5rem
Small:        0.375rem
Large:        0.625rem
```

### Icon Sizes
```css
Small:        4x4  (h-4 w-4)
Medium:       5x5  (h-5 w-5)  ← Default for sidebar/cards
Large:        8x8  (h-8 w-8)
Extra Large:  10x10 (h-10 w-10)
```

### Shadows
```css
Card Hover:   shadow-md
Default:      shadow-sm
None:         shadow-none
```

---

## 🎯 Component Patterns

### Icon with Background
```tsx
<div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
  <Icon className="h-5 w-5 text-primary" />
</div>
```

### Status Badge
```tsx
<div className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">
  Success
</div>
```

### Card with Border Accent
```tsx
<Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
  {/* Card content */}
</Card>
```

### Keyboard Shortcut Display
```tsx
<kbd className="inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
  ⌘K
</kbd>
```

---

## 📱 Responsive Breakpoints

```css
sm:   640px   - Small devices
md:   768px   - Medium devices (sidebar shows)
lg:   1024px  - Large devices (shortcuts show)
xl:   1280px  - Extra large
2xl:  1536px  - 2X Extra large
```

---

## 🎨 Usage Examples

### Dashboard Card
```tsx
<Card className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
      <Package className="h-5 w-5 text-primary" />
    </div>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">1,245</div>
    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
      <TrendingUp className="h-3 w-3 text-green-500" />
      <span className="text-green-500 font-medium">+20.1%</span> from last month
    </p>
  </CardContent>
</Card>
```

### Activity Item
```tsx
<div className="flex items-start gap-3">
  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-500/10 shrink-0">
    <CheckCircle2 className="h-4 w-4 text-green-500" />
  </div>
  <div className="flex-1 space-y-1">
    <p className="text-sm font-medium leading-none">Pickup completed</p>
    <p className="text-xs text-muted-foreground">15 minutes ago</p>
  </div>
  <div className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">
    Success
  </div>
</div>
```

---

## 🔧 Common Customizations

### Change Primary Color
Edit `app/globals.css`:
```css
:root {
  --primary: hsl(227 95% 19%); /* Your color here */
}
```

### Change Sidebar Default State
Edit `components/layout/AppSidebar.tsx`:
```tsx
const [isCollapsed, setIsCollapsed] = useState(false) // false = expanded
```

### Add New Keyboard Shortcut
Edit `hooks/use-keyboard-shortcuts.ts`:
```tsx
// Add to handleKeyDown function
if (e.key === 'x' && !modKey) {
  e.preventDefault()
  router.push('/your-page')
}
```

### Add New Theme
Edit `components/theme-customizer.tsx`:
```tsx
const themes = [
  // ... existing themes
  { name: "Your Theme", value: "yourtheme", color: "bg-your-color", description: "Your description" },
]
```

Then add to `app/globals.css`:
```css
[data-theme="yourtheme"] {
  --primary: hsl(your values);
  --ring: hsl(your values);
}
```

---

## 📊 Before vs After

### Sidebar
**Before**: 
- Static width (256px)
- Small icons (4x4)
- Monochrome
- No shortcuts

**After**:
- Collapsible (64px ↔ 256px)
- Larger icons (5x5)
- Colorful backgrounds
- Keyboard shortcuts shown
- Smooth animations

### Dashboard Cards
**Before**:
- Plain borders
- Small icons (4x4)
- Monochrome
- No hover effects

**After**:
- Colored left border (4px)
- Larger icons (5x5)
- Colorful backgrounds
- Hover shadow
- Trend indicators

### Theme Switcher
**Before**:
- 8 themes (including yellow)
- Small color dots
- No descriptions

**After**:
- 7 themes (removed yellow)
- Larger swatches (4x4)
- Theme descriptions
- Better layout

### Icons
**Before**:
- 4x4 size
- Monochrome
- No backgrounds

**After**:
- 5x5 size (25% larger)
- Colorful
- Rounded backgrounds
- Contextual colors

---

## 🎯 Best Practices

### Color Usage
✅ Use brand navy for primary actions
✅ Use brand orange for accents and warnings
✅ Use green for success states
✅ Use red for errors
✅ Use cyan for info
✅ Maintain 10% opacity for backgrounds

### Icons
✅ Always use 5x5 for main UI icons
✅ Use 4x4 for small icons (badges, etc.)
✅ Add colored backgrounds for context
✅ Use rounded containers (rounded-lg or rounded-full)

### Spacing
✅ Use gap-3 for most layouts
✅ Use gap-4 for cards
✅ Use gap-2 for tight layouts
✅ Maintain consistent padding

### Animations
✅ Use 300ms for transitions
✅ Use ease-in-out for smooth feel
✅ Add hover effects to interactive elements
✅ Keep animations subtle

---

## 🚨 Common Issues & Solutions

### Issue: Sidebar not collapsing
**Solution**: Check localStorage, clear if needed:
```js
localStorage.removeItem('sidebar-collapsed')
```

### Issue: Keyboard shortcuts not working
**Solution**: Make sure you're not in an input field. Shortcuts are disabled in inputs to prevent conflicts.

### Issue: Theme not changing
**Solution**: Check that data-theme attribute is being set on body element.

### Issue: Colors look wrong
**Solution**: Verify CSS variables are properly defined in globals.css for both light and dark modes.

---

## 📚 Resources

### Documentation
- `REDESIGN_NOTES.md` - Comprehensive redesign documentation
- `REDESIGN_SUMMARY.md` - Summary of all changes
- `QUICK_REFERENCE.md` - This file

### Key Files
- `app/globals.css` - Color system
- `components/layout/AppSidebar.tsx` - Sidebar component
- `components/keyboard-shortcuts.tsx` - Shortcuts modal
- `hooks/use-keyboard-shortcuts.ts` - Shortcuts handler

### External Resources
- [shadcn/ui](https://ui.shadcn.com) - Component library
- [Tailwind CSS v4](https://tailwindcss.com) - Utility framework
- [Lucide Icons](https://lucide.dev) - Icon library

---

**Version**: 2.0.0  
**Last Updated**: February 8, 2026  
**Quick Tip**: Press `⌘/Ctrl + /` to see all keyboard shortcuts!
