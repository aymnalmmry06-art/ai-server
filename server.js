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

    // تم التحديث إلى gemini-1.5-flash-latest لضمان التوافق مع سيرفرات Render
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
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
        "فشل في استدعاء الذكاء الاصطناعي. يرجى التأكد من إعدادات الموديل والمفتاح.",
    });
  }
});

// المنفذ الخاص ببيئة Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
