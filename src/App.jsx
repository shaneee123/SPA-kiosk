import { useState, useEffect, useRef } from "react";
import spaBg from "./assets/spa6.png";
import {
  QrCode,
  Wifi,
  CheckCircle2,
  CreditCard,
  UserCheck,
  Ticket,
  Loader2,
  Clock,
  ChevronRight,
  ChevronLeft,
  Globe,
} from "lucide-react";

const translations = {
  EN: {
    welcome: "Premium\nRelaxation\nStarts Here",
    urbanEscape: "Manhattan Premium",
    start: "Begin Check-in",
    touchToStart: "Click Button to Start",
    admission: "Admission",
    selectType: "Select your ticket type",
    dayPass: "Day Pass",
    dayPassDesc: "Single entry for all facilities",
    membership: "Membership",
    membershipDesc: "NYC Premium Members only",
    voucher: "Voucher",
    voucherDesc: "Gift cards & Corporate codes",
    scanTitle: "Scan QR Code",
    scanDesc: "Please place your ticket QR under the scanner",
    verifying: "Verifying Access",
    issueTitle: "Collect Wristband",
    issueDesc: "Your access band is being issued below",
    received: "I've Got the Band",
    tagTitle: "Final Activation",
    tagDesc: "Tap your band to the NFC sensor",
    success: "Enjoy your Stay!",
    complete: "Check-in Complete",
    locker: "Your Assigned Locker",
    guest: "Guest",
    access: "Access",
    finish: "Close & Finish",
  },

  KO: {
    welcome: "최상의 휴식이\n시작되는 곳",
    urbanEscape: "맨해튼 프리미엄",
    start: "체크인 시작",
    touchToStart: "화면을 터치하세요",
    admission: "입장권 선택",
    selectType: "보유하신 티켓 종류를 선택해 주세요",
    dayPass: "일일권",
    dayPassDesc: "모든 시설 1회 이용 가능",
    membership: "멤버십",
    membershipDesc: "NYC 프리미엄 회원 전용",
    voucher: "바우처",
    voucherDesc: "기프트 카드 및 기업 코드",
    scanTitle: "QR 코드 스캔",
    scanDesc: "하단 스캐너에 QR 코드를 인식시켜 주세요",
    verifying: "정보 확인 중",
    issueTitle: "손목밴드 수령",
    issueDesc: "손목밴드가 하단 배출구로 나옵니다",
    received: "수령 완료",
    tagTitle: "최종 활성화",
    tagDesc: "NFC 센서에 밴드를 태그해 주세요",
    success: "즐거운 시간 되세요!",
    complete: "체크인 완료",
    locker: "배정된 라커 번호",
    guest: "방문객",
    access: "입장권",
    finish: "완료 및 닫기",
  },
};

export default function App() {
  const [step, setStep] = useState("idle");
  const [lang, setLang] = useState("EN");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  const [guestCount, setGuestCount] = useState(0);
  const [currentGuestIndex, setCurrentGuestIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState("saved");
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);

  const [guests, setGuests] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [memberData, setMemberData] = useState(null);
  const [history, setHistory] = useState([]);
  const prevStepRef = useRef(step);
  const [isMembershipFlow, setIsMembershipFlow] = useState(false);

  const bg = spaBg;


  

  useEffect(() => {

  if (prevStepRef.current !== step) {

    setHistory((prev) => [...prev, prevStepRef.current]);

    prevStepRef.current = step;
  }

}, [step]);


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
  if (step === "face_capture") {
    navigator.mediaDevices.getUserMedia({ video: true }).then((s) => {
      setStream(s);

      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
    });
  }

  // cleanup (step 바뀔 때 카메라 종료)
  return () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
  };
}, [step]);

  const t = translations[lang];

  // const handleBack = () => {
  // const map = {
  //   select_type: "idle",

  //   select_guests: "select_type",
  //   scan_qr: "select_type",

  //   payment: "select_guests",
  //   choose_card: "payment",
  //   guest_registration: "payment_approved",

  //   face_capture: "guest_registration",
  //   new_customer_registration: "face_capture",
  //   confirm_identity: "new_customer_registration",
  //   phone_verification: "face_capture",
  //   waiver: "phone_verification",
  //   card_register: "waiver",
  //   payment_terminal: "phone_verification",
  //   locker_selection: "payment_terminal",

  //   issue_wristband: "scan_qr",
  //   tag_wristband: "issue_wristband",
  //   existing_member_found: "scan_qr",
  // };

  //   if (map[step]) {
  //     setStep(map[step]);
  //   }
  // };
