import React, { useState, useRef, useEffect } from "react";
import { usePanelStore } from "@/store/panelStore";
import { useMyColorStore } from "@/store/myColorStore";
import ModalWrapper from "@/components/elements/ModalWrapper";
import emailjs from "@emailjs/browser";
import { MdCheckCircleOutline } from "react-icons/md";

const ContactPanel = () => {
  const { isContactPanelOpen, toggleContactPanel } = usePanelStore();
  const { mainColorA, textColorA, baseColorA, baseColorB, accentColorA } =
    useMyColorStore();
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sendResult, setSendResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // 成功アイコンの表示を制御
  useEffect(() => {
    if (sendResult?.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [sendResult]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    setIsSending(true);
    setSendResult(null);
    setShowSuccess(false);

    try {
      // 環境変数からEmailJSの設定を取得
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      // 環境変数が設定されているか確認
      if (!serviceId || !templateId || !publicKey) {
        throw new Error(
          "EmailJSの設定が不足しています。環境変数を確認してください。"
        );
      }

      // EmailJSを使用してメール送信
      const result = await emailjs.sendForm(
        serviceId,
        templateId,
        formRef.current,
        publicKey
      );

      if (result.status === 200) {
        // 送信成功
        setSendResult({
          success: true,
          message: "お問い合わせを送信しました。ありがとうございます。",
        });

        // フォームをリセット
        setFormData({
          name: "",
          email: "",
          message: "",
        });
      } else {
        // 送信失敗
        setSendResult({
          success: false,
          message:
            "送信に失敗しました。しばらく経ってからもう一度お試しください。",
        });
      }
    } catch (error) {
      console.error("メール送信エラー:", error);
      setSendResult({
        success: false,
        message:
          "送信中にエラーが発生しました。しばらく経ってからもう一度お試しください。",
      });
    } finally {
      setIsSending(false);
    }
  };

  const inputStyle = {
    backgroundColor: baseColorB ? baseColorB : baseColorA,
    border: baseColorB ? `1px solid transparent` : `1px solid ${textColorA}`,
    color: textColorA,
    padding: "0.5rem",
    borderRadius: "0.25rem",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s ease",
  };

  const focusStyle = {
    borderColor: accentColorA,
    boxShadow: `0 0 0 1px ${accentColorA}`,
  };

  return (
    <ModalWrapper
      isOpen={isContactPanelOpen}
      onClose={toggleContactPanel}
      backgroundColor={baseColorA}
    >
      <div
        className="p-8 max-w-2xl mx-auto"
        style={
          {
            "--base-color-b": baseColorB || baseColorA,
            "--text-color-a": textColorA,
          } as React.CSSProperties
        }
      >
        <h1
          className="text-3xl font-bold mb-8 text-center"
          style={{ color: mainColorA }}
        >
          お問い合わせ
        </h1>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6"
          style={{ color: textColorA }}
        >
          <div className="space-y-2">
            <label htmlFor="name" className="block">
              お名前
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
              className="focus:outline-none"
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = baseColorB
                  ? "transparent"
                  : textColorA;
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
              className="focus:outline-none"
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = baseColorB
                  ? "transparent"
                  : textColorA;
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block">
              お問い合わせ内容
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              style={inputStyle}
              className="focus:outline-none"
              onFocus={(e) => Object.assign(e.target.style, focusStyle)}
              onBlur={(e) => {
                e.target.style.borderColor = baseColorB
                  ? "transparent"
                  : textColorA;
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div className="flex justify-center mt-8 items-center gap-2">
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-2 rounded-lg font-bold"
              style={{
                backgroundColor: mainColorA,
                color: baseColorA,
                opacity: isSending ? 0.7 : 1,
                cursor: isSending ? "not-allowed" : "pointer",
              }}
              disabled={isSending}
            >
              {showSuccess && (
                <MdCheckCircleOutline
                  className="w-6 h-6"
                  style={{ color: baseColorA }}
                />
              )}
              {isSending ? "送信中..." : "送信する"}
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default ContactPanel;
