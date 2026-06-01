import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";

export function WhatsAppButton() {
  const { userName, language } = useApp();

  // إنشاء رسالة الواتساب مع اسم المستخدم إذا كان موجودًا
  const message = userName
    ? `مرحباً، أنا ${userName} وأحتاج مساعدة { من الموقع}`
    : "مرحباً، أحتاج مساعدة { من الموقع}";

  const whatsappUrl = `https://wa.me/249908180432?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-18 sm:bottom-15 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:shadow-[0_0_40px_rgba(34,197,94,0.7)] transition-all ${
        language === "ar" ? "sm:left-8 left-2" : "sm:right-8 right-2"
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: [
          "0 0 30px rgba(34,197,94,0.5)",
          "0 0 40px rgba(34,197,94,0.7)",
          "0 0 30px rgba(34,197,94,0.5)",
        ],
      }}
      transition={{
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      <MessageCircle className="w-7 h-7" />
    </motion.a>
  );
}