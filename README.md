# 🎨 SketchSync – Collaborative Drawing Canvas

SketchSync is a real-time collaborative drawing application built using **React**, **Fabric.js**, and **Firebase Firestore**.  
It allows users to draw, modify, and save their canvas data seamlessly with automatic syncing.

---

## 🚀 Features
- **Canvas Drawing** using Fabric.js (shapes, free drawing, object manipulation).  
- **Real-time Auto Save** – Every change is automatically saved to Firestore.  
- **Manual Save Button** – For explicit control over saving.  
- **Persistent Storage** – Reloading the page restores your last canvas.  
- **Keyboard Delete Support** – Remove selected objects with `Delete` or `Backspace`.  
- **Mobile Responsive UI** – Works across devices.

---

## 🛠️ Tech Stack
- **Frontend:** React, Tailwind CSS, Fabric.js  
- **Backend:** Firebase Firestore (NoSQL database)  
- **Other Tools:** Vite, Custom React Hooks, .env for environment variables  

---

## ⚙️ Project Structure

---

## 📝 Trade-offs Made
While building this project, the following decisions were made:

1. **Firestore for Simplicity**  
   - Chose Firebase Firestore instead of a custom backend to reduce complexity and speed up development.  
   - Trade-off: Limited backend flexibility compared to a custom Node.js/Express API.

2. **Auto-Save with Debouncing**  
   - Used a **debounce hook** to avoid frequent writes to Firestore.  
   - Trade-off: Changes are not saved instantly (small 1-second delay), but this significantly reduces Firestore usage and costs.

3. **Single-Scene Storage**  
   - For simplicity, only one `sceneId` is used at a time.  
   - Trade-off: Multi-user editing on multiple canvases requires additional logic not included in this version.

---

## 🌟 Bonus Features
- **Manual Save Button:**  
  Gives users control to explicitly save whenever they want.
- **Object Count Display:**  
  Shows how many objects currently exist on the canvas.
- **Keyboard Shortcuts:**  
  Delete selected objects with `Delete` or `Backspace`.
- **Responsive Layout:**  
  Optimized for both desktop and mobile devices.

---

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Mohit-1202/sketchsync.git
cd sketchsync
