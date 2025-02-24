# Color-Check
Color Tester App: Upload images, extract colors, compare with predefined brand colors, and check WCAG contrast compliance for text readability.
Here's a **README.md** file for your repo. You can copy and paste it directly into your repository. 🚀  

---

## **Color Tester App** 🎨  

### **Overview**  
The **Color Tester App** allows users to upload images, extract dominant colors, compare them with predefined brand colors, and evaluate text readability based on **WCAG contrast compliance**.  

---

### **Features**  
✅ Upload an image (JPG, PNG, etc.).  
✅ Extract dominant and palette colors using **Color Thief**.  
✅ Compare extracted colors with predefined brand colors.  
✅ Generate similarity percentages and visualize them with **bar charts**.  
✅ Check **text readability** based on **WCAG contrast ratio** and classify as **Pass/Fail**.  

---

### **Technologies Used**  
🔹 **Frontend:** React, Tailwind CSS, Chart.js, Color Thief, TinyColor  
🔹 **Backend:** Node.js, Express.js, MongoDB  

---

### **Installation & Setup**  
#### **1. Clone the Repository**  
```sh
git clone https://github.com/yourusername/color-tester.git
cd color-tester
```

#### **2. Install Dependencies**  
```sh
npm install
```

#### **3. Start the React App**  
```sh
npm run dev
```

#### **4. Start the Backend (If Applicable)**  
```sh
cd backend
npm install
node server.js
```

---

### **Usage**  
1️⃣ Upload an image via the UI.  
2️⃣ Extracted colors will be displayed along with a comparison chart.  
3️⃣ The **contrast ratio** will be calculated and classified as **Pass/Fail**.  
4️⃣ Download the report if needed.  

---

### **WCAG Compliance Rules**  
- **Contrast ≥ 4.5:** ✅ Pass for normal text.  
- **Contrast ≥ 3.0:** ⚠️ Pass for large text (18pt or 14pt bold).  
- **Contrast < 3.0:** ❌ Fail (Low readability).  

---

Let me know if you need any changes! 🔥
