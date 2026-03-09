import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const phone = "212666666666";
  const message = encodeURIComponent("Bonjour, je suis intéressé(e) par vos casquettes !");

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contacter sur WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
    >
      <MessageCircle size={26} />
    </a>
  );
};

export default WhatsAppButton;