const handleBack = () => {

  if (history.length <= 1) return;

  const newHistory = [...history];

  newHistory.pop();

  const previousStep = newHistory[newHistory.length - 1];

  setHistory(newHistory);

  prevStepRef.current = previousStep;

  setStep(previousStep);
};


  const simulateLoading = (next) => {
    setStep("loading");

    setTimeout(() => {
      setStep(next);
    }, 1500);
  };

  // const showBack = [
  //   "select_type",
  //   "select_guests",
  //   "payment",
  //   "guest_registration",
  //   "waiver",
  //   "face_capture",
  //   "new_customer_registration",
  //   "phone_verification",
  //   "card_register",
  //   "confirm_identity",
  //   "payment_terminal",
  //   "locker_selection",
  //   "scan_qr",
  //   "issue_wristband",
  //   "tag_wristband",
  //   "existing_member_found",
  // ].includes(step);

  const showBack = history.length > 1;

  const resetAppState = (targetStep = "idle") => {

  // camera cleanup
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
  }

  setGuests([]);

  setGuestCount(0);
  setCurrentGuestIndex(0);

  setFirstName("");
  setLastName("");
  setBirthDate("");

  setSelectedType("");
  setSelectedCard("saved");

  setCapturedImage(null);

  setMemberData(null);

  setIsMembershipFlow(false);

  setStep(targetStep);

  // history reset
  setHistory([targetStep]);

  prevStepRef.current = targetStep;
};

  return (
    <div className="w-full min-h-screen bg-slate-900 overflow-hidden relative font-sans">
      {/* BG */}
      <div
        className={`absolute inset-0 transition-all duration-700 ${
          step === "idle" ? "h-full" : "h-[35%]"
        }`}
      >
        <img
          src={bg}
          className="w-full h-full object-cover"
          alt="spa"
        />

        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/20" />
      </div>

      {/* TOP BAR */}
      <div className="absolute top-6 left-0 w-full px-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              className="bg-black/30 backdrop-blur-xl p-3 rounded-2xl text-white"
            >
              <ChevronLeft />
            </button>
          )}

          <div className="bg-black/30 backdrop-blur-xl px-4 py-2 rounded-full text-white flex items-center gap-2">
            <Clock size={14} />
            <span className="text-xs font-bold">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="bg-black/30 backdrop-blur-xl px-4 py-2 rounded-full text-white flex items-center gap-2"
          >
            <Globe size={16} />
            <span>{lang}</span>
          </button>

          {showLangMenu && (
            <div className="absolute top-full right-0 mt-3 bg-white rounded-3xl overflow-hidden shadow-2xl w-40">
              {Object.keys(translations).map((code) => (
                <button
                  key={code}
                  onClick={() => {
                    setLang(code);
                    setShowLangMenu(false);
                  }}
                  className="w-full px-5 py-4 hover:bg-slate-100 text-left font-bold"
                >
                  {code}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* HERO */}
      <div
        className={`relative z-10 flex flex-col items-center transition-all duration-700 ${
          step === "idle"
            ? "pt-24"
            : "h-[35vh] justify-center"
        }`}
      >
        <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center text-white text-2xl font-black backdrop-blur-xl">
          NY
        </div>

        <div className="text-center mt-5">
          <h1 className="text-white text-2xl font-black tracking-[0.2em]">
            NEW YORK SPA
          </h1>

          <p className="text-yellow-400 uppercase tracking-[0.3em] text-xs mt-2 font-black">
            {t.urbanEscape}
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div
        className={`relative z-20 transition-all duration-700 ${
          step === "idle"
            ? "bg-transparent"
            : "bg-white rounded-t-[3rem] -mt-10 min-h-[65vh]"
        }`}
      >
        {/* IDLE */}
        {step === "idle" && (
          <div className="px-10 pb-20 pt-20 flex flex-col justify-end min-h-screen">
            <div className="mb-16">
              <h2 className="text-white text-6xl font-black leading-none whitespace-pre-line">
                {t.welcome}
              </h2>

              <div className="w-20 h-1 bg-blue-500 rounded-full mt-6" />

              <p className="text-white/80 mt-6 text-xl font-bold max-w-sm">
                Experience world-class wellness in Manhattan.
              </p>
            </div>

            <button
              onClick={() => setStep("select_type")}
              className="w-full py-7 rounded-[2rem] bg-white/10 backdrop-blur-2xl border border-white/20 text-white text-2xl font-black flex justify-center items-center gap-3"
            >
              {t.start}
              <ChevronRight size={30} />
            </button>

            <p className="text-center text-white/50 mt-6 uppercase tracking-[0.3em] text-xs">
              {t.touchToStart}
            </p>
          </div>
        )}

        {/* SELECT TYPE */}
        {step === "select_type" && (
          <div className="p-10">
            <h2 className="text-4xl font-black">
              {t.admission}
            </h2>

            <p className="text-slate-400 mt-2 font-bold">
              {t.selectType}
            </p>

            <div className="space-y-5 mt-10">
              {[
                {
                  id: "day",
                  label: t.dayPass,
                  desc: t.dayPassDesc,
                  icon: <Ticket />,
                },
                {
                  id: "mem",
                  label: t.membership,
                  desc: t.membershipDesc,
                  icon: <UserCheck />,
                },
                {
                  id: "vou",
                  label: t.voucher,
                  desc: t.voucherDesc,
                  icon: <CreditCard />,
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedType(item.label);

                    if (item.id === "day") {
                      setIsMembershipFlow(false);
                      setStep("select_guests");
                    }

                    if (item.id === "mem") {
                      setStep("scan_qr");
                    }

                    if (item.id === "vou") {
                      setIsMembershipFlow(false);
                      setStep("scan_qr");
                    }
                  }}
                  className="w-full bg-slate-50 rounded-[2rem] p-7 flex items-center gap-5 hover:bg-blue-50 transition-all"
                >
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center">
                    {item.icon}
                  </div>

                  <div className="flex-1 text-left">
                    <p className="text-2xl font-black">
                      {item.label}
                    </p>

                    <p className="text-slate-400 mt-1">
                      {item.desc}
                    </p>
                  </div>

                  <ChevronRight />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SELECT GUESTS */}
        {step === "select_guests" && (
          <div className="min-h-[65vh] p-10 flex flex-col">
            <div>
              <h2 className="text-4xl font-black">
                Select Guests
              </h2>

              <p className="text-slate-400 mt-3 font-bold">
                How many guests are checking in?
              </p>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-8">
                <button
                  onClick={() =>
                    setGuestCount(Math.max(1, guestCount - 1))
                  }
                  className="w-20 h-20 rounded-full bg-slate-100 text-4xl font-black"
                >
                  -
                </button>

                <div className="text-8xl font-black text-slate-900 w-32 text-center">
                  {guestCount}
                </div>

                <button
                  onClick={() => setGuestCount(guestCount + 1)}
                  className="w-20 h-20 rounded-full bg-blue-600 text-white text-4xl font-black"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => setStep("payment")}
              className="w-full bg-slate-900 text-white py-7 rounded-[2rem] text-2xl font-black"
            >
              Continue
            </button>
          </div>
        )}

        {/* PAYMENT
        {step === "payment" && (
          <div className="min-h-[65vh] p-10 flex flex-col">
            <div>
              <h2 className="text-4xl font-black">
                Payment Summary
              </h2>

              <p className="text-slate-400 mt-3 font-bold">
                Review your admission purchase
              </p>
            </div>

            <div className="mt-12 bg-slate-50 rounded-[2rem] p-8 space-y-6">
              <div className="flex justify-between text-xl font-bold">
                <span>Guests</span>
                <span>{guestCount}</span>
              </div>

              <div className="flex justify-between text-xl font-bold">
                <span>Price Per Guest</span>
                <span>$65</span>
              </div>

              <div className="border-t pt-6 flex justify-between text-3xl font-black">
                <span>Total</span>
                <span>${guestCount * 65}</span>
              </div>
            </div>

            <div className="mt-auto pt-10">
              <button
                onClick={() => setStep("choose_card")}
                className="w-full bg-blue-600 text-white py-7 rounded-[2rem] text-2xl font-black"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )} */}

        {/* PAYMENT TERMINAL */}
        {step === "payment" && (
          <div className="min-h-[65vh] flex flex-col justify-center items-center p-10 text-center bg-white">
            <div className="w-44 h-44 rounded-[3rem] bg-blue-50 flex items-center justify-center shadow-inner animate-pulse">
              <CreditCard
                size={90}
                className="text-blue-600"
              />
            </div>

            <h2 className="text-5xl font-black mt-14 leading-tight">
              Please Tap,
              <br />
              Insert or Swipe
              <br />
              Your Card
            </h2>

            <p className="text-slate-400 text-xl font-bold mt-8 leading-relaxed max-w-md">
              Secure payment terminal is ready.
              <br />
              Follow the instructions on the reader.
            </p>

            <div className="mt-16 flex items-center gap-3 text-blue-600 font-black uppercase tracking-[0.25em] text-sm animate-pulse">
              <div className="w-2 h-2 rounded-full bg-blue-600" />
              Waiting for Payment
            </div>

            <button
              onClick={() => setStep("payment_approved")}
              className="mt-20 text-blue-600 font-black text-lg"
            >
              SIMULATE PAYMENT SUCCESS
            </button>
          </div>
        )}

        {/* PAYMENT APPROVED */}
        {step === "payment_approved" && (
          <div
            onClick={() => setStep("guest_registration")}
            className="min-h-[65vh] flex flex-col justify-center items-center p-10 text-center bg-white cursor-pointer"
          >
            <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center shadow-inner">
              <CheckCircle2
                size={58}
                className="text-green-500"
              />
            </div>

            <h2 className="text-5xl font-black mt-12 leading-tight text-slate-900">
              Payment
              <br />
              Approved
            </h2>

            <div className="mt-10 bg-slate-50 rounded-[2.5rem] p-10 w-full max-w-lg">
              <p className="text-slate-400 uppercase tracking-[0.3em] text-xs font-black">
                TRANSACTION SUMMARY
              </p>

              <div className="mt-8 flex justify-between items-center">
                <span className="text-xl font-bold text-slate-500">
                  Admission
                </span>

                <span className="text-2xl font-black text-blue-600">
                  {guestCount} Day Pass
                </span>
              </div>

              <div className="mt-5 flex justify-between items-center">
                <span className="text-xl font-bold text-slate-500">
                  Status
                </span>

                <span className="text-2xl font-black text-green-500">
                  Paid
                </span>
              </div>
            </div>

            <p className="mt-12 text-2xl font-black leading-relaxed text-slate-900 max-w-xl">
              {guestCount} Day Pass Admission Paid.
              <br />
              Now Register Each Guest.
            </p>

            <p className="mt-12 uppercase tracking-[0.4em] text-xs text-slate-400 font-black animate-pulse">
              TAP ANYWHERE TO CONTINUE
            </p>
          </div>
        )}

        {/* CHOOSE CARD */}
        {step === "choose_card" && (
          <div className="min-h-[65vh] p-10 flex flex-col">
            <div>
              <h2 className="text-4xl font-black">
                Choose Payment Method
              </h2>
              <p className="text-slate-400 mt-3 font-bold">
                Select your preferred card
              </p>
            </div>

            <div className="space-y-5 mt-12">
              <button
                onClick={() => setSelectedCard("saved")}
                className={`w-full rounded-[2rem] p-8 border-2 transition-all ${
                  selectedCard === "saved"
                    ? "border-blue-600 bg-blue-50"
                    : "border-transparent bg-slate-50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <p className="text-2xl font-black">
                      VISA •••• 4242
                    </p>

                    <p className="text-slate-400 mt-2">
                      Saved payment method
                    </p>
                  </div>

                  <CreditCard className="text-blue-600" />
                </div>
              </button>

              <button
                onClick={() => setSelectedCard("new")}
                className={`w-full rounded-[2rem] p-8 border-2 transition-all ${
                  selectedCard === "new"
                    ? "border-blue-600 bg-blue-50"
                    : "border-transparent bg-slate-50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <p className="text-2xl font-black">
                      Use New Card
                    </p>

                    <p className="text-slate-400 mt-2">
                      Tap or insert a new payment card
                    </p>
                  </div>

                  <CreditCard className="text-slate-500" />
                </div>
              </button>
            </div>

            <div className="mt-auto pt-10">
              <button
                onClick={() => setStep("guest_registration")}
                className="w-full bg-slate-900 text-white py-7 rounded-[2rem] text-2xl font-black"
              >
                Continue
              </button>
            </div>
          </div>
        )}

{/* GUEST REGISTRATION */}
{step === "guest_registration" && (
  <div className="min-h-[65vh] p-10 flex flex-col bg-white">

    {/* TITLE */}
    <div>
      <h2 className="text-5xl font-black leading-tight">
        We will now register
        <br />
        each paid guest
      </h2>

      <p className="text-slate-400 mt-4 font-bold text-lg">
        Guest {currentGuestIndex + 1} of {guestCount}
      </p>
    </div>

    {/* PROGRESS VISUAL (optional but kiosk 느낌 강화) */}
    <div className="mt-8 flex gap-2">
      {Array.from({ length: guestCount }).map((_, i) => (
        <div
          key={i}
          className={`h-2 flex-1 rounded-full ${
            i < currentGuestIndex + 1
              ? "bg-blue-600"
              : "bg-slate-200"
          }`}
        />
      ))}
    </div>

    {/* ADMISSION SUMMARY */}
    <div className="mt-12 bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
      <p className="text-slate-400 uppercase tracking-[0.3em] text-xs font-black">
        Admission Summary
      </p>

      <div className="mt-6 flex justify-between items-center">
        <span className="text-slate-500 font-bold text-lg">
          Access Type
        </span>

        <span className="text-2xl font-black text-blue-600">
          {selectedType}
        </span>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-slate-500 font-bold text-lg">
          Total Guests
        </span>

        <span className="text-2xl font-black text-slate-900">
          {guestCount}
        </span>
      </div>
    </div>

    {/* START BUTTON */}
    <div className="mt-auto pt-12">
      <button
        onClick={() => setStep("face_capture")}
        className="w-full bg-blue-600 text-white py-7 rounded-[2rem] text-2xl font-black shadow-xl hover:bg-blue-700 active:scale-95 transition-all"
      >
        Start
      </button>
    </div>

  </div>
)}

{/* FACE CAPTURE */}
{step === "face_capture" && (
  <div className="min-h-[65vh] flex flex-col items-center justify-center p-10 bg-black text-white">
    
    <h2 className="text-4xl font-black">
      Face Capture
    </h2>

    <p className="text-white/60 mt-3 text-center">
      Please look directly at the camera
    </p>

    <p className="text-blue-300 mt-4 font-black tracking-[0.2em] uppercase text-sm">
      Guest {currentGuestIndex + 1} of {guestCount}
    </p>

    {/* CAMERA */}
    <div className="relative w-80 h-96 mt-10 rounded-[2rem] overflow-hidden bg-slate-900">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* scan overlay */}
      <div className="absolute inset-0 border-4 border-blue-500/30 rounded-[2rem]" />

      {/* scanning line */}
      <div className="absolute inset-x-0 top-0 h-20 bg-blue-500/30 animate-scan" />
    </div>

    {/* SIMULATE BUTTON */}
    <button
      onClick={() => {
        // 카메라 종료
        if (stream) {
          stream.getTracks().forEach((t) => t.stop());
        }

        setStep("new_customer_registration");
      }}
      className="mt-10 px-10 py-4 bg-blue-600 rounded-2xl font-black text-white"
    >
      Simulate Capture
    </button>
  </div>
)}

{/* DRIVER LICENSE SCAN */}
{step === "new_customer_registration" && (
  <div className="min-h-[65vh] p-10 flex flex-col items-center justify-center bg-white">

    {/* TITLE */}
    <h2 className="text-5xl font-black text-center leading-tight">
      Please Scan
      <br />
      Your Driver's License
    </h2>

    <p className="text-slate-500 mt-5 text-center font-bold text-lg max-w-md leading-relaxed">
      Hold your ID under the scanner.
      <br />
      Guest information will be automatically verified.
    </p>

    {/* SCANNER AREA */}
    <div className="relative w-[420px] h-[260px] bg-slate-100 rounded-[2.5rem] mt-16 overflow-hidden border border-slate-200">

      {/* CARD MOCK */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[320px] h-[190px] rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-blue-400 shadow-2xl p-6 text-white relative">

          <div className="text-sm font-bold opacity-70">
            DRIVER LICENSE
          </div>

          <div className="mt-10">
            <div className="w-20 h-20 rounded-xl bg-white/20" />
          </div>

          <div className="absolute bottom-6 left-6">
            <p className="text-lg font-black">
              JOHN SMITH
            </p>

            <p className="text-xs opacity-80 mt-1">
              DOB 01/21/1994
            </p>
          </div>
        </div>
      </div>

      {/* SCAN LINE */}
      <div className="absolute inset-x-0 top-0 h-20 bg-blue-500/20 animate-scan" />
    </div>

    {/* STATUS */}
    <div className="mt-10 flex items-center gap-3 text-blue-600 font-black uppercase tracking-[0.3em] text-sm animate-pulse">
      <div className="w-2 h-2 rounded-full bg-blue-600" />
      Waiting For ID Scan
    </div>

    {/* SIMULATE */}
    <button
      onClick={() => {
        setFirstName("JOHN");
        setLastName("SMITH");
        setBirthDate("1994-01-21");

        setStep("confirm_identity");
      }}
      className="mt-14 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-xl"
    >
      Simulate License Scan
    </button>

  </div>
)}

{/* CONFIRM IDENTITY */}
{step === "confirm_identity" && (
  <div className="min-h-[65vh] p-10 flex flex-col bg-white">

    {/* TITLE */}
    <div>
      <h2 className="text-5xl font-black leading-tight">
        Please Confirm
        <br />
        Your Information
      </h2>

      <p className="text-slate-500 mt-4 font-bold text-lg">
        Information extracted from your driver's license
      </p>
    </div>

    {/* INFO CARD */}
    <div className="mt-12 bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">

      <div className="space-y-8">

        {/* NAME */}
        <div>
          <p className="text-slate-400 uppercase tracking-[0.25em] text-xs font-black">
            FULL NAME
          </p>

          <p className="text-3xl font-black mt-3">
            {firstName} {lastName}
          </p>
        </div>

        {/* DOB */}
        <div>
          <p className="text-slate-400 uppercase tracking-[0.25em] text-xs font-black">
            DATE OF BIRTH
          </p>

          <p className="text-3xl font-black mt-3">
            {birthDate}
          </p>
        </div>

        {/* STATUS */}
        <div className="bg-green-50 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="font-black text-green-700">
              Identity Verified
            </p>

            <p className="text-green-600 mt-1 font-medium">
              Driver's license successfully scanned
            </p>
          </div>

          <CheckCircle2
            className="text-green-500"
            size={40}
          />
        </div>

      </div>

    </div>

    {/* BUTTONS */}
    <div className="mt-auto pt-10 space-y-4">

      {/* CONFIRM */}
      <button
        onClick={() => setStep("phone_verification")}
        className="w-full bg-blue-600 text-white py-7 rounded-[2rem] text-2xl font-black"
      >
        Confirm Information
      </button>

      {/* RESCAN */}
      <button
        onClick={() => setStep("new_customer_registration")}
        className="w-full bg-slate-100 text-slate-900 py-7 rounded-[2rem] text-2xl font-black"
      >
        Scan Again
      </button>

    </div>

  </div>
)}

{/* PHONE VERIFICATION */}
{step === "phone_verification" && (
  <div className="min-h-[65vh] p-10 flex flex-col bg-white">

    {/* TITLE */}
    <h2 className="text-4xl font-black leading-tight">
      Phone Verification
    </h2>

    <p className="text-slate-500 mt-3 font-bold">
      Enter your mobile number to receive verification code
    </p>

    {/* INPUT */}
    <div className="mt-12 space-y-5">
      <input
        type="tel"
        placeholder="Phone Number"
        className="w-full bg-slate-50 p-6 rounded-2xl font-black text-xl outline-none"
      />

      <input
        type="text"
        placeholder="Enter Verification Code"
        className="w-full bg-slate-50 p-6 rounded-2xl font-black text-xl outline-none"
      />
    </div>

    {/* INFO BOX */}
    <div className="mt-10 bg-blue-50 rounded-[2rem] p-6">
      <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-xs">
        SMS SENT
      </p>

      <p className="text-slate-700 mt-2 font-bold">
        A 6-digit verification code has been sent to your phone
      </p>
    </div>

    {/* BUTTON */}
    <button
      onClick={() => setStep("waiver")}
      className="mt-auto bg-blue-600 text-white py-6 rounded-2xl font-black text-xl"
    >
      Verify & Continue
    </button>

  </div>
)}

{/* WAIVER AGREEMENT */}
{step === "waiver" && (
  <div className="min-h-[65vh] p-10 flex flex-col bg-white">

    {/* TITLE */}
    <h2 className="text-4xl font-black leading-tight">
      Liability Waiver
    </h2>

    <p className="text-slate-500 mt-3 font-bold">
      Please read and accept the terms before continuing
    </p>

    {/* WAIVER BOX */}
    <div className="mt-10 bg-slate-50 rounded-[2rem] p-8 h-[45vh] overflow-y-auto">
      
      <p className="text-sm text-slate-600 leading-relaxed font-medium">
        By entering the facility, you acknowledge and agree that you are using all services at your own risk. 
        The spa, its employees, and affiliates are not responsible for any injuries, losses, or damages incurred during your visit.
        <br /><br />
        You confirm that you are physically fit to participate in all activities including sauna, steam rooms, cold plunge, and fitness areas.
        <br /><br />
        You also agree to follow all safety instructions and facility rules at all times. Failure to comply may result in removal without refund.
        <br /><br />
        You voluntarily waive any legal claims against the facility for incidents occurring within the premises.
      </p>

    </div>

    {/* CHECKBOX */}
    <label className="flex items-center gap-4 mt-8">
      <input type="checkbox" className="w-6 h-6" />
      <span className="text-slate-700 font-bold">
        I agree to the waiver terms
      </span>
    </label>

    {/* BUTTON */}
    <button
      onClick={() => setStep("card_register")}
      className="mt-auto bg-blue-600 text-white py-6 rounded-2xl font-black text-xl disabled:opacity-40"
    >
      Accept & Continue
    </button>

  </div>
)}

{/* CARD REGISTER */}
{step === "card_register" && (
  <div className="min-h-[65vh] p-10 flex flex-col bg-white">

    <h2 className="text-4xl font-black">
      Payment Method Setup
    </h2>

    <p className="text-slate-400 mt-2 font-bold">
      Guest {currentGuestIndex + 1} of {guestCount}
    </p>

    <p className="text-slate-500 mt-3 font-bold">
      Use the same card used for Day Pass?
    </p>

    <div className="mt-10 bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
      <p className="text-slate-400 uppercase tracking-[0.3em] text-xs font-black">
        CARD ON FILE
      </p>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-xl font-black text-slate-900">
          VISA •••• 4242
        </span>

        <CreditCard className="text-blue-600" />
      </div>

      <p className="text-slate-500 mt-5 font-medium leading-relaxed">
        This card may be used for incidentals or future authorized charges.
      </p>
    </div>

    <div className="mt-12 space-y-5">

      {/* USE SAME CARD */}
    <button
      onClick={() => {

        // 현재 guest 저장
        if (!isMembershipFlow) {

          const newGuest = {
            id: currentGuestIndex + 1,
            name: `${firstName} ${lastName}`,
            birthDate: birthDate,
            locker: `A10${currentGuestIndex + 1}`,
          };

          setGuests((prev) => [...prev, newGuest]);
        }

        setStep("guest_complete");
      }}
      className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-xl"
    >
      Use This Card
    </button>

      {/* DIFFERENT CARD */}
      <button
        onClick={() => setStep("choose_card")}
        className="w-full bg-slate-100 text-slate-900 py-6 rounded-2xl font-black text-xl"
      >
        Register Different Card
      </button>

    </div>

  </div>
)}

{/* GUEST COMPLETE */}
{step === "guest_complete" && (
  <div className="min-h-[65vh] flex flex-col items-center justify-center bg-white p-10 text-center">

    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
      <CheckCircle2 className="text-green-500" size={50} />
    </div>

    <h2 className="text-5xl font-black mt-10">
      Guest {currentGuestIndex + 1} Complete
    </h2>

    <p className="text-slate-500 mt-4 text-xl font-bold">
      Payment & Registration Completed
    </p>

    <button
      onClick={() => {

          // 입력값 초기화
          setFirstName("");
          setLastName("");
          setBirthDate("");


        if (currentGuestIndex + 1 < guestCount) {
          setCurrentGuestIndex(prev => prev + 1);
          setStep("face_capture");   // 다음 guest
        } else {
          setStep("register_summary"); // 마지막이면 summary
        }
      }}
      className="mt-12 bg-blue-600 text-white px-10 py-6 rounded-2xl font-black text-xl"
    >
      {currentGuestIndex + 1 < guestCount
        ? "Next Guest Registration"
        : "View Summary"}
    </button>

  </div>
)}

{/* EXISTING MEMBER FOUND */}
{step === "existing_member_found" && (
  <div className="min-h-[65vh] p-10 flex flex-col bg-white">

    {/* TITLE */}
    <div>
      <h2 className="text-5xl font-black leading-tight">
        Welcome Back
      </h2>

      <p className="text-slate-500 mt-4 font-bold text-lg">
        Existing member profile found
      </p>
    </div>

    {/* MEMBER CARD */}
    <div className="mt-12 bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">

      <div className="space-y-8">

        <div>
          <p className="text-slate-400 uppercase tracking-[0.25em] text-xs font-black">
            FULL NAME
          </p>

          <p className="text-3xl font-black mt-3">
            {memberData?.name}
          </p>
        </div>

        <div>
          <p className="text-slate-400 uppercase tracking-[0.25em] text-xs font-black">
            DATE OF BIRTH
          </p>

          <p className="text-3xl font-black mt-3">
            {memberData?.birthDate}
          </p>
        </div>

        <div>
          <p className="text-slate-400 uppercase tracking-[0.25em] text-xs font-black">
            MEMBERSHIP
          </p>

          <p className="text-3xl font-black mt-3 text-blue-600">
            {memberData?.membership}
          </p>
        </div>

        <div className="bg-green-50 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="font-black text-green-700">
              Verified Member
            </p>

            <p className="text-green-600 mt-1 font-medium">
              Existing profile successfully matched
            </p>
          </div>

          <CheckCircle2
            className="text-green-500"
            size={40}
          />
        </div>

      </div>

    </div>

    {/* BUTTON */}
    <button
      onClick={() => {

        const returningGuest = {
          id: 1,
          name: memberData.name,
          birthDate: memberData.birthDate,
          locker: memberData.locker,
        };

        setGuests([returningGuest]);

        setStep("phone_verification");
      }}
      className="mt-auto bg-blue-600 text-white py-7 rounded-[2rem] text-2xl font-black"
    >
      Continue Check-in
    </button>

  </div>
)}

{/* VOUCHER VERIFIED */}
{step === "voucher_verified" && (
  <div className="min-h-[65vh] p-10 flex flex-col bg-white">

    {/* TITLE */}
    <div>
      <h2 className="text-5xl font-black leading-tight">
        Voucher verified
      </h2>

      <p className="text-slate-500 mt-4 font-bold text-lg">
        Your voucher has been successfully validated
      </p>
    </div>

    {/* INFO CARD */}
    <div className="mt-12 bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">

      <p className="text-slate-400 uppercase tracking-[0.3em] text-xs font-black">
        VOUCHER DETAILS
      </p>

      <div className="mt-8 space-y-6">

        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-bold text-lg">
            Access Type
          </span>

          <span className="text-2xl font-black text-blue-600">
            Online Voucher
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-bold text-lg">
            Guests
          </span>

          <span className="text-2xl font-black">
            1
          </span>
        </div>

        <div className="bg-green-50 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="font-black text-green-700">
              Voucher Approved
            </p>

            <p className="text-green-600 mt-1 font-medium">
              Ready for guest registration
            </p>
          </div>

          <CheckCircle2
            className="text-green-500"
            size={40}
          />
        </div>

      </div>

    </div>

    {/* BUTTON */}
    <div className="mt-auto pt-10">
      <button
        onClick={() => {

          setCurrentGuestIndex(0);

          setStep("guest_registration");
        }}
        className="w-full bg-blue-600 text-white py-7 rounded-[2rem] text-2xl font-black"
      >
        Continue Registration
      </button>
    </div>

  </div>
)}

        {/* SCAN */}
        {step === "scan_qr" && (
          <div className="p-10 flex flex-col items-center justify-center min-h-[65vh]">
            <h2 className="text-4xl font-black">
              {t.scanTitle}
            </h2>

            <p className="text-slate-400 mt-3">
              {t.scanDesc}
            </p>

            <div className="relative w-72 h-72 bg-slate-900 rounded-[3rem] mt-14 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <QrCode
                  size={120}
                  className="text-white/20"
                />
              </div>

              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-blue-500/40 to-transparent animate-scan" />
            </div>

            <button
onClick={() => {

  // Membership
  if (
    selectedType === t.membership
  ) {

    setIsMembershipFlow(true);

    setMemberData({
      name: "Michael Lee",
      birthDate: "1991-08-14",
      phone: "(201) 555-1922",
      locker: "B204",
      membership: "Premium Annual",
    });

    simulateLoading("existing_member_found");
    return;
  }

  // Voucher
  if (
    selectedType === t.voucher
  ) {

    setGuestCount(1);

    simulateLoading("voucher_verified");
    return;
  }
}}
              className="mt-12 text-blue-600 font-black"
            >
              SIMULATE DETECTED
            </button>
          </div>
        )}

        {/* LOADING */}
        {step === "loading" && (
          <div className="min-h-[65vh] flex flex-col justify-center items-center">
            <Loader2
              size={100}
              className="animate-spin text-blue-600"
            />

            <p className="mt-10 text-3xl font-black">
              {t.verifying}
            </p>
          </div>
        )}

        {/* WRISTBAND */}
        {step === "issue_wristband" && (
          <div className="min-h-[65vh] flex flex-col items-center justify-center p-10">
            <h2 className="text-4xl font-black text-center">
              {t.issueTitle}
            </h2>

            <p className="text-slate-400 mt-3 text-center">
              {t.issueDesc}
            </p>

            <div className="w-80 h-52 bg-slate-100 rounded-[3rem] mt-16 flex items-end justify-center p-10">
              <div className="w-44 h-8 bg-blue-600 rounded-full animate-bounce" />
            </div>

            <button
              onClick={() => setStep("tag_wristband")}
              className="mt-16 w-full bg-blue-600 text-white py-7 rounded-[2rem] text-2xl font-black"
            >
              {t.received}
            </button>
          </div>
        )}

        {/* TAG */}
        {step === "tag_wristband" && (
          <div className="min-h-[65vh] flex flex-col items-center justify-center p-10">
            <h2 className="text-4xl font-black">
              {t.tagTitle}
            </h2>

            <p className="text-slate-400 mt-3">
              {t.tagDesc}
            </p>

            <div className="relative w-72 h-72 mt-16">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />

              <div className="relative w-full h-full bg-blue-50 rounded-[4rem] flex items-center justify-center">
                <Wifi
                  size={120}
                  className="text-blue-600 rotate-90"
                />
              </div>
            </div>

            <button
              onClick={() => simulateLoading("success")}
              className="mt-14 text-blue-600 font-black"
            >
              SIMULATE TAGGED
            </button>
          </div>
        )}

{/* REGISTER SUMMARY */}
{step === "register_summary" && (
  <div className="min-h-screen p-10 bg-white flex gap-10">

    {/* LEFT */}
    <div className="flex-1">

      <h2 className="text-5xl font-black">
        Registration Summary
      </h2>

      <p className="text-slate-500 mt-3 font-bold">
        All guests have been successfully registered
      </p>

      {/* GUEST LIST */}
      <div className="mt-12 space-y-5">
        {guests.map((g, i) => (
          <div
            key={i}
            className="bg-slate-50 p-6 rounded-2xl flex justify-between items-center"
          >
            <div>
              <p className="text-2xl font-black">
                {g.name}
              </p>

              <p className="text-slate-500 font-bold mt-1">
                Locker: {g.locker}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">

              {/* PRINT QR */}
              <button
                onClick={() => {
                  alert(`Printing QR for ${g.name}`);
                }}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-all text-white font-black text-sm"
              >
                Print QR
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM BUTTONS */}
      <div className="mt-10 space-y-4">

        {/* START NEW CHECK-IN */}
        <button
          onClick={() => {
            resetAppState("select_type");
          }}
          className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-xl"
        >
          Start New Check-in
        </button>

        {/* RETURN HOME */}
        <button
          onClick={() => {
            resetAppState("idle");
          }}
          className="w-full bg-slate-100 text-slate-900 py-6 rounded-2xl font-black text-xl"
        >
          Return to Home
        </button>

      </div>

    </div>

  </div>
)}
      </div>

      <style>{`
        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }

          100% {
            transform: translateY(300%);
          }
        }

        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
}