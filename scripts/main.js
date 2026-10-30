/**
 * Main Application Controller
 * Điều phối trạng thái ứng dụng (State), chuyển đổi Tab,
 * khởi tạo hiệu ứng 3D Tilt cho các lá bài và kết nối với NPC + các module phụ.
 */

import { NPCDialogue } from "./npc_dialogue.js";
import * as Div from "./divination.js";

// Lưu ý: Khi bạn tạo tiếp 2 file divination.js và canvas_effects.js,
// hệ thống sẽ tự động nạp chúng thông qua Dynamic Import an toàn bên dưới
// để tránh lỗi crash nếu 2 file đó chưa kịp tạo.

class MysticApp {
  constructor() {
    // Quản lý State tập trung
    this.state = {
      currentTab: "gieo-que",
      isShaking: false,
      isMuted: false,
      currentFortune: null,
    };

    // Khởi tạo NPC Thầy Bói
    this.npc = new NPCDialogue({
      textSelector: "#npc-text",
      avatarSelector: "#npc-avatar",
      moodLabelSelector: "#npc-mood-label",
      indicatorSelector: "#typing-indicator",
      skipBtnSelector: "#btn-skip-dialogue",
    });

    // Dữ liệu dự phòng (Fallback) cho Tử Vi & Quẻ Xăm trước khi ghép divination.js
    this.palaceDescriptions = {
      Dan: {
        title: "Cung Mệnh (Dần)",
        desc: "Chủ về tư chất, tính cách cốt lõi và vận mệnh tổng quan cả đời của đương số.",
      },
      Mao: {
        title: "Cung Phụ Mẫu (Mão)",
        desc: "Phản ánh tình cảm, duyên phận và sự tương trợ giữa đương số với cha mẹ.",
      },
      Thin: {
        title: "Cung Phúc Đức (Thìn)",
        desc: "Cội nguồn âm đức tổ tiên, đời sống tinh thần và sự an nhiên trong tâm hồn.",
      },
      Ty_1: {
        title: "Cung Điền Trạch (Tỵ)",
        desc: "Chủ về nhà cửa, đất đai, nơi ăn chốn ở và khả năng tích lũy bất động sản.",
      },
      Ngo: {
        title: "Cung Quan Lộc (Ngọ)",
        desc: "Con đường công danh, sự nghiệp, học vấn và địa vị ngoài xã hội.",
      },
      Mui: {
        title: "Cung Nô Bộc (Mùi)",
        desc: "Mối quan hệ với bạn bè, đồng nghiệp, cộng sự và những người dưới quyền.",
      },
      Than: {
        title: "Cung Thiên Di (Thân)",
        desc: "Việc xuất ngoại, di chuyển, môi trường bên ngoài và cơ hội nơi phương xa.",
      },
      Dau: {
        title: "Cung Tật Ách (Dậu)",
        desc: "Sức khỏe thể chất, những tai ương cần đề phòng và cách hóa giải bệnh tật.",
      },
      Tuat: {
        title: "Cung Tài Bạch (Tuất)",
        desc: "Nguồn tài chính, khả năng kiếm tiền, quản lý tiền bạc và vận may tài lộc.",
      },
      Hoi: {
        title: "Cung Tử Tức (Hợi)",
        desc: "Duyên phận con cái, hậu vận gia đình và sự kế thừa trong tương lai.",
      },
      Ti: {
        title: "Cung Phu Thê (Tý)",
        desc: "Tình duyên, hôn nhân, hình mẫu người bạn đời và hạnh phúc lứa đôi.",
      },
      Suu: {
        title: "Cung Huynh Đệ (Sửu)",
        desc: "Tình cảm anh chị em trong gia đình và sự gắn kết, nâng đỡ lẫn nhau.",
      },
    };
  }

  /**
   * Khởi tạo toàn bộ ứng dụng khi DOM đã sẵn sàng
   */
  async init() {
    this._initNavigation();
    this._initFortuneTellerEvents();
    this._initAgeFormEvents();
    this._initTuViBoardEvents();
    this._init3DTiltCards();
    this._initAudioToggle();

    // Tải động (Dynamic Import) 2 module còn lại nếu đã tồn tại
    await this._loadOptionalModules();

    // Lời chào mở đầu từ Tiên Sinh Huyền Cơ
    this.npc.speakPreset("welcome", "neutral");
  }

  /**
   * Nạp an toàn canvas_effects.js và divination.js
   */
  async _loadOptionalModules() {
    try {
      const canvasModule = await import("./canvas_effects.js");
      if (canvasModule.initParticleCanvas) {
        canvasModule.initParticleCanvas("#particle-canvas");
      }
    } catch {
      // Nếu chưa tạo canvas_effects.js, kích hoạt bộ hạt dự phòng nhẹ
      this._initFallbackParticles();
    }

    try {
      this.divinationModule = await import("./divination.js");
    } catch {
      this.divinationModule = null;
    }
  }

