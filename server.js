const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// مفتاح الـ API الخاص بك
const API_KEY = "AIzaSyDN-u3PM7Ler2yv3kEaup8SqLno0JULMuA";
const genAI = new GoogleGenerativeAI(API_KEY);

app.post("/ask-gemini", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "لا يوجد نص مرسل" });
    }

    // استدعاء الموديل (استخدمنا gemini-1.5-flash للتوافق العالمي وضمان السرعة)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction:
        "أنت المساعد الذكي لموقع كونتننتال (كون إيليت) في صنعاء. أجب بذكاء ومهنية وباللغة العربية.",
    });

    // تنفيذ الطلب
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ text: text });
  } catch (error) {
    console.error("حدث خطأ:", error);
    res.status(500).json({
      error:
        "فشل الاتصال بالذكاء الاصطناعي. إذا كنت في اليمن، تأكد من رفع هذا السيرفر على استضافة خارج البلاد لتجاوز الحظر الجغرافي.",
    });
  }
});

// ملاحظة: المنفذ يتغير تلقائياً عند رفعه على استضافة مثل Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
