/**
 * Module quản lý nhân vật Thầy Bói (Interactive NPC)
 * Chịu trách nhiệm: Hiệu ứng gõ chữ (Typing Effect), thay đổi trạng thái (Mood),
 * và kho lưu trữ lời thoại theo ngữ cảnh.
 */

export class NPCDialogue {
  /**
   * @param {Object} config Cấu hình DOM selectors
   */
  constructor({
    textSelector,
    avatarSelector,
    moodLabelSelector,
    indicatorSelector,
    skipBtnSelector,
  }) {
    this.textEl = document.querySelector(textSelector);
    this.avatarEl = document.querySelector(avatarSelector);
    this.moodLabelEl = document.querySelector(moodLabelSelector);
    this.indicatorEl = document.querySelector(indicatorSelector);
    this.skipBtn = document.querySelector(skipBtnSelector);

    // Quản lý trạng thái gõ chữ
    this.typingTimer = null;
    this.isTyping = false;
    this.fullCurrentText = "";
    this.typingSpeed = 28; // ms trên mỗi ký tự
    this.onCompleteCallback = null;

    // Từ điển trạng thái cảm xúc của Thầy Bói
    this.moodProfiles = {
      neutral: { icon: "🧙‍♂️", label: "Tĩnh Tâm" },
      thinking: { icon: "🔮", label: "Đang Bấm Độn..." },
      auspicious: { icon: "😌", label: "Hoan Hỷ (Quẻ Cát)" },
      ominous: { icon: "🧐", label: "Trầm Ngâm (Cẩn Trọng)" },
    };

    // Kho thoại mẫu theo tình huống
    this.scriptBank = {
      welcome:
        "Chào thí chủ, duyên lành đưa lối đến Huyền Vi Các. Hôm nay thí chủ muốn xin xăm, xem niên mệnh hay luận giải lá số tử vi?",
      tabGieoQue:
        "Hãy tĩnh tâm hít thở sâu, nghĩ về điều mình đang trăn trở rồi chạm vào ống xăm trên bàn.",
      tabXemTuoi:
        "Vạn vật sinh ra đều mang khí số của đất trời. Hãy điền ngày sinh dương lịch để lão phu bấm độn Can Chi, Ngũ Hành.",
      tabTuVi:
        "Thập nhị cung phản chiếu nhân sinh. Thí chủ muốn hỏi về công danh, tiền tài hay tình duyên? Hãy chọn một cung trên sa bàn.",
      shakingTube:
        "Thiên cơ đang chuyển động... Lắng nghe tiếng thẻ tre va vào nhau để tìm ra quẻ ứng nghiệm nhất...",
      fortuneGood:
        "Khà khà! Đại cát, đại lợi! Vận khí của thí chủ đang như mặt trời ban trưa, mưu sự ắt có quý nhân phù trợ.",
      fortuneNeutral:
        'Quẻ này mang ý "Bình hòa". Mọi việc không nên nóng vội, cứ giữ tâm bất biến giữa dòng đời vạn biến ắt sẽ bình an.',
      fortuneWarn:
        "Chậc... Quẻ báo cần thận trọng. Thời vận chưa thông thì nên ẩn nhẫn chờ thời, chớ nên cưỡng cầu mà hao tổn tâm sức.",
    };

    this._bindEvents();
  }

  /**
   * Gắn sự kiện cho nút bỏ qua hiệu ứng chữ (Skip) và click vào hộp thoại
   */
  _bindEvents() {
    if (this.skipBtn) {
      this.skipBtn.addEventListener("click", () => this.finishImmediately());
    }
    if (this.textEl) {
      this.textEl.parentElement.addEventListener("click", () => {
        if (this.isTyping) this.finishImmediately();
      });
    }
  }

  /**
   * Thay đổi biểu cảm và hào quang của Thầy Bói
   * @param {'neutral' | 'thinking' | 'auspicious' | 'ominous'} mood
   */
  setMood(mood = "neutral") {
    const profile = this.moodProfiles[mood] || this.moodProfiles.neutral;
    if (this.avatarEl) {
      this.avatarEl.setAttribute("data-mood", mood);
    }
    if (this.moodLabelEl) {
      this.moodLabelEl.textContent = profile.label;
    }
  }

  /**
   * Phát một câu thoại với hiệu ứng Typing từng chữ
   * @param {string} message Nội dung câu thoại
   * @param {'neutral' | 'thinking' | 'auspicious' | 'ominous'} mood Trạng thái đi kèm
   * @param {Function} onComplete Callback khi gõ xong chữ
   */
  speak(message, mood = "neutral", onComplete = null) {
    // Dọn dẹp tiến trình gõ chữ cũ nếu đang chạy dở
    this._clearTimer();

    this.fullCurrentText = message;
    this.onCompleteCallback = onComplete;
    this.isTyping = true;
    this.setMood(mood);
    this.avatarEl?.classList.add("talking");

    if (!this.textEl) return;

    this.textEl.textContent = "";
    this.textEl.classList.add("is-typing");

    let charIndex = 0;

    this.typingTimer = setInterval(() => {
      if (charIndex < this.fullCurrentText.length) {
        this.textEl.textContent += this.fullCurrentText.charAt(charIndex);
        charIndex++;
      } else {
        this.finishImmediately();
      }
    }, this.typingSpeed);
  }

  /**
   * Phát nhanh câu thoại có sẵn trong kho scriptBank
   * @param {string} key Từ khóa trong scriptBank
   * @param {string} mood Trạng thái biểu cảm
   */
  speakPreset(key, mood = "neutral") {
    const message = this.scriptBank[key] || this.scriptBank.welcome;
    this.speak(message, mood);
  }

  /**
   * Hiển thị toàn bộ câu thoại ngay lập tức (khi người dùng nhấn Bỏ qua)
   */
  finishImmediately() {
    this._clearTimer();
    this.isTyping = false;
    this.avatarEl?.classList.remove("talking");

    if (this.textEl) {
      this.textEl.textContent = this.fullCurrentText;
      this.textEl.classList.remove("is-typing");
    }

    if (typeof this.onCompleteCallback === "function") {
      const cb = this.onCompleteCallback;
      this.onCompleteCallback = null;
      cb();
    }
  }

  _clearTimer() {
    if (this.typingTimer) {
      clearInterval(this.typingTimer);
      this.typingTimer = null;
    }
  }
}