  /**
   * 1. Xử lý chuyển đổi giữa 3 Tab: Xin Xăm - Xem Tuổi - Lá Số Tử Vi
   */
  _initNavigation() {
    const navButtons = document.querySelectorAll(".nav-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

    navButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab");
        if (targetTab === this.state.currentTab) return;

        this.state.currentTab = targetTab;

        // Cập nhật trạng thái nút active
        navButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Ẩn/hiện Panel tương ứng
        tabPanels.forEach((panel) => {
          panel.classList.toggle("active", panel.id === `panel-${targetTab}`);
        });

        // Thầy bói dẫn chuyện theo từng Tab
        if (targetTab === "gieo-que")
          this.npc.speakPreset("tabGieoQue", "neutral");
        if (targetTab === "xem-tuoi")
          this.npc.speakPreset("tabXemTuoi", "neutral");
        if (targetTab === "tu-vi") this.npc.speakPreset("tabTuVi", "neutral");
      });
    });
  }

  /**
   * 2. Xử lý chức năng Lắc Ống Xăm & Rút Quẻ
   */
  _initFortuneTellerEvents() {
    const tubeEl = document.getElementById("fortune-tube");
    const shakeBtn = document.getElementById("btn-shake-tube");
    const resultOverlay = document.getElementById("fortune-result-container");
    const closeCardBtn = document.getElementById("btn-close-card");

    const triggerShake = () => {
      if (this.state.isShaking) return;
      this.state.isShaking = true;

      // Bật animation lắc ống xăm
      tubeEl.classList.add("is-shaking");
      resultOverlay.classList.add("hidden");
      this.npc.speakPreset("shakingTube", "thinking");

      setTimeout(() => {
        tubeEl.classList.remove("is-shaking");
        this.state.isShaking = false;
        this._revealFortuneResult();
      }, 1500);
    };

    if (tubeEl) tubeEl.addEventListener("click", triggerShake);
    if (shakeBtn) shakeBtn.addEventListener("click", triggerShake);

    if (closeCardBtn) {
      closeCardBtn.addEventListener("click", () => {
        resultOverlay.classList.add("hidden");
        this.npc.speakPreset("tabGieoQue", "neutral");
      });
    }
  }

  /** Hiển thị thẻ kết quả Quẻ Xăm theo chủ đề đã chọn */
  _revealFortuneResult() {
    const topic = document.getElementById("input-topic")?.value || "tong";
    const fortune = Div.drawFortuneStick(this.state.currentFortune?.title);
    this.state.currentFortune = fortune;

    const rank = document.getElementById("card-rank");
    rank.textContent = fortune.rank;
    rank.dataset.type = fortune.type;
    document.getElementById("card-title").textContent = fortune.title;
    document.getElementById("card-poem").innerHTML = fortune.poem.replace(/\n/g, "<br>");
    document.getElementById("card-meaning").textContent = fortune.meaning;
    document.getElementById("card-topic").innerHTML =
      `<strong>${Div.TOPICS[topic].label}:</strong> ${Div.getTopicAdvice(fortune.type, topic)}`;
    document.getElementById("fortune-result-container").classList.remove("hidden");

    const preset = { auspicious: "fortuneGood", ominous: "fortuneWarn" }[fortune.type] || "fortuneNeutral";
    this.npc.speakPreset(preset, fortune.type);
    this._tone(fortune.type);
  }

  /** Âm báo chuông ngắn theo kết quả (tôn trọng nút tắt tiếng) */
  _tone(type) {
    if (this.state.isMuted) return;
    try {
      this._ac = this._ac || new AudioContext();
      const ac = this._ac;
      const notes = type === "ominous" ? [196, 175] : type === "neutral" ? [262, 330] : [523, 659, 784];
      notes.forEach((hz, i) => {
        const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime + i * 0.16;
        o.type = "sine";
        o.frequency.value = hz;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.15, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
        o.connect(g).connect(ac.destination);
        o.start(t);
        o.stop(t + 1);
      });
    } catch { /* trình duyệt chặn âm thanh: bỏ qua */ }
  }

  /** 3. Form Xem Tuổi: Can Chi, Nạp Âm, Con Giáp, Cung Phi, hợp - xung */
  _initAgeFormEvents() {
    const form = document.getElementById("form-xem-tuoi");
    const resultCard = document.getElementById("age-result");
    const resultContent = document.getElementById("age-result-content");
    if (!form) return;
    const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const dobValue = document.getElementById("input-dob").value;
      if (!dobValue) return;
      const name = document.getElementById("input-name").value.trim() || "Thí chủ";
      const gender = document.getElementById("input-gender").value;
      const year = Number(dobValue.slice(0, 4));
      const d = Div.calculateAgeDestiny(year, gender);
      const el = d.element;

      resultContent.innerHTML = `
        <div class="card-border">
          <span class="card-rank" style="background:${el.color};color:#0b0a14">Mệnh ${el.short}</span>
          <h3 class="card-title">${esc(name)}</h3>
          <p>${d.emoji} Tuổi ${d.canChi} (${year}) · ${d.age} tuổi mụ</p>
          <div class="card-divider">❖ ── ❖ ── ❖</div>
          <div class="info-grid">
            <div class="wide"><b>Ngũ hành nạp âm</b>${el.name}. ${el.trait}</div>
            <div><b>Con giáp</b>${d.animal}</div>
            <div><b>Cung phi</b>${d.quai} (${d.nhom})</div>
            <div><b>Tam hợp</b>${d.tamHop}</div>
            <div><b>Xung khắc</b>${d.xung}</div>
            <div><b>Màu hợp mệnh</b>${el.lucky}</div>
            <div><b>Số may mắn</b>${el.nums}</div>
            <div class="wide"><b>Hướng tốt (nhà, bàn làm việc)</b>${d.huong}</div>
          </div>
          <p class="age-note">Năm sinh tính theo dương lịch; người sinh trước Tết âm lịch tính theo năm trước. Kết quả mang tính tham khảo.</p>
        </div>`;

      resultCard.classList.remove("hidden");
      this.npc.speak(
        `${name} tuổi ${d.canChi}, con ${d.animal}, mệnh ${el.short}. ${el.trait} Hợp màu ${el.lucky.toLowerCase()}, nên tìm bạn đồng hành tuổi ${d.tamHop}.`,
        "auspicious",
      );
    });
  }

  /** 4. Sa Bàn Tử Vi 12 Cung: mô tả cung + lời luận ngẫu nhiên */
  _initTuViBoardEvents() {
    const cells = document.querySelectorAll(".palace-cell");
    const titleEl = document.getElementById("selected-palace-title");
    const descEl = document.getElementById("selected-palace-desc");

    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        cells.forEach((c) => c.classList.remove("active-palace"));
        cell.classList.add("active-palace");

        const key = cell.getAttribute("data-palace");
        const info = this.palaceDescriptions[key];
        if (!info) return;
        const reading = Div.getPalaceReading(key);
        titleEl.textContent = info.title;
        descEl.textContent = info.desc;
        this.npc.speak(`${info.title}: ${info.desc} ${reading.text}`, reading.mood);
      });
    });
  }

  /**
   * 5. Hiệu ứng 3D Tilt Card theo chuyển động chuột
   */
  _init3DTiltCards() {
    const tiltCards = document.querySelectorAll(".tilt-card");

    tiltCards.forEach((card) => {
      const inner = card.querySelector(".tilt-card-inner");
      if (!inner) return;

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Giới hạn góc nghiêng tối đa 12 độ để chữ vẫn dễ đọc
        const rotateX = ((y - centerY) / centerY) * -12;
        const rotateY = ((x - centerX) / centerX) * 12;

        // Tọa độ ánh kim (Glare)
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;

        inner.style.setProperty("--rotateX", `${rotateX.toFixed(2)}deg`);
        inner.style.setProperty("--rotateY", `${rotateY.toFixed(2)}deg`);
        inner.style.setProperty("--scale", "1.02");
        inner.style.setProperty("--glareX", `${glareX.toFixed(1)}%`);
        inner.style.setProperty("--glareY", `${glareY.toFixed(1)}%`);
        inner.style.setProperty("--glareOpacity", "1");
      });

      card.addEventListener("mouseleave", () => {
        inner.style.setProperty("--rotateX", "0deg");
        inner.style.setProperty("--rotateY", "0deg");
        inner.style.setProperty("--scale", "1");
        inner.style.setProperty("--glareOpacity", "0");
      });
    });
  }

  /**
   * Nút bật/tắt âm thanh
   */
  _initAudioToggle() {
    const muteBtn = document.getElementById("btn-mute");
    if (!muteBtn) return;

    muteBtn.addEventListener("click", () => {
      this.state.isMuted = !this.state.isMuted;
      muteBtn.textContent = this.state.isMuted ? "🔇" : "🔊";
    });
  }

  /**
   * Hạt Particle dự phòng giúp giao diện lung linh ngay cả khi chưa tạo canvas_effects.js
   */
  _initFallbackParticles() {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5,
      vy: -(Math.random() * 0.4 + 0.1),
      alpha: Math.random() * 0.6 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y += p.vy;
        if (p.y < 0) p.y = canvas.height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(render);
    };
    render();
  }
}

// Khởi chạy ứng dụng khi DOM hoàn tất
document.addEventListener("DOMContentLoaded", () => {
  const app = new MysticApp();
  app.init();
});
